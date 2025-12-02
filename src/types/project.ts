export type ProjectItem = {
    projectCode: string;
    projectName: string;
    projectDescription: string;
    startDate: string | null;
    endDate: string | null;
    projectStatus: string;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string | null;
    modifiedBy?: string | null;
};
export type ListData = {
    items: ProjectItem[];
    totalCount: number;
    pageNo: number;
    pageSize: number;
};
export type ApiEnvelope<T = unknown> = {
    isSuccess?: boolean;
    message?: string;
    data?: T;
    [k: string]: unknown;
};

export type Row = {
    id: string; // projectCode
    name: string;
    status: string;
    startDate: string;
    endDate: string;
};

export type ProjectFormValues = {
    code: string;
    name: string;
    description: string;
    status: "Active" | "Completed" | "Cancelled" | "Planned" | "";
    start: Date | null;
    due: Date | null;
};

export type ProjectFormProps = {
    mode: "create" | "edit";
    initialValues?: Partial<ProjectFormValues>;
    submitting?: boolean;
    serverError?: string;
    onSubmit: (values: ProjectFormValues) => void | Promise<void>;
    onCancel: () => void;
};

export type ApiProject = {
    id?: string | number;
    projectCode?: string;
    projectName: string;
    projectDescription?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    projectStatus: "Active" | "Completed" | "Cancelled" | "Planned";
};

export type Project = {
    projectCode: string;
    projectName: string;
    projectStatus: "Planned" | "InProgress" | "DONE";
    startDate?: string | null;
    endDate?: string | null;
};

export type ListParams = {
    pageNo: number;
    pageSize: number;
    search?: string;
    from?: string;
    to?: string;
};

export type Payload = {
    projectName: string;
    projectDescription: string;
    startDate: string;
    endDate: string;
    projectStatus: string;
};