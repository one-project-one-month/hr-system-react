import { useNavigate, useParams } from "react-router-dom";
import { LocationForm } from "../../../../components/forms/LocationForm";
import { useState, useEffect } from "react";
import { useDataStore } from "@/stores/useDataStore";
import { LocationService } from "@/services/LocationService ";

export default function LocationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [locationData, setLocationData] = useState(null);
  const { error, data } = useDataStore();

  useEffect(() => {
    const loadLocationDetail = async () => {
      if (id) {
        await LocationService.fetchLocation(id);
      }
    };

    loadLocationDetail();
  }, [id]);

  useEffect(() => {
    if (data?.data) {
      const location = data.data;
      setLocationData({
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        radius: location.radius,
      });
    }
  }, [data]);

  const handleBack = () => {
    navigate("/location");
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <LocationForm
      mode="detail"
      locationData={locationData}
      onBack={handleBack}
    />
  );
}
