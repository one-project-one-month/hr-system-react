import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

interface FetchConfig {
    endPoint: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    responseType?: "json" | "blob";
}
interface DataStore {
    data: any[];
    loading: boolean;
    error: string | null;
    fetchData: (config: FetchConfig) => Promise<any>;
    clearError?: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
    data: [],
    loading: false,
    error: null,

    fetchData: async ({
        endPoint,
        method = "GET",
        body,
        headers = {},
        responseType = "json",
    }: FetchConfig) => {
        set({ loading: true, error: null });

        try {
            const token = useAuthStore.getState().token;
            const isFormData = body instanceof FormData;

            const options: RequestInit = {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(isFormData ? {} : { "Content-Type": "application/json" }),
                    ...headers,
                },
                ...(body
                    ? {
                        body: isFormData ? body : JSON.stringify(body),
                    }
                    : {}),
            };

            const response = await fetch(`/api${endPoint}`, options);

            const data =
                responseType === "blob" ? null : await response.json();

            if (!response.ok) {
                set({
                    error: data?.message ?? "Request failed",
                    loading: false,
                    data,
                });
                return data;
            }

            set({ data, loading: false });
            return data;
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));
