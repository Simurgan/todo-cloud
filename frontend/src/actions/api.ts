import axios from "axios";

// axios.defaults.baseURL = process.env.BACKEND_URL + "api/";
axios.defaults.baseURL = "http://127.0.0.1:8000/" + "api/";
export const api = axios;
