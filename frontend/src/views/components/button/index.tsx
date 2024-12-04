import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

interface ButtonProps {
  style?: "primary";
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  classNames?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  style = "primary",
  href,
  disabled = false,
  onClick,
  classNames = "",
  children,
  type = "button",
}: ButtonProps) => {
  return (
    <>
      {href ? (
        <Link to={href} role="button">
          <div
            className={`button ${style} ${classNames} ${
              disabled ? "disabled" : ""
            }`}
            onClick={onClick}
          >
            {children}
          </div>
        </Link>
      ) : (
        <button
          className={`button ${style} ${classNames}`}
          onClick={onClick}
          disabled={disabled}
          type={type}
        >
          {children}
        </button>
      )}
    </>
  );
};
export default Button;
