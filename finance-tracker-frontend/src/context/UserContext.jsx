import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

// Create Context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Provider Component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    toast.success(`Welcome back, ${userData.username}! 🎉`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.info("You have logged out successfully. See you soon! 👋");
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
