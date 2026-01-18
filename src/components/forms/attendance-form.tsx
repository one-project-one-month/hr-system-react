"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { EmployeeService } from "@/services/employeeService";
import { useNavigate, useParams } from "react-router-dom";
import { SuccessDialog } from "../ui/custom/success-dialogue";
import { formSchema } from "@/schema/attendance";
import { DateTimePicker } from "../ui/custom/date-time-picker";

type AttendanceFormValues = z.infer<typeof formSchema>;

export default function AttendanceForm({
  mode,
  onSubmitExternal,
  initialValues,
}: {
  mode?: "create" | "edit" | "view";
  onSubmitExternal?: (values: AttendanceFormValues) => Promise<any>;
  initialValues?: Partial<AttendanceFormValues> | any;
}) {
  const { code } = useParams();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: "",
      employeeName: "",
      checkinLocation: "",
      checkoutLocation: "",
      checkinTime: new Date(),
      checkoutTime: new Date(),
      workingHour: 0,
      status: "",
      date: new Date(),
      remark: "",
    },
  });

  const employeeCode = form.watch("employeeCode");

  useEffect(() => {
    if (!initialValues) return;
    const pad = (n: number) => n.toString().padStart(2, "0");

    const parseDate = (d: any) => {
      if (!d) return new Date();
      const dt = typeof d === "string" ? new Date(d) : d;
      return dt instanceof Date && !isNaN(dt.getTime()) ? dt : new Date();
    };

    const parseDateTime = (value?: string | Date) => {
      if (!value) return null;
      const date = typeof value === "string" ? new Date(value) : value;
      return date instanceof Date && !isNaN(date.getTime()) ? date : null;
    };
    const vals: AttendanceFormValues = {
      employeeCode: initialValues.employeeCode ?? "",
      employeeName: initialValues.employeeName ?? "",
      checkinLocation: initialValues.checkinLocation ?? "",
      checkoutLocation: initialValues.checkoutLocation ?? initialValues.checkOutLocation ?? "",
      checkinTime: initialValues.checkinTime ? parseDateTime(initialValues.checkinTime) : new Date(),
      checkoutTime: initialValues.checkoutTime ? parseDateTime(initialValues.checkoutTime) : new Date(),
      workingHour: Number(initialValues.workingHour ?? 0),
      status: initialValues.status ?? "",
      date: parseDate(initialValues.date ?? initialValues.attendanceDate ?? initialValues.attendanceDate),
      remark: initialValues.remark ?? "",
    };

    form.reset(vals);
  }, [initialValues]);

  // When employee code changes, fetch employee details and populate employeeName
  useEffect(() => {
    if (!employeeCode) {
      form.clearErrors("employeeCode");
      form.setValue("employeeName", "");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const emp = await EmployeeService.fetchEmployee(employeeCode);

        const name = emp?.name ?? emp?.employeeName ?? "";

        if (!name) {
          throw new Error("Employee not found");
        }

        form.setValue("employeeName", name);
        form.clearErrors("employeeCode");
      } catch (error: any) {
        const message = "employee not found";
        form.setValue("employeeName", "");
        form.setError("employeeCode", {
          type: "manual",
          message,
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [employeeCode, form]);

  const title = mode === "create"
    ? "Add New Attendance"
    : mode === "edit"
      ? "Edit Attendance"
      : "Attendance Detail";

  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/attendance");
  };

  const onSubmit = async (values: AttendanceFormValues) => {
    if (onSubmitExternal) {
      console.log(values)
      try {
        await onSubmitExternal(values);
        setSuccessDialogOpen(true);
      } catch (err) {
        console.error("Create attendance failed", err);
        // Optionally show an error to the user here
      }
    } else {
      // Fallback behavior for standalone form usage
      setTimeout(() => {
        setSuccessDialogOpen(true);
      }, 500);
    }
  };
  return (
    <div className="p-6 md:p-8 w-full flex-1">
      <div className="mb-8">
        <h1 className="page-title">
          {title}
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-48">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Employee Code */}
              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Employee Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-natural-400 border-natural-500 text-gray-700 h-10"
                        placeholder="Enter employee code"
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-in Location */}
              <FormField
                control={form.control}
                name="checkinLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Location
                    </FormLabel>
                    <FormControl>
                      <Input

                        {...field}
                        className="bg-natural-50 border-natural-500 h-10 text-natural-800"
                        placeholder="Enter location"
                        disabled={mode === "view"}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-out Location */}
              <FormField
                control={form.control}
                name="checkoutLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-natural-50 border-natural-500 h-10 text-natural-800"
                        placeholder="Enter location"
                        disabled={mode === "view"}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Working Hour */}
              {(mode === 'view') ?
                <FormField
                  control={form.control}
                  name="workingHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hour
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-natural-400 border-natural-500 text-gray-700 h-10"
                          placeholder="Auto-calculated"
                          disabled={mode === "view"}

                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                : ''}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Employee Name */}
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Employee Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-natural-400 border-natural-500 text-gray-700 h-10"
                        placeholder="Enter name"
                        disabled={mode === "view"}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-in Time */}
              <FormField
                control={form.control}
                name="checkinTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Time
                    </FormLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={mode === "view"}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-out Time */}
              <FormField
                control={form.control}
                name="checkoutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Time
                    </FormLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={mode === "view"}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              {(mode === 'view') ?
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-natural-50 border-natural-500 h-10 text-natural-800"
                          placeholder="Auto status"
                          disabled={mode === "view"}

                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                : ''}
            </div>
          </div>

          {/* Action Buttons */}
          {mode !== "view" && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/attendance")}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                className="primary-btn"
              >
                {code ? "UPDATE" : "CREATE"}
              </Button>
            </div>
          )}
          {/* View Mode Back Button */}
          {mode === "view" && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant={"outline"}
                type="button"
                className="px-8 py-2 bg-primary-500 hover:bg-primary-600 text-white h-10"
                onClick={() => navigate("/attendance")}
              >
                BACK
              </Button>
            </div>
          )}
        </form>
      </Form>

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}
