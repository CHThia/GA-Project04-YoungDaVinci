import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';


const ProtectedRoute = ({ children, allowedRoles }) => {
  
  const { role } = useUser();

  if (!allowedRoles.includes(role)) {
    alert("You are not authorized to access this page. Please login as a teacher.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
