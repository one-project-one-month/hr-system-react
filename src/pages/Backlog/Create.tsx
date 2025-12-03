import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BacklogForm from "@/components/forms/backlogForm";
import { SuccessDialog } from "@/components/ui/custom/SuccessDialog";
import { backlogService } from "@/services/backlogService";

export function BacklogCreate() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setCreating(true);
      console.log("Creating backlog:", values);

      const payload = {
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

      const result = await backlogService.createTask(payload);

      if (result.isSuccess) {
        setShowSuccessModal(true);
      } else {
        console.error("Create failed:", result);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <BacklogForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/backlog")}

      />

      <SuccessDialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        onConfirm={() => navigate("/backlog")}
        title="Create Successful!"
        description="New backlog item has been added successfully."
      />
    </>
  );
}