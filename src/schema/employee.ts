import z from "zod";

export const employeeSchema = z.object({
    // employeeCode: z
    //   .string()
    //   .min(1, "EmployeeCode is required")
    //   .max(15, "EmployeeCode must be at most 15 characters"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .trim(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(30, "Password must be at most 30 characters")
        .trim(), // make password optional
    salary: z
        .number()
        .positive("Salary must be a positive number")
        .max(10000000, "Salary too high")
        ,
    name: z.string().min(2, "Name is required").max(60, "Name too long").trim(),
    roleCode: z.string(),
    email: z.string().email("Invalid email address").trim(),
    phoneNo: z
        .string()
        .transform((val) => val.replace(/[\s-]/g, ""))
        .refine(
            (val) =>
                /^(09\d{7,9}|\+959\d{7,9})$/.test(val),
            "Invalid Myanmar phone number"
        ),
    startDate: z
        .string().trim()
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "StartDate must be a valid date"
        ),
    resignDate: z
        .string()
        .trim()
        .optional()
        .nullable()
        .refine(
            (val) => !val || !isNaN(Date.parse(val)),
            "ResignDate must be a valid date"
        ),
});