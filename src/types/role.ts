export interface ListData {
    items: RoleItems[];
    pageNo: number;
    pageSize: number;
    totalCount: number;

}

export interface RoleItems {
    roleId: string;
    roleCode: string;
    roleName: string;
    createdAt: string;
    createdBy: string;
    deleteFlag: boolean;
}

export interface listParams {
    roleName: string;
    pageNo: number;
    pageSize: number;
}