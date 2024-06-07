import { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate(response.data.redirect);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLinkClick = (path) => {
    setShowLoginForm(false); 
    navigate(path); 
  };

  return (
    <Container component="main" maxWidth="xs">
      {showLoginForm && (
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Welcome
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography component="h1">
              <Button variant="text" onClick={() => handleLinkClick('/forgotpassword')}>
                Forgot your password?
              </Button>
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color='success'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Typography component="p" sx={{ mt: 3 }}>
            Not a member yet?
            <Button variant="text" onClick={() => handleLinkClick('/studentsignup')}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      )}
    </Container>
  );
}
