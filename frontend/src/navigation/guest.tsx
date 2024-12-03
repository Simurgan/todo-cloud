import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/store";
import { Urls } from "../models/router";

const Guest = () => {
  const user = useStore((x) => x.user);

  if (!user) {
    return <Outlet />;
  }

  return <Navigate to={Urls.Home} />;
};
export default Guest;
