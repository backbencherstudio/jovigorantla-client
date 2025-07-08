import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL; // Use VITE_ prefix as required by Vite

// export const publicApi = axios.create({
//   baseURL,
// });

export const api = axios.create({
  baseURL,
  withCredentials: true,
});


