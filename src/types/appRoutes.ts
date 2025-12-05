import type { JSX } from "react";

export interface AppRoute {
    path: string;
    element: JSX.Element;
    permission?: {
        menuCode: string;
        menuGroupCode: string;
        permissionCode: string
    };
}

export interface permissions {
    menuCode: string;
    menuGroupCode: string;
    permissionCode: string
}