import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';

// HomeIcon component
function HomeIcon_Student (props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// NavBar_Student component
export default function NavBar_Student() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('studentName'); // Remove the student name
    navigate('/'); // Redirect to home page
  };

  // Close the login dialog when route changes
  useEffect(() => {
    // Additional actions if needed
  }, [location]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="home">
            <Link to="/">
              <HomeIcon_Student style={{ color: 'white' }} />
            </Link>
          </IconButton>
          <Button color="inherit" sx={{ marginLeft: 'auto' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
