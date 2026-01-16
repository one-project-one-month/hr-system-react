import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EmployeeService } from "@/services/employeeService";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
import { employeeSchema } from "@/schema/employee";

export default function EmployeeForm() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState({});
    const fetchRoles = roles?.items || [];
    const { onConfirm, openDialog } = useSuccessDialogStore();
    const handleCancel = () => {
        navigate("/employee");
    };

    const form = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            // employeeCode: "",
            username: "",
            password: "",
            salary: 0,
            name: "",
            roleCode: "",
            email: "",
            phoneNo: "",
            startDate: "",
            resignDate: "",
        },
    });

    useEffect(() => {
        (async () => {
            const fetchRoles = await EmployeeService.fetchRoles();
            setRoles(fetchRoles.data);
        })();
    }, []);

    const handleFormSubmit = async (values: z.infer<typeof employeeSchema>) => {
        const employeeData = {
            ...values,
            startDate: values.startDate
                ? new Date(values.startDate).toISOString()
                : null,
            resignDate: values.resignDate
                ? new Date(values.resignDate).toISOString()
                : null,
        };
        try {
            await EmployeeService.createEmployee(employeeData);
            openDialog("Create Employee Successful!", onConfirm);
            navigate("/employee");
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    return (
        <div className="flex-1 p-6 bg-natural-100">
            <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary-500">
                Employee Create
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-natural-500 rounded-sm py-5"
                                            placeholder="Enter username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-natural-500 rounded-sm py-5"
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salary</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-natural-500 rounded-sm py-5"
                                            type="number"
                                            placeholder="Enter salary amount"
                                            {...field}
                                            value={field.value ?? 0}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-natural-500 rounded-sm py-5"
                                            placeholder="Enter name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="roleCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value ?? ""}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="border-natural-500 rounded-sm py-5">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-50">
                                                {fetchRoles.map((role) => (
                                                    <SelectItem
                                                        id={role.roleId}
                                                        value={role.roleCode}
                                                    >
                                                        {role.roleName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-natural-500 rounded-sm py-5"
                                            placeholder="Enter email address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone No.</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-natural-500 rounded-sm py-5"
                                            placeholder="Enter phone number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
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
                                                    captionLayout="dropdown"
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
                                                                ? date.toISOString()
                                                                : ""
                                                        )
                                                    }
                                                    initialFocus
                                                    fromYear={2000}
                                                    toYear={new Date().getFullYear() + 10}

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
                            name="resignDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resign Date</FormLabel>
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
                                                                ? date.toISOString()
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
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
