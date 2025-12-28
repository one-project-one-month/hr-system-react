export interface Employee {
    employeeCode: string;
    username: string;
    name: string;
    roleName: string;
    email: string;
    phoneNo: string;
    menuTree: object | null;
    isFirstTimeLogin: null | boolean;
    profileImage: string;
}

export interface fetchData {
    name: string;
    pageNo: number;
    pageSize: number;
    roleName: string;
}

export interface fetchEmployees {
    pageSize: number;
    pageNo: number;
    totalCount: number;
    items: Employee[] | never;
}