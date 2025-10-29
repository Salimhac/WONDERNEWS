import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin-authenticated');
    const authTimestamp = sessionStorage.getItem('admin-auth-timestamp');
    
    // Auto-logout after 1 hour
    if (authStatus === 'true' && authTimestamp) {
      const oneHour = 60 * 60 * 1000;
      const timeElapsed = Date.now() - parseInt(authTimestamp);
      
      if (timeElapsed < oneHour) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin-authenticated');
        sessionStorage.removeItem('admin-auth-timestamp');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-authenticated', 'true');
      sessionStorage.setItem('admin-auth-timestamp', Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-authenticated');
    sessionStorage.removeItem('admin-auth-timestamp');
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout
  };
};