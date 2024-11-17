import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import Box from "@mui/material/Box";
import { useInView } from "react-intersection-observer";

interface FeedbackCardProps {
  feedback: {
    imageUrl: string;
    content: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Using useInView to detect when the card enters the viewport
  const { ref, inView } = useInView({
    triggerOnce: true, // Load content only once when the card enters the viewport
    threshold: 0.6, // Trigger when 60% of the card is visible
  });

  useEffect(() => {
    // Automatically open InfoWindow for the first feedback item, if available
    if (feedback) {
      setTimeout(() => {
        setSelectedLocation({
          lat: feedback?.location?.lat || 0,
          lng: feedback?.location?.lng || 0,
        });
      }, 1500);
    }
  }, [feedback]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={ref}>
      {inView && (
        <Card sx={{ mb: 2 }}>
          {/* Render Google Map if there is a valid location */}
          {feedback.location && (
            <Box sx={{ mt: 2 }}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "300px" }}
                center={{ lat: feedback.location.lat, lng: feedback.location.lng }}
                zoom={10}
              >
                <Marker
                  position={{
                    lat: feedback.location.lat,
                    lng: feedback.location.lng,
                  }}
                  onClick={() =>
                    setSelectedLocation({
                      lat: feedback?.location?.lat || 0,
                      lng: feedback?.location?.lng || 0,
                    })
                  }
                />
                {/* Show InfoWindow if the marker is selected */}
                {selectedLocation &&
                  selectedLocation.lat === feedback.location.lat &&
                  selectedLocation.lng === feedback.location.lng && (
                    <InfoWindow
                      position={{
                        lat: feedback.location.lat,
                        lng: feedback.location.lng,
                      }}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <div>
                        <h3>Location Information</h3>
                        <p>{feedback.content}</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${feedback.location.lat},${feedback.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </InfoWindow>
                  )}
              </GoogleMap>
            </Box>
          )}
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {feedback.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                width="200"
                image={feedback.imageUrl}
                alt="Feedback"
                sx={{ maxWidth: "400px" }}
              />
            )}
            <CardContent>
              <Typography
                variant="body1"
                component="p"
                sx={{ textAlign: "center" }}
              >
                {feedback.content}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      )}
    </div>
  );
};

export default FeedbackCard;
