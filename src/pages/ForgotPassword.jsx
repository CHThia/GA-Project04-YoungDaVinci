import { useState } from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, Container } from '@mui/material';

export default function ForgotPassword () {

  const [email, setEmail] = useState("")
 
  const handleResetPassword = (event) => {
    event.preventDefault();
    // Code logic (Future Upgrade Version)
    console.log("Email", email)
    alert('Password reset link has been sent to your email address.');
    setEmail("")
  }

  return (
    <>
    <div className="title">
      <h1>Forgot Your Password?</h1>
    </div>

    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 2 }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          <TextField
            fullWidth
            label="Email Address"
            id="input-email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

          />
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleResetPassword}
            sx={{ 
              width: '100%',
              marginTop: 2,
            }}
          >
            Reset Password
          </Button>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'right',
            marginTop: 2,
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography color="primary" >
              Back to Home Page
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>  
    </>
  )
}