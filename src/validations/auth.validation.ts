import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),

  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  age: z
    .number()
    .min(1, "Age must be greater than 0")
    .max(120, "Invalid age")
    .optional(),

  gender: z
    .enum(["male", "female"], {
      message: "Gender must be male or female"
    })
    .optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});