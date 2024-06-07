import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

export default function TeacherSignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/teachersignup', formData);
      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="title">
        <h1>Teacher Sign Up</h1>
      </div>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ width: '100%' }}
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ width: '100%' }}
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ width: '100%' }}
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '16px' }}
          >
            Sign Up
          </Button>
        </form>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'right',
            marginTop: 4,
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography color="primary">
              Back to Home Page
            </Typography>
          </Link>
        </Box>
      </Container>
    </>
  );
}