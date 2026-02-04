import React from "react";
import './Button.css';

const Button = ({ name, clickHandler, id, className = "" }) => {
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
