import axios from 'axios';

const MAPBOX_API_KEY = 'pk.eyJ1IjoiZGVzaWVhc3k5OTA5IiwiYSI6ImNtYWhsMG9mOTA2eWcycnE0czhwY2tvM3QifQ.J0e0jKaSnehPaoSKFlH-0g';

export const loadCityOptions = async (inputValue: string) => {
  if (!inputValue.trim()) return [];

  try {
    // Determine if input is likely a ZIP code (5 digits)
    const isZipCode = /^\d{5}$/.test(inputValue.trim());
    
    // Construct URL with appropriate type filter
    const types = isZipCode ? 'postcode' : 'place,postcode';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${MAPBOX_API_KEY}&types=${types}`;
    
    const response = await axios.get(url);
    
    return response.data.features.map(feature => ({
      value: feature.place_name,
      label: feature.place_name,
      coordinates: feature.center,
      type: feature.place_type[0],
      context: feature.context
    }));
  } catch (error) {
    console.error('Error loading options:', error);
    return [];
  }
};
  