import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL; // Use VITE_ prefix as required by Vite

// export const publicApi = axios.create({
//   baseURL,
// });
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(userTimezone);

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'timezone': userTimezone // 'America/New_York' , // Add the timezone header here
  }
});


