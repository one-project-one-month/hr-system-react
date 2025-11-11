import { useDataStore } from "@/stores/useDataStore";

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  message?: string;
  data?: T;
  [k: string]: unknown;
};

type ListParams = {
  pageNo: number;
  pageSize: number;
  search?: string;
  from?: string;
  to?: string;
};

type Payload = {
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
};

type ProjectItem = {
  projectCode: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string | null;
  modifiedBy?: string | null;
};

type ListData = {
  items: ProjectItem[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
};

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
      ...(params.search ? { search: params.search } : {}),
      ...(params.from ? { from: params.from } : {}),
      ...(params.to ? { to: params.to } : {}),
    }).toString();

    await useDataStore.getState().fetchData({
      endPoint: `/Project/list?${qs}`,
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
    await useDataStore.getState().fetchData({
      endPoint: `/Project/create`,
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
};
