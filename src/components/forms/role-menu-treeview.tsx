import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, AlertCircle } from "lucide-react";
import { roleMenuPermissionService } from "@/services/roleMenuPermissionService";
import type { MenuPermissionItem, Permission, PermissionCheckboxProps, Role, SavePermission } from "@/types/role-menu-permission";

const PermissionCheckbox = ({
  menuGroupCode,
  menuItemCode,
  permissionCode,
  newPermissions,
  togglePermission,
}: PermissionCheckboxProps) => {
  const isChecked = newPermissions.menuPermissions.some(
    (mp) =>
      mp.menuGroupCode === menuGroupCode &&
      mp.menuItemCode === menuItemCode &&
      mp.permissionCode === permissionCode &&
      mp.isChecked
  );

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className="check-menus"
        checked={isChecked}
        onCheckedChange={(v) =>
          togglePermission(
            menuGroupCode,
            menuItemCode,
            permissionCode,
            v === true
          )
        }
      />
      <div className="font-medium">{permissionCode}</div>
    </div>
  );
};

interface ChildMenuProps {
  menu: any;
  menuGroupCode: string | null;
  permissions: Permission[];
  newPermissions: SavePermission;
  toggleMenuItem: (menuItemCode: string, value: boolean) => void;
  togglePermission: PermissionCheckboxProps["togglePermission"];
}

const ChildMenu = ({
  menu,
  menuGroupCode,
  permissions,
  newPermissions,
  toggleMenuItem,
  togglePermission,
}: ChildMenuProps) => {
  const menuChecked = newPermissions.menuPermissions.some(
    (mp) => mp.menuItemCode === menu.menuItemCode && mp.isChecked
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center ps-6 gap-2">
        <Checkbox
          className="check-menus"
          checked={menuChecked}
          onCheckedChange={(v) => toggleMenuItem(menu.menuItemCode, v === true)}
        />{" "}
        <div className="font-medium">{menu.menuItemName}</div>
      </div>

      <div className="flex flex-row ps-12 gap-5 mt-1">
        {permissions.map((p) => (
          <PermissionCheckbox
            menuGroupCode={menuGroupCode}
            key={p.permissionCode}
            menuItemCode={menu.menuItemCode}
            permissionCode={p.permissionCode}
            newPermissions={newPermissions}
            togglePermission={togglePermission}
          />
        ))}
      </div>
    </div>
  );
};

interface ParentMenuProps {
  menuGroup: any;
  openMenuGroup: string | null;
  toggleMenuGroupCode: (code: string) => void;
  newPermissions: SavePermission;
  permissions: Permission[];
  toggleMenuItem: (menuItemCode: string, value: boolean) => void;
  toggleMenuGroup: (menuGroupCode: string, value: boolean) => void;
  togglePermission: PermissionCheckboxProps["togglePermission"];
}

const ParentMenu = ({
  menuGroup,
  openMenuGroup,
  toggleMenuGroupCode,
  newPermissions,
  permissions,
  toggleMenuItem,
  toggleMenuGroup,
  togglePermission,
}: ParentMenuProps) => {
  const groupChecked = newPermissions.menuPermissions.some(
    (mp) =>
      (mp.menuGroupCode === menuGroup.menuGroupCode && mp.isChecked)
  );

  const hasChildMenus = menuGroup.childMenus?.length > 0;
  const isOpen = openMenuGroup === menuGroup.menuGroupCode;

  // Filter permissions for special groups
  const getPermissionsForGroup = () => {
    if (hasChildMenus) return []; // Handled by child menus
    if (
      menuGroup.menuGroupCode === "DASHBOARD" ||
      menuGroup.menuGroupCode === "PAYROLL"
    )
      return [];
    if (["COMPANY_RULES"].includes(menuGroup.menuGroupCode)) {
      return permissions.filter((p) =>
        ["LIST", "UPDATE"].includes(p.permissionCode)
      );
    }
    return permissions;
  };

  const groupPermissions = getPermissionsForGroup();

  return (
    <div className="flex gap-2" key={menuGroup.menuGroupCode}>
      {/* Toggle Icon */}
      <div>
        {menuGroup.menuGroupCode !== "DASHBOARD"
          && menuGroup.menuGroupCode !== "PAYROLL"
          && menuGroup.menuGroupCode !== "ROLE_MENU_PERMISSION" ? (
          isOpen ? (
            <MinusCircle
              className="text-primary-700 mt-3 cursor-pointer"
              onClick={() => toggleMenuGroupCode(menuGroup.menuGroupCode)}
            />
          ) : (
            <PlusCircle
              className="text-primary-700 mt-3 cursor-pointer"
              onClick={() => toggleMenuGroupCode(menuGroup.menuGroupCode)}
            />
          )
        ) : (
          <div className="ms-6" />
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        {/* Parent Menu */}
        <div className="flex items-center gap-2">
          <Checkbox
            className="check-menus"
            checked={groupChecked}
            onCheckedChange={(v) =>
              toggleMenuGroup(menuGroup.menuGroupCode, v === true)
            }
          />
          <div className="font-medium">{menuGroup.menuGroupCode}</div>
        </div>

        {/* Child Menus */}
        {hasChildMenus && isOpen && (
          <div className="flex flex-col gap-2">
            {menuGroup.childMenus.map((menu: any) => {
              return (
                <ChildMenu
                  key={menu.menuItemCode}
                  menu={menu}
                  menuGroupCode={menuGroup.menuGroupCode}
                  permissions={permissions}
                  newPermissions={newPermissions}
                  toggleMenuItem={toggleMenuItem}
                  togglePermission={togglePermission}
                />
              );
            })}
          </div>
        )}

        {/* Permissions for childless groups */}
        {!hasChildMenus && isOpen && (
          <div className="flex gap-2 ms-6 mt-1">
            {groupPermissions.map((p) => {
              return (
                <PermissionCheckbox
                  key={p.permissionCode}
                  menuItemCode={null}
                  menuGroupCode={menuGroup.menuGroupCode}
                  permissionCode={p.permissionCode}
                  newPermissions={newPermissions}
                  togglePermission={togglePermission}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------- Main Component ---------------------
export default function RoleMenuPermissionPanel() {
  const [roleMenuPermission, setRoleMenuPermission] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [openMenuGroup, setOpenMenuGroup] = useState<string | null>(null);
  const [newPermissions, setNewPermissions] = useState<SavePermission>({
    roleCode: "",
    menuPermissions: [],
  });
  console.log (selectedRole)
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleMenuGroupCode = (menuGroupCode: string) =>
    setOpenMenuGroup((prev) => (prev === menuGroupCode ? null : menuGroupCode));

  const toggleMenuItem = (menuItemCode: string, value: boolean) => {
    setNewPermissions((prev) => ({
      ...prev,
      roleCode: selectedRole,
      menuPermissions: prev.menuPermissions.map((mp) =>
        mp.menuItemCode === menuItemCode ? { ...mp, isChecked: value } : mp
      ),
    }));
  };

  const toggleMenuGroup = (menuGroupCode: string, value: boolean) => {
    setNewPermissions((prev) => ({
      ...prev,
      roleCode: selectedRole,
      menuPermissions: prev.menuPermissions.map((mp) =>
        mp.menuGroupCode === menuGroupCode ? { ...mp, isChecked: value } : mp
      ),
    }));
  };

  const togglePermission = (
    menuGroupCode: string | null,
    menuItemCode: string | null,
    permissionCode: string,
    value: boolean
  ) => {
    setNewPermissions((prev) => ({
      ...prev,
      roleCode: selectedRole,
      menuPermissions: prev.menuPermissions.map((mp) =>
        mp.menuGroupCode === menuGroupCode &&
          mp.menuItemCode === menuItemCode &&
          mp.permissionCode === permissionCode
          ? { ...mp, isChecked: value }
          : mp
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await roleMenuPermissionService.savePermissions(newPermissions);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------- Fetch Data ---------------------
  useEffect(() => {
    (async () => {
      const fetchRMP = await roleMenuPermissionService.fetchRoleMenuPermission(
        selectedRole ?? ""
      );
      console.log (fetchRMP)
      const fetchedRoles = await roleMenuPermissionService.fetchRoles();
      const fetchedPermissions =
        await roleMenuPermissionService.fetchPermissions();

      setRoleMenuPermission(fetchRMP ?? []);
      setRoles(fetchedRoles.items ?? []);
      setPermissions(fetchedPermissions ?? []);

      const flatPermissions: MenuPermissionItem[] = [];

      (fetchRMP ?? []).forEach((group: any) => {
        // Child menus
        if (group.childMenus?.length) {
          group.childMenus.forEach((menu: any) => {
            (fetchedPermissions ?? []).forEach((p: any) => {
              flatPermissions.push({
                menuGroupCode: group.menuGroupCode,
                menuItemCode: menu.menuItemCode,
                permissionCode: p.permissionCode,
                isChecked: menu.permissions?.includes(p.permissionCode),
              });
            });
          });
          return;
        }

        // DASHBOARD
        if (
          group.menuGroupCode === "DASHBOARD" ||
          group.menuGroupCode === "PAYROLL" ||
          group.menuGroupCode === "ROLE_MENU_PERMISSION"
        ) {
          flatPermissions.push({
            menuGroupCode: group.menuGroupCode,
            menuItemCode: null,
            permissionCode: null,
            isChecked: group.isChecked,
          });
          return;
        }

        // COMPANY_RULES → LIST + UPDATE
        if (["COMPANY_RULES"].includes(group.menuGroupCode)) {
          ["LIST", "UPDATE"].forEach((code) => {
            flatPermissions.push({
              menuGroupCode: group.menuGroupCode,
              menuItemCode: null,
              permissionCode: code,
              isChecked: group.isChecked,
            });
          });
          return;
        }

        // Default → all permissions
        (fetchedPermissions ?? []).forEach((p: any) => {
          flatPermissions.push({
            menuGroupCode: group.menuGroupCode,
            menuItemCode: null,
            permissionCode: p.permissionCode,
            isChecked: group.isChecked,
          });
        });
      });
      console.log (flatPermissions)
      setNewPermissions({
        roleCode: selectedRole ?? "",
        menuPermissions: flatPermissions,
      });
    })();
  }, [selectedRole]);

  return (
    <div className="pt-6 max-w-6xl mx-auto w-full flex gap-6">
      <div className="flex flex-col gap-3 mb-4 w-64">
        <Label>Role</Label>
        <Select onValueChange={(v) => setSelectedRole(v)}>
          <SelectTrigger className="bg-white text-primary-700">
            <SelectValue placeholder="Select role">
              {roles.find((r) => r.roleCode === selectedRole)?.roleName ||
                "Select Role"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-natural-50 text-primary-700 w-full">
            {roles.map((r) => (
              <SelectItem key={r.roleId} value={r.roleCode}>
                {r.roleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Permissions Panel */}
      <div className="flex-1">
        <Card className="border-none shadow-none">
          <CardContent className="flex flex-col gap-4">
            {roleMenuPermission.length < 1 && (
              <div className="p-4 text-sm text-muted-foreground">
                No menus matched.
              </div>
            )}

            {roleMenuPermission.map((menuGroup) => (
              <ParentMenu
                key={menuGroup.menuGroupCode}
                menuGroup={menuGroup}
                openMenuGroup={openMenuGroup}
                toggleMenuGroupCode={toggleMenuGroupCode}
                newPermissions={newPermissions}
                permissions={permissions}
                toggleMenuItem={toggleMenuItem}
                toggleMenuGroup={toggleMenuGroup}
                togglePermission={togglePermission}
              />
            ))}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <Button className="cancel-btn">Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="primary-btn"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
