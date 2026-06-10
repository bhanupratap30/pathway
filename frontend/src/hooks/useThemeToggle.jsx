import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../theme/theme';

const PortalContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
  role: 'student',
  setRole: () => {}
});

export const ThemeProvider = ({ children }) => {
  // Theme Mode State
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // User Role Portal State (student or admin)
  const [role, setRoleState] = useState(() => {
    const savedRole = localStorage.getItem('portalRole');
    return savedRole || 'student';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('portalRole', role);
  }, [role]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const setRole = (newRole) => {
    setRoleState(newRole);
  };

  const theme = getTheme(mode);

  return (
    <PortalContext.Provider value={{ mode, toggleTheme, role, setRole }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </PortalContext.Provider>
  );
};

export const useThemeToggle = () => useContext(PortalContext);
export default useThemeToggle;
