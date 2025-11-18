import {
  MenuGroupForm,
  type MenuGroupFormValues,
} from "../../../../components/ui/MenuGroupForm";
import { useNavigate, useParams } from "react-router-dom";
import { useDataStore } from "@/stores/useDataStore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  menuGroupService,
  type MenuGroupItem,
} from "@/services/menuGroupService";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export default function MenuGroupEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useDataStore();

  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    menuGroupService.fetchMenuGroupsByCode(id);
  }, [id]);

  function isApiResponse<T>(x: unknown): x is { isSuccess: unknown; data: T } {
    return (
      typeof x === "object" && x !== null && "isSuccess" in x && "data" in x
    );
  }

  const payload = isApiResponse<MenuGroupFormValues>(data)
    ? data.data
    : (data as unknown as MenuGroupFormValues | null);
  const menu = (payload ?? null) as MenuGroupFormValues | null;

  if (loading && !menu) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!menu) return <div className="p-6">Menu Group not found</div>;

  const initialValues: Partial<MenuGroupItem> = {
    menuGroupCode: menu.menuGroupCode ?? "",
    menuGroupName: menu.menuGroupName ?? "",
    url: menu.url ?? "",
    icon: menu.icon,
    sortOrder: menu.sortOrder ?? undefined,
    hasMenuItem: menu.hasMenuItem,
  };

  return (
    <>
      <MenuGroupForm
        key={menu.menuGroupCode}
        mode="edit"
        initialValues={initialValues}
        onCancel={() => navigate(-1)}
        onSubmit={async (vals: MenuGroupFormValues) => {
          const body = {
            menuGroupCode: vals.menuGroupCode,
            menuGroupName: vals.menuGroupName,
            url: vals.url,
            icon: vals.icon,
            sortOrder: vals.sortOrder,
            hasMenuItem: vals.hasMenuItem,
          };

          const resp = await menuGroupService.updateMenuGroup(id!, body);
          const latestErr = useDataStore.getState().error;
          const ok =
            !latestErr &&
            (resp?.isSuccess === undefined || resp?.isSuccess === true);

          if (ok) setSuccessOpen(true);
        }}
      />
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Success!"
        description="Your menu has been updated successfully."
        onConfirm={() => {
          setSuccessOpen(false);
          navigate("/management/admin/menu-group");
        }}
      />
    </>
  );
}
