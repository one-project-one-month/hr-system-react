import { useEffect, useState } from "react";

// shadcn/ui components (assumed available in the environment)
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
import { roleMenuPermissionService } from "@/services/roleMenuPermissionService";

export default function RoleMenuPermissionPanel() {
  const [roles, setRoles] = useState();

  const [menus, setMenus] = useState();

  const [permissions, setPermissions] = useState();

  const [selectedRole, setSelectedRole] = useState();
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   // ensure selectedRole exists after (fake) data changes
  //   if (!roles.find((r) => r.id === selectedRole)) {
  //     setSelectedRole(roles[0]?.id ?? null);
  //   }
  // }, [roles, selectedRole]);

  // function togglePermission(roleId: string, menuId: string) {
  //   setPermissions((prev) => {
  //     const clone = { ...prev };
  //     const setForRole = new Set(clone[roleId] ?? []);
  //     if (setForRole.has(menuId)) setForRole.delete(menuId);
  //     else setForRole.add(menuId);
  //     clone[roleId] = setForRole;
  //     return clone;
  //   });
  // }

  function isAllowed(roleId: string, menuId: string) {
    return !!permissions[roleId] && permissions[roleId].has(menuId);
  }

  function toggleAllForRole(roleId: string, enable: boolean) {
    setPermissions((prev) => {
      const clone = { ...prev };
      if (enable) clone[roleId] = new Set(menus.map((m) => m.id));
      else clone[roleId] = new Set();
      return clone;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
    } catch (err) {
      console.error(err);
      alert("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  }

  const filteredMenus = menus
    ? menus.filter((m) =>
        m.menuName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  useEffect(() => {
    (async () => {
      const fetchedRoles = await roleMenuPermissionService.fetchRoles();
      const fetchedMenus = await roleMenuPermissionService.fetchMenus();
      setRoles(fetchedRoles.items);
      setMenus(fetchedMenus);
    })();
  }, []);

  return (
    <div className="pt-6 max-w-6xl mx-auto w-full flex">
      <div className="flex flex-col gap-3 mb-4 w-full">
        <Label className="mb-1">Role</Label>
        <Select onValueChange={(v) => setSelectedRole(v)}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select role">
              {roles
                ? roles.filter((r) => r.roleId === selectedRole)?.roleName
                : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-full">
            {roles
              ? roles.map((r) => (
                  <SelectItem
                    key={r.roleId}
                    value={r.roleId}
                    className="w-full"
                  >
                    {r.roleName}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col w-full">
        <Card className="border-none shadow-none">
          <CardContent>
            {filteredMenus.map((menu) => (
              <div
                key={menu.menuId}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="data-[state=checked]:border-primary-500 border border-2  data-[state=checked]:text-primary-500"
                    id={`chk-${selectedRole}-${menu.menuId}`}
                    // checked={isAllowed(selectedRole, menu.id)}
                    // onCheckedChange={() =>
                    //   togglePermission(selectedRole, menu.id)
                    // }
                  />
                  <div className="font-medium">{menu.menuName}</div>
                </div>
              </div>
            ))}

            {filteredMenus.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">
                No menus match your search.
              </div>
            )}
            <div className="flex gap-4">
              <div className="mt-4 flex">
                <Button className="outline-btn">Cancel</Button>
              </div>
              <div className="mt-4 flex">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="outline-btn"
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
