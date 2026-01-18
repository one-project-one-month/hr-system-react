import { z } from "zod";

export const formSchema = z.object({
    employeeCode: z.string().nonempty("Employee Code cannot be empty!"),
    employeeName: z.string().nonempty("Employee Name cannot be empty"),
    checkinLocation: z.string().nonempty("Check In location cannot be empty!"),
    checkoutLocation: z.string().nonempty("Check out location cannot be empty!"),
    checkinTime: z.date(),
    checkoutTime: z.date().optional(),
    workingHour: z.any(),
    status: z.any(),
    date: z.date(),
    remark: z.string(),
});


export interface dateFilter {
    from?: Date;
    to?: Date;
}
