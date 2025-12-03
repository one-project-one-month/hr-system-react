import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LocationForm } from "../../../../components/forms/LocationForm";
import { SuccessDialog } from "@/components/ui/custom/SuccessDialog";
import { useDataStore } from "@/stores/useDataStore";
import { LocationService } from "@/services/LocationService ";

export default function LocationCreate() {
  const navigate = useNavigate();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, data } = useDataStore();

  // Clear store data when component mounts
  useEffect(() => {
    // Clear old data to prevent confusion
    useDataStore.setState({ data: null, error: null });
  }, []);

  // Watch data changes after submit
  useEffect(() => {
    if (isSubmitting && data) {
      console.log("🔍 Create Response:", data);

      // Check if API returned success
      if (data.isSuccess === true) {
        console.log("✅ Create Success!");
        setSuccessDialogOpen(true);
      } else {
        console.log("❌ Create Failed:", data.message);
      }

      // Reset submitting flag
      setIsSubmitting(false);
    }
  }, [data, isSubmitting]);

  const handleSubmit = async (values: any) => {
    try {
      console.log("📤 Submitting:", values);
      setIsSubmitting(true);
      await LocationService.createLocation(values);
    } catch (error) {
      console.log("❌ Error creating location:", error);
      setIsSubmitting(false);
    }
  };

  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/location");
  };

  const handleCancel = () => {
    navigate("/location");
  };

  return (
    <>
      <LocationForm
        mode="add"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        error={error}
      />

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
      />
    </>
  );
}
