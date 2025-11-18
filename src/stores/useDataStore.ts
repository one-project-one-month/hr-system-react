import { handleUnauthorized } from "@/lib/utils";
import { create } from "zustand";

interface FetchConfig {
  endPoint: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}
interface DataStore {
  data: any[];
  loading: boolean;
  error: string | null;
  fetchData: (config: FetchConfig) => Promise<any>;
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
  }: FetchConfig) => {
    set({ loading: true, error: null });

    try {
      const defaultHeaders = {
        "Content-Type": "application/json",
        ...(headers || {}),
      };

      const options: RequestInit = {
        method,
        headers: defaultHeaders,
        ...(body && { body: JSON.stringify(body) }),
      };
      const response = await fetch(`/api${endPoint}`, options);

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `API Error ${response.status}`
        );
      }

      set({ data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err; // optionally rethrow
    }
  },

  clearError: () => set({ error: null }),
}));
