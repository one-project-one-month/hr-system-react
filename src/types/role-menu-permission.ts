export interface MenuPermissionItem {
    menuGroupCode: string;
    menuItemCode: string | null;
    permissionCode: string | null;
    isChecked: boolean;
}

export interface SavePermission {
    roleCode: string | null;
    menuPermissions: MenuPermissionItem[];
}

export interface Permission {
    permissionId: string;
    permissionCode: string;
    permissionName: string;
}

export interface Role {
    roleId: string;
    roleCode: string;
    roleName: string;
    createdAt: string;
    createdBy: string;
    modifiedAt: string | null;
    modifiedBy: string | null;
    deleteFlag: boolean;
}

// --------------------- Components ---------------------

export interface PermissionCheckboxProps {
    menuGroupCode: string | null;
    menuItemCode: string | null;
    permissionCode: string;
    newPermissions: SavePermission;
    togglePermission: (
        menuGroupCode: string | null,
        menuItemCode: string | null,
        permissionCode: string,
        value: boolean
    ) => void;
}
