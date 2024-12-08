import "./style.scss";
import logoutSvg from "../../../assets/icons/logout.svg";
import { useStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Urls } from "../../../models/router";

const HomePage = () => {
  const setUser = useStore((x) => x.setUser);
  const navigate = useNavigate();
  const logoutHandler = () => {
    setUser();
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
