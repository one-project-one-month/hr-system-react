import z from "zod";

export const employeeSchema = z.object({
    // employeeCode: z
    //   .string()
    //   .min(1, "EmployeeCode is required")
    //   .max(15, "EmployeeCode must be at most 15 characters"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(30, "Password must be at most 30 characters"), // make password optional
    salary: z
        .number()
        .positive("Salary must be a positive number")
        .max(10000000, "Salary too high"),
    name: z.string().min(2, "Name is required").max(60, "Name too long"),
    roleCode: z.string(),
    email: z.string().email("Invalid email address"),
    phoneNo: z
        .string()
        .regex(/^[0-9]{9,11}$/, "Invalid phone number (must be 9–11 digits)"),
    startDate: z
        .string()
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "StartDate must be a valid date"
        ),
    resignDate: z
        .string()
        .optional()
        .nullable()
        .refine(
            (val) => !val || !isNaN(Date.parse(val)),
            "ResignDate must be a valid date"
        ),
});