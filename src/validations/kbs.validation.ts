import { z } from "zod";

export const kbsAnswerSchema = z.object({
    node: z.string().trim().min(1, "node is required"),
    answer: z.string().trim().nullable().optional()
  });