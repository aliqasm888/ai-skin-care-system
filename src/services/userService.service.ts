import UserService from "../models/userService.model";
import Service from "../models/service.model";
import AppError from "../utils/AppError";

class UserServiceService {

  // BOOK SERVICE
  async bookService(userId: string, serviceId: string) {

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError("Service not found", 404);
    }

    const exists = await UserService.findOne({
      user_id: userId,
      service_id: serviceId
    });

    if (exists) {
      throw new AppError("Service already booked", 400);
    }

    return await UserService.create({
      user_id: userId,
      service_id: serviceId
    });
  }

  // GET USER BOOKINGS
  async getUserServices(userId: string) {
    return await UserService.find({ user_id: userId })
      .populate("service_id");
  }

  // CANCEL BOOKING
  async cancelService(userId: string, serviceId: string) {

    const deleted = await UserService.findOneAndDelete({
      user_id: userId,
      service_id: serviceId
    });

    if (!deleted) {
      throw new AppError("Booking not found", 404);
    }

    return deleted;
  }
}

export default new UserServiceService();