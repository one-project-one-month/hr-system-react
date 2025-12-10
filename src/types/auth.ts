import type { ReactNode } from "react";

export interface User {
    createAt: string;
    email: string;
    employeeCode: string;
    name: string;
    phoneNo: string;
    profileImage: string;
    roleName: string;
    username: string;
    menuTree: {};
    isFirstTimeLogin: boolean;
}
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: Object | null;
    login: (username: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    setUser: (user: User) => void;
    setError: (error: Object) => void;
    getUser: () => User | null;
    getToken: () => string | null;
    setToken: (token: string) => void;
    clearAuth: () => void;
}

export type Role = "Administrator" | "HR Specialist" | "Employee" | "default";

export interface ProtectedRouteProps {
    isAllowed: boolean;
    redirect?: string;
    children: ReactNode
};
