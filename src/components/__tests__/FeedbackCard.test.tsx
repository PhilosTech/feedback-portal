import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FeedbackCard from "../FeedbackCard"; // Update with the correct path
import { useJsApiLoader } from "@react-google-maps/api";
import { act } from "react-dom/test-utils";

jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: jest.fn(),
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Marker: () => <div>Marker</div>,
  InfoWindow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(() => ({
    ref: jest.fn(),
    inView: true,
  })),
}));

describe("FeedbackCard Component", () => {
  beforeEach(() => {
    (useJsApiLoader as jest.Mock).mockReturnValue({ isLoaded: true });
  });

  const mockFeedback = {
    imageUrl: "https://example.com/image.jpg",
    content: "This is a feedback message",
    location: {
      lat: 40.7128,
      lng: -74.006,
    },
  };

  it("renders loading state when Google Maps API is not loaded", () => {
    (useJsApiLoader as jest.Mock).mockReturnValue({ isLoaded: false });

    render(<FeedbackCard feedback={mockFeedback} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders feedback content correctly", async () => {
    render(<FeedbackCard feedback={mockFeedback} />);

    await waitFor(() =>
      expect(screen.getByAltText("Feedback")).toHaveAttribute("src", mockFeedback.imageUrl)
    );
    expect(screen.getByText(/This is a feedback message/i)).toBeInTheDocument();
  });

  it("renders Google Map and marker for valid location", async () => {
    render(<FeedbackCard feedback={mockFeedback} />);

    await waitFor(() => {
      expect(screen.getByText("Marker")).toBeInTheDocument();
    });
  });

  it("opens InfoWindow on marker click", async () => {
    render(<FeedbackCard feedback={mockFeedback} />);

    await waitFor(() => {
      expect(screen.getByText("Marker")).toBeInTheDocument();
    });

    // Simulate marker click
    act(() => {
      screen.getByText("Marker").click();
    });

    expect(screen.getByText(/This is a feedback message/i)).toBeInTheDocument();
    expect(screen.getByText(/View on Google Maps/i)).toBeInTheDocument();
  });
});
