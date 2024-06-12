import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (savedRole) setRole(savedRole);
    if (savedIsAuthenticated) setIsAuthenticated(savedIsAuthenticated);
    setIsAuthReady(true);
  }, []);

  const login = (userRole) => {
    setRole(userRole);
    setIsAuthenticated(true);
    localStorage.setItem('role', userRole); 
    localStorage.setItem('isAuthenticated', 'true'); 
  };

  const logout = () => {
    setRole('');
    setIsAuthenticated(false);
    localStorage.removeItem('role'); 
    localStorage.removeItem('isAuthenticated'); 
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');  
  };

  return (
    <UserContext.Provider value={{ role, isAuthenticated, isAuthReady, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
