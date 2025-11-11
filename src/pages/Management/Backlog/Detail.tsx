import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BacklogForm from "@/components/ui/backlogForm";
import { SpinnerCustom } from "@/components/ui/spinner";
import { backlogService } from "@/services/backlogService";

export function BacklogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const result = await backlogService.fetchTaskById(id as string);

        if (result.isSuccess && result.data?.tasks) {
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

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <SpinnerCustom /> Loading...
      </div>
    );

  if (!task) {
    return (
      <div className="p-10 w-full flex-1">
        <p className="text-red-500">Task not found</p>
      </div>
    );
  }

  return (
    <BacklogForm
      mode="view"
      initialData={task}
      onSubmit={() => {}}
      onCancel={() => navigate("/backlog")}
    />
  );
}
