import axios from 'axios';

const MAPBOX_API_KEY = 'pk.eyJ1IjoiZGVzaWVhc3k5OTA5IiwiYSI6ImNtYWhsMG9mOTA2eWcycnE0czhwY2tvM3QifQ.J0e0jKaSnehPaoSKFlH-0g';

const useMyLocationOption = {
  label: "Use my location",
  value: "use-my-location",
  coordinates: [0, 0],
  type: "custom",
  context: [],
};


export const loadCityOptions = async (inputValue: string) => {

  const results = [];
  results.push(useMyLocationOption);

  if (!inputValue.trim()) return results;

  try {
    // Determine if input is likely a ZIP code (5 digits)
    const isZipCode = /^\d{5}$/.test(inputValue.trim());
    
    // Construct URL with appropriate type filter
    const types = isZipCode ? 'postcode' : 'place,postcode';
const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${MAPBOX_API_KEY}&types=place,postcode&country=US`;
// const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${MAPBOX_API_KEY}&types=place,postcode`;


    
    const response = await axios.get(url);

    
    
    const mapboxOptions =  response.data.features.map(feature => ({
      value: feature.place_name,
      label: feature.place_name,
      coordinates: feature.center,
      type: feature.place_type[0],
      context: feature.context
    }));

  return [...results, ...mapboxOptions]; 

  } catch (error) {
    console.error('Error loading options:', error);
    return [];
  }
};
  