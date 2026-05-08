import { z } from "zod";
export const loginZodSchema = z.object({
  email: z.string().email().min(1, "Email is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password mus be at least 8 characters long")
  // .regex(
  //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  //   "Password must be at least 8 characters long and contain at least one letter and one number",
  // )
  // .regex(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  //   "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
  // )
  // .regex(
  //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
  // ),
});



export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export type IRegisterPayload = z.infer<typeof registerSchema>;
