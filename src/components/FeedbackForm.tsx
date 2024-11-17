import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { uploadFeedback } from "../services/awsConfig";
import { v4 as uuidv4 } from "uuid";
import FeedbackModal from "../components/FeedbackModal";
import { useFeedback } from "../context/FeedbackContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Container, Typography } from "@mui/material";

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { refreshFeedbacks } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const feedbackId = uuidv4();

    try {
      if (file && location) {
        await uploadFeedback(feedbackId, feedback, file, location);
        setFeedback("");
        setFile(null);
        setLocation(null);
        setFilePreview(null);
        setModalMessage("Feedback submitted successfully!");
        setModalOpen(true);
        await refreshFeedbacks(); // Refresh the list of feedbacks
      } else {
        setModalMessage("Please select a file and location before submitting.");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error uploading feedback:", error);
      setModalMessage("Failed to submit feedback. Please try again.");
      setModalOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFilePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        mt: 2,
      }}
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: "flex" }}>
        <Container
          sx={{ minHeight: "50%"}}
        >
          <Typography variant="body2">Select a location on the map:</Typography>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}
          >
            <GoogleMap
              mapContainerStyle={{ height: "350px", width: "80%" }}
              center={{ lat: 51.5074, lng: -0.1278 }}
              zoom={10}
              onClick={handleMapClick}
            >
              {location && <Marker position={location} />}
            </GoogleMap>
          </LoadScript>
          <TextField
          label="Enter your feedback"
          variant="outlined"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          sx={{ width: "80%", backgroundColor: "white", mt: 2 }}
        />
        </Container>
        
        <Box sx={{ mt: 2 }}>
        <Button variant="contained" component="label">
          Upload File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {filePreview && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Preview:</Typography>
          <img
            src={filePreview}
            alt="Preview"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </Box>
      )}
        </Box>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="success"
        size="large"
        disabled={uploading}
        sx={{ mt: 2, ml: 3 }}
      >
        {uploading ? "Uploading..." : "Submit Feedback"}
      </Button>

      <FeedbackModal
        open={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default FeedbackForm;
