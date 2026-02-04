import React from "react";
import Button from "./Button";
import './Button.css';

const ButtonPanel = ({ clickHandler }) => {
  const memoryButtons = ["M+", "MR", "MC"];
  const memoryIds = ["memoryPlus", "memoryRecall", "memoryClear"];

  const buttonGroups = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="]
  ];

  const ids = [
    ["clear", "plusMinus", "percent", "divide"],
    ["seven", "eight", "nine", "multiply"],
    ["four", "five", "six", "subtract"],
    ["one", "two", "three", "add"],
    ["zero", "decimal", "equals"]
  ];

  return (
    <div className="button-panel">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px", flexWrap: "wrap" }}>
        {memoryButtons.map((btn, i) => (
          <Button
            key={btn}
            name={btn}
            id={memoryIds[i]}
            clickHandler={clickHandler}
            className="button-memory"
          />
        ))}
      </div>
      {buttonGroups.map((group, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
          {group.map((btn, j) => (
            <Button
              key={btn}
              name={btn}
              id={ids[i][j]}
              clickHandler={clickHandler}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ButtonPanel;
