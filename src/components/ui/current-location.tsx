import { useState } from 'react';

type GeoPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  timestamp: number;
} | null;

export function useCurrentLocation(options: PositionOptions = {}) {
  const [position, setPosition] = useState<GeoPosition>({
    latitude: 0, // default Yangon
    longitude: 0,
    accuracy: 0,
    altitude: null,
    speed: null,
    timestamp: Date.now()
  });

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    if (!('permissions' in navigator) || !('geolocation' in navigator)) {
      return; // fallback to default
    }

    const status = await navigator.permissions.query({ name: 'geolocation' });

    if (status.state !== 'granted') {
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, speed } = pos.coords;

        setPosition({
          latitude,
          longitude,
          accuracy,
          altitude,
          speed,
          timestamp: pos.timestamp
        });

        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      options
    );
  };

  return { position, error, loading, requestLocation };
}
