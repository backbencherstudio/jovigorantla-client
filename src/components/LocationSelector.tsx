import React, { useState, useRef, useEffect } from "react";
import { MapPin, X, Check, Loader2, Locate, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AsyncSelect from "react-select/async";
import { StylesConfig, CSSObjectWithLabel } from "react-select";
import { components } from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Slider } from "@/components/ui/slider";
import { loadCityOptions } from "@/hooks/load-city-options";
import { Location } from "@/context/ListingContext";
import stateAbbreviations from "./stateAbbreviations";
import { set } from "date-fns";

interface LocationOption {
  value: string;
  label: string;
  coordinates: [number, number];
  type: string;
  context: Array<{
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }>;
}

interface LocationSelectorProps {
  onChange?: (location: Location) => void;
  className?: string;
  compact?: boolean;
}

interface StylesProps {
  display?: string;
  flexDirection?: string;
  padding?: string;
  paddingLeft?: string;
  borderColor?: string;
  backgroundColor?: string;
  minHeight?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onChange,
  className,
  compact = false,
}) => {
  const {
    locationString,
    updateLocation,
    loading,
    radius,
    updateRadius,
    updateCurrentLocation,
  } = useGeolocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [radiusValue, setRadiusValue] = useState(radius || 40);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayText, setDisplayText] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelect = (option: LocationOption | null) => {
    if (option) {
      const location: Location = {
        lat: option.coordinates[1],
        lng: option.coordinates[0],
        address: option.value,
      };

      // Console log the coordinates
      // console.log("Selected Location Coordinates:", option.coordinates);
      // console.log("Latitude:", option.coordinates[1]);
      // console.log("Longitude:", option.coordinates[0]);

      // Store complete location data
      localStorage.setItem("selectedLocation", option.value);
      localStorage.setItem(
        "selectedCoordinates",
        JSON.stringify([option.coordinates[1], option.coordinates[0]])
      );
      localStorage.setItem("selectedLocationType", option.type);

      setSelectedLocation(option);
      setInputValue(option.value);

      // setDisplayText(option.value);
      onChange?.(location);
      // setIsOpen(false);
    }
  };

  // Custom styles for AsyncSelect
  const customStyles: StylesConfig<LocationOption, false> = {
    option: (provided: CSSObjectWithLabel) => ({
      ...provided,
      display: "flex",
      flexDirection: "column" as const,
      padding: "8px 12px",
    }),
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      paddingLeft: "2rem",
      borderColor: "#e5ebee",
      backgroundColor: "#f9fafb",
      minHeight: "42px",
    }),
  };

  const formatOptionLabel = (option: LocationOption) => {
    const [city, state] = option.label.split(",");

    const stateAbbreviation =
      stateAbbreviations[state?.trim()] || state?.trim();
    const country = option.label.includes("United States") && "USA";

    // Format the label
    const formattedLabel = stateAbbreviation
      ? `${city.trim()}, ${stateAbbreviation}`
      : city.trim();

    return (
      <div>
        <div className="font-medium">
          {formattedLabel}, {country}
        </div>
        {/* <div className="text-xs text-gray-500">
        {option.type === "postcode" ? "ZIP Code" : "City"}
      </div> */}
      </div>
    );
  };
  const handleRemove = (cityToRemove) => {
    setSelectedCities((prev) =>
      prev.filter((city) => city.value !== cityToRemove.value)
    );
  };

  // const handleAddAdToGroup = (groupId: string) => {
  //   setNewAdForm({
  //     name: "",
  //     targetUrl: "",
  //     groupId: groupId,
  //     isAddingToExistingGroup: true,
  //   });
  //   setSelectedCities([]);
  // };

  // Add this effect after other useEffect hooks
  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation");
    const storedRadius = localStorage.getItem("selectedRadius");

    const formattedLabel = formatedInputValue(storedLocation);

    if (storedLocation) {
      setInputValue(storedLocation);
      setDisplayText(formattedLabel);
    }

    if (storedRadius) {
      const radius = parseInt(storedRadius, 10);
      if (!isNaN(radius)) {
        setRadiusValue(radius);
        updateRadius(radius);
      }
    }
  }, []);

  // Listen for location and radius changes
  useEffect(() => {
    const handleLocationUpdate = () => {
      if (locationString) {
        setInputValue(locationString);
        setDisplayText(locationString);
      }
    };

    const handleRadiusUpdate = () => {
      if (radius !== radiusValue) {
        // setRadiusValue(radius);
      }
    };

    window.addEventListener("locationUpdated", handleLocationUpdate);
    window.addEventListener("radiusUpdated", handleRadiusUpdate);

    return () => {
      window.removeEventListener("locationUpdated", handleLocationUpdate);
      window.removeEventListener("radiusUpdated", handleRadiusUpdate);
    };
  }, [locationString, radius, radiusValue]);

  const formatedInputValue = (inputValue) => {
    const [city, state] = inputValue.split(",");
    console.log(state.split(" ")[1]);

    const zipMatch = state.match(/\d{5}/); // This will extract 5-digit numbers
    const zipCode = zipMatch ? zipMatch[0] : null;

    const cleanedState = state?.trim().replace(/\d+/g, "").trim();
    const stateAbbreviation = stateAbbreviations[cleanedState] || state?.trim();

    // Format the label
    return stateAbbreviation
      ? `${city.trim()}, ${stateAbbreviation}${zipCode ? ", " + zipCode : ""}`
      : city.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await updateLocation(inputValue);
    await updateRadius(radiusValue);

    // Store location data in localStorage
    localStorage.setItem("selectedLocation", inputValue);
    localStorage.setItem("selectedRadius", radiusValue.toString());

    const formattedLabel = formatedInputValue(inputValue);

    // Create a Location object from the input value
    const location: Location = {
      address: inputValue,
      lat: 0, // These will be updated by the geocoding service
      lng: 0,
    };

    onChange?.(location);
    setDisplayText(formattedLabel);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const ClearIndicator = (props: any) => {
    const {
      clearValue,
      selectProps: { isDisabled },
    } = props;

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          clearValue();
        }}
        className="pr-2 cursor-pointer text-muted-foreground hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </div>
    );
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadiusValue(newRadius);
    // updateRadius(newRadius);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const locationAddress = await updateCurrentLocation();

      if (locationAddress) {
        // Get coordinates from localStorage if available
        const coordinates = localStorage.getItem("selectedCoordinates");
        let lat = 0;
        let lng = 0;

        if (coordinates) {
          const [latitude, longitude] = JSON.parse(coordinates); // Already stored in lat,lng order
          lat = latitude;
          lng = longitude;
        }

        const location: Location = {
          address: locationAddress,
          lat: Number(lat), // Ensure numbers
          lng: Number(lng), // Ensure numbers
        };

        setInputValue(locationAddress);
        setDisplayText(locationAddress);
        onChange?.(location);
      }
    } finally {
      setIsLocating(false);
    }
  };

  const renderSelect = () => (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadCityOptions}
        onChange={handleSelect}
        // value={inputValue ? {
        //   value: inputValue,
        //   label: inputValue,
        //   coordinates: [0, 0], // Default coordinates
        //   type: 'custom',
        //   context: []
        // } : null}
        formatOptionLabel={formatOptionLabel}
        value={selectedLocation ? selectedLocation : inputValue}
        placeholder="City or zip code"
        className="text-sm"
        styles={customStyles}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />

      <div className="cursor-pointer absolute  top-0 translate-x-full right-5 translate-y-3" onClick={(e) => handleClear()}>X</div>
    </div>
  );

  // Compact style for form input
  if (compact) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          asChild
          className="hover:bg-transparent hover:underline"
        >
          <Button
            variant="outline"
            className={`flex items-center justify-between text-sm w-full ${className}`}
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
            </div>
            <div>
              <span className="truncate text-black">
                {displayText || "Select location"}
              </span>
              {radius && <span className="text-black ml-1">• {radius} mi</span>}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              {renderSelect()}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-brand hover:text-brand/80 disabled:opacity-50"
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Locate className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-black text-sm font-medium">
                  Search Radius
                </span>
                <span className="text-brand text-sm">{radiusValue} miles</span>
              </div>

              <Slider
                value={[radiusValue]}
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
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !inputValue.trim()}
                className="h-8 text-xs"
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
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        className="hover:bg-transparent bg-transparent hover:underline"
      >
        <Button
          variant={className ? "outline" : "ghost"}
          className={`flex items-center text-sm px-2 ${className}`}
        >
          <MapPin className="h-4 w-4 -mr-1 text-primary" />
          <span className="truncate">
            {displayText || "Select location"}
            {radius && ` • ${radius} mi`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            {renderSelect()}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-brand hover:text-brand/80 disabled:opacity-50"
                disabled={isLocating}
              >
                {isLocating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  ""
                  // <Locate className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-black text-sm font-medium">
                Search Radius
              </span>
              <span className="text-brand text-sm">{radiusValue} miles</span>
            </div>

            <Slider
              value={[radiusValue]}
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
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !inputValue.trim()}
              className="h-8 text-xs"
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

export default LocationSelector;
