import { z } from "zod";

export const createAdminValidationSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  admin: z.object({
    name: z
      .string({ required_error: "Name is required and must be string" })
      .min(5, "Name must be at least 5 characters")
      .max(30, "Name must be at most 30 characters"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    contactNumber: z
      .string({ required_error: "Contact number is required" })
      .min(11, "Contact number must be at least 11 characters")
      .max(15, "Contact number must be at most 15 characters"),
    profilePhoto: z.any().optional(),
  }),
  role: z.enum(["ADMIN", "SUPER_ADMIN"], {
    required_error: "Role must be either ADMIN or SUPER_ADMIN",
    invalid_type_error: "Role must be either ADMIN or SUPER_ADMIN",
  }),
});

export type ICreateAdminPayload = z.infer<typeof createAdminValidationSchema>;

export const updateAdminValidationSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters").optional(),
  contactNumber: z
    .string()
    .min(11, "Contact number must be at least 11 characters")
    .max(15, "Contact number must be at most 15 characters")
    .optional(),
  profilePhoto: z.any().optional(),
});

export type IUpdateAdminPayload = z.infer<typeof updateAdminValidationSchema>;
