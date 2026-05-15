import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import asyncHandler from "../middlewares/asyncHandler";
import { sendResponse } from "../utils/apiResponse";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.signup(req.body);

  return sendResponse(res, 201, "User created successfully", user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  return sendResponse(res, 200, "Login successful", result);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await authService.getUsers();

  return sendResponse(res, 200, "Users fetched successfully", users);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.deleteUser(req.params.id as string);
  return sendResponse(res, 200, "User deleted successfully", user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.updateUser(req.params.id as string, req.body);

  return sendResponse(res, 200, "User updated successfully", user);
});