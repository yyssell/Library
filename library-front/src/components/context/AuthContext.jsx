// src/context/AuthContext.jsx
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {AuthLogin, Profile} from "../modules/Api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  console.log("User обновлён:", user);
}, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('auth');
        if (token) {
          const response = await Profile(token);
          setUser(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await AuthLogin(email, password);
      localStorage.setItem('auth', response.data.token);

      const token = localStorage.getItem('auth');
      if (token) {
          const response = await Profile(token);
          setUser(response.data);
        }
    } catch (err) {
      throw err
    }
    finally {
      setLoading(false)
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    navigate('/login');
  };

  const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        loading,
    }), [user, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);