import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { LoginDTO, SignupDTO } from "../types/auth.types";
import AppError from "../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const signup = async (data: SignupDTO) => {
  const { name, email, password, age, gender } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    age,
    gender
  });

  return user;
};

export const login = async (data: LoginDTO) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
};

export const getUsers = async () => {
  return await User.find().select("-password");
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const updateUser = async (id: string, data: any) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const user = await User.findByIdAndUpdate(id, data, { new: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};