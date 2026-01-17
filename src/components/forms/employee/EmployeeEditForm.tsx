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
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .trim(),
    salary: z
      .number()
      .positive("Salary must be a positive number")
      .max(10000000, "Salary too high"),
    name: z.string().min(2, "Name is required").max(60, "Name too long").trim(),
    roleCode: z.string().trim(),
    email: z.string().email("Invalid email address").trim(),
    phoneNo: z
      .string()
      .transform((val) => val.replace(/[\s-]/g, ""))
      .refine(
        (val) =>
          /^(09\d{7,9}|\+959\d{7,9})$/.test(val),
        "Invalid Myanmar phone number"
      ),
    gender: z.string(),
    startDate: z
      .string()
      .trim()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "StartDate must be a valid date"
      ),
    resignDate: z
      .string()
      .trim()
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
      // employeeCode: "",
      username: "",
      salary: 0,
      name: "",
      roleCode: "",
      email: "",
      phoneNo: "",
      startDate: "",
      resignDate: "",
      gender: ""
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
        console.log(employee)
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
          gender: employee.gender ?? ""
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
      <h2 className="text-xl font-bold mb-6 text-center sm:text-left text-primary-700">
        {code ? "Edit Employee Information" : "Add New Employee"}
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          onReset={onReset}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5  ">

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

            <div className="flex gap-4">
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-natural-500 rounded-sm py-5">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50">
                          <SelectItem id="male" value="Male"
                          >
                            Male
                          </SelectItem>
                          <SelectItem
                            id="female"
                            value="Female"
                          >
                            Female
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                          className="justify-start text-left font-normal w-full border-natural-500 rounded-sm py-5"
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
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="primary-btn">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
