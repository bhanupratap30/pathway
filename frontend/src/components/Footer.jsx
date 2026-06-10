import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        px: 2, 
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Academic Pathway Recommendation Engine. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" variant="body2" color="text.secondary" underline="hover">
              Privacy Policy
            </Link>
            <Link href="#" variant="body2" color="text.secondary" underline="hover">
              Terms of Service
            </Link>
            <Link href="#" variant="body2" color="text.secondary" underline="hover">
              Contact Advisory
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
