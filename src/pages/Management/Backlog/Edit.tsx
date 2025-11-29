// BacklogEdit.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BacklogForm from "@/components/forms/backlogForm";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { SpinnerCustom } from "@/components/ui/spinner";
import { backlogService } from "@/services/backlogService";

export function BacklogEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const result = await backlogService.fetchTaskById(id as string);

        if (result && result.data?.tasks) {
          setTask(result.data.tasks);
        } else {
          console.error("Task not found or error:", result);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      setUpdating(true);
      console.log("Updating backlog:", values);

      // Transform the data to match API expectations exactly as shown in Swagger
      const payload = {
        taskId: String(id), // Ensure it's a string
        employeeCode: values.employeeCode,
        projectCode: values.projectCode,
        taskName: values.taskName,
        taskDescription: values.taskDescription,
        startDate: values.startDate instanceof Date
          ? values.startDate.toISOString()
          : values.startDate,
        endDate: values.endDate instanceof Date
          ? values.endDate.toISOString()
          : values.endDate,
        taskStatus: values.taskStatus,
        workingHour: parseInt(values.workingHour) || 0,
      };

      console.log("Transformed payload:", payload);

      const result = await backlogService.updateTask(payload);

      console.log("Full update result:", result);

      // The response might have isSuccess or might be checking the wrong property
      if (result && result.isSuccess !== false) {
        setShowSuccessModal(true);
      } else {
        console.error("Update failed:", result);
        alert("Failed to update task. Please check console for details.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task: " + error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <SpinnerCustom /> Loading...
      </div>
    );

  if (!task) {
    return (
      <div className="py-6 px-10 w-full flex-1">
        <p className="text-red-500">Task not found</p>
      </div>
    );
  }

  return (
    <>
      <BacklogForm
        mode="edit"
        initialData={task}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/backlog")}
        isSubmitting={updating}
      />

      <SuccessDialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        onConfirm={() => navigate("/backlog")}
        title="Update Successful!"
        description="Backlog item has been updated successfully."
      />
    </>
  );
}