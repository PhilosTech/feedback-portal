import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FeedbackForm from "../FeedbackForm"; // Update the path as per your project structure
import { useFeedback } from "../../context/FeedbackContext"; // Adjust the path accordingly
import { uploadFeedback } from "../../services/awsConfig";

jest.mock("../../context/FeedbackContext", () => ({
  useFeedback: jest.fn(),
}));

jest.mock("../../services/awsConfig", () => ({
  uploadFeedback: jest.fn(),
}));

jest.mock("@react-google-maps/api", () => ({
  GoogleMap: ({ onClick }: { onClick: jest.Mock }) => (
    <div data-testid="google-map" onClick={onClick}></div>
  ),
  LoadScript: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("FeedbackForm Component", () => {
  const refreshFeedbacks = jest.fn();

  beforeEach(() => {
    (useFeedback as jest.Mock).mockReturnValue({ refreshFeedbacks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockFeedbackData = {
    feedback: "Great service!",
    file: new File(["(⌐□_□)"], "test.png", { type: "image/png" }),
    location: { lat: 51.5074, lng: -0.1278 },
  };

  it("renders the form fields and map", () => {
    render(<FeedbackForm />);

    expect(screen.getByLabelText(/enter your feedback/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload file/i })).toBeInTheDocument();
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit feedback/i })).toBeInTheDocument();
  });

  it("updates feedback text and file input correctly", async () => {
    render(<FeedbackForm />);

    const feedbackInput = screen.getByLabelText(/enter your feedback/i);
    fireEvent.change(feedbackInput, { target: { value: mockFeedbackData.feedback } });

    expect(feedbackInput).toHaveValue(mockFeedbackData.feedback);

    const fileInputNode = screen.getByLabelText(/upload file/i);
    fireEvent.change(fileInputNode, { target: { files: [mockFeedbackData.file] } });

    await screen.findByAltText("Preview");
  });

  it("handles map click and sets location", () => {
    const mockMapClick = jest.fn();
    render(<FeedbackForm />);
    fireEvent.click(screen.getByTestId("google-map"));

    expect(mockMapClick).toHaveBeenCalled();
  });

  it("submits feedback successfully", async () => {
    (uploadFeedback as jest.Mock).mockResolvedValueOnce({});
    render(<FeedbackForm />);

    fireEvent.change(screen.getByLabelText(/enter your feedback/i), {
      target: { value: mockFeedbackData.feedback },
    });

    fireEvent.change(screen.getByLabelText(/upload file/i), {
      target: { files: [mockFeedbackData.file] },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

    await waitFor(() => expect(uploadFeedback).toHaveBeenCalledTimes(1));
    expect(uploadFeedback).toHaveBeenCalledWith(
      expect.any(String), // Feedback ID
      mockFeedbackData.feedback,
      mockFeedbackData.file,
      mockFeedbackData.location
    );
    expect(refreshFeedbacks).toHaveBeenCalledTimes(1);
  });

  it("displays an error message when feedback submission fails", async () => {
    (uploadFeedback as jest.Mock).mockRejectedValueOnce(new Error("Upload failed"));

    render(<FeedbackForm />);

    fireEvent.change(screen.getByLabelText(/enter your feedback/i), {
      target: { value: mockFeedbackData.feedback },
    });

    fireEvent.change(screen.getByLabelText(/upload file/i), {
      target: { files: [mockFeedbackData.file] },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

    await screen.findByText(/failed to submit feedback. please try again./i);
  });
});
