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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  taskCode: z.string().optional(),
  taskName: z.string().nonempty("Task Name cannot be empty!"),
  taskDescription: z.string().nonempty("Task Description cannot be empty!"),
  assignee: z.string().nonempty("Assignee cannot be empty!"),
  projectName: z.string().nonempty("Project Name cannot be empty!"),
  taskStatus: z.string().nonempty("Task Status cannot be empty!"),
  startDate: z.date({ error: "Start Date cannot be empty!" }),
  endDate: z.date({ error: "Due Date cannot be empty!" }),
  workingHour: z.string().nonempty("Working Hours cannot be empty!"),
});

const mockProjects = [
  "HR System",
  "Employee Management",
  "POS System",
  "Online Booking System",
  "E-Commerce Platform",
];

const mockAssignees = [
  "Chan Lay",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Williams",
  "David Brown",
];

interface BacklogFormProps {
  mode: "create" | "edit" | "view";
  initialData?: {
    taskCode?: string;
    taskName: string;
    taskDescription: string;
    assignee: string;
    projectName: string;
    taskStatus: string;
    startDate: string;
    endDate: string;
    workingHour: number;
  };
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export default function BacklogForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: BacklogFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskCode: initialData?.taskCode || "",
      taskName: initialData?.taskName || "",
      taskDescription: initialData?.taskDescription || "",
      assignee: initialData?.assignee || "",
      projectName: initialData?.projectName || "",
      taskStatus: initialData?.taskStatus || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      workingHour: initialData?.workingHour
        ? String(initialData.workingHour)
        : "",
    },
  });

  const isDisabled = mode === "view";

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <div className="py-6 px-10 w-full flex-1">
      <div className="flex items-center gap-4 mb-6">
        <p className="font-semibold">Backlog Information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            {/* Left Column */}
            <div
              className={
                mode === "create"
                  ? "space-y-6 md:space-y-10"
                  : "space-y-5 md:space-y-8"
              }
            >
              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="taskCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Code</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-natural-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter task name"
                          className="border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isDisabled}
                          placeholder="Enter task description"
                          className={
                            isDisabled
                              ? "bg-natural-500"
                              : "border border-gray-300"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              type="button"
                              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary text-left flex items-center justify-between"
                            >
                              <span
                                className={field.value ? "" : "text-gray-400"}
                              >
                                {field.value || "Select assignee name"}
                              </span>
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 bg-primary-500 text-white"
                          align="start"
                        >
                          <div className="max-h-60 overflow-auto">
                            {mockAssignees.map((assignee) => (
                              <button
                                key={assignee}
                                type="button"
                                onClick={() => field.onChange(assignee)}
                                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100 hover:text-gray-700 transition-colors"
                              >
                                {assignee}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      {isDisabled ? (
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="bg-natural-500"
                          />
                        </FormControl>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                type="button"
                                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary text-left flex items-center justify-between"
                              >
                                <span
                                  className={field.value ? "" : "text-gray-400"}
                                >
                                  {field.value || "Select project name"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0 bg-primary-500 text-white"
                            align="start"
                          >
                            <div className="max-h-60 overflow-auto">
                              {mockProjects.map((project) => (
                                <button
                                  key={project}
                                  type="button"
                                  onClick={() => field.onChange(project)}
                                  className="w-full p-3 text-sm text-left hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                >
                                  {project}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="taskStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Status</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter task status"
                          className="border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    {isDisabled ? (
                      <div className="relative">
                        <FormControl>
                          <Input
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            disabled
                            className="pl-10 bg-natural-500"
                          />
                        </FormControl>
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                      </div>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal p-3 h-auto border-gray-300",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "LLL dd, y")
                              ) : (
                                <span>Enter start date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-primary-500 text-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="workingHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          disabled={isDisabled}
                          placeholder="Enter working hours"
                          className={
                            isDisabled
                              ? "bg-natural-500"
                              : "border border-gray-300"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Right Column */}
            <div
              className={
                mode === "create"
                  ? "space-y-6 md:space-y-10 pr-5"
                  : "space-y-5 md:space-y-8 pr-5"
              }
            >
              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter task description"
                          className="border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isDisabled}
                          placeholder="Enter task name"
                          className={
                            isDisabled
                              ? "bg-natural-500"
                              : "border border-gray-300"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              type="button"
                              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary text-left flex items-center justify-between"
                            >
                              <span
                                className={field.value ? "" : "text-gray-400"}
                              >
                                {field.value || "Select project name"}
                              </span>
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 bg-primary-500 text-white"
                          align="start"
                        >
                          <div className="max-h-60 overflow-auto">
                            {mockProjects.map((project) => (
                              <button
                                key={project}
                                type="button"
                                onClick={() => field.onChange(project)}
                                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100 hover:text-gray-700 transition-colors"
                              >
                                {project}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      {isDisabled ? (
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="bg-natural-500"
                          />
                        </FormControl>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                type="button"
                                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary text-left flex items-center justify-between"
                              >
                                <span
                                  className={field.value ? "" : "text-gray-400"}
                                >
                                  {field.value || "Select assignee name"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0 bg-primary-500 text-white"
                            align="start"
                          >
                            <div className="max-h-60 overflow-auto">
                              {mockAssignees.map((assignee) => (
                                <button
                                  key={assignee}
                                  type="button"
                                  onClick={() => field.onChange(assignee)}
                                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                >
                                  {assignee}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode !== "create" && (
                <FormField
                  control={form.control}
                  name="taskStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Status</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isDisabled}
                          placeholder="Enter task Status"
                          className={
                            isDisabled
                              ? "bg-natural-500"
                              : "border border-gray-300"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal p-3 h-auto border-gray-300",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "LLL dd, y")
                              ) : (
                                <span>Enter start date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-primary-500 text-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    {isDisabled ? (
                      <div className="relative">
                        <FormControl>
                          <Input
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            disabled
                            className="pl-10 bg-natural-500"
                          />
                        </FormControl>
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                      </div>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal p-3 h-auto border-gray-300",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "LLL dd, y")
                              ) : (
                                <span>Enter due date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-primary-500 text-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="workingHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter working hours"
                          className="border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`${
              mode === "create" ? "mt-10" : "mt-4"
            } mr-5 flex justify-end gap-3`}
          >
            <Button type="button" className="outline-btn" onClick={onCancel}>
              {mode === "view" ? "Back" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" className="outline-btn">
                {mode === "edit" ? "Update" : "Create"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
