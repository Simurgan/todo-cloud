import { Navigate, Outlet } from "react-router-dom";
import { Urls } from "../models/router";
import { localStorageHelper } from "../helpers/global";
import { getUserIdentity } from "../actions/account";
import { useEffect } from "react";

const Authorize = () => {
  const checkUser = async () => {
    await getUserIdentity();
  };

  useEffect(() => {
    checkUser();
  }, []);

  const refreshToken = localStorageHelper.get("refresh_token");

  if (refreshToken) {
    return <Outlet />;
  }

  return <Navigate to={Urls.Login} />;
};
export default Authorize;
