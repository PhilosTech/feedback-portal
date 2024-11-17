import React, { createContext, useContext, useState, useEffect } from "react";
import { listFeedbackObjects, getFeedbackContent } from "../services/awsConfig";

interface Feedback {
  imageUrl: string;
  content: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface FeedbackContextProps {
  feedbacks: Feedback[];
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
  refreshFeedbacks: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(
  undefined
);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const refreshFeedbacks = async () => {
    try {
      const feedbackMap = await listFeedbackObjects();
      const updatedFeedbacks: Feedback[] = [];

      for (const feedback of Object.values(feedbackMap)) {
        if (feedback.content) {
          try {
            // Fetch content from the S3 content URL
            const contentResponse = (await getFeedbackContent(
              feedback.content
            )) as {
              feedback: string;
              location: {
                lat: number;
                lng: number;
              };
            };

            // Ensure contentResponse is a valid string before parsing
            if (contentResponse) {
              updatedFeedbacks.push({
                imageUrl: feedback.imageUrl || "",
                content: contentResponse.feedback, // Extract feedback content from parsed JSON
                location: contentResponse.location, // Extract location from parsed JSON
              });
            }
          } catch (error) {
            console.error("Failed to fetch feedback content:", error);
          }
        }
      }

      setFeedbacks((prevFeedbacks) => {
        // Update feedbacks only if there are changes
        if (
          JSON.stringify(prevFeedbacks) !== JSON.stringify(updatedFeedbacks)
        ) {
          return updatedFeedbacks;
        }
        return prevFeedbacks;
      });
    } catch (error) {
      console.error("Failed to refresh feedbacks:", error);
    }
  };

  // Ensure that refreshFeedbacks is called only once on mount
  useEffect(() => {
    const fetchInitialFeedbacks = async () => {
      await refreshFeedbacks();
    };
    fetchInitialFeedbacks();
  }, []); // Empty dependency array means this will run only once

  return (
    <FeedbackContext.Provider
      value={{ feedbacks, setFeedbacks, refreshFeedbacks }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
