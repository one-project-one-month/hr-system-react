import { z } from "zod";

export const formSchema = z.object({
    taskCode: z.string().optional(),
    taskName: z.string().nonempty("Task Name cannot be empty!"),
    taskDescription: z.string().nonempty("Task Description cannot be empty!"),
    assignee: z.string().nonempty("Assignee cannot be empty!"),
    employeeCode: z.string().optional(), // hidden
    projectName: z.string().nonempty("Project Name cannot be empty!"),
    projectCode: z.string().optional(), // hidden
    taskStatus: z.string().nonempty("Task Status cannot be empty!"),
    startDate: z.date({ error: "Start Date cannot be empty!" }),
    endDate: z.date({ error: "Due Date cannot be empty!" }),
    workingHour: z.string().nonempty("Working Hours cannot be empty!"),
});
