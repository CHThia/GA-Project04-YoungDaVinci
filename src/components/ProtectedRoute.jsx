import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, isAuthenticated, isAuthReady } = useUser();

  if (!isAuthReady) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    return <div 
      style={{
        display:'flex',
        flexDirection: 'column',
        marginTop: '5%',
        fontFamily:'helvetica',
        fontSize:'30px'
      }}>

      <p style={{ textAlign:'center'}}>You are not authorized to access this page. Please login as a teacher.</p>

        <div style={{
          marginTop: '35px',
          display:'flex',
          justifyContent:'center',
          fontFamily:'helvetica',
          fontSize:'30px'
      }}>
          <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW5qcGJxYTZzYmMzbHZwbTFwOWtwYXdndTQ2YndudzEzazBtaHRrZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sQic8pa6ga8PboWJSN/giphy.gif" alt="Access Denied" />
        </div>

      </div>;
  }

  return children;
};

export default ProtectedRoute;
