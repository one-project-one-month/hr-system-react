export type CheckInResponse = {
    attendaneDate: string;
    isCheckIn: boolean;
    isCheckOut: boolean;
    checkInTime: string;
    checkOutTime: string;
}

export type CheckInPayload = {
    employeeCode: string;
    checkInStatus: string;
    latitude: string;
    longitude: string;
    remark?: string;
};