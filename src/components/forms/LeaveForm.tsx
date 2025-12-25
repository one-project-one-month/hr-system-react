import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
import { createLeaveSchema, type CreateLeaveInputs } from "@/schema/leave";
import { leaveService } from "@/services/leaveService";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface LeaveAvailability {
    totalLeavenTaken: number;
    remainingLeave: number;
    leaveAllowedPerYear: number;
    leaveType: string;
}

interface ToastState {
    message: string;
    type: "success" | "error" | "info" | "warning";
}

export default function LeaveForm() {
    const navigate = useNavigate();
    const openDialog = useSuccessDialogStore((state) => state.openDialog);
    const [leaveAvailability, setLeaveAvailability] =
        useState<LeaveAvailability | null>(null);
    const [errMsg, setErrMsg] = useState("");

    const onConfirm = () => {
        navigate(-1);
    };
    const handleCancel = () => {
        navigate(-1);
    };

    const form = useForm<CreateLeaveInputs>({
        resolver: zodResolver(createLeaveSchema),
        defaultValues: {
            leaveType: "",
            fromDate: "",
            toDate: "",
            fullOrHalf: "",
            reason: "",
        },
    });

    const handleLeaveTypeChange = async (
        value: string,
        fieldChange: (value: string) => void
    ) => {
        fieldChange(value);
        if (value) {
            try {
                const response = await leaveService.checkLeaveAvailability(value);
                setLeaveAvailability(response.data);
            } catch (err: any) {
                console.log('asdf');
                setErrMsg(err.message);
                setLeaveAvailability(null);
            }
        } else {
            setLeaveAvailability(null);
        }
    };;

    const handleFormSubmit = async (values: CreateLeaveInputs) => {
        try {
            await leaveService.createLeave(values);
            openDialog("Create Leave Successful!", onConfirm);
        } catch (error) {
            console.error("Error saving leave:", error);
            setToast({
                message: "Failed to create leave.",
                type: "error",
            });
        }
    };

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    return (
        <div className="flex-1 p-6 bg-natural-100">
            <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary-500">
                Leave Create
            </h2>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    onReset={onReset}
                    className="space-y-3"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="leaveType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave Type</FormLabel>
                                    <Select
                                        value={field.value ?? ""}
                                        onValueChange={(value) =>
                                            handleLeaveTypeChange(
                                                value,
                                                field.onChange
                                            )
                                        }
                                    >
                                        <SelectTrigger className="border-natural-500 rounded-sm py-5 w-full">
                                            <SelectValue placeholder="Select leave type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50">
                                            <SelectItem value="MedicalLeave">
                                                Medical Leave
                                            </SelectItem>
                                            <SelectItem value="CasualLeave">
                                                Casual Leave
                                            </SelectItem>
                                            <SelectItem value="LeaveWithoutPay">
                                                Leave Without Pay
                                            </SelectItem>
                                            <SelectItem value="EarnLeave">
                                                Earn Leave
                                            </SelectItem>
                                            <SelectItem value="MaternityLeave">
                                                Maternity Leave
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fullOrHalf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full/Half Day</FormLabel>
                                    <Select
                                        value={field.value ?? ""}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="border-natural-500 rounded-sm py-5 w-full ">
                                            <SelectValue placeholder="Select full or half day" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50">
                                            <SelectItem value="FullLeave">
                                                Full Day
                                            </SelectItem>
                                            <SelectItem value="HalfLeave">
                                                Half Day
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {leaveAvailability && (
                        <div className="py-4">
                            <Table className="bg-card text-card-foreground">
                                <TableHeader className="bg-primary-500 text-white">
                                    <TableRow>
                                        <TableHead className="text-white">
                                            Leave Type
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Leave Allowed Per Year
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Total Leaven Taken
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Remaining Leave
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="hover:bg-primary-100">
                                        <TableCell className="font-bold">
                                            {leaveAvailability.leaveType}
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {
                                                leaveAvailability.leaveAllowedPerYear
                                            }
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {leaveAvailability.totalLeavenTaken}
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {leaveAvailability.remainingLeave}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {leaveAvailability === null && errMsg && (
                        <div className="py-4">
                            <h1 className="text-red-800 text-medium">
                                {errMsg}
                            </h1>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="fromDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From Date</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="justify-start text-left font-normal w-full border-natural-500 rounded-sm py-5"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value
                                                        ? format(
                                                              new Date(
                                                                  field.value
                                                              ),
                                                              "PPP"
                                                          )
                                                        : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white ">
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) =>
                                                        field.onChange(
                                                            date
                                                                ? date
                                                                      .toISOString()
                                                                      .split(
                                                                          "T"
                                                                      )[0]
                                                                : ""
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="toDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To Date</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="justify-start text-left font-normal w-full border-natural-500 rounded-sm py-5"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value
                                                        ? format(
                                                              new Date(
                                                                  field.value
                                                              ),
                                                              "PPP"
                                                          )
                                                        : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white">
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) =>
                                                        field.onChange(
                                                            date
                                                                ? date
                                                                      .toISOString()
                                                                      .split(
                                                                          "T"
                                                                      )[0]
                                                                : ""
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="border-natural-500 rounded-sm py-5"
                                            placeholder="Enter reason"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                        <Button
                            type="reset"
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="primary-btn">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
