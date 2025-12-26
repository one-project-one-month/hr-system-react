export interface Leave {
  leaveId?: string;
  employeeCode?: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalHours?: number;
  isPaid?: boolean;
  fullOrHalf: string;
  reason: string;
  status?: string;
  leaveCode?: string;
}

export type LeaveResponse = {
  items: Leave[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
};
