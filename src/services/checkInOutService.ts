import { useDataStore } from "@/stores/useDataStore";

type CheckInPayload = {
    employeeCode: string;
    checkInStatus: string;
    latitude: string;
    longitude: string;
    remark?: string;
};

export const checkInOutService = {
    getCheckInStatus: async (employeeCode: string) => {
        const ds = useDataStore.getState();

        const data = await ds.fetchData({
            endPoint: `/employee/today-attendance/${employeeCode}`,
        });

        return data;
    },
    CheckIn: async (payload: CheckInPayload) => {
        const ds = useDataStore.getState();

        await ds.fetchData({
            endPoint: "/employee/check-in-out",
            method: "POST",
            body: payload,
        });
    },
};
