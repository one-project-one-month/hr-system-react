import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import { useDataStore } from "@/stores/useDataStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { projectService } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

// ...imports
type ApiProject = {
  id?: string | number;
  projectCode?: string;
  projectName: string;
  projectDescription?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  projectStatus: "Active" | "Completed" | "Cancelled" | "Planned";
};

export function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useDataStore();
  const token = useAuthStore((s) => s.token);
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    projectService.fetchProjectById(id, authHeaders);
  }, [id, authHeaders]);

  function isApiResponse<T>(x: unknown): x is { isSuccess: unknown; data: T } {
    return (
      typeof x === "object" && x !== null && "isSuccess" in x && "data" in x
    );
  }

  const payload = isApiResponse<ApiProject>(data)
    ? data.data
    : (data as unknown as ApiProject | null);
  const proj = (payload ?? null) as ApiProject | null;

  if (loading && !proj) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!proj) return <div className="p-6">Project not found.</div>;

  const initialValues: Partial<ProjectFormValues> = {
    code: proj.projectCode ?? "",
    name: proj.projectName ?? "",
    description: proj.projectDescription ?? "",
    status: proj.projectStatus, // <-- direct
    start: proj.startDate ? new Date(proj.startDate) : null,
    due: proj.endDate ? new Date(proj.endDate) : null,
  };

  return (
    <>
      <ProjectForm
        key={proj.projectCode || String(id)}
        mode="edit"
        initialValues={initialValues}
        submitting={loading}
        serverError={error ?? undefined}
        onCancel={() => navigate(-1)}
        onSubmit={async (vals) => {
          useDataStore.setState({ error: null });

          const body = {
            projectName: vals.name,
            projectDescription: vals.description || "",
            startDate: vals.start ? vals.start.toISOString() : "",
            endDate: vals.due ? vals.due.toISOString() : "",
            projectStatus: vals.status, // <-- direct
          };

          const resp = await projectService.updateProject(
            id!,
            body,
            authHeaders
          );
          const latestErr = useDataStore.getState().error;
          const ok =
            !latestErr &&
            (resp?.isSuccess === undefined || resp?.isSuccess === true);

          if (ok) setSuccessOpen(true);
        }}
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Project updated"
        description="Your changes have been saved successfully."
        onConfirm={() => {
          setSuccessOpen(false);
          navigate("/project");
        }}
      />
    </>
  );
}
