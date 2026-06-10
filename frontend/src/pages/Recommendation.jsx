import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ReplayIcon from '@mui/icons-material/Replay';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AnimatedPage from '../components/Common/AnimatedPage';
import PathwayForm from '../components/Form/PathwayForm';
import SkeletonLoader from '../components/Common/SkeletonLoader';
import { submitProfile, clearRecommendation } from '../features/recommendation/recommendationSlice';

export const Recommendation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const { loading, currentRecommendation, error } = useSelector((state) => state.recommendation);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFormSubmit = (formData) => {
    const processedData = {
      ...formData,
      experience: parseFloat(formData.experience)
    };
    dispatch(submitProfile(processedData));
  };

  const handleReset = () => {
    dispatch(clearRecommendation());
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader />
            </motion.div>
          ) : currentRecommendation ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Paper
                elevation={0}
                className="glass-panel"
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'none'
                }}
              >
                {/* Large Background Decorative Icon */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    right: -20, 
                    bottom: -20, 
                    opacity: 0.03, 
                    color: 'text.primary',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 260 }} />
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing="0.1em">
                    Your Academic Pathway Match
                  </Typography>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontFamily: 'Outfit', 
                      fontWeight: 900, 
                      letterSpacing: '-0.04em',
                      mt: 1, 
                      mb: 4,
                      color: 'text.primary'
                    }}
                  >
                    {currentRecommendation.recommendation}
                  </Typography>

                  {/* Reasoning Card */}
                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      bgcolor: 'background.surface', 
                      border: '1px solid',
                      borderColor: 'divider',
                      mb: 5 
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7, 
                        fontWeight: 400,
                        color: 'text.primary',
                        whiteSpace: 'pre-line' 
                      }}
                    >
                      {currentRecommendation.reason}
                    </Typography>
                  </Box>

                  {/* Personalized Action Roadmap Timeline */}
                  {currentRecommendation.nextSteps && currentRecommendation.nextSteps.length > 0 && (
                    <Box sx={{ mb: 5 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 800, 
                          fontFamily: 'Outfit', 
                          mb: 3, 
                          letterSpacing: '-0.02em',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1 
                        }}
                      >
                        Actionable Next Steps
                      </Typography>
                      
                      <Box sx={{ pl: 3, borderLeft: '2px solid', borderColor: 'divider', position: 'relative', ml: 1 }}>
                        {currentRecommendation.nextSteps.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + idx * 0.15, ease: 'easeOut' }}
                            style={{ position: 'relative', marginBottom: '24px' }}
                          >
                            {/* Bullet Dot */}
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                left: '-31px', 
                                top: '4px', 
                                width: '12px', 
                                height: '12px', 
                                borderRadius: '50%', 
                                bgcolor: 'text.primary',
                                border: '2px solid',
                                borderColor: 'background.default'
                              }} 
                            />
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.08em', 
                                fontSize: '0.65rem', 
                                fontWeight: 700 
                              }}
                            >
                              Step 0{idx + 1}
                            </Typography>
                            <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary', mt: 0.5 }}>
                              {step}
                            </Typography>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Profile Summary */}
                  <Box sx={{ mb: 5, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', mb: 2 }}>
                      Analyzed Profile Summary
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Name</Typography>
                        <Typography variant="body2" fontWeight={600}>{currentRecommendation.fullName}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Qualification</Typography>
                        <Typography variant="body2" fontWeight={600}>{currentRecommendation.qualification}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Experience</Typography>
                        <Typography variant="body2" fontWeight={600}>{currentRecommendation.experience} years</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Profession</Typography>
                        <Typography variant="body2" fontWeight={600}>{currentRecommendation.profession}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReset}
                      startIcon={<ReplayIcon />}
                      sx={{ py: 1.5, px: 3, fontWeight: 600 }}
                    >
                      Analyze Another Profile
                    </Button>
                    
                    {role === 'admin' && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/dashboard')}
                        startIcon={<DashboardIcon />}
                        sx={{ py: 1.5, px: 3, fontWeight: 600 }}
                      >
                        View Admin Dashboard
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PathwayForm onSubmit={handleFormSubmit} isLoading={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </AnimatedPage>
  );
};

export default Recommendation;
