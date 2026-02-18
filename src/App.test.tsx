import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Calculator App", () => {
  test("renders calculator display", () => {
    render(<App />);
    const display = screen.getByRole("status");
    expect(display).toBeInTheDocument();
    expect(display).toHaveTextContent("0");
  });

  test("adds two numbers correctly", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("button-2"));
    fireEvent.click(screen.getByLabelText("button-+"));
    fireEvent.click(screen.getByLabelText("button-2"));
    fireEvent.click(screen.getByLabelText("button-="));

    const display = document.getElementById("display");
    expect(display).toHaveTextContent("4");
  });
});

test("AC clears the display", () => {
  render(<App />);

  fireEvent.click(screen.getByLabelText("button-2"));
  fireEvent.click(screen.getByLabelText("button-AC"));

  const display = document.getElementById("display");
  expect(display).toHaveTextContent("0");
});

test("plus/minus toggles sign", () => {
  render(<App />);

  fireEvent.click(screen.getByLabelText("button-5"));
  fireEvent.click(screen.getByLabelText("button-+/-"));

  const display = document.getElementById("display");
  expect(display).toHaveTextContent("-5");
});

test("memory add and recall works", () => {
  render(<App />);

  fireEvent.click(screen.getByLabelText("button-8"));
  fireEvent.click(screen.getByLabelText("button-M+"));
  fireEvent.click(screen.getByLabelText("button-AC"));
  fireEvent.click(screen.getByLabelText("button-MR"));

  const display = document.getElementById("display");
  expect(display).toHaveTextContent("8");
});

test("prevents multiple decimals", () => {
  render(<App />);
  const btnDecimal = screen.getByLabelText("button-.");
  const btnTwo = screen.getByLabelText("button-2");

  fireEvent.click(btnTwo);
  fireEvent.click(btnDecimal);
  fireEvent.click(btnDecimal); // second decimal attempt
  fireEvent.click(btnTwo);

  // Grab only the **bottom display number** (last child of #display)
  const display = document.getElementById("display")?.lastElementChild?.textContent;

  // Split on "." and expect max 2 parts
  expect(display?.split(".").length).toBeLessThanOrEqual(2);
});



