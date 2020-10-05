import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders instagram", () => {
  render(<App />);
  const instagramTexts = screen.getAllByText(/instagram/i);
  
  for (const text of instagramTexts) {
    expect(text).toBeInTheDocument();
  }
});
