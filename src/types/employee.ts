export interface Employee {
    Id: number;
    EmployeeCode: string;
    Username: string;
    Name: string;
    Role: string;
    Email: string;
    PhoneNo: string;
    StartDate: string;
    ResignDate: string;
    Salary?: number;
    Password?: string;
}

export interface fetchData {
    name: string;
    pageNo: number;
    pageSize: number;
    roleName: string;
}