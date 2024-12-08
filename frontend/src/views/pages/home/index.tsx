import "./style.scss";
import logoutSvg from "../../../assets/icons/logout.svg";
import { useNavigate } from "react-router-dom";
import { Urls } from "../../../models/router";
import { logout } from "../../../actions/auth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const HomePage = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await logout();
      if (response?.status === 205) {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 400) {
        toast.error("Token is already expired");
      } else {
        toast.error("Something went wrong with the login!");
      }
    }
    navigate(Urls.Login);
  };

  return (
    <section className="home-section">
      <div className="container">
        <div className="content">
          <div className="title-container">
            <div className="title-text">
              <h1>ToDo</h1>
              <p>Add, edit, delete ToDo items</p>
            </div>
            <div className="logout-icon-container" onClick={logoutHandler}>
              <img src={logoutSvg} className="logout-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomePage;
