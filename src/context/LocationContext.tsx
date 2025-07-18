
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
  const [lat, setLat] = useState(localStorage.getItem('selectedLocation') ? JSON.parse(localStorage.getItem('selectedLocation')).lat : 40.7128);
  const [lng, setLng] = useState(localStorage.getItem('selectedLocation')? JSON.parse(localStorage.getItem('selectedLocation')).lng : -74.0060);
  const [radius, setRadius] = useState(localStorage.getItem('selectedRadius')? JSON.parse(localStorage.getItem('selectedRadius')) : 100);

  const setLatLngRadius = (lat: number, lng: number, radius: number) => {
    setLat(lat);
    setLng(lng);
    setRadius(radius);
  };

  // useEffect(() => {
  //   const selectedLocation = JSON.parse(localStorage.getItem('selectedLocation'))
  //   const selectedRadius = JSON.parse(localStorage.getItem('selectedRadius'))
  //   if (selectedLocation && selectedRadius) {
  //     setLatLngRadius(selectedLocation.lat, selectedLocation.lng, selectedRadius)
  //   }
  // }, []);

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