export type MenuGroupListParams = {
    pageNo: number;
    pageSize: number;
};

export type MenuGroupItem = {
    menuGroupId: string;
    menuGroupCode: string;
    menuGroupName: string;
    hasMenuItem: boolean;
    url: string;
    icon: string;
    sortOrder: number;
    createdAt: string;
    createdBy: string;
    modifiedAt: string | null;
    modifiedBy: string | null;
    deleteFlag: boolean;
};

export type MenuGroupListData = {
    items: MenuGroupItem[];
    totalCount: number;
    pageNo: number;
    pageSize: number;
};

export type Payload = {
    menuGroupCode?: string;
    menuGroupName: string;
    url: string;
    icon: string;
    sortOrder: number | null | undefined;
    hasMenuItem: boolean;
};
