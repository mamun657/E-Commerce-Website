import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const STORAGE_KEY = 'userProfile';

const UserContext = createContext({ user: null, setUser: () => {} });

const readStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to read stored user', error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [user, setUser] = useState(() => {
    const storedUser = readStoredUser();
    return authUser ? { ...storedUser, ...authUser } : storedUser;
  });

  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUser((prev) => ({ ...prev, ...authUser }));
    }
  }, [authUser, isAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
