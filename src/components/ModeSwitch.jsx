import React from "react";

export default function ModeSwitch({ mode, isOn, changeMode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "lime", fontSize: "0.9rem" }}>Mode:</span>
      <div
        style={{
          background: "#333",
          borderRadius: "20px",
          display: "flex",
          padding: "4px",
          width: "120px",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <button
          onClick={() => changeMode("classic")}
          style={{
            flex: 1,
            backgroundColor: mode === "classic" ? "limegreen" : "gray",
            color: "darkred",
            border: "none",
            borderRadius: "16px",
            fontSize: "0.8rem",
            cursor: isOn ? "pointer" : "not-allowed",
            padding: "6px 0",
            transition: "all 0.12s ease"
          }}
          disabled={!isOn}
        >
          Classic
        </button>

        <button
          onClick={() => changeMode("math")}
          style={{
            flex: 1,
            backgroundColor: mode === "math" ? "limegreen" : "gray",
            color: "darkred",
            border: "none",
            borderRadius: "16px",
            fontSize: "0.8rem",
            cursor: isOn ? "pointer" : "not-allowed",
            padding: "6px 0",
            transition: "all 0.12s ease"
          }}
          disabled={!isOn}
        >
          Math
        </button>
      </div>
    </div>
  );
}
