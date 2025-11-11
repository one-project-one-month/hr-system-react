import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EmployeeService } from "@/services/employeeService";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";

export default function EmployeeForm() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState({});
  const { onConfirm, openDialog } = useSuccessDialogStore();

  const fetchRoles = roles?.items || [];
  const handleCancel = () => {
    navigate("/employee");
  };

  const employeeSchema = z.object({
    // employeeCode: z
    //   .string()
    //   .min(1, "EmployeeCode is required")
    //   .max(15, "EmployeeCode must be at most 15 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    salary: z
      .number()
      .positive("Salary must be a positive number")
      .max(10000000, "Salary too high"),
    name: z.string().min(2, "Name is required").max(60, "Name too long"),
    roleCode: z.string(),
    email: z.string().email("Invalid email address"),
    phoneNo: z
      .string()
      .regex(/^[0-9]{9,11}$/, "Invalid phone number (must be 9–11 digits)"),
    startDate: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "StartDate must be a valid date"
      ),
    resignDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        "ResignDate must be a valid date"
      ),
  });

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeCode: "",
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

  const { reset } = form;

  useEffect(() => {
    (async () => {
      const fetchRoles = await EmployeeService.fetchRoles();
      setRoles(fetchRoles.data);
    })();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!code) return;

      try {
        const employee = await EmployeeService.fetchEmployee(code);
        // Reset the form with fetched values
        reset({
          //   employeeCode: employee.employeeCode ?? "",
          username: employee.username ?? "",
          salary: employee.salary ?? 0,
          name: employee.name ?? "",
          roleCode: employee.roleCode ?? "",
          email: employee.email ?? "",
          phoneNo: employee.phoneNo ?? "",
          startDate: employee.startDate ?? "",
          resignDate: employee.resignDate ?? "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployeeData();
  }, [code, reset]);

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
      if (code) {
        await EmployeeService.updateEmployee(code, employeeData);
        openDialog("Update Employee Successful!", onConfirm);
        navigate("/employee");
      }
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
        {code ? "Employee Edit" : "Employee Create"}
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          onReset={onReset}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* <FormField
              control={form.control}
              name="employeeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Employee Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
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
                      type="number"
                      placeholder="Enter salary amount"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Input placeholder="Enter name" {...field} />
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50">
                        {fetchRoles.map((role) => (
                          <SelectItem id={role.roleId} value={role.roleCode}>
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
                    <Input placeholder="Enter email address" {...field} />
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
                    <Input placeholder="Enter phone number" {...field} />
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
                          className="justify-start text-left font-normal w-full"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
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
              name="resignDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resign Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal w-full"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
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
              variant="outline"
              className="w-full sm:w-auto text-primary-500"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="outline-btn">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
