import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface LocationDetectorProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationDetector = ({ onLocationChange }: LocationDetectorProps) => {
  const { position, loading, error, updateLocation } = useGeolocation();
  const [locationName, setLocationName] = useState<string>("");
  const [manualAddress, setManualAddress] = useState<string>("");
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  useEffect(() => {
    if (position) {
      onLocationChange(position.lat, position.lng);
      fetchLocationName(position.lat, position.lng);
    }
  }, [position, onLocationChange]);

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      // This would normally use a geocoding API, but for now we'll simulate it
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (err) {
      console.error("Error fetching location name:", err);
      setLocationName("Unknown location");
    }
  };

  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      toast("Updating your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Instead of using setManualPosition, we'll use the updateLocation method
          // with a formatted string representation of the coordinates
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locationString = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          updateLocation(locationString).then((success) => {
            if (success) {
              toast.success("Location updated successfully");
              // Refresh the page to update listings with new location
              window.location.reload();
            } else {
              toast.error("Failed to update location");
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleManualAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress) {
      toast.error("Please enter an address");
      return;
    }

    // Use the updateLocation method to set the location
    updateLocation(manualAddress).then((success) => {
      if (success) {
        setLocationName(manualAddress);
        toast.success("Location set manually");
        setShowManualInput(false);
        // Refresh the page to update listings with new location
        window.location.reload();
      } else {
        toast.error(
          "Could not set the location. Please try a different address."
        );
      }
    });
  };

  const toggleManualInput = () => {
    setShowManualInput(!showManualInput);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="h-5 w-5 text-brand flex-shrink-0" />
          {loading ? (
            <div className="w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          ) : error ? (
            <div className="text-sm text-[#bc0117]">{error}</div>
          ) : (
            <div className="text-sm truncate">
              <p className="font-medium truncate">{locationName}</p>
              <p className="text-xs text-muted-foreground">
                {position?.lat.toFixed(4)}, {position?.lng.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshLocation}
            className="gap-1 text-xs h-8 text-brand hover:text-brand/80 hover:bg-brand/10"
          >
            <Locate className="h-3 w-3" />
            GPS
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleManualInput}
            className="gap-1 text-xs h-8"
          >
            {showManualInput ? "Cancel" : "Set Manual"}
          </Button>
        </div>
      </div>

      {showManualInput && (
        <form onSubmit={handleManualAddressSubmit} className="flex gap-2">
          <Input
            placeholder="Enter address, city, or zip code"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            className="bg-brand hover:bg-brand/90"
          >
            Set Location
          </Button>
        </form>
      )}
    </div>
  );
};

export default LocationDetector;
