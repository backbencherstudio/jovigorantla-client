interface Location {
    lat: number;
    lng: number;
    [key: string]: any; // allow any other city properties
}

const EARTH_RADIUS_KM = 6371;
const MILES_TO_KM = 1.60934;

const validateCoordinates = (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const getNearbyCities = (
    lat: number,
    lng: number,
    radiusInMiles: number,
    locationsData: Location[]
): Location[] => {
    if (!validateCoordinates(lat, lng)) {
        throw new Error('Invalid coordinates');
    }

    const radiusInKm = radiusInMiles * MILES_TO_KM;
    
    // First filter by rough bounding box to improve performance
    const approxFiltered = locationsData.filter(location => {
        if (!validateCoordinates(location.lat, location.lng)) return false;
        
        // Simple approximation: 1 degree ≈ 111km
        const latDiff = Math.abs(lat - location.lat);
        const lngDiff = Math.abs(lng - location.lng);
        return latDiff < (radiusInKm / 111) && lngDiff < (radiusInKm / (111 * Math.cos(toRadians(lat))));
    });

    // Then apply precise Haversine formula
    return approxFiltered.filter(location => {
        const distance = getDistance(lat, lng, location.lat, location.lng);
        return distance <= radiusInKm;
    });
};

const toRadians = (degree: number): number => degree * (Math.PI / 180);

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};