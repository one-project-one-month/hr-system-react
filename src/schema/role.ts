import z from "zod";

export const roleSchema = z.object({
    roleName: z.string().nonempty("Role name is required!")
})