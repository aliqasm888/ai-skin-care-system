import { Request, Response } from "express";
import serviceService from "../services/service.service";
import asyncHandler from "../middlewares/asyncHandler";
import { sendResponse } from "../utils/apiResponse";

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const service = await serviceService.createService(req.body, userId);

  return sendResponse(res, 201, "Service created successfully", service);
});


export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await serviceService.getAllServices();

  return sendResponse(res, 200, "Services fetched successfully", services);
});


export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.getServiceById(req.params.id as string);

  return sendResponse(res, 200, "Service fetched successfully", service);
});


export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.updateService(req.params.id as string, req.body);

  return sendResponse(res, 200, "Service updated successfully", service);
});


export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  await serviceService.deleteService(req.params.id as string );

  return sendResponse(res, 200, "Service deleted successfully", null);
});