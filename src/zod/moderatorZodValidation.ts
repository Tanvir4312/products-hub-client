import z from "zod";

const fileSchema = z.custom<File>((val) => {
    return val instanceof File || (typeof val === 'object' && val !== null && 'name' in val && 'type' in val);
}, {
    message: "Must be a valid file",
}).optional();

export const updateModeratorSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    contactNumber: z.string().min(10, "Contact number must be at least 10 characters").optional(),
    profilePhoto: fileSchema,
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export type IUpdateModeratorFormValues = z.infer<typeof updateModeratorSchema>;
