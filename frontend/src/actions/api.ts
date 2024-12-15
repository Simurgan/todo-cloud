import axios from "axios";

// Dynamically set backend URL
const backendUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL // Use local backend during development
    : window.__ENV__?.VITE_BACKEND_URL ?? "__VITE_BACKEND_URL__";

console.log(backendUrl);

axios.defaults.baseURL = `${backendUrl}api/`;

export const api = axios;
