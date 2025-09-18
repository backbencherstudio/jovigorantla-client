import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Location {
  lat: number;
  lng: number;
  city: string;
  state_id: string;
  state_name: string;
  search: string;
  zips?: string[];
}

interface LocationContextProps {
  lat: number;
  lng: number;
  radius: number;
  setLatLngRadius: (lat: number, lng: number, radius: number) => void;
  updateLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [lat, setLat] = useState(
    localStorage.getItem("selectedLocation")
      ? JSON.parse(localStorage.getItem("selectedLocation")).lat
      : 40.7128
  );
  const [lng, setLng] = useState(
    localStorage.getItem("selectedLocation")
      ? JSON.parse(localStorage.getItem("selectedLocation")).lng
      : -74.006
  );
  const [radius, setRadius] = useState(
    localStorage.getItem("selectedRadius")
      ? JSON.parse(localStorage.getItem("selectedRadius"))
      : 100
  );

  const setLatLngRadius = (lat: number, lng: number, radius: number) => {
    setLat(lat);
    setLng(lng);
    setRadius(radius);
  };

  const updateLocation = (location: Location) => {
    //console.log("LocationContext: updateLocation called with:", location);
    setLat(location.lat);
    setLng(location.lng);
    setRadius(100); // Default radius
    // Also update localStorage
    localStorage.setItem("selectedLocation", JSON.stringify(location));
    localStorage.setItem("selectedRadius", "100");
    /* console.log(
      "LocationContext: Updated lat/lng to:",
      location.lat,
      location.lng
    ); */
  };

  // useEffect(() => {
  //   const selectedLocation = JSON.parse(localStorage.getItem('selectedLocation'))
  //   const selectedRadius = JSON.parse(localStorage.getItem('selectedRadius'))
  //   if (selectedLocation && selectedRadius) {
  //     setLatLngRadius(selectedLocation.lat, selectedLocation.lng, selectedRadius)
  //   }
  // }, []);

  return (
    <LocationContext.Provider
      value={{ lat, lng, radius, setLatLngRadius, updateLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
};
