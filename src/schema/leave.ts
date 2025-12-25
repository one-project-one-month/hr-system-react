// Rerun
import { z } from "zod";

export const createLeaveSchema = z.object({
    leaveType: z.string().min(1, "Leave type is required"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
    fullOrHalf: z.string().min(1, "Full or half day is required"),
    reason: z.string().min(1, "Reason is required"),
});

export type CreateLeaveInputs = z.infer<typeof createLeaveSchema>;
