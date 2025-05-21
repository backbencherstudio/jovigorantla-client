import axios from 'axios';

export const getAddressFromCoordinates =function (latitude: number, longitude: number): any  {
  const apiKey = 'pk.eyJ1IjoiZGVzaWVhc3k5OTA5IiwiYSI6ImNtYWhsMG9mOTA2eWcycnE0czhwY2tvM3QifQ.J0e0jKaSnehPaoSKFlH-0g'; // Replace with your API key

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     const address = response.data.features?.[0]?.place_name || 'Address not found';
//     return address;
//   } catch (error) {
//     console.error('Error fetching address:', error);
//     return 'Address not found';
//   }

    axios.get(url)
    .then(response => {
     const address = response.data.features?.[0]?.place_name || 'Address not found';
     console.log(address);
    return address;
   })
   .catch(error => {
     console.error('Error fetching address:', error);
     return 'Address not found';
   });
};
