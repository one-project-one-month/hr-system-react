import { z } from "zod";

export const formSchema = z.object({
    employeeCode: z.string().nonempty("Employee Code cannot be empty!"),
    employeeName: z.string().nonempty("Employee Name cannot be empty"),
    checkinLocation: z.string().nonempty("Check In location cannot be empty!"),
    checkoutLocation: z.string().nonempty("Check out location cannot be empty!"),
    checkinTime: z.string().nonempty("Checkin Time cannot be empty!"),
    checkoutTime: z.string().nonempty("Checkout Time cannot be empty!"),
    workingHour: z.any(),
    status: z.any(),
    date: z.date(),
    remark: z.string(),
});