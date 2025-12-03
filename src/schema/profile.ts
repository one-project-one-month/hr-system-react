import z from "zod";

export const profileSchema = z.object({
    profileImage: z.string().optional(),
    employeeCode: z.string().nonempty("Employee code is required"),
    username: z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(20, "Username must be less than 20 characters"),
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    roleName: z.string(),
    email: z.string().email("Invalid email address"),
    phoneNo: z
        .string()
        .regex(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
});