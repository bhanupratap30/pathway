import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import { useThemeToggle } from '../hooks/useThemeToggle';
import { logoutUser } from '../features/auth/authSlice';

export const Navbar = () => {
  const { mode, toggleTheme } = useThemeToggle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authenticated State from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const isSelected = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Nav links depend on auth state and role
  const navItems = !isAuthenticated 
    ? [] 
    : user?.role === 'admin'
      ? [
          { label: 'Analytics Dashboard', path: '/dashboard' },
          { label: 'Submissions Archive', path: '/submissions' }
        ]
      : [
          { label: 'Home', path: '/' },
          { label: 'Get Recommendation', path: '/recommendation' }
        ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2, height: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
        <SchoolIcon sx={{ color: 'text.primary' }} />
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.03em' }}>
          PATHWAY
        </Typography>
      </Box>

      {isAuthenticated && user && (
        <Box sx={{ mb: 3, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'text.primary', color: 'background.default', width: 40, height: 40 }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
              {user.role === 'admin' ? 'Advisor Portal' : 'Student Portal'}
            </Typography>
          </Box>
        </Box>
      )}

      <List sx={{ mb: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                textAlign: 'center',
                borderRadius: '6px',
                mx: 1,
                bgcolor: isSelected(item.path) ? 'background.surface' : 'transparent',
                '&:hover': {
                  bgcolor: 'background.surface',
                }
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isSelected(item.path) ? 600 : 400,
                  color: isSelected(item.path) ? 'text.primary' : 'text.secondary'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {isAuthenticated && (
        <Button 
          variant="outlined" 
          color="error" 
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ py: 1 }}
        >
          Sign Out
        </Button>
      )}
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, minHeight: '64px' }}>
        {/* Left Section - Brand */}
        <Box 
          onClick={() => navigate(isAuthenticated ? '/' : '/login')} 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
        >
          <SchoolIcon sx={{ color: 'text.primary', fontSize: 26 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              color: 'text.primary', 
              fontFamily: 'Outfit',
              letterSpacing: '-0.04em',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            PATHWAY
          </Typography>
        </Box>

        {/* Middle Section - Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                color: isSelected(item.path) ? 'text.primary' : 'text.secondary',
                fontWeight: isSelected(item.path) ? 600 : 400,
                px: 2,
                borderRadius: '6px',
                position: 'relative',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'background.surface',
                },
                ...(isSelected(item.path) && {
                  backgroundColor: 'background.surface',
                })
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right Section - Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* User Profile Info (Desktop) */}
          {isAuthenticated && user && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6rem', display: 'block' }}>
                  {user.role === 'admin' ? 'Advisor' : 'Student'}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'text.primary', color: 'background.default', width: 32, height: 32, fontSize: '0.85rem', fontWeight: 600 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton 
                onClick={handleLogout} 
                color="inherit" 
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main', bgcolor: 'background.surface' }
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}

          <IconButton 
            onClick={toggleTheme} 
            color="inherit" 
            sx={{ 
              color: 'text.primary',
              '&:hover': { bgcolor: 'background.surface' }
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' }, 
                color: 'text.primary',
                '&:hover': { bgcolor: 'background.surface' }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, borderLeft: '1px solid', borderColor: 'divider' },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
