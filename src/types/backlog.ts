import type { formSchema } from "@/schema/backlog";
import { z } from "zod";
export interface EmployeeApiItem {
    name?: string;
    employeeCode?: string;
}

export interface ProjectApiItem {
    projectName?: string;
    projectCode?: string;
}

export type LookupOption = { name: string; code: string };

export interface BacklogFormProps {
    mode: "create" | "edit" | "view";
    initialData?: {
        taskCode?: string;
        taskName: string;
        taskDescription: string;
        employeeName: string;
        employeeCode?: string;
        projectName: string;
        projectCode?: string;
        taskStatus: string;
        startDate: string;
        endDate: string;
        workingHour: number;
    }
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    onCancel: () => void;
}
