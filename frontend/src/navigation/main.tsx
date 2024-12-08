import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Urls } from "../models/router";
import Authorize from "./authorize";
import Guest from "./guest";
import LoginPage from "../views/pages/login";
import HomePage from "../views/pages/home";
import NotFoundPage from "../views/pages/not-found";
import SignupPage from "../views/pages/signup";

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};
export default MainRouter;

const Router = () => {
  return (
    <Routes>
      <Route element={<Authorize />}>
        <Route element={<HomePage />} path={Urls.Home} />
      </Route>
      <Route element={<Guest />}>
        <Route element={<LoginPage />} path={Urls.Login} />
        <Route element={<SignupPage />} path={Urls.Signup} />
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
};
