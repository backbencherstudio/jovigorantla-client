export const getLocationFromCoordinates = async (lat: number, lng: number) => {
    const accessToken = "pk.eyJ1IjoiZGVzaWVhc3k5OTA5IiwiYSI6ImNtYWhsMG9mOTA2eWcycnE0czhwY2tvM3QifQ.J0e0jKaSnehPaoSKFlH-0g"; // Replace with your Mapbox Access Token
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`
    );
  
    const data = await response.json();
  
    // Check if the response contains valid data
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      let city = "";
      let state = "";
      let country = "";
  
      // Loop through the address components to find city, state, and country
      feature.context.forEach((component: any) => {
        if (component.id.includes("place")) {
          city = component.text;
        }
        if (component.id.includes("region")) {
          state = component.text;
        }
        if (component.id.includes("country")) {
          country = component.text;
        }
      });
  
      return { city, state, country };
    } else {
      throw new Error("Unable to get location data from Mapbox.");
    }
  };
  