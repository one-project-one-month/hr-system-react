import z from "zod";

export const formSchema = z.object({
    username: z.string().min(2, "username must be at least 2 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
