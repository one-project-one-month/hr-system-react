import { useDataStore } from "@/stores/useDataStore";
import type { MenuGroupItem, MenuGroupListData, MenuGroupListParams, Payload } from "@/types/menu-group";

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  message?: string;
  data?: T;
  [k: string]: unknown;
};

const asApi = <T = unknown>(x: unknown): ApiEnvelope<T> => x as ApiEnvelope<T>;


// Service
export const menuGroupService = {
  // GET /MenuGroup/list?PageNo=1&PageSize=10
  fetchMenuGroups: async (
    params: MenuGroupListParams,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<MenuGroupItem[] | MenuGroupListData>> => {
    const qs = new URLSearchParams({
      PageNo: String(params.pageNo),
      PageSize: String(params.pageSize),
    }).toString();

    await useDataStore.getState().fetchData({
      endPoint: `/MenuGroup/list?${qs}`,
      headers,
    });

    return asApi<MenuGroupItem[] | MenuGroupListData>(
      useDataStore.getState().data as unknown
    );
  },

  // GET /MenuGroup/edit:code
  fetchMenuGroupsByCode: async (
    code: string,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<MenuGroupItem>> => {
    await useDataStore.getState().fetchData({
      endPoint: `/MenuGroup/edit/${encodeURIComponent(code)}`,
      headers,
    });
    return asApi<MenuGroupItem>(useDataStore.getState().data as unknown);
  },

  // POST /MenuGroup/create
  createMenuGroup: async (
    payload: Payload,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<boolean> | null> => {
    await useDataStore.getState().fetchData({
      endPoint: `/MenuGroup/create`,
      method: "POST",
      body: payload,
      headers,
    });

    const resp = asApi<boolean>(useDataStore.getState().data as unknown);

    if (resp?.isSuccess === false) {
      useDataStore.setState({ error: resp.message || "Create failed" });
      return null;
    }
    return resp;
  },

  // PUT /MenuGroup/update/:code
  updateMenuGroup: async (
    code: string,
    payload: Payload,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<boolean> | null> => {
    await useDataStore.getState().fetchData({
      endPoint: `/MenuGroup/update/${encodeURIComponent(code)}`,
      method: "PUT",
      body: payload,
      headers,
    });

    const resp = asApi<boolean>(useDataStore.getState().data as unknown);

    if (resp?.isSuccess === false) {
      useDataStore.setState({ error: resp.message || "Update failed" });
      return null;
    }
    return resp;
  },

  // DELETE /MenuGroup/delete/:code
  deleteMenuGroup: async (
    code: string,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<boolean>> => {
    await useDataStore.getState().fetchData({
      endPoint: `/MenuGroup/delete/${encodeURIComponent(code)}`,
      method: "DELETE",
      headers,
    });

    return asApi<boolean>(useDataStore.getState().data as unknown);
  },
};
