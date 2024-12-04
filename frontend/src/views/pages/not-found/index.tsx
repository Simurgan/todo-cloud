import "./style.scss";
import Button from "../../components/button";
import { Urls } from "../../../models/router";

const NotFoundPage = () => {
  return (
    <section className="not-found-section">
      <div className="container">
        <div className="text-container">
          <h1>404</h1>
          <h3 className="text-thin">Page not found!</h3>
        </div>
        <div className="button-container">
          <Button href={Urls.Home}>
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
export default NotFoundPage;
