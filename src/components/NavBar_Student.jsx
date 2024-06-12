import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Divider } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useUser } from '../../context/userContext'; 


// HomeIcon component
function HomeIcon_Student(props) {
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
  const [studentId, setStudentId] = useState(null);
  const { logout } = useUser(); 

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  // Get student ID from location state or local storage
  useEffect(() => {
    if (location.state && location.state.studentId) {
      console.log("Student ID from location state:", location.state.studentId);
      setStudentId(location.state.studentId);
      localStorage.setItem('studentId', location.state.studentId); 
    } else {
      const storedStudentId = localStorage.getItem('studentId');
      console.log("Student ID from localStorage:", storedStudentId);
      setStudentId(storedStudentId);
    }
  }, [location]);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#F0770B', borderRadius: '10px' }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="home">
            <Link to="/">
              <HomeIcon_Student style={{ color: 'white' }} />
            </Link>
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              component={Link}
              to={`/studentdashboard/${studentId || ''}`} 
            >
              Student Dashboard
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