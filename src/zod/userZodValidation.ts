import z from "zod"

// Custom validation for File that works in both browser and server contexts
const fileSchema = z.custom<File>((val) => {
    return val instanceof File || (typeof val === 'object' && val !== null && 'name' in val && 'type' in val);
}, {
    message: "Must be a valid file",
}).optional();

export const updateUserSchema = z.object({
    name: z
        .string({ required_error: "Name is required and must be string" })
        .min(5, "Name must be at least 5 characters")
        .max(30, "Name must be at most 30 characters")
        .optional(),
    email: z.string({ required_error: "Email is required" }).email("Invalid email address").optional(),
    contactNumber: z.string().min(10, "Contact number must be at least 10 characters").optional(),
    profilePhoto: fileSchema,
})

export type UpdateFormValues = z.infer<typeof updateUserSchema>