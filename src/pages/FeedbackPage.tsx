// FeedbackPage.tsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const FeedbackPage: React.FC = () => {
  return (
    <Box sx={{ mt: 8, px: 4 }}>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Feedback Portal
      </Typography>
      <Typography
        variant="body1"
        component="div"
        sx={{ textAlign: "center", mb: 4 }}
      >
        To leave your own feedback, select a location on the map, add a short
        description, and attach an image. We appreciate your contribution!
      </Typography>

      <FeedbackForm />
      <FeedbackList />
    </Box>
  );
};

export default FeedbackPage;
