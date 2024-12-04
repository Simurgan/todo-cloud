import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { Urls } from "../../../models/router";
import {
  Form,
  InputEmail,
  InputPassword,
  Permit,
  useForm,
  Validate,
} from "vanora-react";
import Button from "../../components/button";
import { useStore } from "../../../store/store";
import { UserModel } from "../../../models/auth";

const LoginPage = () => {
  const loginForm = useForm();
  const setUser = useStore((x) => x.setUser);
  const navigate = useNavigate();
  const loginFormSubmitHandler = async () => {
    const user: UserModel = { Email: loginForm.get("Email")?.value as string };
    setUser(user);
    navigate(Urls.Home);
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="content">
          <div className="title-container">
            <h1>Login</h1>
            <p>
              You don't have an account? Signup{" "}
              <Link to={Urls.Signup}>here</Link>!
            </p>
          </div>
          <div className="login-form-container">
            <Form
              form={loginForm}
              onSubmit={loginFormSubmitHandler}
              classNames="form login-form"
            >
              <InputEmail
                name="Email"
                placeholder="Email"
                permissions={[Permit.OnlyEmail()]}
                validations={[
                  Validate.Email("Email is not valid"),
                  Validate.Required("Email is required"),
                ]}
              />
              <InputPassword
                name="Password"
                placeholder="Password"
                permissions={[Permit.MaxLength(20)]}
                validations={[Validate.Required("Password is required")]}
              />
              <Button style="primary" type="submit">
                <span>Login</span>
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
