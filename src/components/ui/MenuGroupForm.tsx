import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { MenuGroupItem } from "@/services/menuGroupService";

export type MenuGroupFormValues = {
  menuGroupCode: string;
  menuGroupName: string;
  url: string;
  icon: string;
  sortOrder: number | null | undefined;
  hasMenuItem: boolean;
};

type MenuGroupFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<MenuGroupItem>;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: MenuGroupFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function MenuGroupForm({
  mode,
  initialValues,
  submitting = false,
  serverError,
  onSubmit,
  onCancel,
}: MenuGroupFormProps) {
  const [values, setValues] = useState<MenuGroupFormValues>({
    menuGroupCode: initialValues?.menuGroupCode ?? "",
    menuGroupName: initialValues?.menuGroupName ?? "",
    url: initialValues?.url ?? "",
    icon: initialValues?.icon ?? "",
    sortOrder: initialValues?.sortOrder ?? null,
    hasMenuItem: initialValues?.hasMenuItem ?? false,
  });

  // Update form when editing + data arrives async
  useEffect(() => {
    if (!initialValues) return;
    setValues({
      menuGroupCode: initialValues.menuGroupCode ?? "",
      menuGroupName: initialValues.menuGroupName ?? "",
      url: initialValues.url ?? "",
      icon: initialValues.icon ?? "",
      sortOrder: initialValues.sortOrder ?? null,
      hasMenuItem: initialValues.hasMenuItem ?? false,
    });
  }, [initialValues]);

  const update = <K extends keyof MenuGroupFormValues>(
    key: K,
    val: MenuGroupFormValues[K]
  ) => setValues((v) => ({ ...v, [key]: val }));

  const submitLabel = mode === "create" ? "Create" : "Update";

  return (
    <form
      className="flex flex-col w-full bg-white p-10 rounded-lg shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <h2 className="text-2xl mb-6 font-semibold text-gray-800">
        {mode === "create" ? "Menu Group Information" : "Edit Menu Group"}
      </h2>

      {serverError && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Menu Group Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-700">
            Menu Group Name
          </label>
          <Input
            value={values.menuGroupName}
            onChange={(e) => update("menuGroupName", e.target.value)}
            placeholder="Enter Menu Group Name"
            disabled={submitting}
            className="bg-gray-50 text-gray-700 border-gray-200 focus:ring-1"
          />
        </div>

        {/* URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-700">URL</label>
          <Input
            value={values.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="Enter URL"
            disabled={submitting}
            className="bg-gray-50 text-gray-700 border-gray-200 focus:ring-1"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Icon */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-700">Icon</label>
          <Input
            value={values.icon}
            onChange={(e) => update("icon", e.target.value)}
            placeholder="Enter Icon"
            disabled={submitting}
            className="bg-gray-50 text-gray-700 border-gray-200 focus:ring-1"
          />
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-700">
            Sort Order
          </label>
          <Input
            inputMode="numeric"
            value={values.sortOrder ?? ""}
            onChange={(e) => {
              const n = e.target.value.replace(/\D/g, "");
              update("sortOrder", n ? Number(n) : null);
            }}
            placeholder="Enter Sort Order"
            disabled={submitting}
            className="bg-gray-50 text-gray-700 border-gray-200 focus:ring-1"
          />
        </div>
      </div>

      {/* Has Menu Item */}
      <div className="mt-6 flex flex-col gap-2">
        <label className="text-sm font-medium text-primary-700">
          Has Menu Item
        </label>
        <Checkbox
          checked={values.hasMenuItem}
          onCheckedChange={(val) => update("hasMenuItem", !!val)}
          disabled={submitting}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-10">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
          className="outline-btn"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-primary-500 text-white"
          disabled={submitting}
        >
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
