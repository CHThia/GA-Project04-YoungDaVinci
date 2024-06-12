import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Divider } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import SchoolIcon from '@mui/icons-material/School';
import DrawIcon from '@mui/icons-material/Draw';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../../context/userContext'; 

// HomeIcon component
function HomeIcon_Teacher(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// NavBar_Teacher component
export default function NavBar_Teacher() {
  const navigate = useNavigate();
  const { logout } = useUser(); 

  const handleLogout = () => {
    logout(); 
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ borderRadius: '10px' }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="home">
            <Link to="/" component={Box} sx={{ display: 'flex' }}>
              <HomeIcon_Teacher style={{ color: 'white' }} />
            </Link>
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/drawingresources" startIcon={<DrawIcon />} sx={{ mx: 3 }}>
              Drawing Resources
            </Button>
            <Button color="inherit" component={Link} to="/AllStudents" startIcon={<SchoolIcon />} sx={{ mx: 0 }}>
              View All Students
            </Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 5, borderColor: 'white' }} />
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
