
import { Position } from './types';

// Reverse geocoding function (mock implementation for demo)
export const reverseGeocode = async (lat: number, lng: number): Promise<Partial<Position>> => {
  try {
    // For demo purposes without API key
    // In real application, this would be an actual API call
    return {
      address: "123 Main St",
      city: "Denton",
      state: "TX",
      zipCode: "76201"
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {};
  }
};

// Forward geocoding function (mock implementation for demo)
export const geocodeAddress = async (address: string): Promise<Position | null> => {
  try {
    // This would be an actual API call in production
    // For demo purposes, we're returning mock data
    if (address.toLowerCase().includes('denton')) {
      return {
        lat: 33.2148,
        lng: -97.1331,
        city: 'Denton',
        state: 'TX',
        zipCode: '76201'
      };
    } else if (address.toLowerCase().includes('dallas')) {
      return {
        lat: 32.7767,
        lng: -96.7970,
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201'
      };
    } else if (address.toLowerCase().includes('irving')) {
      return {
        lat: 32.8140,
        lng: -96.9489,
        city: 'Irving',
        state: 'TX',
        zipCode: '75062'
      };
    } else {
      // Default fallback
      return {
        lat: 33.2148,
        lng: -97.1331,
        city: 'Denton',
        state: 'TX',
        zipCode: '76201'
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
