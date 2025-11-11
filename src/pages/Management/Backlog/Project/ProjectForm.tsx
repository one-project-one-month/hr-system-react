// src/pages/projects/ProjectForm.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar1Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export type ProjectFormValues = {
  code: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "Cancelled" | "Planned" | "";
  start: Date | null;
  due: Date | null;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ProjectFormValues>;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: ProjectFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function ProjectForm({
  mode,
  initialValues,
  submitting = false,
  serverError,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({
    code: initialValues?.code ?? "PJ1234",
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    status: (initialValues?.status as ProjectFormValues["status"]) ?? "",
    start: initialValues?.start ?? null,
    due: initialValues?.due ?? null,
  });

  // re-hydrate when editing once data arrives
  useEffect(() => {
    if (!initialValues) return;
    setValues((prev) => ({
      ...prev,
      code: initialValues.code ?? prev.code,
      name: initialValues.name ?? prev.name,
      description: initialValues.description ?? prev.description,
      status:
        (initialValues.status as ProjectFormValues["status"]) ?? prev.status,
      start: initialValues.start ?? prev.start,
      due: initialValues.due ?? prev.due,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.code,
    initialValues?.name,
    initialValues?.description,
    initialValues?.status,
    initialValues?.start?.toString(),
    initialValues?.due?.toString(),
  ]);

  const update = <K extends keyof ProjectFormValues>(
    key: K,
    val: ProjectFormValues[K]
  ) => setValues((v) => ({ ...v, [key]: val }));

  const submitLabel = mode === "create" ? "Create" : "Update";

  return (
    <form
      className="p-6 w-full flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === "create" ? "Create Project" : "Edit Project"}
        </h2>
      </div>

      {serverError && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {/* Code */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium">
            Code <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="PJ1234"
            value={values.code}
            onChange={(e) => update("code", e.target.value)}
            disabled={submitting}
          />
        </div> */}

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Enter Description"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            disabled={submitting}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={values.status}
            onValueChange={(v) =>
              update("status", v as ProjectFormValues["status"])
            }
            disabled={submitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative w-full text-left pl-9 pr-3 py-2 rounded-md border bg-background"
                disabled={submitting}
              >
                <Calendar1Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {values.start ? (
                  format(values.start, "M/d/yyyy")
                ) : (
                  <span className="text-muted-foreground">
                    Enter Start date
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.start ?? undefined}
                onSelect={(d) => update("start", d ?? null)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Due Date */}
        <div className="space-y-2 md:col-span-1">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative w-full text-left pl-9 pr-3 py-2 rounded-md border bg-background"
                disabled={submitting}
              >
                <Calendar1Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {values.due ? (
                  format(values.due, "M/d/yyyy")
                ) : (
                  <span className="text-muted-foreground">Enter Due date</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.due ?? undefined}
                onSelect={(d) => update("due", d ?? null)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 justify-end max-w-4xl">
        <Button
          variant="secondary"
          type="button"
          className="outline-btn"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="outline-btn" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
