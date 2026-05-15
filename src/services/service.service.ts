import Service from "../models/service.model";
import AppError from "../utils/AppError";

class ServiceService {

  async createService(data: any, userId: string) {
    return await Service.create({
      ...data
    });
  }

  async getAllServices() {
    return await Service.find();
  }

  async getServiceById(id: string) {
    const service = await Service.findById(id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    return service;
  }

  async updateService(id: string, data: any) {
    const updated = await Service.findByIdAndUpdate(id, data, {
      new: true
    });

    if (!updated) {
      throw new AppError("Service not found", 404);
    }

    return updated;
  }

  async deleteService(id: string) {
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError("Service not found", 404);
    }

    return deleted;
  }
}

export default new ServiceService();