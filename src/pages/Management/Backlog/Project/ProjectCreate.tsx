// pages/projects/ProjectCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import { useDataStore } from "@/stores/useDataStore";
import { projectService } from "@/services/projectService";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export function ProjectCreate() {
  const navigate = useNavigate();
  const { loading, error } = useDataStore();
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <>
      <ProjectForm
        mode="create"
        submitting={loading}
        serverError={error ?? undefined}
        onCancel={() => navigate(-1)}
        onSubmit={async (vals: ProjectFormValues) => {
  
          const payload = {
            projectName: vals.name,
            projectDescription: vals.description || "",
            startDate: vals.start ? vals.start.toISOString() : "",
            endDate: vals.due ? vals.due.toISOString() : "",
            projectStatus: vals.status, // "Planned" | "InProgress" | "DONE"
          };

          const resp = await projectService.createProject(payload);

          const latestErr = useDataStore.getState().error;
          const ok =
            !latestErr &&
            (resp?.isSuccess === undefined || resp?.isSuccess === true);

          if (ok) {
            setSuccessOpen(true);
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
