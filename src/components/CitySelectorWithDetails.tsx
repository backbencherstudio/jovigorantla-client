
// components/CitySelectorWithDetails.tsx (Data Only - No Map)
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { X } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

// mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVzaWVhc3k5OTA5IiwiYSI6ImNtYWhsMG9mOTA2eWcycnE0czhwY2tvM3QifQ.J0e0jKaSnehPaoSKFlH-0g';

const loadCityOptions = async (inputValue: string) => {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      inputValue
    )}.json?access_token=${mapboxgl.accessToken}&types=place&limit=5`
  );
  const data = await res.json();

  return data.features.map((feature: any) => {
    const [longitude, latitude] = feature.center;
    const context = feature.context || [];
    const country = context.find((c: any) => c.id.includes('country'))?.text || 'Unknown';
    const state = context.find((c: any) => c.id.includes('region'))?.text || '';

    return {
      label: feature.place_name,
      value: {
        name: feature.text,
        slug: feature.text.toLowerCase().replace(/\s+/g, '-'),
        country,
        state,
        latitude,
        longitude,
        center: feature.center,
        id: feature.id
      },
    };
  });
};

const fetchCityBoundary = async (cityName: string) => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        cityName
      )}.json?access_token=${mapboxgl.accessToken}&types=place&limit=1`
    );
    const data = await res.json();
    const feature = data.features[0];

    if (feature && feature.bbox) {
      const [west, south, east, north] = feature.bbox;
      const coordinates = [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south]
        ]
      ];
      return {
        type: 'Polygon',
        coordinates
      };
    }
  } catch (error) {
    console.error('Error fetching city boundary:', error);
  }
  return null;
};

const CitySelectorWithDetails = ({ onSubmit }: { onSubmit: (cityPayloads: any[]) => void }) => {
  const [selectedCities, setSelectedCities] = useState<any[]>([]);

  const handleAddCity = async (selected: any) => {
    const alreadySelected = selectedCities.find((c) => c.value.id === selected.value.id);
    if (!alreadySelected) {
      const boundary = await fetchCityBoundary(selected.label);
      const enriched = {
        ...selected,
        value: {
          ...selected.value,
          boundary,
        },
      };
      const updatedCities = [...selectedCities, enriched];
      setSelectedCities(updatedCities);

      const enrichedData = updatedCities.map((city) => ({
        name: city.value.name,
        slug: city.value.slug,
        country: city.value.country,
        state: city.value.state,
        latitude: city.value.latitude,
        longitude: city.value.longitude,
        boundary: city.value.boundary,
      }));
      onSubmit(enrichedData);
    }
  };

  const handleRemoveCity = (id: string) => {
    const updated = selectedCities.filter((c) => c.value.id !== id);
    setSelectedCities(updated);

    const enriched = updated.map((city) => ({
      name: city.value.name,
      slug: city.value.slug,
      country: city.value.country,
      state: city.value.state,
      latitude: city.value.latitude,
      longitude: city.value.longitude,
      boundary: city.value.boundary,
    }));
    onSubmit(enriched);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Search Cities</label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadCityOptions}
          onChange={handleAddCity}
          placeholder="Select place"
          value={null} // Ensures placeholder is shown and doesn't retain last selection
        />
      </div>

      {selectedCities.length > 0 && (
        <div className="flex flex-col gap-2">
          {selectedCities.map((city) => (
            <div key={city.value.id} className="flex items-center gap-2 p-2 border rounded">
              <span>{city.label}</span>
              <button onClick={() => handleRemoveCity(city.value.id)} className="ml-auto">
                <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySelectorWithDetails;
