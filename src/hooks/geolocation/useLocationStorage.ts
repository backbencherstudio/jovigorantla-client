
import { useState, useEffect } from 'react';

export const useLocationStorage = () => {
  const [locationString, setLocationString] = useState<string>('');
  const [radius, setRadius] = useState<number>(40); // Default radius is 10 miles

  useEffect(() => {
    // Load saved location and radius from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    const savedRadius = localStorage.getItem('searchRadius');
    
    if (savedLocation) {
      setLocationString(savedLocation);
    } else {
      // Set default if not found
      setLocationString('Denton, TX');
      localStorage.setItem('userLocation', 'Denton, TX');
    }
    
    if (savedRadius) {
      setRadius(Number(savedRadius));
    }
  }, []);

  const saveLocation = (location: string) => {
    setLocationString(location);
    localStorage.setItem('userLocation', location);
  };

  const saveRadius = (newRadius: number) => {
    setRadius(newRadius);
    localStorage.setItem('searchRadius', newRadius.toString());
    return true;
  };

  return {
    locationString,
    radius,
    saveLocation,
    saveRadius
  };
};
