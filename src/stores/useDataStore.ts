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

            const options: RequestInit = {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...headers,
                },
                ...(body ? { body: JSON.stringify(body) } : {}),
            };

            const response = await fetch(`/api${endPoint}`, options);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `API Error ${response.status}`);
            }

            // ✅ HANDLE BLOB FIRST
            if (responseType === "blob") {
                const blob = await response.blob();
                const contentDisposition = response.headers.get("content-disposition");

                set({ loading: false });
                console.log (blob, contentDisposition)
                return { blob, contentDisposition };
            }

            // ✅ HANDLE JSON
            const data = await response.json();
            set({ data, loading: false });
            return data;
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));
