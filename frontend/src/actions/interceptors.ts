import axios, { InternalAxiosRequestConfig } from "axios";
import { areTokensExpired, localStorageHelper } from "../helpers/global";
import { refresh } from "./auth";

export const requestAuthorizationInterceptor = async (
  config: InternalAxiosRequestConfig
) => {
  const accessToken = localStorageHelper.get("access_token");
  const refreshToken = localStorageHelper.get("refresh_token");
  const { isRefreshExpired, isAccessExpired } = areTokensExpired();

  if (accessToken && !isAccessExpired) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = "Bearer " + accessToken;

    return config;
  } else if (refreshToken && !isRefreshExpired) {
    const response = await refresh();

    if (response?.status === 200) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = "Bearer " + response.data.access;
    }

    return config;
  } else {
    window.location.href = "/login";
    return Promise.reject(
      new axios.Cancel("Request aborted: Refresh token expired.")
    );
  }
};
