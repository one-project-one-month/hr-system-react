import { z } from "zod";

export const menuItemSchema = z.object({
  menuGroupCode: z.string().min(1, "Menu Group is required"),
  menuCode: z.string().min(1, "Menu Code is required"),
  menuName: z.string().min(2, "Menu Name is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.string().min(1, "Icon is required"),
  sortOrder: z.number().min(0, "Sort Order must be 0 or greater"),
});
