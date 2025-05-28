// import { useGeolocation } from './geolocation';

// export { useGeolocation };

import { useState } from "react";
import { toast } from "sonner";

interface LocationResult {
  coords: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

export const useGeolocation = () => {
  const [locationString, setLocationString] = useState<string>("");
  const [radius, setRadius] = useState<number>(40);
  const [loading, setLoading] = useState<boolean>(false);

  const updateLocation = async (newLocation: string) => {
    setLoading(true);
    try {
      setLocationString(newLocation);
      return true;
    } catch (error) {
      console.error("Location update failed", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<LocationResult> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("Your browser doesn't support geolocation");
        reject("Geolocation not supported");
        return;
      }

      setLoading(true);

      const handleSuccess = async (position: GeolocationPosition) => {
        try {
          const { latitude, longitude } = position.coords;

          // Convert coordinates to address using reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          if (!response.ok) {
            throw new Error("Failed to get address");
          }

          const data = await response.json();
          const address =
            data.display_name?.split(",")[0] ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          resolve({
            coords: { latitude, longitude },
            address,
          });
        } catch (error) {
          console.error("Geocoding error:", error);
          // Fallback to coordinates if geocoding fails
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            address: `${position.coords.latitude.toFixed(
              4
            )}, ${position.coords.longitude.toFixed(4)}`,
          });
        }
      };

      const handleError = (error: GeolocationPositionError) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Please allow location access to use this feature");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Unable to detect your location");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out");
            break;
          default:
            toast.error("Failed to get your location");
        }
        reject(error);
      };

      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  };

  const updateCurrentLocation = async () => {
    try {
      const result = await getCurrentLocation();
      console.log(result,"fdjlfjlkdfj result result")
      if (result?.address) {
        const success = await updateLocation(result.address);
        if (success) {
          toast.success("Location updated successfully");
          return result.address;
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating current location:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRadius = (newRadius: number) => {
    setRadius(newRadius);
  };

  return {
    locationString,
    radius,
    loading,
    updateLocation,
    updateRadius,
    updateCurrentLocation,
  };
};
