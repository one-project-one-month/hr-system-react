export interface Leave {
  leaveId?: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  fullOrHalf: string;
  reason: string;
  status?: string;
}
