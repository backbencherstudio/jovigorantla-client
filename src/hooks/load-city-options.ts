interface MapboxFeature {
  place_name: string;
  text: string;
  center: [number, number];
  place_type: string[];
}

interface MapboxResponse {
  features: MapboxFeature[];
}

export const loadCityOptions = async (inputValue: string) => {
  const apiKey = 'pk.eyJ1IjoiZGVzaWVhc3k5OTA5IiwiYSI6ImNtYWhsMG9mOTA2eWcycnE0czhwY2tvM3QifQ.J0e0jKaSnehPaoSKFlH-0g';

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        inputValue
      )}.json?access_token=${apiKey}&types=place&limit=5`
    );
    const data: MapboxResponse = await res.json();
    
    return data.features.map((feature) => ({
      value: feature.place_name,
      label: feature.place_name,
    }));
  } catch (error) {
    console.error('Error loading city options:', error);
    return [];
  }
};
  