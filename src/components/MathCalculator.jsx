import React from "react";
import ButtonPanel from "./ButtonPanel";
import "./Button.css";
import "../App.css";

export default function MathCalculator({ handleMathClick, handleClassicClick }) {
  const mathButtons = ["sin", "cos", "tan", "√", "x²", "π", "e", "log"];

  return (
    <div
      style={{
        backgroundColor: "black",
        borderRadius: "12px",
        padding: "3px",
        minHeight: "50px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        border: "2px solid darkred",
        boxShadow: "0 0 15px lime",
      }}
    >
      <p style={{ color: "lime", marginBottom: "10px", textAlign: "center" }}>
        Math Calculator
      </p>

      {/* Math function buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "5px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto 20px auto",
        }}
      >
        {mathButtons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleMathClick(btn)}
            style={{
              backgroundColor: "darkred",
              color: "lime",
              border: "1px solid lime",
              borderRadius: "8px",
              padding: "5px",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 0 5px darkred",
            }}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Numeric buttons below math buttons */}
      <div style={{ width: "100%", marginTop: "5px" }}>
        <ButtonPanel clickHandler={handleClassicClick} />
      </div>
    </div>
  );
}
