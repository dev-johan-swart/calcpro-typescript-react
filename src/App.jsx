// Replace file: src/App.js
import React, { useState, useCallback, useEffect } from "react";
import Display from "./components/Display";
import ButtonPanel from "./components/ButtonPanel";
import MathCalculator from "./components/MathCalculator";
import "./App.css";
import "./components/Button.css";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [value, setValue] = useState(null);
  const [memory, setMemory] = useState(null);
  const [mode, setMode] = useState("classic"); // "classic" or "math"
  const [isOn, setIsOn] = useState(true); // power state

  // Helper: reset all calculator runtime state
  const clearAll = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setOperator(null);
    setWaitingForOperand(false);
    setValue(null);
  }, []);

  // Power toggle: when turning off clear everything including memory
  const togglePower = () => {
    if (isOn) {
      // turning off: clear everything (including memory)
      setIsOn(false);
      setDisplay("OFF");
      setExpression("");
      setOperator(null);
      setWaitingForOperand(false);
      setValue(null);
      setMemory(null);
    } else {
      // turning on: reset to initial state
      setIsOn(true);
      setDisplay("0");
      setExpression("");
      setOperator(null);
      setWaitingForOperand(false);
      setValue(null);
      // memory remains cleared
    }
  };

  // Change mode and reset calculator fields (keep power state)
  const changeMode = (newMode) => {
    if (!isOn) return; // can't change mode when off
    setMode(newMode);
    setDisplay("0");
    setExpression("");
    setOperator(null);
    setWaitingForOperand(false);
    setValue(null);
  };

  // --- CLASSIC CALCULATOR HANDLER ---
  const handleClassicClick = (btn) => {
    if (!isOn) return;

    if (btn === "AC") {
      clearAll();
      return;
    }

    if (btn === "M+") {
      const parsed = parseFloat(display);
      if (!isNaN(parsed)) {
        setMemory(parsed);
      }
      return;
    }

    if (btn === "MR") {
      if (memory !== null) {
        setDisplay(String(memory));
        setExpression((prev) => (prev ? prev + " MR" : "MR"));
      }
      return;
    }

    if (btn === "MC") {
      setMemory(null);
      return;
    }

    // Operators
    if (["+", "-", "x", "÷"].includes(btn)) {
      const current = parseFloat(display);
      if (isNaN(current)) {
        setDisplay("Error");
        return;
      }

      if (operator && value != null && !waitingForOperand) {
        let result = value;
        switch (operator) {
          case "+": result = value + current; break;
          case "-": result = value - current; break;
          case "x": result = value * current; break;
          case "÷":
            if (current === 0) {
              setDisplay("Error");
              setExpression(prev => prev + " ÷ 0");
              setOperator(null);
              setValue(null);
              setWaitingForOperand(false);
              return;
            }
            result = value / current;
            break;
          default: break;
        }
        setDisplay(String(result));
        setValue(result);
        setExpression((prev) => (prev ? prev + " " + btn + " " : String(value) + " " + btn + " "));
      } else {
        setValue(current);
        setExpression((prev) => (prev ? prev + " " + btn + " " : String(current) + " " + btn + " "));
      }
      setOperator(btn);
      setWaitingForOperand(true);
      return;
    }

    if (btn === "=") {
      if (operator && value != null) {
        const current = parseFloat(display);
        if (isNaN(current)) {
          setDisplay("Error");
          return;
        }
        let result;
        switch (operator) {
          case "+": result = value + current; break;
          case "-": result = value - current; break;
          case "x": result = value * current; break;
          case "÷":
            if (current === 0) {
              setDisplay("Error");
              setExpression(prev => prev + " =");
              setOperator(null);
              setValue(null);
              setWaitingForOperand(false);
              return;
            }
            result = value / current; break;
          default: return;
        }
        setDisplay(String(result));
        setExpression((prev) => (prev ? prev + " =" : "="));
        setOperator(null);
        setValue(null);
        setWaitingForOperand(false);
      }
      return;
    }

    if (btn === ".") {
      if (waitingForOperand) {
        setDisplay("0.");
        setWaitingForOperand(false);
        setExpression((prev) => prev + "0.");
        return;
      }
      if (!display.includes(".")) {
        setDisplay(display + ".");
        setExpression((prev) => prev + ".");
      }
      return;
    }

    if (btn === "+/-") {
      if (display === "0" || display === "OFF" || display === "Error") return;
      const newValue = display.charAt(0) === "-" ? display.slice(1) : "-" + display;
      setDisplay(newValue);
      return;
    }

    if (btn === "%") {
      const parsed = parseFloat(display);
      if (!isNaN(parsed)) {
        const percentValue = parsed / 100;
        setDisplay(String(percentValue));
        setExpression((prev) => prev + "%");
      } else {
        setDisplay("Error");
      }
      return;
    }

    // Numeric input (0-9)
    if (/^\d+$/.test(btn)) {
      if (display === "0" || waitingForOperand) {
        setDisplay(btn);
        setWaitingForOperand(false);
      } else if (display === "OFF" || display === "Error") {
        setDisplay(btn);
        setWaitingForOperand(false);
      } else {
        setDisplay(display + btn);
      }
      setExpression((prev) => prev + btn);
      return;
    }
  };

  // --- MATH CALCULATOR HANDLER ---
  const handleMathClick = (btn) => {
    if (!isOn) return;

    if (btn === "M+") {
      const parsed = parseFloat(display);
      if (!isNaN(parsed)) setMemory(parsed);
      return;
    }
    if (btn === "MR") {
      if (memory !== null) {
        setDisplay(String(memory));
        setExpression(prev => prev ? prev + " MR" : "MR");
      }
      return;
    }
    if (btn === "MC") {
      setMemory(null);
      return;
    }

    try {
      const num = parseFloat(display);
      let result;
      switch (btn) {
        case "sin":
          if (isNaN(num)) { setDisplay("Error"); return; }
          result = Math.sin((num * Math.PI) / 180);
          break;
        case "cos":
          if (isNaN(num)) { setDisplay("Error"); return; }
          result = Math.cos((num * Math.PI) / 180);
          break;
        case "tan":
          if (isNaN(num)) { setDisplay("Error"); return; }
          result = Math.tan((num * Math.PI) / 180);
          if (!isFinite(result)) { setDisplay("Error"); return; }
          break;
        case "√":
          if (isNaN(num) || num < 0) { setDisplay("Error"); return; }
          result = Math.sqrt(num);
          break;
        case "x²":
          if (isNaN(num)) { setDisplay("Error"); return; }
          result = Math.pow(num, 2);
          break;
        case "π":
          result = num ? num * Math.PI : Math.PI;
          break;
        case "e":
          result = num ? num * Math.E : Math.E;
          break;
        case "log":
          if (isNaN(num) || num <= 0) { setDisplay("Error"); return; }
          result = Math.log10(num);
          break;
        default:
          return;
      }

      if (typeof result === "number" && isFinite(result)) {
        const fmt = Number.parseFloat(result.toPrecision(12)).toString();
        setDisplay(fmt);
        setExpression(`${btn}(${display})`);
        setWaitingForOperand(false);
      } else {
        setDisplay("Error");
      }
    } catch {
      setDisplay("Error");
    }
  };

  // Delete last char (Backspace behaviour)
  const handleBackspace = () => {
    if (!isOn) return;
    if (display === "OFF" || display === "Error") {
      setDisplay("0");
      return;
    }
    if (display.length <= 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Keyboard handler
  useEffect(() => {
    const onKeyDown = (ev) => {
      if (!isOn) return; // no keyboard when off
      const key = ev.key.toLowerCase();

      // Prevent default for Enter and for Backspace in case it navigates back
      if (["enter", "backspace", "escape"].includes(ev.key.toLowerCase())) {
        ev.preventDefault();
      }

      // Digits
      if (/^[0-9]$/.test(key)) {
        handleClassicClick(key);
        return;
      }

      // Decimal
      if (key === ".") {
        handleClassicClick(".");
        return;
      }

      // Operators
      if (key === "+") {
        handleClassicClick("+");
        return;
      }
      if (key === "-") {
        handleClassicClick("-");
        return;
      }
      if (key === "*") {
        handleClassicClick("x"); 
        return;
      }
      if (key === "/") {
        handleClassicClick("÷"); 
        return;
      }
      if (key === "%") {
        handleClassicClick("%");
        return;
      }

      // Equals
      if (key === "enter" || key === "=") {
        handleClassicClick("=");
        return;
      }

      // Clear all (Escape)
      if (key === "escape") {
        handleClassicClick("AC");
        return;
      }

      // Backspace -> delete last digit
      if (key === "backspace") {
        handleBackspace();
        return;
      }

      // Math function shortcuts only active in math mode
      if (mode === "math") {
        // s -> sin, c-> cos, t-> tan, r-> sqrt, ^-> x², p-> π, e-> e, l-> log
        if (key === "s") { handleMathClick("sin"); return; }
        if (key === "c") { handleMathClick("cos"); return; }
        if (key === "t") { handleMathClick("tan"); return; }
        if (key === "r") { handleMathClick("√"); return; }
        if (key === "^") { handleMathClick("x²"); return; }
        if (key === "p") { handleMathClick("π"); return; }
        if (key === "e") { handleMathClick("e"); return; }
        if (key === "l") { handleMathClick("log"); return; }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [display, isOn, mode, operator, value, waitingForOperand, memory]);

  // ModeSwitch visual small component
  const ModeSwitch = () => {
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
  };

  return (
    <div className="App">
      <div className="background-wrapper">
        <div className="calculator">

          {/* Expression / small top line */}
          <div className="expression-display" title={expression}>
            {expression}
          </div>

          {/* Display */}
          <Display value={display} expression={expression} isOn={isOn && display !== "OFF"} />

          {/* Controls line: power + mode switch */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "8px 0", gap: "10px" }}>
          
            <button
              onClick={togglePower}
              style={{
                width: 84,
                height: 36,
                backgroundColor: isOn ? "red" : "limegreen",
                color: "black",
                border: "none",
                borderRadius: 20,
                fontSize: "0.95rem",
                cursor: "pointer",
                fontWeight: 600
              }}
              aria-pressed={isOn}
            >
              {isOn ? "ON" : "OFF"}
            </button>

            <ModeSwitch />
          </div>

          {/* Main panel: Classic or Math */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {mode === "classic" ? (
              <ButtonPanel clickHandler={handleClassicClick} />
            ) : (
              <MathCalculator
                handleMathClick={handleMathClick}
                handleClassicClick={handleClassicClick}
              />
            )}
          </div>
        </div>

        <div className="keyboard-hint">
          💡 Tip: Press <strong>Backspace</strong> to edit numbers.
        </div>

        {/* Footer badge beside calculator */}
        <div className="footer-badge" aria-hidden 
         style={{
          marginLeft: "20px",
         }}>
        </div>
      </div>
    </div>
  );
}
