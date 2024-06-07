import { useState } from 'react';
import { Link } from 'react-router-dom'
import { TextField, Button, Container, Typography, MenuItem, Box } from '@mui/material';

export default function SignUp() {

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Code Login
    console.log(formData);
  };

  return (
    <>
        <div className="title">
          <h1>Membership Sign Up</h1>
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
          
          {/* NEED TO CHANGE TO DOB */}
          <TextField
            sx={{ width: '100%' }}
            margin="normal"
            label="Age "
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
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
            <MenuItem value="Kindergarten">Male</MenuItem>
            <MenuItem value="Primary">Female</MenuItem>
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
            <Typography color="primary" >
              Back to Home Page
            </Typography>
          </Link>
        </Box> 

      </Container>
    </>
  );
}
