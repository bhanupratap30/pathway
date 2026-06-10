import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';

const loadingTexts = [
  'Parsing qualification credentials...',
  'Analyzing years of experience and domain expertise...',
  'Evaluating career goals against industry pathways...',
  'Consulting heuristic pathway matrix...',
  'Generating personalized advisory report...'
];

export const SkeletonLoader = () => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 100;
        const diff = Math.random() * 8 + 4;
        return Math.min(oldProgress + diff, 98); // hold at 98 until complete
      });
    }, 250);

    // Rotate loading text
    const textTimer = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 1500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <Box 
      sx={{ 
        maxWidth: 700, 
        mx: 'auto', 
        my: 6, 
        px: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px'
      }}
    >
      <Paper 
        elevation={0} 
        className="glass-panel"
        sx={{ 
          p: 5, 
          width: '100%', 
          borderRadius: 3, 
          textAlign: 'center',
          boxShadow: 'none'
        }}
      >
        {/* Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            mb: 1, 
            fontFamily: 'Outfit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          Analyzing Your Academic Profile
          <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
                style={{ fontSize: '1.2rem', lineHeight: 1 }}
              >
                .
              </motion.span>
            ))}
          </Box>
        </Typography>

        {/* Rotating sub-text */}
        <Box sx={{ height: 24, mb: 4 }}>
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {loadingTexts[textIndex]}
            </Typography>
          </motion.div>
        </Box>

        {/* Custom Progress Bar */}
        <Box sx={{ width: '100%', mb: 6 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 4, 
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.mode === 'light' ? '#f4f4f5' : '#18181b',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'text.primary',
                borderRadius: 2
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {Math.round(progress)}% Complete
          </Typography>
        </Box>

        {/* Shimmer Skeletons representing Pathway Results */}
        <Box sx={{ textAlign: 'left' }}>
          <Box className="shimmer" sx={{ height: 16, width: '40%', mb: 2, borderRadius: 1 }} />
          <Box className="shimmer" sx={{ height: 36, width: '70%', mb: 4, borderRadius: 1 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box className="shimmer" sx={{ height: 60, borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className="shimmer" sx={{ height: 60, borderRadius: 2 }} />
            </Grid>
          </Grid>
          <Box className="shimmer" sx={{ height: 14, width: '100%', mb: 1, borderRadius: 0.5 }} />
          <Box className="shimmer" sx={{ height: 14, width: '95%', mb: 1, borderRadius: 0.5 }} />
          <Box className="shimmer" sx={{ height: 14, width: '85%', mb: 1, borderRadius: 0.5 }} />
        </Box>
      </Paper>
    </Box>
  );
};

export default SkeletonLoader;
