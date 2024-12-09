import { Navigate, Outlet } from "react-router-dom";
import { Urls } from "../models/router";
import { localStorageHelper } from "../helpers/global";

const Guest = () => {
  const refreshToken = localStorageHelper.get("refresh_token");

  if (!refreshToken) {
    return <Outlet />;
  }

  return <Navigate to={Urls.Home} />;
};
export default Guest;
