import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  tagIds: z.array(z.string()).min(1, "At least one tag is required"),
  links: z.string().min(1, "Link is required").url("Must be a valid URL"),
  photo: z.instanceof(File, { message: "Product photo is required" }),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
