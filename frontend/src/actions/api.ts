import axios, { AxiosRequestConfig } from "axios";
import { localStorageHelper } from "../helpers/global";
import { refresh } from "./auth";

axios.defaults.baseURL = process.env.BACKEND_URL + "api/";
export const api = axios;

export const requestAuthorizationInterceptor = async (
  config: AxiosRequestConfig
) => {
  const accessToken = localStorageHelper.get("access_token");
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = "Bearer" + accessToken;

    return config;
  } else {
    const refreshToken = localStorageHelper.get("refresh_token");

    if (refreshToken) {
      const response = await refresh();

      if (response?.status === 200) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = "Bearer" + response.data.access;
      }
    }
  }

  return config;
};
