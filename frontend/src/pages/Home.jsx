import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/Common/AnimatedPage';

const features = [
  {
    title: 'Smart Recommendations',
    description: 'Advanced classification logic analyzing academic backgrounds, professional roles, and goals.',
    icon: AutoAwesomeIcon
  },
  {
    title: 'Academic Guidance',
    description: 'Aligns your credentials with postgraduate goals, whether research-focused or professional.',
    icon: SchoolIcon
  },
  {
    title: 'Career Alignment',
    description: 'Assesses transition readiness, management skills, and research capabilities to guide your next move.',
    icon: TrendingUpIcon
  },
  {
    title: 'Analytics Driven',
    description: 'Empowers university advisors with visual metrics to monitor cohort qualification trends.',
    icon: AssessmentIcon
  }
];

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <AnimatedPage>
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 8, md: 12 }, pb: 8 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontFamily: 'Outfit',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  letterSpacing: '-0.05em',
                  lineHeight: 1.1,
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Academic Pathway <br />
                Recommendation Engine
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography 
                variant="h5" 
                color="text.secondary"
                sx={{ 
                  maxWidth: '700px', 
                  mx: 'auto', 
                  mb: 5, 
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6
                }}
              >
                Discover the most suitable academic pathway based on your education, experience, and professional goals. Built for elite university consulting and career advisors.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' }, px: 3 }}>
                {!isAuthenticated ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate('/login')}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ py: 1.8, px: 4, fontSize: '1rem', fontWeight: 600 }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                      sx={{ py: 1.8, px: 4, fontSize: '1rem', fontWeight: 600 }}
                    >
                      Learn Features
                    </Button>
                  </>
                ) : user?.role === 'admin' ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate('/dashboard')}
                      endIcon={<DashboardIcon />}
                      sx={{ py: 1.8, px: 4, fontSize: '1rem', fontWeight: 600 }}
                    >
                      View Dashboard
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate('/submissions')}
                      endIcon={<StorageIcon />}
                      sx={{ py: 1.8, px: 4, fontSize: '1rem', fontWeight: 600 }}
                    >
                      Submissions Archive
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/recommendation')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ py: 1.8, px: 4, fontSize: '1rem', fontWeight: 600 }}
                  >
                    Get Recommendation
                  </Button>
                )}
              </Box>
            </motion.div>
          </Box>

          {/* Features Grid Section */}
          <Box id="features" sx={{ mb: { xs: 8, md: 12 } }}>
            <Typography 
              variant="h3" 
              align="center"
              sx={{ 
                fontFamily: 'Outfit', 
                fontWeight: 800, 
                letterSpacing: '-0.03em',
                mb: 6 
              }}
            >
              Engine Features
            </Typography>

            <Grid container spacing={4}>
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Grid item xs={12} sm={6} md={3} key={item.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 4, 
                          height: '240px', 
                          display: 'flex', 
                          flexDirection: 'column',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.default',
                          transition: 'border-color 0.2s ease',
                          '&:hover': {
                            borderColor: 'text.primary',
                          }
                        }}
                      >
                        <Box sx={{ color: 'text.primary', mb: 2 }}>
                          <Icon sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', lineHeight: 1.5 }}>
                          {item.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Benefits Section */}
          <Paper 
            elevation={0}
            className="glass-panel"
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4,
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
                  How Pathway Recommendations are Generated
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Our algorithm processes educational credentials and professional tenure against standardized academic frameworks:
                </Typography>
                <Box sx={{ pl: { xs: 0, md: 2 }, textAlign: 'left' }}>
                  <Typography variant="body2" color="text.primary" sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                    <strong>• Executive Leadership:</strong> Profiles with over 15 years of industry stewardship are aligned with Honorary Doctorates.
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                    <strong>• Corporate Management:</strong> Mid-career professionals seeking organizational strategies are mapped to DBA pathways.
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                    <strong>• Academic Research:</strong> Candidates focusing on scientific methodology are directed to Doctor of Philosophy (PhD) routes.
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ display: 'flex', gap: 1 }}>
                    <strong>• Career Development:</strong> Junior professionals and students receive agile Certification suggestions.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box 
                  sx={{ 
                    p: 4, 
                    border: '1px dashed', 
                    borderColor: 'text.secondary', 
                    borderRadius: 3,
                    textAlign: 'center',
                    maxWidth: '300px'
                  }}
                >
                  <Typography variant="h2" sx={{ fontFamily: 'Outfit', fontWeight: 900, mb: 1 }}>
                    Grok
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    AI Analysis Engine Enabled
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default Home;
