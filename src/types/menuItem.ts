export interface fetchData {
    token: string | null;
    name: string;
    pageNo: number;
    pageSize: number;
}

export interface updateMenu {
    token: string | null;
    menuCode: string;
    payload: {
        menuGroupCode: string;
        menuName: string;
        url: string;
        icon: string;
        sortOrder: number;
    };
}

export interface createMenu {
    payload: {
        menuGroupCode: string;
        menuName: string;
        url: string;
        icon: string;
        sortOrder: number;
    };
    token: string | null;
}