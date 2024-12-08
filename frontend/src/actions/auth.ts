import { localStorageHelper } from "../helpers/global";
import { SignupLoginDataModel } from "../models/auth";
import { api } from "./api";

const authApi = api.create({
  baseURL: api.defaults.baseURL + "auth/",
});

export const signup = async (data: SignupLoginDataModel) => {
  const response = await authApi({
    method: "post",
    url: "signup/",
    data: data,
  });

  return response;
};

export const login = async (data: SignupLoginDataModel) => {
  const response = await authApi({
    method: "post",
    url: "token/",
    data: data,
  });

  if (response.status === 200) {
    localStorageHelper.set("refresh_token", response.data.refresh);
    localStorageHelper.set("access_token", response.data.access);
  }

  return response;
};

export const logout = async () => {
  const refresh_token = localStorageHelper.get("refresh_token");

  if (refresh_token) {
    const response = await authApi({
      method: "post",
      url: "logout/",
      data: { refresh_token: refresh_token },
    });

    if (response.status === 205) {
      localStorageHelper.delete("refresh_token");
      localStorageHelper.delete("access_token");
    }

    return response;
  }
};

export const refresh = async () => {
  const refresh_token = localStorageHelper.get("refresh_token");

  if (refresh_token) {
    const response = await authApi({
      method: "post",
      url: "token/refresh/",
      data: { refresh: refresh_token },
    });

    if (response.status === 200) {
      localStorageHelper.set("access_token", response.data.access);
    } else {
      localStorageHelper.delete("access_token");
      localStorageHelper.delete("refresh_token");
    }

    return response;
  }
};
