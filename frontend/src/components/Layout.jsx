import React from 'react';
import Box from '@mui/material/Box';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      {/* Dynamic Header Navbar */}
      <Navbar />

      {/* Main content wrapper */}
      <Box 
        component="main" 
        className="grid-bg"
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </Box>

      {/* Branding Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
