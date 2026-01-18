// Rerun
import { z } from "zod";

export const createLeaveSchema = z.object({
    leaveType: z.string().min(1, "Leave type is required"),
    fromDate: z.date(),
    toDate: z.date(),
    fullOrHalf: z.string().min(1, "Full or half day is required"),
    reason: z.string().min(1, "Reason is required"),
});

export type CreateLeaveInputs = z.infer<typeof createLeaveSchema>;
