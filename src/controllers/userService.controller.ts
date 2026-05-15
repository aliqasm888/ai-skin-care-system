import { Request, Response } from "express";
import userServiceService from "../services/userService.service";
import asyncHandler from "../middlewares/asyncHandler";
import { sendResponse } from "../utils/apiResponse";

export const bookService = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { serviceId } = req.body;

  const booking = await userServiceService.bookService(userId, serviceId);

  return sendResponse(res, 201, "Service booked successfully", booking);
});


export const getUserServices = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const services = await userServiceService.getUserServices(userId);

  return sendResponse(res, 200, "User services fetched successfully", services);
});


export const cancelService = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { serviceId } = req.body;

  await userServiceService.cancelService(userId, serviceId);

  return sendResponse(res, 200, "Service cancelled successfully", null);
});