export type ApiEnvelope<T = unknown> = {
    isSuccess: boolean;
    isError: boolean;
    isValidationError: boolean;
    isSystemError: boolean;
    isDataError: boolean;
    isDuplicateRecord: boolean;
    isInvalidData: boolean;
    isNotFound: boolean;
    message: string | null;
    data: T | null;
};

export type DashboardStats = {
    todayAbsence: number;
    totalEmployee: number;
    totalProject: number;
};

export type AttendanceTypes = {
    label: string;
    present: number;
    absent: number;
    halfDayLeave: number;
    empCount:number;
    projCount: number;
    tdyAbsent:number;
};