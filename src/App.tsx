import React, { Suspense } from "react";
import Header from "./components/Header";
import { FeedbackProvider } from "./context/FeedbackContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FeedbackPage from "./pages/FeedbackPage";
import PrivateRoute from "./components/PrivateRoute";
import Container from "@mui/material/Container";
import ScrollToTop from "./components/ScrollToTop";

const App: React.FC = () => {
  return (
    <FeedbackProvider>
      <Router>
        <ScrollToTop>
          <Header />
          <Container
            maxWidth="lg"
            sx={{ maxWidth: "1000px", px: 2, margin: "0 auto" }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/feedback"
                  element={
                    <PrivateRoute>
                      <FeedbackPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<LoginPage />} />
              </Routes>
            </Suspense>
          </Container>
        </ScrollToTop>
      </Router>
    </FeedbackProvider>
  );
};

export default App;
