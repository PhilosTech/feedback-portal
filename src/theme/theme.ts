import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary color for key UI components
    },
    secondary: {
      main: '#ff4081', // Secondary color for highlights and accents
    },
    background: {
      default: '#f5f5f5', // Light grey background for better contrast
      paper: '#ffffff', // White background for card components
    },
    text: {
      primary: '#333333', // Dark grey for primary text to improve readability
      secondary: '#555555', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation for buttons
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: '1300px', // Limit container width to 1000px
          margin: '0 auto', // Center the container
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for buttons
          padding: '16px 22px', // Increase padding for better touch targets
          minWidth: '180px', // Ensure buttons have a minimum width of 100px
          fontSize: '1.2rem', // Increase font size for better readability
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Softer shadow for cards
          borderRadius: '12px', // Rounded corners for cards
          padding: '16px', // Padding inside cards for better spacing
        },
      },
    },
  },
});

export default theme;

export {}; // Ensure the file is treated as a module
