import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, MenuItem, Box } from '@mui/material';
import axios from 'axios';

export default function StudentSignUp() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    education: '',
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
      const response = await axios.post('/api/studentsignup', formData);
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
        <h1>Membership Sign Up</h1>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Not a student? <Link to="/teachersignup">Click here to sign up as a teacher.</Link>
        </Typography>
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
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx={{ width: '100%' }}
            margin="normal"
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField
            sx={{ width: '100%' }}
            margin="normal"
            select
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
          >
            <MenuItem value="Kindergarten">Kindergarten</MenuItem>
            <MenuItem value="Primary">Primary</MenuItem>
            <MenuItem value="Secondary">Secondary</MenuItem>
          </TextField>
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
            color="warning"
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