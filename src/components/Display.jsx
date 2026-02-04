import React from "react";


const Display = ({ value = "0", expression = "", isOn = true }) => {
  // Auto-scale font based on length
  const len = String(value).length;
  const fontSize = len > 12 ? "1.6rem" : len > 8 ? "2rem" : "2.4rem";

  const mainColor = isOn ? "limegreen" : "crimson";

  return (
    <div
      id="display"
      style={{
        backgroundColor: "black",
        color: mainColor,
        textAlign: "right",
        padding: "8px",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        marginBottom: "10px",
        border: "1px solid lime",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    >
      <div
        style={{
          fontSize: "0.95rem",
          color: "darkred",
          marginBottom: "6px",
          minHeight: "20px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {expression}
      </div>

      <div
        style={{
          fontSize,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default Display;
