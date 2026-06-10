import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

const qualifications = [
  'High School',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'MBA',
  'PhD',
  'Other'
];

export const PathwayForm = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      qualification: '',
      experience: '',
      profession: '',
      careerGoal: ''
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Paper 
        elevation={0}
        className="glass-panel"
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 3,
          boxShadow: 'none'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
          Academic Profile Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Fill in your details below. Our recommendation engine will process your qualifications and goals.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="fullName"
                control={control}
                rules={{ 
                  required: 'Full name is required', 
                  minLength: { value: 3, message: 'Name must be at least 3 characters' } 
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    disabled={isLoading}
                    InputProps={{ className: 'focus-glow' }}
                  />
                )}
              />
            </Grid>

            {/* Email Address */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required', 
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address' } 
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    fullWidth
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isLoading}
                    InputProps={{ className: 'focus-glow' }}
                  />
                )}
              />
            </Grid>

            {/* Qualification Dropdown */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="qualification"
                control={control}
                rules={{ required: 'Highest qualification is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Highest Qualification"
                    fullWidth
                    variant="outlined"
                    error={!!errors.qualification}
                    helperText={errors.qualification?.message}
                    disabled={isLoading}
                    InputProps={{ className: 'focus-glow' }}
                  >
                    {qualifications.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Years of Experience */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="experience"
                control={control}
                rules={{ 
                  required: 'Years of experience is required',
                  min: { value: 0, message: 'Experience cannot be negative' },
                  max: { value: 50, message: 'Experience cannot exceed 50 years' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Years of Experience"
                    fullWidth
                    variant="outlined"
                    error={!!errors.experience}
                    helperText={errors.experience?.message}
                    disabled={isLoading}
                    InputProps={{
                      className: 'focus-glow',
                      endAdornment: <InputAdornment position="end">years</InputAdornment>,
                      inputProps: { min: 0, max: 50, step: 'any' }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Current Profession */}
            <Grid item xs={12}>
              <Controller
                name="profession"
                control={control}
                rules={{ required: 'Current profession is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Profession / Role"
                    fullWidth
                    variant="outlined"
                    error={!!errors.profession}
                    helperText={errors.profession?.message}
                    disabled={isLoading}
                    InputProps={{ className: 'focus-glow' }}
                    placeholder="e.g. Student, Software Engineer, Project Manager, Accountant"
                  />
                )}
              />
            </Grid>

            {/* Career Goal */}
            <Grid item xs={12}>
              <Controller
                name="careerGoal"
                control={control}
                rules={{ 
                  required: 'Career goal description is required',
                  minLength: { value: 10, message: 'Please describe your career goal in at least 10 characters' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="What is your main career or professional goal?"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    error={!!errors.careerGoal}
                    helperText={errors.careerGoal?.message}
                    disabled={isLoading}
                    InputProps={{ className: 'focus-glow' }}
                    placeholder="Describe your research aspirations, management goals, or career transition details here..."
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ 
                py: 1.5, 
                px: 4, 
                fontSize: '0.95rem',
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Get Recommendation
            </Button>
          </Box>
        </form>
      </Paper>
    </motion.div>
  );
};

export default PathwayForm;
