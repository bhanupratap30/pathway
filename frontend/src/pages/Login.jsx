import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SchoolIcon from '@mui/icons-material/School';

import { loginUser, registerUser, loginWithGoogle, loginSuccess, clearError } from '../features/auth/authSlice';
import AnimatedPage from '../components/Common/AnimatedPage';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);

  // Forms
  const { control: loginControl, handleSubmit: handleLoginSubmit, reset: resetLogin } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const { control: registerControl, handleSubmit: handleRegisterSubmit, reset: resetRegister } = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'student' }
  });

  // Navigate after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Logged in as ${user.name}`);
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Toast errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Load Google GIS script dynamically if configured
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse
          });
        }
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleCredentialResponse = (response) => {
    try {
      const jwt = response.credential;
      const payloadBase64 = jwt.split('.')[1];
      const decodedPayload = JSON.parse(decodeURIComponent(escape(atob(payloadBase64))));
      
      const email = decodedPayload.email;
      const name = decodedPayload.name || decodedPayload.given_name || 'Google User';
      
      setGoogleUserData({ name, email });
      setGoogleDialogOpen(true);
    } catch (err) {
      toast.error('Failed to parse Google account credentials.');
    }
  };

  // Listen for message from the mock google login popup window
  useEffect(() => {
    const handleGoogleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        const { name, email, role } = event.data.user;
        setIsSimulatingGoogle(true);
        setTimeout(() => {
          setIsSimulatingGoogle(false);
          dispatch(loginSuccess({ name, email, role }));
        }, 1000);
      }
    };
    window.addEventListener('message', handleGoogleMessage);
    return () => window.removeEventListener('message', handleGoogleMessage);
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onLoginSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const onRegisterSubmit = (data) => {
    dispatch(registerUser(data));
  };

  // Google Login flow
  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID' && window.google) {
      window.google.accounts.id.prompt();
    } else {
      // Fallback to high-fidelity mock popup
      const popupWidth = 500;
      const popupHeight = 650;
      const left = window.screen.width / 2 - popupWidth / 2;
      const top = window.screen.height / 2 - popupHeight / 2;
      
      window.open(
        '/google-mock-login.html',
        'GoogleLoginPopup',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );
    }
  };

  const handleGoogleRoleSelect = (selectedRole) => {
    setGoogleDialogOpen(false);
    if (googleUserData) {
      setIsSimulatingGoogle(true);
      setTimeout(() => {
        setIsSimulatingGoogle(false);
        dispatch(loginSuccess({
          name: googleUserData.name,
          email: googleUserData.email,
          role: selectedRole
        }));
      }, 1000);
    }
  };

  return (
    <AnimatedPage>
      <Box 
        sx={{ 
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          px: 2,
          py: 6
        }}
      >
        <Paper 
          elevation={0}
          className="glass-panel"
          sx={{ 
            width: '100%', 
            maxWidth: '450px', 
            borderRadius: 4, 
            boxShadow: 'none',
            overflow: 'hidden',
            p: 4
          }}
        >
          {/* Header Branding */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                bgcolor: 'text.primary', 
                color: 'background.default', 
                p: 1.2, 
                borderRadius: '8px', 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SchoolIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Academic Pathway
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to generate and view path metrics
            </Typography>
          </Box>

          {/* Form Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              mb: 4,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTabs-indicator': { bgcolor: 'text.primary', height: '1.5px' },
              '& .MuiTab-root': { fontWeight: 600, color: 'text.secondary', textTransform: 'none' },
              '& .MuiTab-root.Mui-selected': { color: 'text.primary' }
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          <AnimatePresence mode="wait">
            {activeTab === 0 ? (
              <motion.div
                key="login-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* LOGIN FORM */}
                <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Controller
                      name="email"
                      control={loginControl}
                      rules={{ required: 'Email is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={loading || isSimulatingGoogle}
                          placeholder="student@acdyon.com or admin@acdyon.com"
                        />
                      )}
                    />

                    <Controller
                      name="password"
                      control={loginControl}
                      rules={{ required: 'Password is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Password"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={loading || isSimulatingGoogle}
                          placeholder="password123"
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || isSimulatingGoogle}
                      sx={{ py: 1.5, fontWeight: 600, mt: 1 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                  </Box>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* REGISTER FORM */}
                <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Controller
                      name="name"
                      control={registerControl}
                      rules={{ required: 'Full name is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Full Name"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={loading || isSimulatingGoogle}
                        />
                      )}
                    />

                    <Controller
                      name="email"
                      control={registerControl}
                      rules={{ 
                        required: 'Email is required',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address' }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={loading || isSimulatingGoogle}
                        />
                      )}
                    />

                    <Controller
                      name="password"
                      control={registerControl}
                      rules={{ 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Password"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={loading || isSimulatingGoogle}
                        />
                      )}
                    />

                    <Controller
                      name="role"
                      control={registerControl}
                      rules={{ required: 'Role selection is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          select
                          label="Register As"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={loading || isSimulatingGoogle}
                        >
                          <MenuItem value="student">Student / Applicant</MenuItem>
                          <MenuItem value="admin">Academic Advisor / Admin</MenuItem>
                        </TextField>
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || isSimulatingGoogle}
                      sx={{ py: 1.5, fontWeight: 600, mt: 1 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
                    </Button>
                  </Box>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Or
            </Typography>
          </Divider>

          {/* Branded Google Sign-In Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleClick}
            disabled={loading || isSimulatingGoogle}
            startIcon={isSimulatingGoogle ? <CircularProgress size={18} color="inherit" /> : <GoogleIcon />}
            sx={{ 
              py: 1.5, 
              fontWeight: 600, 
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'text.primary',
                bgcolor: 'background.surface'
              }
            }}
          >
            {isSimulatingGoogle ? 'Signing in with Google...' : 'Continue with Google'}
          </Button>
        </Paper>
      </Box>

      {/* Google Sign-in Role Selection Dialog */}
      <Dialog 
        open={googleDialogOpen} 
        onClose={() => setGoogleDialogOpen(false)}
        PaperProps={{
          className: 'glass-panel',
          sx: { p: 2, borderRadius: 3, maxWidth: '380px' }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 800, pb: 1 }}>
          Google Authentication
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose your profile role to complete Google registration and sync your account metadata:
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1.5, p: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => handleGoogleRoleSelect('student')}
            sx={{ py: 1.2, fontWeight: 600 }}
          >
            Connect as Student
          </Button>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={() => handleGoogleRoleSelect('admin')}
            sx={{ py: 1.2, fontWeight: 600 }}
          >
            Connect as Advisor / Admin
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedPage>
  );
};

export default Login;
