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
} from "./form";
import { Input } from "./input";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SuccessDialog } from "./SuccessDialog";

const formSchema = z.object({
  employeeCode: z.string().nonempty("Employee Code cannot be empty!"),
  employeeName: z.string().nonempty("Employee Name cannot be empty"),
  checkinLocation: z.string().nonempty("Check In location cannot be empty!"),
  checkoutLocation: z.string().nonempty("Check out location cannot be empty!"),
  checkinTime: z.string().nonempty("Checkin Time cannot be empty!"),
  checkoutTime: z.string().nonempty("Checkout Time cannot be empty!"),
  workingHour: z
    .float32()
    .min(0, "Working hour cannot be negative")
    .max(24, "Too many hours"),
  status: z.string().nonempty("checkin and checkout time incorrect"),
  date: z.date(),
  remark: z.string(),
});
export default function AttendanceForm() {
  const { code } = useParams();
  const [open, setOpen] = useState(false);
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
  const { setValue } = form;

  const checkinTime = form.watch("checkinTime");
  const checkoutTime = form.watch("checkoutTime");

  useEffect(() => {
    if (!checkinTime || !checkoutTime) return;
    const status = calculateAttendanceStatus(checkinTime, checkoutTime);
    setValue("status", status);
    console.log(form.getValues("status"));
  }, [checkinTime, checkoutTime]);

  const calculateAttendanceStatus = (checkIn: string, checkOut: string) => {
    const toMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const handleBack = () => {
      navigate("/AttendanceList");
    };

    // Reference points
    const START_TIME = toMinutes("09:00");
    const LATE_THRESHOLD = toMinutes("10:00");
    const EARLY_DEPARTURE_THRESHOLD = toMinutes("16:30");
    const END_TIME = toMinutes("17:00");

    // Validate inputs
    if (!checkIn || !checkOut) return "absent";

    const checkInMinutes = toMinutes(checkIn);
    const checkOutMinutes = toMinutes(checkOut);
    const hours = (checkOutMinutes - checkInMinutes) / 60;
    form.setValue("workingHour", parseFloat(hours.toFixed(2)));

    // Validation: Check-out must be after check-in
    if (checkOutMinutes <= checkInMinutes) {
      form?.setError?.("checkinTime", {
        message: "Checkout time must be later than checkin time",
      });
      return "";
    }

    // --- Determine status ---
    let status = "absent";

    // Check-in based logic
    if (checkInMinutes < START_TIME && checkOutMinutes > END_TIME) {
      status = "present";
    } else if (checkInMinutes <= LATE_THRESHOLD) {
      status = "late";
    } else if (checkInMinutes > LATE_THRESHOLD) {
      status = "half-day";
    }

    if (
      checkOutMinutes >= EARLY_DEPARTURE_THRESHOLD &&
      checkOutMinutes < END_TIME &&
      (status === "present" || status === "late")
    ) {
      status = "early-departure";
    } else if (checkOutMinutes >= END_TIME && status === "present") {
      status = "present";
    } else if (checkOutMinutes >= END_TIME && status === "late") {
      status = "late";
    } else if (checkOutMinutes < EARLY_DEPARTURE_THRESHOLD) {
      status = "absent";
    }
    form.setValue("status", status);
    return status;
  };

  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/attendance");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setTimeout(() => {
      setSuccessDialogOpen(true);
    }, 500);
  };
  return (
    <div className="p-6 md:p-8 w-full flex-1 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {!code ? "Add New Attendance" : "Update Attendance"}
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
                        className="bg-natural-50 border-natural-500 h-10 text-natural-800"
                        placeholder="Enter employee code"
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Working Hour */}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Picker */}
              {/* <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        value={
                          field.value
                            ? field.value.toLocaleDateString()
                            : ""
                        }
                        readOnly
                        className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                        placeholder="Select date"
                      />
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      captionLayout="dropdown"
                      onSelect={field.onChange}
                      className="bg-white"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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

              {/* Status */}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant={"outline"}
              type="button"
              className="px-8 py-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-50 h-10"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="px-8 py-2 bg-primary-500 hover:bg-primary-600 text-white h-10"
            >
              {code ? "UPDATE" : "CREATE"}
            </Button>
          </div>
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
