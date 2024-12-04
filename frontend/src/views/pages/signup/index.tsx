import { Link } from "react-router-dom";
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

const SignupPage = () => {
  const signupForm = useForm();
  const signupFormSubmitHandler = async () => {
    console.log("signup form submitted!!");
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
