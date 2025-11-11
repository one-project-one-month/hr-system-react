// stores/useDataStore.ts
import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_API_URL;

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
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `API Error ${response.status}`;
        throw new Error(msg);
      }
      set({ data: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },
}));
