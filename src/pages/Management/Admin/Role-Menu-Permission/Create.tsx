import RoleMenuPermissionPanel from "@/components/ui/role-menu-treeview";

export function RoleMenuTreeViewCreate() {
  return (
    <div className="flex flex-col w-full ps-4 pt-4">
      <h1 className="font-bold">Role Menu Permission Information</h1>
      <RoleMenuPermissionPanel />
    </div>
  );
}
