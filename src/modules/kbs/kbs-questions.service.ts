import { spawn } from "child_process";
import path from "path";
import KBSResult from "../../models/kbsResult.model";
import AppError from "../../utils/AppError";

type KBSInput = {
  node: string;
  answer: string | null;
};

type KBSResultResponse = {
  type: "result";
  skin: string;
  [key: string]: unknown;
};

type KBSQuestionResponse = {
  type: "question";
  question: string;
  options: string[];
  [key: string]: unknown;
};

type KBSErrorResponse = {
  type: "error";
  message: string;
  [key: string]: unknown;
};

type KBSResponse = KBSResultResponse | KBSQuestionResponse | KBSErrorResponse;

const PYTHON_SCRIPT_PATH =
  process.env.KBS_SCRIPT_PATH?.trim() ||
  path.resolve(process.cwd(), "src/kbs-engine/main.py");

const PYTHON_BIN = process.env.PYTHON_BIN?.trim() || "python";
const PYTHON_TIMEOUT_MS = 30_000;

const normalizeText = (value: string | null | undefined): string => {
  return value?.trim() || "";
};

const buildPayload = (node: string, answer: string | null): KBSInput => {
  const normalizedNode = normalizeText(node);

  if (!normalizedNode) {
    throw new AppError("node is required", 400);
  }

  return {
    node: normalizedNode,
    answer: normalizeText(answer) || null,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const parsePythonResponse = (rawOutput: string): KBSResponse => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawOutput);
  } catch {
    throw new AppError("Invalid JSON from Python response", 500);
  }

  if (!isRecord(parsed) || typeof parsed.type !== "string") {
    throw new AppError("Python response has an invalid shape", 500);
  }

  if (parsed.type === "result") {
    if (typeof parsed.skin !== "string" || !parsed.skin.trim()) {
      throw new AppError("Python result response must include a valid skin field", 500);
    }

    return parsed as KBSResultResponse;
  }

  if (parsed.type === "question") {
    if (typeof parsed.question !== "string" || !parsed.question.trim()) {
      throw new AppError("Python question response must include a valid question field", 500);
    }

    if (!isStringArray(parsed.options)) {
      throw new AppError("Python question response must include a valid options array", 500);
    }

    return parsed as KBSQuestionResponse;
  }

  if (parsed.type === "error") {
    if (typeof parsed.message !== "string" || !parsed.message.trim()) {
      throw new AppError("Python error response must include a valid message field", 500);
    }

    return parsed as KBSErrorResponse;
  }

  throw new AppError(`Unknown Python response type: ${parsed.type}`, 500);
};

const runPythonProcess = (payload: KBSInput): Promise<string> => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(PYTHON_BIN, [PYTHON_SCRIPT_PATH, JSON.stringify(payload)], {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (error?: AppError, result?: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);

      if (error) {
        reject(error);
        return;
      }

      resolve(result || "");
    };

    const timeoutHandle = setTimeout(() => {
      childProcess.kill("SIGKILL");
      finish(new AppError(`Python process timed out after ${PYTHON_TIMEOUT_MS}ms`, 500));
    }, PYTHON_TIMEOUT_MS);

    childProcess.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    childProcess.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    childProcess.on("error", (err: NodeJS.ErrnoException) => {
      finish(new AppError(`Failed to start Python process: ${err.message}`, 500));
    });

    childProcess.on("close", (code: number | null, signal: NodeJS.Signals | null) => {
      if (code !== 0) {
        const details = stderr.trim() || stdout.trim();
        const suffix = details ? ` | ${details}` : "";
        finish(
          new AppError(
            `Python process exited with code ${code}${signal ? ` (signal: ${signal})` : ""}${suffix}`,
            500
          )
        );
        return;
      }

      const cleanOutput = stdout.trim();

      if (!cleanOutput) {
        finish(new AppError("Empty response from Python", 500));
        return;
      }

      finish(undefined, cleanOutput);
    });
  });
};

const saveKBSResult = async (userId: string, skinType: string) => {
  const normalizedUserId = normalizeText(userId);
  const normalizedSkinType = normalizeText(skinType);

  if (!normalizedUserId) {
    throw new AppError("userId is required", 400);
  }

  if (!normalizedSkinType) {
    throw new AppError("skinType is required", 400);
  }

  const savedResult = await KBSResult.create({
    user_id: normalizedUserId,
    skin_type: normalizedSkinType,
  });

  if (!savedResult) {
    throw new AppError("Failed to save KBS result", 500);
  }

  return savedResult;
};

export const runKBS = async (
  node: string,
  answer: string | null,
  userId: string
): Promise<KBSResponse> => {
  const payload = buildPayload(node, answer);
  const rawOutput = await runPythonProcess(payload);
  const response = parsePythonResponse(rawOutput);

  if (response.type === "result") {
    await saveKBSResult(userId, response.skin);
  }

  return response;
};