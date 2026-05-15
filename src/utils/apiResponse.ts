import { Response } from "express";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    message,
    data
  };

  return res.status(statusCode).json(response);
};