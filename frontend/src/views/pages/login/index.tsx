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
import { login } from "../../../actions/auth";

const LoginPage = () => {
  const loginForm = useForm();
  const navigate = useNavigate();

  const loginFormSubmitHandler = async () => {
    const formData = await loginForm.getAllJson();
    const response = await login(formData);

    if (response.status === 200) {
      navigate(Urls.Home);
    } else {
      window.alert("Try again.");
    }
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
                name="username"
                placeholder="Email"
                permissions={[Permit.OnlyEmail()]}
                validations={[
                  Validate.Email("Email is not valid"),
                  Validate.Required("Email is required"),
                ]}
              />
              <InputPassword
                name="password"
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
