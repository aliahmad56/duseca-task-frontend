import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');

    if (accessToken && storedUserId && storedRole) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = data => {
    console.log('Context function token is', data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('userId', data.user._id);
    localStorage.setItem('role', data.user.role);
    setIsAuthenticated(true);
    setUserId(data.user._id);
    setRole(data.user.role);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
