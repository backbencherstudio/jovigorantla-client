
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LocationContextProps {
  lat: number;
  lng: number;
  radius: number;
  setLatLngRadius: (lat: number, lng: number, radius: number) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [lat, setLat] = useState(40.7831);
  const [lng, setLng] = useState(-73.9712);
  const [radius, setRadius] = useState(100000);

  const setLatLngRadius = (lat: number, lng: number, radius: number) => {
    setLat(lat);
    setLng(lng);
    setRadius(radius);
  };

  useEffect(() => {
    const selectedLocation = JSON.parse(localStorage.getItem('selectedLocation'))
    const selectedRadius = JSON.parse(localStorage.getItem('selectedRadius'))
    if (selectedLocation && selectedRadius) {
      setLatLngRadius(selectedLocation.lat, selectedLocation.lng, selectedRadius)
    }
  }, []);

  return (
    <LocationContext.Provider value={{ lat, lng, radius, setLatLngRadius }}>
      {children}
    </LocationContext.Provider>
  );
};


export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};