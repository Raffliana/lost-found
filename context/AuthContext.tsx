
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { mockApi } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = sessionStorage.getItem('lostfound-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to check auth status', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string) => {
    const loggedInUser = await mockApi.login(username);
    sessionStorage.setItem('lostfound-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    navigate('/');
  };
  
  const register = async (userData: Omit<User, 'id'>) => {
    const newUser = await mockApi.register(userData);
    sessionStorage.setItem('lostfound-user', JSON.stringify(newUser));
    setUser(newUser);
    navigate('/');
  };

  const logout = () => {
    sessionStorage.removeItem('lostfound-user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
