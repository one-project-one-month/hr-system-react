"use client";

import { useEffect, useState } from "react";
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
import { backlogService } from "@/services/backlogService";

interface EmployeeApiItem {
  name?: string;
  employeeCode?: string;
}

interface ProjectApiItem {
  projectName?: string;
  projectCode?: string;
}

type LookupOption = { name: string; code: string };

const formSchema = z.object({
  taskCode: z.string().optional(),
  taskName: z.string().nonempty("Task Name cannot be empty!"),
  taskDescription: z.string().nonempty("Task Description cannot be empty!"),
  assignee: z.string().nonempty("Assignee cannot be empty!"),
  employeeCode: z.string().optional(), // hidden
  projectName: z.string().nonempty("Project Name cannot be empty!"),
  projectCode: z.string().optional(), // hidden
  taskStatus: z.string().nonempty("Task Status cannot be empty!"),
  startDate: z.date({ error: "Start Date cannot be empty!" }),
  endDate: z.date({ error: "Due Date cannot be empty!" }),
  workingHour: z.string().nonempty("Working Hours cannot be empty!"),
});


interface BacklogFormProps {
  mode: "create" | "edit" | "view";
  initialData?: {
    taskCode?: string;
    taskName: string;
    taskDescription: string;
    employeeName: string;
    employeeCode?: string;
    projectName: string;
    projectCode?: string;
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
  const [employees, setEmployees] = useState<LookupOption[]>([]);
  const [projects, setProjects] = useState<LookupOption[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskCode: initialData?.taskCode || "",
      taskName: initialData?.taskName || "",
      taskDescription: initialData?.taskDescription || "",
      assignee: initialData?.employeeName || "",
      employeeCode: initialData?.employeeCode || "",
      projectName: initialData?.projectName || "",
      projectCode: initialData?.projectCode || "",
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

  // Fetch project dropdown options for create and edit modes
  // Fetch dropdown data whenever we can edit the form.
  useEffect(() => {
    if (mode === "view") {
      return;
    }

    let isMounted = true;
    const fetchDropdowns = async () => {
      try {
        setEmployeesLoading(true);
        setProjectsLoading(true);
        setEmployeesError(null);
        setProjectsError(null);

        const empRes = await backlogService.fetchEmployees(1, 100);
         console.log("Employee: ", empRes);
        if (isMounted) {
          setEmployees(
            (empRes.items ?? []).map((emp: EmployeeApiItem) => ({
              name: emp.name ?? "",
              code: emp.employeeCode ?? "",
            }))
            .filter((emp: LookupOption) => Boolean(emp.name))
          );
        }
       

        const projRes = await backlogService.fetchProjects(1, 100);
        if (isMounted) {
          setProjects(
            (projRes.items ?? []).map((p: ProjectApiItem) => ({
              name: p.projectName ?? "",
              code: p.projectCode ?? "",
            }))
            .filter((proj: LookupOption) => Boolean(proj.name))
          );
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching dropdown data", err);
          setEmployeesError(
            err instanceof Error ? err.message : "Unable to load assignees."
          );
          setProjectsError(
            err instanceof Error ? err.message : "Unable to load projects."
          );
        }
      } finally {
        if (isMounted) {
          setEmployeesLoading(false);
          setProjectsLoading(false);
        }
      }
    };

    fetchDropdowns();
    return () => {
      isMounted = false;
    };
  }, [mode]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  const filteredAssignees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const handleSelectAssignee = (
    value: string,
    onChange: (val: string) => void
  ) => {
    const selected = employees.find((e) => e.name === value);
    onChange(value);
    form.setValue("employeeCode", selected?.code || "");
    setIsAssigneeOpen(false);
    setAssigneeSearch("");
  };

  const handleSelectProject = (
    value: string,
    onChange: (val: string) => void
  ) => {
    const selected = projects.find((p) => p.name === value);
    onChange(value);
    form.setValue("projectCode", selected?.code || "");
    setIsProjectOpen(false);
    setProjectSearch("");
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
                      <Popover
                        open={isAssigneeOpen}
                        onOpenChange={setIsAssigneeOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <div className="relative">
                              <Input
                                value={field.value}
                                readOnly
                                className="pr-8 cursor-pointer bg-white border-gray-300"
                                placeholder="Select assignee name"
                              />
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-2 bg-white"
                          align="start"
                        >
                          <div className="space-y-2">
                            <Input
                              placeholder="Search assignee..."
                              value={assigneeSearch}
                              onChange={(e) =>
                                setAssigneeSearch(e.target.value)
                              }
                              className="h-8"
                            />
                            <div className="max-h-48 overflow-y-auto">
                              {employeesLoading && (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  Loading assignees…
                                </div>
                              )}
                              {!employeesLoading && filteredAssignees.length > 0 &&
                                filteredAssignees.map((assignee) => (
                                  <button
                                    key={assignee.code || assignee.name}
                                    type="button"
                                    onClick={() =>
                                      handleSelectAssignee(
                                        assignee.name,
                                        field.onChange
                                      )
                                    }
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                                  >
                                    {assignee.name}
                                  </button>
                                ))}
                              {!employeesLoading && filteredAssignees.length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  {employeesError || "No results"}
                                </div>
                              )}
                            </div>
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
                        <Popover
                          open={isProjectOpen}
                          onOpenChange={setIsProjectOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  value={field.value}
                                  readOnly
                                  disabled={projectsLoading}
                                  className="pr-8 cursor-pointer bg-white border-gray-300"
                                  placeholder="Select project name"
                                />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-2 bg-white"
                            align="start"
                          >
                            <div className="space-y-2">
                              <Input
                                placeholder="Search project..."
                                value={projectSearch}
                                onChange={(e) =>
                                  setProjectSearch(e.target.value)
                                }
                                className="h-8"
                              />
                              <div className="max-h-48 overflow-y-auto">
                                {projectsLoading && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    Loading projects…
                                  </div>
                                )}
                                {!projectsLoading &&
                                  filteredProjects.length > 0 &&
                                  filteredProjects.map((project) => (
                                    <button
                                      key={project.code || project.name}
                                      type="button"
                                      onClick={() =>
                                        handleSelectProject(
                                          project.name,
                                          field.onChange
                                        )
                                      }
                                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                                    >
                                      {project.name}
                                    </button>
                                  ))}
                                {!projectsLoading &&
                                  filteredProjects.length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                      {projectsError || "No results"}
                                    </div>
                                  )}
                              </div>
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

              {mode !== "create" && (
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
                            className="w-auto p-0 bg-white"
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
              )}

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
                      <Popover
                        open={isProjectOpen}
                        onOpenChange={setIsProjectOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <div className="relative">
                              <Input
                                value={field.value}
                                readOnly
                                disabled={projectsLoading}
                                className="pr-8 cursor-pointer bg-white border-gray-300"
                                placeholder="Select project name"
                              />
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-2 bg-white"
                          align="start"
                        >
                          <div className="space-y-2">
                            <Input
                              placeholder="Search project..."
                              value={projectSearch}
                              onChange={(e) => setProjectSearch(e.target.value)}
                              className="h-8"
                            />
                            <div className="max-h-48 overflow-y-auto">
                              {projectsLoading && (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  Loading projects…
                                </div>
                              )}
                              {!projectsLoading &&
                                filteredProjects.length > 0 &&
                                filteredProjects.map((project) => (
                                  <button
                                    key={project.code || project.name}
                                    type="button"
                                    onClick={() =>
                                      handleSelectProject(
                                        project.name,
                                        field.onChange
                                      )
                                    }
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                                  >
                                    {project.name}
                                  </button>
                                ))}
                              {!projectsLoading &&
                                filteredProjects.length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    {projectsError || "No results"}
                                  </div>
                                )}
                            </div>
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
                        <Popover
                          open={isAssigneeOpen}
                          onOpenChange={setIsAssigneeOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  value={field.value}
                                  readOnly
                                  className="pr-8 cursor-pointer bg-white border-gray-300"
                                  placeholder="Select assignee name"
                                />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-2 bg-white"
                            align="start"
                          >
                            <div className="space-y-2">
                              <Input
                                placeholder="Search assignee..."
                                value={assigneeSearch}
                                onChange={(e) =>
                                  setAssigneeSearch(e.target.value)
                                }
                                className="h-8"
                              />
                              <div className="max-h-48 overflow-y-auto">
                                {employeesLoading && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    Loading assignees…
                                  </div>
                                )}
                                {!employeesLoading && filteredAssignees.length > 0 &&
                                  filteredAssignees.map((assignee) => (
                                    <button
                                      key={assignee.code || assignee.name}
                                      type="button"
                                      onClick={() =>
                                        handleSelectAssignee(
                                          assignee.name,
                                          field.onChange
                                        )
                                      }
                                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                                    >
                                      {assignee.name}
                                    </button>
                                  ))}
                                {!employeesLoading && filteredAssignees.length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    {employeesError || "No results"}
                                  </div>
                                )}
                              </div>
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
                          className="w-auto p-0 bg-white"
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
                          className="w-auto p-0 bg-white"
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