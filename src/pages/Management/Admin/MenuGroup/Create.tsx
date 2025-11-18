import { menuGroupService } from "@/services/menuGroupService";
import {
  MenuGroupForm,
  type MenuGroupFormValues,
} from "../../../../components/ui/MenuGroupForm";
import { useNavigate } from "react-router-dom";
import { useDataStore } from "@/stores/useDataStore";
import { useState } from "react";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

const makeMenuGroupCode = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const firstWord = trimmed.split(/\s+/)[0];
  return firstWord.toUpperCase();
};

export default function MenuGroupCreatePage() {
  const navigate = useNavigate();
  const { loading, error } = useDataStore();
  const [successOpen, setSuccessOpen] = useState(false);

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <>
      <MenuGroupForm
        mode="create"
        submitting={loading}
        serverError={error ?? undefined}
        onCancel={() => navigate(-1)}
        onSubmit={async (vals: MenuGroupFormValues) => {
          const menuGroupCode = makeMenuGroupCode(vals.menuGroupName);

          const payload = {
            menuGroupCode,
            menuGroupName: vals.menuGroupName,
            url: vals.url,
            icon: vals.icon,
            sortOrder: vals.sortOrder,
            hasMenuItem: vals.hasMenuItem,
          };

          const resp = await menuGroupService.createMenuGroup(payload);

          const latestErr = useDataStore.getState().error;
          const ok =
            !latestErr &&
            (resp?.isSuccess === undefined || resp?.isSuccess === true);

          if (ok) {
            setSuccessOpen(true);
          }
        }}
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Success!"
        description="Your menu has been created successfully."
        onConfirm={() => {
          setSuccessOpen(false);
          navigate("/management/admin/menu-group");
        }}
      />
    </>
  );
}
