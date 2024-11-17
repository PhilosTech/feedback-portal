import React from "react";
import { render, screen } from "@testing-library/react";
import { FeedbackProvider } from "./context/FeedbackContext";
import App from "./App";
import "@testing-library/jest-dom";

Object.defineProperty(window, "scrollTo", {
  value: () => {},
  writable: true,
});

describe("App Component", () => {
  const renderApp = () =>
    render(
      <FeedbackProvider>
        <App />
      </FeedbackProvider>
    );

  it("should render Login page on initial load", () => {
    renderApp();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("should render Header component", () => {
    renderApp();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should navigate to FeedbackPage when user is authenticated", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("token");

    renderApp();
    window.history.pushState({}, "FeedbackPage", "/feedback");

    expect(screen.getAllByText(/feedback portal/i)[0]).toBeInTheDocument();
  });
});
