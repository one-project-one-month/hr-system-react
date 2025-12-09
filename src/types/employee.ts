export interface Employee {
    employeeCode: string;
    username: string;
    name: string;
    roleName: string;
    email: string;
    phoneNo: string;
}

export interface EmployeeResponse {
    EmployeeCode: string;
    Username: string;
    Name: string;
    Role: string;
    Email: string;
    PhoneNo: string;
    StartDate: string;
    ResignDate: string;
    Salary?: number;
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
    items: EmployeeResponse[] | never;
}