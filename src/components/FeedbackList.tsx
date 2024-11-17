import React, { useEffect } from "react";
import FeedbackCard from "./FeedbackCard";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useFeedback } from "../context/FeedbackContext";
import { Container } from "@mui/material";

const FeedbackList: React.FC = () => {
  const { feedbacks, refreshFeedbacks } = useFeedback();

  useEffect(() => {
    refreshFeedbacks();
  }, [refreshFeedbacks]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="body1"
        component="div"
        sx={{ textAlign: "center", mb: 4 }}
      >
        Here you can see all the feedbacks submitted by our users. We value your
        input and hope you find the insights here helpful!
      </Typography>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <Container key={index} sx={{ mb: 4 }}>
            <FeedbackCard feedback={feedback} />
          </Container>
        ))
      ) : (
        <Typography variant="body1" component="div">
          No feedback available.
        </Typography>
      )}
    </Box>
  );
};

export default FeedbackList;
