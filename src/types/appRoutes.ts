import type { JSX } from "react";

export interface AppRoute {
    path: string;
    element: JSX.Element;
    permission?: { menuCode: string; permissionCode: string };
}

export interface permissions {
    menuCode: string;
    permissionCode: string
}