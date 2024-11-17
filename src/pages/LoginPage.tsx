import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    localStorage.setItem('token', 'token');
    navigate('/feedback');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        component="div"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#1976d2',
          textAlign: 'center',
        }}
      >
        Welcome to the User Feedback Portal
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          maxWidth: '600px',
          textAlign: 'center',
          color: '#555',
        }}
      >
        Please enter your credentials below to log in and share your feedback. We value your input to make our services better.
      </Typography>

      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          width: '100%',
        }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#1976d2',
              },
              '&:hover fieldset': {
                borderColor: '#ff4081',
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#1976d2',
              },
              '&:hover fieldset': {
                borderColor: '#ff4081',
              },
            },
          }}
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: '#ff4081',
            ':hover': {
              backgroundColor: '#ff79b0',
            },
          }}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#1976d2',
            cursor: 'pointer',
            mt: 2,
          }}
        >
          Forgot password?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#1976d2',
            cursor: 'pointer',
          }}
        >
          Create an account
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;
