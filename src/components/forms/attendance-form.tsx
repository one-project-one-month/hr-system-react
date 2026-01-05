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
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { EmployeeService } from "@/services/employeeService";
import { useNavigate, useParams } from "react-router-dom";
import { SuccessDialog } from "../ui/custom/success-dialogue";
import { formSchema } from "@/schema/attendance";

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
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: "",
      employeeName: "",
      checkinLocation: "",
      checkoutLocation: "",
      checkinTime: "",
      checkoutTime: "",
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

    const extractTime = (dtOrTime: any) => {
      if (!dtOrTime) return "";
      if (typeof dtOrTime === "string") {
        if (dtOrTime.includes("T")) {
          const t = new Date(dtOrTime);
          return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
        }
        if (/^\d{2}:\d{2}/.test(dtOrTime)) return dtOrTime.slice(0, 5);
      }
      if (dtOrTime instanceof Date) return `${pad(dtOrTime.getHours())}:${pad(dtOrTime.getMinutes())}`;
      return "";
    };

    const vals: AttendanceFormValues = {
      employeeCode: initialValues.employeeCode ?? initialValues.employeeCode ?? "",
      employeeName: initialValues.employeeName ?? initialValues.name ?? "",
      checkinLocation: initialValues.checkinLocation ?? initialValues.checkInLocation ?? "",
      checkoutLocation: initialValues.checkoutLocation ?? initialValues.checkOutLocation ?? "",
      checkinTime: extractTime(initialValues.checkinTime ?? initialValues.checkInTime ?? initialValues.checkInTime),
      checkoutTime: extractTime(initialValues.checkoutTime ?? initialValues.checkOutTime ?? initialValues.checkOutTime),
      workingHour: Number(initialValues.workingHour ?? 0),
      status: initialValues.status ?? "",
      date: parseDate(initialValues.date ?? initialValues.attendanceDate ?? initialValues.attendanceDate),
      remark: initialValues.remark ?? "",
    };

    form.reset(vals);
  }, [initialValues]);

  // When employee code changes, fetch employee details and populate employeeName
  useEffect(() => {
    if (!employeeCode) return;
    // debounce to avoid many requests on fast typing
    const t = setTimeout(async () => {
      try {
        const emp = await EmployeeService.fetchEmployee(employeeCode);
        // EmployeeService returns an object with 'name' or 'employeeName'
        const name = emp?.name ?? emp?.employeeName ?? "";
        if (name) form.setValue("employeeName", name);
      } catch (err) {
        // ignore fetch errors silently; user can still type name manually
        console.warn("Failed to fetch employee for code", employeeCode, err);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [employeeCode]);

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
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Input
                            value={field.value || ""}
                            readOnly
                            className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                            placeholder="Select time"
                            disabled={mode === "view"}

                          />
                          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-4 bg-white"
                        align="start"
                      >
                        <input
                          type="time"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="border rounded-md p-2"
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Input
                            value={field.value || ""}
                            readOnly
                            className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                            placeholder="Select time"
                            disabled={mode === "view"}

                          />
                          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-4 bg-white"
                        align="start"
                      >
                        <input
                          type="time"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="border rounded-md p-2"
                          disabled={mode === "view"}

                        />
                      </PopoverContent>
                    </Popover>
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
