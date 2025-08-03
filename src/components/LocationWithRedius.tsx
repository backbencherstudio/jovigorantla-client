import React, { useState, useRef, useEffect } from "react";
import { MapPin, X, Check, Loader2, Navigation, Search } from "lucide-react";
import AsyncSelect from "react-select/async";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
// import locationsData from "../data/us_cities_with_zipcode.json";
import locationsData from "../data/uscitiesLocation.json";
import { getLocationFromCoordinates } from "@/hooks/getLocationFromCoordinates ";
import { useLocationContext } from "@/context/LocationContext";


const toRadians = (degree: number) => {
    return degree * (Math.PI / 180);
};

const milesToKilometers = (miles: number) => {
    return miles * 1.60934; // Convert miles to kilometers
};

// Haversine formula to calculate the distance between two lat/lng coordinates in kilometers
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
};

function isInUSA(lat, lng) {
    // Approximate geographic boundaries of the contiguous USA
    const MIN_LAT = 24.396308;  // Southernmost point (Florida)
    const MAX_LAT = 49.384358;   // Northernmost point (Washington)
    const MIN_LNG = -125.000000; // Westernmost point (Washington)
    const MAX_LNG = -66.934570;   // Easternmost point (Maine)
    
    // For Alaska and Hawaii you would need additional checks
    // This is a simplified version for contiguous USA only
    
    return (
        lat >= MIN_LAT &&
        lat <= MAX_LAT &&
        lng >= MIN_LNG &&
        lng <= MAX_LNG
    );
}

const DALLAS_FALLBACK: Location = {
    city: "Dallas",
    state_id: "TX",
    state_name: "Texas",
    lat: 32.7935,
    lng: -96.7667,
    search: "Dallas, TX, USA",
    zips: null
};

// const isValidCoordinate = (lat: number, lng: number) => {
//     return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
// };

// const findNearestCity = (lat: number, lng: number): Location => {
//     // Validate coordinates first
//     if (!isValidCoordinate(lat, lng)) {
//         console.warn("Invalid coordinates provided, falling back to Dallas");
//         return DALLAS_FALLBACK;
//     }

//     try {
//         if (!(locationsData as Location[])?.length) {
//             console.warn("No location data available, falling back to Dallas");
//             return DALLAS_FALLBACK;
//         }

//         let nearestCity = locationsData[0];
//         let minDistance = getDistance(lat, lng, nearestCity.lat, nearestCity.lng);

//         for (const city of locationsData as Location[]) {
//             const distance = getDistance(lat, lng, city.lat, city.lng);
//             if (distance < minDistance) {
//                 minDistance = distance;
//                 nearestCity = city;
//             }
//         }

//         return nearestCity;
//     } catch (error) {
//         console.error("Error finding nearest city:", error);
//         return DALLAS_FALLBACK;
//     }
// };

const isValidCoordinate = (lat: number, lng: number) => {
    // Additional type checking and NaN protection
    return (
        typeof lat === 'number' && 
        typeof lng === 'number' &&
        !isNaN(lat) && 
        !isNaN(lng) &&
        lat >= -90 && 
        lat <= 90 && 
        lng >= -180 && 
        lng <= 180
    );
};

const findNearestCity = (lat: number, lng: number): Location => {
    // Validate coordinates first
    if (!isValidCoordinate(lat, lng)) {
        console.warn(`Invalid coordinates provided (${lat}, ${lng}), falling back to Dallas`);
        return DALLAS_FALLBACK;
    }

    try {
        // More defensive check for locationsData
        if (!Array.isArray(locationsData) || locationsData.length === 0) {
            console.warn("Invalid or empty location data, falling back to Dallas");
            return DALLAS_FALLBACK;
        }

        let nearestCity = locationsData[0];
        
        // Validate the first city's coordinates before using as initial comparison
        if (!isValidCoordinate(nearestCity.lat, nearestCity.lng)) {
            console.warn("First city in dataset has invalid coordinates");
            return DALLAS_FALLBACK;
        }

        let minDistance = getDistance(lat, lng, nearestCity.lat, nearestCity.lng);

        for (const city of locationsData) {
            // Skip cities with invalid coordinates
            if (!isValidCoordinate(city.lat, city.lng)) {
                console.warn(`Skipping city with invalid coordinates: ${city.city}`);
                continue;
            }

            const distance = getDistance(lat, lng, city.lat, city.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city;
            }
        }

        console.log("nearestCity => ", nearestCity)

        return nearestCity;
    } catch (error) {
        console.error("Error finding nearest city:", error);
        return DALLAS_FALLBACK;
    }
};





interface Location {
    zips: [string];
    lat: number;
    lng: number;
    city: string;
    state_id: string;
    state_name: string;
    search: string;
}

interface LocationWithRadiusProps {
    onChange?: (location: Location) => void;
    className?: string;
    setCities?: (any) => void
    notSetDefault?: boolean
    setNearByRadius?: (any) => void
    initialRadius?: number
    initialLocation?: Location
    setCurrentLocation? : (any) => void
    popupStyle?: string
}

const LocationWithRadius: React.FC<LocationWithRadiusProps> = ({ onChange, className, setCities, notSetDefault, setNearByRadius, initialRadius, initialLocation, setCurrentLocation, popupStyle }) => {
    const [selectedOption, setSelectedOption] = useState<Location | null>(null);
    const [dispalySelectedOption, setDisplaySelectedOption] = useState<Location | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [radius, setRadius] = useState(100);
    const [displayRadius, setDisplayRadius] = useState("100");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const { setLatLngRadius } = useLocationContext()

    // console.log("default data => ", initialLocation, initialRadius)

    

    const selectRef = useRef(null);

    const handleSearchChange = (inputValue: string) => {
        setSearchValue(inputValue);
    };

    const handleRadiusChange = (value: number[]) => {
        setRadius(value[0]);

    };

    const handleRadiusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && parseInt(value || "0") <= 100) {
            setDisplayRadius(value);
        }
    };

    const handleSelect = (option: Location | null) => {
        setSelectedOption(option);
        if (onChange) {
            onChange(option);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        setSearchValue("");
        setSelectedOption(null);
        if (selectRef.current) {
            selectRef.current.clearValue();
        }
    };


    useEffect(() => {
        if (initialLocation) {
            setSelectedOption(initialLocation);
            setDisplaySelectedOption(initialLocation);
        }

        if (initialRadius) {
            setRadius(initialRadius);
            setDisplayRadius(initialRadius.toString());
        }
    }, [initialLocation, initialRadius]);


    //   const getCurrentLocation = () => {
    //     setLocationLoading(true); // Start loading indicator

    //     if ("geolocation" in navigator) {
    //       // Use browser geolocation API
    //       navigator.geolocation.getCurrentPosition(
    //         async (position) => {
    //           const { latitude, longitude } = position.coords;

    //           // Make an API request to Mapbox reverse geocoding to get city, state, and country
    //           try {
    //             const locationData = await getLocationFromCoordinates(latitude, longitude);

    //             const currentLocation: Location = {
    //               zip: 12345, // Mock ZIP, can be left as a default or updated via geocoding if available
    //               lat: latitude,
    //               lng: longitude,
    //               city: locationData.city || "Unknown City",
    //               state_id: locationData.state || "Unknown State",
    //               state_name: locationData.state || "Unknown State",
    //               search: `${locationData.city}, ${locationData.state}, ${locationData.country}`,
    //             };

    //             // Set the location in state
    //             setSelectedOption(currentLocation);

    //             // Notify parent component about the new location
    //             if (onChange) {
    //               onChange(currentLocation);
    //             }

    //           } catch (error) {
    //             console.error("Error in reverse geocoding:", error);
    //           }

    //           setLocationLoading(false); // Stop loading indicator
    //         },
    //         (error) => {
    //           console.error("Error getting location:", error);
    //           setLocationLoading(false); // Stop loading on error
    //         }
    //       );
    //     } else {
    //       console.error("Geolocation is not supported by this browser.");
    //       setLocationLoading(false); // Stop loading if geolocation is not available
    //     }
    //   };

    // const getCurrentLocation = () => {
    //     setLocationLoading(true); // Start loading indicator

    //     if ("geolocation" in navigator) {
    //         // Use browser geolocation API
    //         navigator.geolocation.getCurrentPosition(
    //             async (position) => {
    //                 const { latitude, longitude } = position.coords;

    //                 // Make an API request to Mapbox reverse geocoding to get city, state, and country
    //                 try {
    //                     const locationData = await getLocationFromCoordinates(latitude, longitude);

    //                     const currentLocation: Location = {
    //                         zip: 12345, // Mock ZIP, can be left as a default or updated via geocoding if available
    //                         lat: latitude,
    //                         lng: longitude,
    //                         city: locationData.city || "Unknown City",
    //                         state_id: locationData.state || "Unknown State",
    //                         state_name: locationData.state || "Unknown State",
    //                         search: `${locationData.city}, ${locationData.state}, ${locationData.country}`,
    //                     };

    //                     // Set the location in state
    //                     setSelectedOption(currentLocation);

    //                     // Notify parent component about the new location
    //                     if (onChange) {
    //                         onChange(currentLocation);
    //                     }

    //                 } catch (error) {
    //                     console.error("Error in reverse geocoding:", error);
    //                 }

    //                 setLocationLoading(false); // Stop loading indicator
    //             },
    //             async (error) => {
    //                 console.error("Error getting location:", error);

    //                 // Fallback to IP-based geolocation if permission is denied or error occurs
    //                 await handleIPGeolocation(); // Fallback function to handle IP geolocation

    //                 setLocationLoading(false); // Stop loading on error
    //             }
    //         );
    //     } else {
    //         console.error("Geolocation is not supported by this browser.");

    //         // Fallback to IP-based geolocation if geolocation is not available
    //         handleIPGeolocation();
    //         setLocationLoading(false); // Stop loading if geolocation is not available
    //     }
    // };

    // const getCurrentLocation = () => {
    //     setLocationLoading(true);
    
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 const nearestCity = findNearestCity(latitude, longitude);
                    
    //                 setSelectedOption(nearestCity);
    //                 if (onChange) onChange(nearestCity);
    //                 setLocationLoading(false);
    //             },
    //             (error) => {
    //                 console.error("Geolocation error:", error);
    //                 setSelectedOption(DALLAS_FALLBACK);
    //                 if (onChange) onChange(DALLAS_FALLBACK);
    //                 setLocationLoading(false);
    //             }
    //         );
    //     } else {
    //         console.warn("Geolocation not supported");
    //         setSelectedOption(DALLAS_FALLBACK);
    //         if (onChange) onChange(DALLAS_FALLBACK);
    //         setLocationLoading(false);
    //     }
    // };

    const getCurrentLocation = () => {
        setLocationLoading(true);
    
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // First check if coordinates are within USA bounds
                    if (isInUSA(latitude, longitude)) {
                        const nearestCity = findNearestCity(latitude, longitude);
                        setSelectedOption(nearestCity);
                        if (onChange) onChange(nearestCity);
                    } else {
                        // Outside USA - use fallback
                        setSelectedOption(DALLAS_FALLBACK);
                        if (onChange) onChange(DALLAS_FALLBACK);
                    }
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setSelectedOption(DALLAS_FALLBACK);
                    if (onChange) onChange(DALLAS_FALLBACK);
                    setLocationLoading(false);
                }
            );
        } else {
            console.warn("Geolocation not supported");
            setSelectedOption(DALLAS_FALLBACK);
            if (onChange) onChange(DALLAS_FALLBACK);
            setLocationLoading(false);
        }
    };
    


    // Fallback to IP Geolocation (if browser geolocation fails)
    // const handleIPGeolocation = async () => {
    //     try {
    //         // Try getting location from IP using ipinfo.io API (or another IP geolocation service)
    //         const locationData = await getLocationFromIP(); // Function to get location from IP

    //         // If successful, update with the fetched data
    //         const ipLocation: Location = {
    //             zip: 12345, // You might not get a ZIP from IP-based geolocation
    //             lat: locationData.lat,
    //             lng: locationData.lng,
    //             city: locationData.city || "Unknown City",
    //             state_id: locationData.state || "Unknown State",
    //             state_name: locationData.state || "Unknown State",
    //             search: `${locationData.city}, ${locationData.state}, ${locationData.country}`,
    //         };

    //         setSelectedOption(ipLocation);

    //         // Notify parent component about the new location
    //         if (onChange) {
    //             onChange(ipLocation);
    //         }

    //     } catch (error) {
    //         console.error("Error in IP geolocation:", error);

    //         // Fallback to Dallas, TX if IP geolocation fails
    //         const fallbackLocation: Location = {
    //             zip: 75201, // Dallas ZIP code
    //             lat: 32.7767, // Latitude for Dallas
    //             lng: -96.7970, // Longitude for Dallas
    //             city: "Dallas",
    //             state_id: "TX",
    //             state_name: "Texas",
    //             search: "Dallas, TX, USA", // Fallback to Dallas, TX
    //         };

    //         setSelectedOption(fallbackLocation);

    //         // Notify parent component about the fallback location
    //         if (onChange) {
    //             onChange(fallbackLocation);
    //         }
    //     }
    // };

    const handleIPGeolocation = async () => {
        try {
            const response = await fetch("https://ipinfo.io/json");
            if (!response.ok) throw new Error("IP info failed");
            
            const data = await response.json();
            if (!data.loc) throw new Error("No location data");

             if (data.country && data.country !== "US") {
                throw new Error("Non-US location detected");
            }
            
            const [lat, lng] = data.loc.split(',').map(Number);
            const nearestCity = findNearestCity(lat, lng);
            
            setSelectedOption(nearestCity);
            if (onChange) onChange(nearestCity);

            setLatLngRadius(nearestCity.lat, nearestCity.lng, 100)
            
            // Save to localStorage if initial load
            if (!localStorage.getItem("selectedLocation")) {
                localStorage.setItem("selectedLocation", JSON.stringify(nearestCity));
            }
        } catch (error) {
            console.error("IP geolocation failed:", error);
            setSelectedOption(DALLAS_FALLBACK);
            if (onChange) onChange(DALLAS_FALLBACK);
            
            if (!localStorage.getItem("selectedLocation")) {
                localStorage.setItem("selectedLocation", JSON.stringify(DALLAS_FALLBACK));
            }

            setLatLngRadius(DALLAS_FALLBACK.lat, DALLAS_FALLBACK.lng, 100)
        }
    };


    // Function to get location from IP address
    // const getLocationFromIP = async () => {
    //     const response = await fetch("https://ipinfo.io/json");
    //     const data = await response.json();

    //     const [lat, lng] = data.loc.split(",");

    //     return {
    //         city: data.city || "Unknown City",
    //         state: data.region || "Unknown State",
    //         country: data.country || "Unknown Country",
    //         lat: parseFloat(lat),
    //         lng: parseFloat(lng),
    //     };
    // };


    // const getLocationFromIP = async (): Promise<Location> => {
    //     try {
    //         // 1. Fetch IP location data
    //         const response = await fetch("https://ipinfo.io/json");
    //         if (!response.ok) throw new Error(`IP geolocation failed with status ${response.status}`);
            
    //         const data = await response.json();
    //         if (!data.loc) throw new Error("No location data in response");
    
    //         // 2. Parse coordinates
    //         const [lat, lng] = data.loc.split(',').map(Number);
    //         if (!isValidCoordinate(lat, lng)) throw new Error("Invalid coordinates from IP");

    //         console.log("data from closest city => ", data)
    
    //         // 3. Find nearest city in your dataset
    //         const nearestCity = findNearestCity(lat, lng);

    //         console.log("nearest city => ", nearestCity)
            
    //         // 4. Return enriched location data
    //         return {
    //             ...nearestCity,
    //             search: `${data.city || nearestCity.city}, ${data.region || nearestCity.state_id}, ${data.country || 'USA'}`,
    //             lat: nearestCity.lat, 
    //             lng: nearestCity.lng
    //         };
            
    //     } catch (error) {
    //         console.error("Error in getLocationFromIP:", error);
    //         // Return Dallas fallback with proper typing
    //         return {
    //             ...DALLAS_FALLBACK,
    //             search: "Dallas, TX, USA"
    //         };
    //     }
    // };

    // const getLocationFromIP = async (): Promise<Location> => {
    // try {
    //     // 1. Fetch IP location data
    //     const response = await fetch("https://ipinfo.io/json");
    //     if (!response.ok) throw new Error(`IP geolocation failed with status ${response.status}`);
        
    //     const data = await response.json();
    //     if (!data.loc) throw new Error("No location data in response");

    //     // 2. Check if country is not USA
    //     if (data.country && data.country !== "US") {
    //         throw new Error("Non-US location detected");
    //     }

    //     // 3. Parse coordinates
    //     const [lat, lng] = data.loc.split(',').map(Number);
    //     if (!isValidCoordinate(lat, lng)) throw new Error("Invalid coordinates from IP");

    //     // 4. Find nearest city in your dataset
    //     const nearestCity = findNearestCity(lat, lng);
        
    //     // 5. Return enriched location data
    //     return {
    //         ...nearestCity,
    //         search: `${data.city || nearestCity.city}, ${data.region || nearestCity.state_id}, USA`,
    //         lat: nearestCity.lat, 
    //         lng: nearestCity.lng
    //     };
        
    // } catch (error) {
    //     console.error("Error in getLocationFromIP:", error);
    //     // Return Dallas fallback with proper typing
    //     return {
    //         ...DALLAS_FALLBACK,
    //         search: "Dallas, TX, USA"
    //     };
    // }
    // };

    const getLocationFromIP = async (): Promise<Location> => {
        try {
            // 1. Fetch IP location data
            const response = await fetch("https://ipinfo.io/json");
            if (!response.ok) throw new Error(`IP geolocation failed with status ${response.status}`);
            
            const data = await response.json();
            if (!data.loc) throw new Error("No location data in response");
    
            // 2. Check if country is not USA
            if (data.country && data.country !== "US") {
                throw new Error("Non-US location detected");
            }
    
            // 3. Parse coordinates
            const [lat, lng] = data.loc.split(',').map(Number);
            if (!isValidCoordinate(lat, lng)) throw new Error("Invalid coordinates from IP");
    
            // 4. Find nearest city in your dataset
            const nearestCity = findNearestCity(lat, lng);
            
            // 5. Return enriched location data
            // return {
            //     ...nearestCity,
            //     search: `${data.city || nearestCity.city}, ${data.region || nearestCity.state_id}, USA`,
            //     lat: nearestCity.lat, 
            //     lng: nearestCity.lng
            // };
            return nearestCity;
            
        } catch (error) {
            console.error("Error in getLocationFromIP:", error);
            // Return Dallas fallback with proper typing
            return {
                ...DALLAS_FALLBACK,
                search: "Dallas, TX, USA"
            };
        }
    };


    const handleUpdate = () => {
        
        let lat: number, lng: number, r: number;

        if (selectedOption) {
            setDisplaySelectedOption(selectedOption);
            // check the current path if it create-listing if it's not then only set the selected location
            if (!notSetDefault) {
                localStorage.setItem('selectedLocation', JSON.stringify(selectedOption));
                lat = selectedOption.lat;
                lng = selectedOption.lng;
            }
            // localStorage.setItem('selectedLocation', JSON.stringify(selectedOption));
        }
        if (radius) {
            setDisplayRadius(radius.toString());
            if (!notSetDefault) {
                localStorage.setItem('selectedRadius', radius.toString());
                r = radius;
            }
            // localStorage.setItem('selectedRadius', radius.toString());
        }

        console.log("inside with radius => ",lat, lng, radius)

        if (lat && lng && r) {
           
            setLatLngRadius(lat, lng, r);
        }

        setIsOpen(false);

        // check the current path if it create-listing the set cities
        // if (setCities) {
        //     setCities(getNearbyCities(selectedOption.lat, selectedOption.lng, radius));
        // }
        if (setCities && selectedOption && radius) {
            // const nearbyCities = getNearbyCities(selectedOption.lat, selectedOption.lng, radius);
            // console.log(nearbyCities)
            setCities(getNearbyCities(selectedOption.lat, selectedOption.lng, radius));
            setNearByRadius(radius);
            setCurrentLocation(selectedOption)
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setLoading(true);
        try {
            const radiusNum = parseInt(displayRadius || "45");
            setRadius(radiusNum);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    };

    // const loadOptions = (inputValue: string) => {
    //     return new Promise<Location[]>((resolve) => {
    //         const filtered = (locationsData as Location[])
    //             .filter((location: Location) => {
    //                 return (
    //                     location.city.toLowerCase().includes(inputValue.toLowerCase()) ||
    //                     location.state_id.toLowerCase().includes(inputValue.toLowerCase()) ||
    //                     location.zip.toString().includes(inputValue)
    //                 );
    //             })
    //             .slice(0, 5);
    //         resolve(filtered as Location[]);
    //     });
    // };

    const loadOptions = (inputValue: string) => {
        return new Promise<Location[]>((resolve) => {
            const filtered = (locationsData as Location[])
                .filter((location: Location) => {
                    const searchValue = inputValue.toLowerCase();

                    // Check if the input matches any part of the 'search' field
                    // return location.search.toLowerCase().startsWith(searchValue);
                    return location.search.toLowerCase().includes(searchValue);
                })
                .slice(0, 5); // Limit results to 5 suggestions

            resolve(filtered as Location[]); // Resolve the filtered results
        });
    };


    // const loadOptions = (inputValue: string) => {
    //     return new Promise<Location[]>((resolve) => {
    //         const searchValue = inputValue.toLowerCase().trim();
            
    //         // If empty search, return empty array
    //         if (!searchValue) {
    //             resolve([]);
    //             return;
    //         }
    
    //         const filtered = (locationsData as Location[])
    //             .filter((location: Location) => {
    //                 // Check main search field
    //                 if (location.search.toLowerCase().includes(searchValue)) {
    //                     return true;
    //                 }
    
    //                 // Check zip codes if they exist
    //                 if (location.zips && location.zips.length > 0) {
    //                     // Join all zips into a single string and check
    //                     const allZips = location.zips.join(' ');
    //                     if (allZips.includes(searchValue)) {
    //                         return true;
    //                     }
    
    //                     // Alternatively, check each zip individually
    //                     /*
    //                     return location.zips.some(zipBlock => {
    //                         return zipBlock.split(' ').some(zip => zip.includes(searchValue));
    //                     });
    //                     */
    //                 }
    
    //                 return false;
    //             })
    //             .slice(0, 5); // Limit results to 5 suggestions
    
    //         resolve(filtered as Location[]);
    //     });
    // };

    // const getNearbyCities = (lat: number, lng: number, radiusInMiles: number) => {
    //     const radiusInKm = milesToKilometers(radiusInMiles); // Convert radius to kilometers

    //     const nearbyCities = (locationsData as Location[]).filter((location: Location) => {
    //         const distance = getDistance(lat, lng, location.lat, location.lng);
    //         return distance <= radiusInKm; // Check if the distance is within the radius in kilometers
    //     });

    //     return nearbyCities;
    // };

    const getNearbyCities = (lat: number, lng: number, radiusInMiles: number) => {
        // console.log(`Starting search at (${lat}, ${lng}) within ${radiusInMiles} miles`);

        const radiusInKm = milesToKilometers(radiusInMiles);
        // console.log(`Converted radius: ${radiusInKm} km`);

        // Filter valid locations first
        const validLocations = (locationsData as Location[]).filter(location => {
            const valid = location.lat >= -90 && location.lat <= 90 &&
                location.lng >= -180 && location.lng <= 180;
            if (!valid) {
                console.warn(`Invalid coordinates for location:`, location);
            }
            return valid;
        });

        // console.log(`Checking ${validLocations.length} valid locations`);

        const nearbyCities = validLocations.filter((location: Location) => {
            const distance = getDistance(lat, lng, location.lat, location.lng);
            const isNearby = distance <= radiusInKm;
            // console.log(`City at (${location.lat},${location.lng}) - Distance: ${distance.toFixed(2)} km - ${isNearby ? 'INCLUDED' : 'excluded'}`);
            return isNearby;
        });

        // console.log(`Found ${nearbyCities.length} nearby cities`);
        return nearbyCities;
    };


    // Load the selected location from localStorage when the component mounts
    // useEffect(() => {
    //     const savedLocation = localStorage.getItem("selectedLocation");
    //     const savedRadius = localStorage.getItem("selectedRadius");

    //     // If there's a saved location in localStorage, set it to the state
    //     if (!initialLocation && savedLocation) {
    //         const location = JSON.parse(savedLocation);
    //         setSelectedOption(location);
    //         setDisplaySelectedOption(location); // Optionally display the selected location in your UI
    //     }



    //     // If there's a saved radius, set it
    //     if (!initialRadius && savedRadius) {
    //         const radiusValue = parseInt(savedRadius, 10);
    //         if (!isNaN(radiusValue)) {
    //             setRadius(radiusValue);
    //             setDisplayRadius(radiusValue.toString());
    //         }
    //     }


    //     // Fallback: If neither savedLocation nor savedRadius exists
    //     if (!savedLocation && !savedRadius) {
    //         getLocationFromIP()
    //             .then(data => {
    //                 // console.log("IP Geolocation Data:", data);

    //                 const ipLocation: Location = {
    //                     zip: 12345, // Fallback ZIP
    //                     lat: data.lat,
    //                     lng: data.lng,
    //                     city: data.city || "Unknown City",
    //                     state_id: data.state || "Unknown State",
    //                     state_name: data.state || "Unknown State",
    //                     search: `${data.city}, ${data.state}, ${data.country}`,
    //                 };

    //                 // Set the location state
    //                 setSelectedOption(ipLocation);
    //                 setDisplaySelectedOption(ipLocation);

    //                 // Save the location to localStorage
    //                 localStorage.setItem("selectedLocation", JSON.stringify(ipLocation));

    //                 // Set radius to 50 and update state
    //                 setRadius(20);
    //                 setDisplayRadius("20");

    //                 // Save the radius to localStorage
    //                 localStorage.setItem("selectedRadius", "20");

    //             })
    //             .catch(error => {
    //                 console.error("Error fetching IP geolocation data:", error);

    //                 // Fallback to Dallas, TX if IP geolocation fails
    //                 const fallbackLocation: Location = {
    //                     zip: 75201, // Dallas ZIP code
    //                     lat: 32.7767, // Latitude for Dallas
    //                     lng: -96.7970, // Longitude for Dallas
    //                     city: "Dallas",
    //                     state_id: "TX",
    //                     state_name: "Texas",
    //                     search: "Dallas, TX, USA", // Fallback to Dallas, TX
    //                 };

    //                 // Set the location state
    //                 setSelectedOption(fallbackLocation);
    //                 setDisplaySelectedOption(fallbackLocation);

    //                 // Save the fallback location to localStorage
    //                 localStorage.setItem("selectedLocation", JSON.stringify(fallbackLocation));

    //                 // Set radius to 50 and update state
    //                 setRadius(20);
    //                 setDisplayRadius("20");

    //                 // Save the radius to localStorage
    //                 localStorage.setItem("selectedRadius", "20");
    //             });
    //     }

    //     // console.log("Selected Location:", savedLocation);
    //     // console.log("Selected Radius:", savedRadius);
    // }, []);

    useEffect(() => {
        const savedLocation = localStorage.getItem("selectedLocation");
        const savedRadius = localStorage.getItem("selectedRadius");

        let lat: number, lng: number, radius: number;
    
        if (!initialLocation && savedLocation) {
            try {
                const location = JSON.parse(savedLocation);
                setSelectedOption(location);
                setDisplaySelectedOption(location);
                lat = location.lat;
                lng = location.lng;
            } catch (error) {
                console.error("Error parsing saved location:", error);
                setSelectedOption(DALLAS_FALLBACK);
                setDisplaySelectedOption(DALLAS_FALLBACK);
                lat = DALLAS_FALLBACK.lat;
                lng = DALLAS_FALLBACK.lng;
            }
        } else if (!initialLocation) {
            handleIPGeolocation();
        }
    
        if (!initialRadius && savedRadius) {
            const radiusValue = parseInt(savedRadius, 10);
            if (!isNaN(radiusValue)) {
                setRadius(radiusValue);
                setDisplayRadius(radiusValue.toString());
                radius = radiusValue;
            } else {
                setRadius(100);
                setDisplayRadius("100");
                radius = 100;
            }
        }


              // Fallback: If neither savedLocation nor savedRadius exists
        if (!savedLocation && !savedRadius) {
            getLocationFromIP()
                .then(data => {

                    // Set the location state
                    setSelectedOption(data);
                    setDisplaySelectedOption(data);

                    // Save the location to localStorage
                    localStorage.setItem("selectedLocation", JSON.stringify(data));

                    // Set radius to 50 and update state
                    setRadius(100);
                    setDisplayRadius("100");

                    // Save the radius to localStorage
                    localStorage.setItem("selectedRadius", "100");

                    setLatLngRadius(data.lat, data.lng, 100)

                })
                .catch(error => {
                    console.error("Error fetching IP geolocation data:", error);

                    // Fallback to Dallas, TX if IP geolocation fails
                    const fallbackLocation: Location = DALLAS_FALLBACK

                    // Set the location state
                    setSelectedOption(fallbackLocation);
                    setDisplaySelectedOption(fallbackLocation);

                    // Save the fallback location to localStorage
                    localStorage.setItem("selectedLocation", JSON.stringify(fallbackLocation));

                    // Set radius to 50 and update state
                    setRadius(100);
                    setDisplayRadius("100");

                    // Save the radius to localStorage
                    localStorage.setItem("selectedRadius", "100");
                    setLatLngRadius(fallbackLocation.lat, fallbackLocation.lng, 100)
                });
        }
    }, []);

    useEffect(() => {
        if (setCities && selectedOption && radius) {
            setCities(getNearbyCities(selectedOption.lat, selectedOption.lng, radius));
            setNearByRadius(radius);
            setCurrentLocation(selectedOption)
        }
    }, [selectedOption, radius, setCities]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`flex items-center w-full hover:bg-transparent bg-transparent outline-0 border-0 justify-end ${className} `}
                >
                    <div className="flex items-center justify-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {/* <span className="truncate underline">
                            {dispalySelectedOption
                                ? `${dispalySelectedOption?.search?.replace(/, [^,]+$/, '')} • ${displayRadius} mi`
                                : "Select location"}
                        </span> */}

                        {/* <span className="truncate underline decoration-from-font [text-underline-position:under]">
                            {dispalySelectedOption
                                ? `${dispalySelectedOption?.search?.replace(/, [^,]+$/, '')} • ${displayRadius} mi`
                                : "Select location"}
                        </span> */}

                        <span className="truncate relative pb-0.1">
                        {dispalySelectedOption
                            ? `${dispalySelectedOption?.search?.replace(/, [^,]+$/, '')} • ${displayRadius} mi`
                            : "Select location"}
                        <span className="absolute bottom-0 left-0 w-full h-px bg-current" />
                        </span>
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className={`w-64 p-4 ${popupStyle}`} align="end" side="top">
                <form onSubmit={handleSubmit} className={`space-y-4`}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            ref={selectRef}
                            value={selectedOption}
                            loadOptions={loadOptions}
                            onChange={handleSelect}
                            onInputChange={handleSearchChange}
                            getOptionLabel={(option: Location) => option.search}
                            getOptionValue={(option: Location) => option.search}
                            // getOptionValue={(option: Location) => option.zip.toString()}
                            placeholder="Search by city"
                            className="text-sm "
                            styles={{
                                control: (base, state) => ({
                                    // ...base,
                                    paddingLeft: '1.6rem',
                                    border: state.isFocused ? '2px solid #ff7a19' : '2px solid #d1d5db', // Change border color on focus
                                    borderRadius: '0.375rem',
                                    minHeight: '42px',
                                    backgroundColor: '#fff',
                                    // border: '1px solid #f1db0e !important', // Default border color
                                    display:"flex",
                                    alignItems:"center",
                                    transition: 'border-color 0.3s ease', // Optional transition for smooth effect
                                }),
                            }}

                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                            }}
                        />
                        {/* <button
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white p-1"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4" />

                        </button>

                        <button
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white p-1"
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                        >
                            {locationLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Navigation className="h-4 w-4 mr-2 text-[#FF7A19]" />
                            )}
                        </button> */}
                        {/* Clear Button */}
                        <button
                            className="absolute right-8 top-1/2 -translate-y-1/2 bg-white p-1 rounded hover:bg-gray-100"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4 text-gray-600" />
                        </button>

                        {/* Location Button */}
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded hover:bg-gray-100"
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                        >
                            {locationLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                            ) : (
                                <Navigation className="h-4 w-4 text-[#FF7A19]" />
                            )}
                        </button>

                    </div>

                    {/* <Button
                        type="button"
                        variant="outline"
                        // className="w-full"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                    >
                        {locationLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Navigation className="h-4 w-4 mr-2 text-[#FF7A19]" />
                        )}
                        Use my location
                    </Button> */}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{notSetDefault ? "Select" : "Search"} Radius</span>
                            {/* <Input
                type="text"
                value={displayRadius}
                onChange={handleRadiusInputChange}
                // className="w-20 text-right"
                className="w-20 text-right pr-6"
              /> */}
                            <span className="text-sm text-[#FF7A19]">{radius || "100"} miles</span>
                        </div>

                        <Slider
                            value={[parseInt(radius.toString() || "100")]}
                            min={5}
                            max={100}
                            step={5}
                            onValueChange={handleRadiusChange}
                            className="my-2"
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>5 mi</span>
                            <span>50 mi</span>
                            <span>100 mi</span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            onClick={handleUpdate}
                            disabled={loading || (!selectedOption || !radius) || (selectedOption?.search === dispalySelectedOption?.search && radius === parseInt(displayRadius))}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Update
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default LocationWithRadius;
