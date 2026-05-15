import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { runKBS } from "./kbs-questions.service";
import { sendResponse } from "../../utils/apiResponse";

export const getFirstQuestion = asyncHandler(
  async (req: Request, res: Response) => {

    const userId = (req as any).user.id;

    const result = await runKBS(
      "start_question",
      null,
      userId
    );

    return sendResponse(
      res,
      200,
      "First question fetched successfully",
      result
    );
  }
);

export const sendAnswer = asyncHandler(
  async (req: Request, res: Response) => {

    const userId = (req as any).user.id;

    const { node, answer } = req.body;
    const result = await runKBS(
      node,
      answer ?? null,
      userId
    );

    return sendResponse(
      res,
      200,
      "Answer processed successfully",
      result
    );
  }
);