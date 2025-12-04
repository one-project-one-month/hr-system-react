import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocationForm } from "../../../components/forms/LocationForm";
import { SuccessDialog } from "@/components/ui/custom/success-dialogue";
import { useDataStore } from "@/stores/useDataStore";
import { LocationService } from "@/services/LocationService ";

export default function LocationEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [locationData, setLocationData] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { error, data } = useDataStore();

  useEffect(() => {
    const loadLocationForEdit = async () => {
      if (id) {
        setIsLoading(true);
        await LocationService.fetchLocation(id);
        setIsLoading(false);
      }
    };

    loadLocationForEdit();
  }, [id]);

  useEffect(() => {
    if (data?.data) {
      const location = data.data;

      setLocationData({
        name: location.name || "",
        latitude: location.latitude || "",
        longitude: location.longitude || "",
        radius: location.radius || "",
      });
    }
  }, [data]);

  const handleSubmit = async (values: any) => {
    if (id) {
      await LocationService.updateLocation(id, values);

      // Check success from the store after update
      const storeData = useDataStore.getState().data;
      if (storeData?.isSuccess) {
        setSuccessDialogOpen(true);
      }
    }
  };

  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/location");
  };

  const handleCancel = () => {
    navigate("/location");
  };

  if (error) return <div className="p-6">Error: {error}</div>;
  if (isLoading || !locationData) return <div className="p-6">Loading...</div>;

  return (
    <>
      <LocationForm
        mode="edit"
        locationData={locationData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
        description="Location has been updated successfully."
      />
    </>
  );
}
