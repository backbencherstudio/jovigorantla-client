
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GeolocationState, Position } from './types';
import { reverseGeocode, geocodeAddress } from './geocoding';
import { useLocationStorage } from './useLocationStorage';

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true
  });

  const { locationString, radius, saveLocation, saveRadius } = useLocationStorage();

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: "Geolocation is not supported by your browser",
        loading: false
      });
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      try {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Reverse geocode the coordinates to get address info
        const address = await reverseGeocode(coords.lat, coords.lng);
        
        setState({
          position: { 
            ...coords, 
            ...address 
          },
          error: null,
          loading: false
        });
        
        if (address.city && address.state && !localStorage.getItem('userLocation')) {
          const locationStr = `${address.city}, ${address.state}`;
          saveLocation(locationStr);
        }
      } catch (error) {
        setState({
          position: { lat: position.coords.latitude, lng: position.coords.longitude },
          error: null,
          loading: false
        });
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      setState({
        position: null,
        error: error.message,
        loading: false
      });
      
      // Set default location if not already set
      if (!localStorage.getItem('userLocation')) {
        saveLocation('Denton, TX');
      }
    };

    // Set default position while waiting for actual location
    setState(prev => ({
      ...prev,
      position: { lat: 33.2148, lng: -97.1331, city: 'Denton', state: 'TX' }, // Default to Denton, TX
      loading: true
    }));

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const id = navigator.geolocation.watchPosition(
      handleSuccess, 
      handleError,
      options
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const updateLocation = async (locationInput: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const geocoded = await geocodeAddress(locationInput);
      
      if (geocoded) {
        setState({
          position: geocoded,
          error: null,
          loading: false
        });
        
        const locationStr = `${geocoded.city}, ${geocoded.state}`;
        saveLocation(locationStr);
        
        toast.success(`Location updated to ${geocoded.city}, ${geocoded.state}`);
        return true;
      } else {
        throw new Error("Could not geocode address");
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: "Failed to update location",
        loading: false
      }));
      toast.error("Failed to update location. Please try a different address.");
      return false;
    }
  };

  const updateRadius = async (newRadius: number) => {
    return saveRadius(newRadius);
  };

  return { 
    ...state, 
    locationString,
    radius,
    updateLocation,
    updateRadius
  };
};
