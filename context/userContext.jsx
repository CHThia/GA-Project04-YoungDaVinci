import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userRole) => {
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setRole('');
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ role, isAuthenticated, login, logout, setRole, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
