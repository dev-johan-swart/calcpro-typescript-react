import React, { useState, useEffect, useCallback, useRef } from "react";
import Display from "./components/Display";
import ButtonPanel from "./components/ButtonPanel";
import MathCalculator from "./components/MathCalculator";
import ModeSwitch from "./components/ModeSwitch";
import "./App.css";
import "./components/Button.css";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [value, setValue] = useState(null);
  const [memory, setMemory] = useState(null);
  const [mode, setMode] = useState("classic");
  const [isOn, setIsOn] = useState(true);

  const displayRef = useRef(display);
  const isOnRef = useRef(isOn);
  const modeRef = useRef(mode);
  const operatorRef = useRef(operator);
  const valueRef = useRef(value);
  const waitingRef = useRef(waitingForOperand);
  const memoryRef = useRef(memory);

  useEffect(() => { displayRef.current = display; }, [display]);
  useEffect(() => { isOnRef.current = isOn; }, [isOn]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { operatorRef.current = operator; }, [operator]);
  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { waitingRef.current = waitingForOperand; }, [waitingForOperand]);
  useEffect(() => { memoryRef.current = memory; }, [memory]);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setOperator(null);
    setWaitingForOperand(false);
    setValue(null);
  }, []);

  const togglePower = () => {
    if (isOn) {
      setIsOn(false);
      setDisplay("OFF");
      setExpression("");
      setOperator(null);
      setWaitingForOperand(false);
      setValue(null);
      setMemory(null);
    } else {
      setIsOn(true);
      clearAll();
    }
  };

  const changeMode = (newMode) => {
    if (!isOn) return;
    setMode(newMode);
    clearAll();
  };

  // --- Classic calculator handler ---
  const handleClassicClick = (btn) => {
    if (!isOn) return;

    // --- Memory ---
    if (btn === "AC") return clearAll();
    if (btn === "M+") { const num = parseFloat(display); if (!isNaN(num)) setMemory(num); return; }
    if (btn === "MR") { if (memory !== null) { setDisplay(String(memory)); setExpression(prev => prev ? prev + " MR" : "MR"); } return; }
    if (btn === "MC") { setMemory(null); return; }

    // --- Operators ---
    if (["+", "-", "x", "÷"].includes(btn)) {
      const current = parseFloat(display);
      if (isNaN(current)) { setDisplay("Error"); return; }

      if (operator && value != null && !waitingForOperand) {
        let result = value;
        switch (operator) {
          case "+": result = value + current; break;
          case "-": result = value - current; break;
          case "x": result = value * current; break;
          case "÷": 
            if (current === 0) { setDisplay("Error"); setExpression(prev => prev + " ÷ 0"); setOperator(null); setValue(null); setWaitingForOperand(false); return; }
            result = value / current; break;
        }
        setDisplay(String(result));
        setValue(result);
        setExpression(prev => prev ? prev + " " + btn + " " : String(value) + " " + btn + " ");
      } else {
        setValue(current);
        setExpression(prev => prev ? prev + " " + btn + " " : String(current) + " " + btn + " ");
      }
      setOperator(btn);
      setWaitingForOperand(true);
      return;
    }

    if (btn === "=") {
      if (operator && value != null) {
        const current = parseFloat(display);
        if (isNaN(current)) { setDisplay("Error"); return; }
        let result;
        switch (operator) {
          case "+": result = value + current; break;
          case "-": result = value - current; break;
          case "x": result = value * current; break;
          case "÷":
            if (current === 0) { setDisplay("Error"); setExpression(prev => prev + " ="); setOperator(null); setValue(null); setWaitingForOperand(false); return; }
            result = value / current; break;
        }
        setDisplay(String(result));
        setExpression(prev => prev ? prev + " =" : "=");
        setOperator(null);
        setValue(null);
        setWaitingForOperand(false);
      }
      return;
    }

    // --- Decimal ---
    if (btn === ".") {
      if (waitingForOperand) {
        setDisplay("0.");
        setWaitingForOperand(false);
        setExpression(prev => prev + "0.");
        return;
      }
      // Prevent multiple decimals in the **current number**
      const parts = display.split(/[\+\-\x÷]/);
      const currentNum = parts[parts.length - 1];
      if (!currentNum.includes(".")) {
        setDisplay(display + ".");
        setExpression(prev => prev + ".");
      }
      return;
    }

    // --- Plus/Minus toggle ---
    if (btn === "+/-") {
      if (display === "0" || display === "OFF" || display === "Error") return;
      setDisplay(display.charAt(0) === "-" ? display.slice(1) : "-" + display);
      return;
    }

    // --- Percent ---
    if (btn === "%") {
      const parsed = parseFloat(display);
      if (!isNaN(parsed)) { setDisplay(String(parsed / 100)); setExpression(prev => prev + "%"); }
      else setDisplay("Error");
      return;
    }

    // --- Numbers ---
    if (/^\d+$/.test(btn)) {
      if (display === "0" || waitingForOperand || display === "OFF" || display === "Error") {
        setDisplay(btn);
        setWaitingForOperand(false);
      } else setDisplay(display + btn);
      setExpression(prev => prev + btn);
      return;
    }
  };

  // --- Math calculator handler ---
  const handleMathClick = (btn) => {
    if (!isOn) return;
    if (btn === "M+") { const parsed = parseFloat(display); if (!isNaN(parsed)) setMemory(parsed); return; }
    if (btn === "MR") { if (memory !== null) { setDisplay(String(memory)); setExpression(prev => prev ? prev + " MR" : "MR"); } return; }
    if (btn === "MC") { setMemory(null); return; }

    try {
      const num = parseFloat(display);
      let result;
      switch (btn) {
        case "sin": result = Math.sin((num * Math.PI) / 180); break;
        case "cos": result = Math.cos((num * Math.PI) / 180); break;
        case "tan": result = Math.tan((num * Math.PI) / 180); if (!isFinite(result)) { setDisplay("Error"); return; } break;
        case "√": if (num < 0) { setDisplay("Error"); return; } result = Math.sqrt(num); break;
        case "x²": result = Math.pow(num, 2); break;
        case "π": result = num ? num * Math.PI : Math.PI; break;
        case "e": result = num ? num * Math.E : Math.E; break;
        case "log": if (num <= 0) { setDisplay("Error"); return; } result = Math.log10(num); break;
        default: return;
      }
      setDisplay(Number.parseFloat(result.toPrecision(12)).toString());
      setExpression(`${btn}(${display})`);
      setWaitingForOperand(false);
    } catch { setDisplay("Error"); }
  };

  const handleBackspace = () => {
    if (!isOn) return;
    if (display === "OFF" || display === "Error") { setDisplay("0"); return; }
    if (display.length <= 1 || (display.length === 2 && display.startsWith("-"))) setDisplay("0");
    else setDisplay(display.slice(0, -1));
  };

  // --- Keyboard ---
  useEffect(() => {
    const onKeyDown = (ev) => {
      if (!isOnRef.current) return;
      const key = ev.key.toLowerCase();
      if (["enter", "backspace", "escape"].includes(key)) ev.preventDefault();

      if (/^[0-9]$/.test(key)) handleClassicClick(key);
      else if (key === ".") handleClassicClick(".");
      else if (key === "+") handleClassicClick("+");
      else if (key === "-") handleClassicClick("-");
      else if (key === "*") handleClassicClick("x");
      else if (key === "/") handleClassicClick("÷");
      else if (key === "%") handleClassicClick("%");
      else if (key === "enter" || key === "=") handleClassicClick("=");
      else if (key === "escape") handleClassicClick("AC");
      else if (key === "backspace") handleBackspace();

      if (modeRef.current === "math") {
        if (key === "s") handleMathClick("sin");
        if (key === "c") handleMathClick("cos");
        if (key === "t") handleMathClick("tan");
        if (key === "r") handleMathClick("√");
        if (key === "^") handleMathClick("x²");
        if (key === "p") handleMathClick("π");
        if (key === "e") handleMathClick("e");
        if (key === "l") handleMathClick("log");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="App">
      <div className="background-wrapper">
        <div className="calculator">
          <div className="expression-display" title={expression}>{expression}</div>
          <Display value={display} expression={expression} isOn={isOn && display !== "OFF"} />

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "8px 0", gap: "10px" }}>
            <button
              onClick={togglePower}
              style={{
                width: 84, height: 36,
                backgroundColor: isOn ? "red" : "limegreen",
                color: "black", border: "none", borderRadius: 20,
                fontSize: "0.95rem", cursor: "pointer", fontWeight: 600
              }}
              aria-pressed={isOn}
            >
              {isOn ? "ON" : "OFF"}
            </button>

            <ModeSwitch mode={mode} isOn={isOn} changeMode={changeMode} />
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            {mode === "classic" ? (
              <ButtonPanel clickHandler={handleClassicClick} />
            ) : (
              <MathCalculator handleMathClick={handleMathClick} handleClassicClick={handleClassicClick} />
            )}
          </div>
        </div>

        <div className="keyboard-hint">💡 Tip: Press <strong>Backspace</strong> to edit numbers.</div>
        <div className="footer-badge" aria-hidden style={{ marginLeft: "20px" }}></div>
      </div>
    </div>
  );
}
