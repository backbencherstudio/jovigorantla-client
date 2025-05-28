import { getDistanceInMiles } from "./getDistanceInMiles";


export const filterUSLocationsWithinRadius = (locations, centerLat, centerLng, radiusMiles) => {

  return locations.filter((loc) => {
    const lat = loc.lat;
    const lng = loc.lng;
    const distance = getDistanceInMiles(centerLat, centerLng, lat, lng);
    return distance <= radiusMiles;
  });
};
