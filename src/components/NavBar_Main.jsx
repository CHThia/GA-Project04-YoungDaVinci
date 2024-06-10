import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Dialog, IconButton } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import LoginIcon from '@mui/icons-material/Login';
import Login from './Login';

// HomeIcon component 
function HomeIcon(props) {
  
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// NavLogin component 
export default function NavLogin() {
  
  const [open, setOpen] = useState(false); // Toggle open/close the Login Form
  const location = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Update LoginFrom State when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="home">
            <Link to="/">
              <HomeIcon style={{ color: 'white' }} />
            </Link>
          </IconButton>
          <Button color="inherit" startIcon={<LoginIcon />} sx={{ marginLeft: 'auto' }} onClick={handleClickOpen}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}>
        <Login />
      </Dialog>
    </Box>
  );
}
