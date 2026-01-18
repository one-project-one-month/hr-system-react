import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { useDataStore } from "@/stores/useDataStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { projectService } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/ui/custom/success-dialogue";
import type { ApiProject, ProjectFormValues } from "@/types/project";

// ...imports

export function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error } = useDataStore();
  const token = useAuthStore((s) => s.token);
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const [project, setProject] = useState<ApiProject | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const resp = await projectService.fetchProjectById(id, authHeaders);
      if (resp?.isSuccess && resp.data) {
        setProject(resp.data);
      }
    })();
  }, [id, authHeaders]);

  if (loading && !project) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found.</div>;
  }

  const initialValues: Partial<ProjectFormValues> = {
    code: project.projectCode ?? "",
    name: project.projectName ?? "",
    description: project.projectDescription ?? "",
    status: project.projectStatus,
    start: project.startDate ? new Date(project.startDate) : null,
    due: project.endDate ? new Date(project.endDate) : null,
  };

  return (
    <>
      <ProjectForm
        mode="edit"
        initialValues={initialValues}
        submitting={loading}
        serverError={error ?? undefined}
        onCancel={() => navigate(-1)}
        onSubmit={async (vals) => {
          useDataStore.setState({ error: null });

          const body = {
            projectName: vals.name,
            projectDescription: vals.description,
            startDate: vals.start?.toISOString(),
            endDate: vals.due?.toISOString(),
            projectStatus: vals.status,
          };

          const resp = await projectService.updateProject(
            id!,
            body,
            authHeaders
          );

          if (resp?.isSuccess) {
            setSuccessOpen(true);
          }
        }}
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Project updated"
        description="Your changes have been saved successfully."
        onConfirm={() => navigate("/project")}
      />
    </>
  );
}
