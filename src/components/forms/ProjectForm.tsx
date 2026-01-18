"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Calendar1Icon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type ProjectFormValues = {
  code: string;
  name: string;
  description: string;
  status: "Planned" | "InProgress" | "Completed" | "Cancelled" | "";
  start: Date | null;
  due: Date | null;
};

const projectSchema = z.object({
  code: z.string().optional(),
  name: z.string().nonempty("Project name is required"),
  description: z.string().nonempty("Description is required"),
  status: z.enum(["Planned", "InProgress", "Completed", "Cancelled"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
  start: z.date(),
  due: z.date(),
});

type ProjectFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ProjectFormValues>;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: ProjectFormValues, event?: React.BaseSyntheticEvent) => void; // ✅ add event
  onCancel: () => void;
};



export function ProjectForm({ mode, initialValues, submitting = false, serverError, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      code: initialValues?.code ?? "",
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      status: initialValues?.status ?? "Planned", // pick a valid enum
      start: initialValues?.start ?? null,
      due: initialValues?.due ?? null,
    },
  });
  // Reset form if initialValues change (editing)
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const submitLabel = mode === "create" ? "Create" : "Update";
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 w-full flex-1">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="page-title">{mode === "create" ? "Create Project" : "Edit Project"}</h2>
      </div>
      {serverError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{serverError}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input {...field} placeholder="Enter Name" disabled={submitting} />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea {...field} placeholder="Enter Description" rows={4} disabled={submitting} />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
            </div>
          )}
        />


        {/* Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-natural-50">
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="InProgress">InProgress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>}
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <Controller
            control={control}
            name="start"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="relative w-full text-left pl-9 pr-3 py-2 rounded-md border bg-background"
                    disabled={submitting}
                  >
                    <Calendar1Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {field.value ? format(field.value, "M/d/yyyy") : <span className="text-muted-foreground">Select Start date</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value ?? undefined} onSelect={(d) => field.onChange(d ?? null)} />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.start && <p className="text-red-600 text-xs mt-1">{errors.start.message}</p>}
        </div>

        {/* Due Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Due Date</label>
          <Controller
            control={control}
            name="due"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="relative w-full text-left pl-9 pr-3 py-2 rounded-md border bg-background"
                    disabled={submitting}
                  >
                    <Calendar1Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {field.value ? format(field.value, "M/d/yyyy") : <span className="text-muted-foreground">Select Due date</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value ?? undefined} onSelect={(d) => field.onChange(d ?? null)} />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.due && <p className="text-red-600 text-xs mt-1">{errors.due.message}</p>}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 justify-end max-w-4xl">
        <Button variant="secondary" type="button" className="cancel-btn" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}