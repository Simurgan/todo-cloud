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
import { signup } from "../../../actions/auth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const SignupPage = () => {
  const signupForm = useForm();
  const navigate = useNavigate();

  const signupFormSubmitHandler = async () => {
    try {
      const formData = await signupForm.getAllJson();
      const response = await signup(formData); // axios call

      if (response.status === 201) {
        toast.success("Account created successfully!");
        navigate(Urls.Login);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 400) {
        toast.error("This email is used by another user. Try another one.");
      } else {
        // Network errors or unexpected failures
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <section className="signup-section">
      <div className="container">
        <div className="content">
          <div className="title-container">
            <h1>Signup</h1>
            <p>
              Already have an account? Login <Link to={Urls.Login}>here</Link>!
            </p>
          </div>
          <div className="signup-form-container">
            <Form
              form={signupForm}
              onSubmit={signupFormSubmitHandler}
              classNames="form signup-form"
            >
              <InputEmail
                name="email"
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
                <span>Signup</span>
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SignupPage;
