import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BacklogForm from "@/components/ui/backlogForm";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { SpinnerCustom } from "@/components/ui/spinner";


export function BacklogEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState<unknown>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

useEffect(() => {
  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/Task/edit?taskId=${id}`);
      const result = await response.json();

      if (result.isSuccess && result.data?.tasks) {
        setTask(result.data.tasks);
      } else {
        console.error("Task not found or error:", result);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }finally{
       setLoading(false);
    }
  };

  fetchTask();
}, [id]);


  const handleSubmit = (values: unknown) => {
    console.log("Updating backlog:", values);
    // Add your API call here
    setShowSuccessModal(true);
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




