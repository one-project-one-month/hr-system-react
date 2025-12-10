export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
};

export interface changePassword  {
    employeeCode: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface resetPassword {    
    email: string;
    newPassword: string;
    resetToken: string; 
}
