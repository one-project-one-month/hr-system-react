import { checkInOutService } from "@/services/checkInOutService";
import { create } from "zustand";
import type { CheckInResponse } from "@/types/checkInOut";
import { useAuthStore } from "./useAuthStore";

type CheckInStore = {
    data: CheckInResponse | null;
    loading: boolean;                                                                                                                   
    loadData: (employeeCode: string) => Promise<void>;
    handleCheckInOut: (payload: any) => Promise<void>;
};

const getPosition = (timeout = 5000) =>
    new Promise<GeolocationPosition | null>((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        let settled = false;
        const timer = window.setTimeout(() => {
            if (!settled) {
                settled = true;
                resolve(null);
            }
        }, timeout);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(pos);
                }
            },
            () => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(null);
                }
            },
            { enableHighAccuracy: false, maximumAge: 0, timeout }
        );
    });

const checkInStore = create<CheckInStore>((set, get) => ({
    data: null,
    loading: false,
    loadData: async (employeeCode: string) => {
        set({ loading: true });
        const data = await checkInOutService.getCheckInStatus(employeeCode);
        set({ data: data?.data, loading: false });
    },
    handleCheckInOut: async () => {
        set({ loading: true });
        try {
            const pos = await getPosition(5000);
            const latitude = pos?.coords?.latitude?.toString() ?? "";
            const longitude = pos?.coords?.longitude?.toString() ?? "";
            const authUser = useAuthStore.getState().user;

            const payload = {
                employeeCode: authUser?.employeeCode ?? "",
                checkInStatus: get()?.data?.isCheckIn ? "CheckOut" : "CheckIn",
                latitude: String(latitude),
                longitude: String(longitude),
                remark: "",
            };

            console.log(payload);

            await checkInOutService.CheckIn(payload);
            await get()?.loadData(authUser?.employeeCode ?? "");
        } catch (err: any) {
            console.log(err);
        } finally {
            set({ loading: false });
        }
    },
}));

export const useCheckInStore = checkInStore;
