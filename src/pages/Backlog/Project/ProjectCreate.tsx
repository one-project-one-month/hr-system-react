// pages/projects/ProjectCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { useDataStore } from "@/stores/useDataStore";
import { projectService } from "@/services/projectService";
import { SuccessDialog } from "@/components/ui/custom/success-dialogue";
import type { ProjectFormValues } from "@/types/project";

export function ProjectCreate() {
  const navigate = useNavigate();
  const { loading } = useDataStore();
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState("")
  return (
    <>
      <ProjectForm
        mode="create"
        submitting={loading}
        serverError={error ?? undefined}
        onCancel={() => navigate(-1)}
        onSubmit={async (vals: ProjectFormValues) => {
          
          try {
            const payload = {
            projectName: vals.name,
            projectDescription: vals.description || "",
            startDate: vals.start ? vals.start.toISOString() : "",
            endDate: vals.due ? vals.due.toISOString() : null,
            projectStatus: vals.status, // "Planned" | "InProgress" | "DONE"
          };
            const resp = await projectService.createProject(payload);
            console.log (resp?.message)
          if (resp?.isSuccess) {
            setSuccessOpen(true);
            return
          }
          setError(resp?.message)

          }catch (error) {
            console.log (error.message)
          }
          
        }}
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Project created"
        description="Your project has been created successfully."
        onConfirm={() => {
          setSuccessOpen(false);
          // Ensure this matches your list route. If your app uses /projects, use that.
          navigate("/project");
        }}
      />
    </>
  );
}
