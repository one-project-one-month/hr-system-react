import { useDataStore } from "@/stores/useDataStore";
import type { ApiEnvelope, ListData, ListParams, Payload, ProjectItem } from "@/types/project";



const asApi = <T = unknown>(x: unknown): ApiEnvelope<T> => x as ApiEnvelope<T>;

export const projectService = {
  // GET /Project/list
  fetchProjects: async (
    params: ListParams,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<ListData>> => {
    const qs = new URLSearchParams({
      pageNo: String(params.pageNo),
      pageSize: String(params.pageSize),
      ...(params.search ? { ProjectName: params.search } : {}),
    }).toString();

    await useDataStore.getState().fetchData({
      endPoint: `/Project/list?${qs}`,
      headers,
    });

    return asApi<ListData>(useDataStore.getState().data as unknown);
  },

  fetchProjectsByCode: async (
    empCode:string | undefined,
    params: ListParams,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<ListData>> => {
    const qs = new URLSearchParams({
      pageNo: String(params.pageNo),
      pageSize: String(params.pageSize),
      ...(params.search ? { ProjectName: params.search } : {}),
    }).toString();

    await useDataStore.getState().fetchData({
      endPoint: `/Project/list/${empCode}?${qs}`,
      headers,
    });

    return asApi<ListData>(useDataStore.getState().data as unknown);
  },

  // GET /Project/edit/:code
  fetchProjectById: async (
    code: string,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<ProjectItem>> => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/edit/${encodeURIComponent(code)}`,
      headers,
    });
    return asApi<ProjectItem>(useDataStore.getState().data as unknown);
  },

  // POST /Project/create
  createProject: async (
    payload: Payload,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<boolean> | null> => {
    const resp = await useDataStore.getState().fetchData({
      endPoint: `/Project/create`,
      method: "POST",
      body: payload,
      headers,
    });

    return resp;
  },

  // PUT /Project/update/:code
  updateProject: async (
    code: string,
    payload: Payload,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<boolean> | null> => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/update/${encodeURIComponent(code)}`,
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

  // DELETE /Project/delete/:code
  deleteProject: async (
    code: string,
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<boolean>> => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/delete/${encodeURIComponent(code)}`,
      method: "DELETE",
      headers,
    });

    return asApi<boolean>(useDataStore.getState().data as unknown);
  },

  fetchProjectOverview: async () => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/overview`,
      method: "GET",
    });
    return asApi<boolean>(useDataStore.getState().data.data.projectOverview ?? null);
  }
};
