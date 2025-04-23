
import { useEffect, useRef, useState, useCallback } from 'react';
import { Listing } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers, Maximize2, Minimize2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MapProps {
  listings: Listing[];
  currentLocation: { lat: number; lng: number } | null;
  radius: number;
  onListingSelect?: (listing: Listing) => void;
}

const Map = ({ listings, currentLocation, radius, onListingSelect }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const navigate = useNavigate();

  // For simplicity, we'll just simulate the map component with markers
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMarkerClick = useCallback((listing: Listing) => {
    setSelectedListing(listing);
    if (onListingSelect) {
      onListingSelect(listing);
    }
  }, [onListingSelect]);

  const viewListingDetails = useCallback(() => {
    if (selectedListing) {
      navigate(`/listing/${selectedListing.id}`);
    }
  }, [navigate, selectedListing]);

  // Calculate distance from current location to a listing
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
  };

  // Filter listings by radius
  const filteredListings = currentLocation 
    ? listings.filter(listing => {
        const distance = calculateDistance(
          currentLocation.lat, 
          currentLocation.lng, 
          listing.location.lat, 
          listing.location.lng
        );
        return distance <= radius;
      })
    : listings;

  return (
    <div 
      className={`relative rounded-lg overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[300px] sm:h-[400px]'
      }`}
    >
      {!isLoaded ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <div ref={mapRef} className="w-full h-full bg-dot-pattern relative">
          {/* Simulated map with markers */}
          <div className="absolute inset-0">
            {currentLocation && (
              <div 
                className="absolute animate-pulse"
                style={{ 
                  left: `${50}%`, 
                  top: `${50}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="mt-1 text-xs bg-white px-2 py-1 rounded-md shadow-md">
                  Your location
                </div>
              </div>
            )}
            
            {/* Render listing markers */}
            {filteredListings.map((listing, index) => (
              <div
                key={listing.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  selectedListing?.id === listing.id ? 'scale-125 z-10' : ''
                }`}
                style={{ 
                  left: `${(listing.location.lng - (currentLocation?.lng || -122.4194) + 0.05) * 1000 % 100}%`, 
                  top: `${(listing.location.lat - (currentLocation?.lat || 37.7749) + 0.05) * 1000 % 100}%`,
                }}
                onClick={() => handleMarkerClick(listing)}
              >
                <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">${listing.price}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Radius circle visualization */}
          {currentLocation && (
            <div 
              className="absolute rounded-full border-2 border-blue-500/30 bg-blue-500/10"
              style={{ 
                left: '50%', 
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(radius * 5, 80)}%`,
                height: `${Math.min(radius * 5, 80)}%`,
              }}
            />
          )}
          
          {/* Selected listing popup */}
          {selectedListing && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg max-w-xs w-full">
              <h3 className="font-medium truncate">{selectedListing.title}</h3>
              <p className="text-sm text-muted-foreground">${selectedListing.price}</p>
              <Button 
                onClick={viewListingDetails}
                className="w-full mt-2"
                size="sm"
              >
                View Details
              </Button>
            </div>
          )}
          
          {/* Map info */}
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded-md text-xs">
            <p className="font-medium">Showing {filteredListings.length} listings</p>
            <p className="text-muted-foreground">Radius: {radius} miles</p>
          </div>
        </div>
      )}

      <div className="absolute top-3 right-3 flex gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {isFullscreen && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <Button 
            onClick={toggleFullscreen}
            className="shadow-lg"
          >
            Close Map
          </Button>
        </div>
      )}
    </div>
  );
};

export default Map;
