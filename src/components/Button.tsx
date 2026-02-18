import React from "react";
import "./Button.css";

interface ButtonProps {
  name: string;
  clickHandler: (name: string) => void;
  id?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  name,
  clickHandler,
  id,
  className = ""
}) => {
  let buttonClass = "button";

  if (name === "AC" || name === "+/-" || name === "%") {
    buttonClass += " button-red";
  } else if (["=", "+", "-", "x", "÷"].includes(name)) {
    buttonClass += " button-green";
  } else {
    buttonClass += " button-black";
  }

  const finalClassName = `${buttonClass} ${className}`.trim();

  return (
    <button
      id={id}
      className={finalClassName}
      onClick={() => clickHandler(name)}
      aria-label={`button-${name}`}
    >
      {name}
    </button>
  );
};

export default Button;
