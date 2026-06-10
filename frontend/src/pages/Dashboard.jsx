import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import StarIcon from '@mui/icons-material/Star';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

import AnimatedPage from '../components/Common/AnimatedPage';
import MetricCard from '../components/Cards/MetricCard';
import { fetchAnalytics } from '../features/analytics/analyticsSlice';
import { useThemeToggle } from '../hooks/useThemeToggle';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { mode } = useThemeToggle();
  const { 
    loading, 
    totalSubmissions, 
    recommendationCounts, 
    qualificationCounts, 
    monthlySubmissions, 
    error 
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading && totalSubmissions === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  // 1. Prepare Pie Chart Data (Recommendation Distribution)
  const pieData = Object.entries(recommendationCounts || {})
    .filter(([_, value]) => value > 0)
    .map(([key, value], index) => ({
      id: index,
      value: Number(value),
      label: key
    }));

  const hasPieData = pieData.length > 0;

  // 2. Prepare Bar Chart Data (Qualification Distribution)
  const barXAxis = Object.keys(qualificationCounts || {});
  const barSeries = Object.values(qualificationCounts || {}).map(Number);
  const hasBarData = barSeries.some(val => val > 0);

  // 3. Prepare Line Chart Data (Monthly Submissions)
  const lineXAxis = (monthlySubmissions || []).map(item => item.month);
  const lineSeries = (monthlySubmissions || []).map(item => Number(item.count));
  const hasLineData = lineSeries.some(val => val > 0);

  // Text color based on light/dark theme
  const chartTextColor = mode === 'light' ? '#000000' : '#ffffff';

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h2" sx={{ fontFamily: 'Outfit', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Cohort Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Real-time aggregate data on qualifications and pathway recommendations.
          </Typography>
        </Box>

        {/* Metrics Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard 
              title="Total Submissions" 
              value={totalSubmissions} 
              icon={AssignmentIcon} 
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard 
              title="PhD Pathways" 
              value={recommendationCounts['PhD'] || 0} 
              icon={SchoolIcon} 
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard 
              title="DBA Pathways" 
              value={recommendationCounts['DBA'] || 0} 
              icon={BusinessCenterIcon} 
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard 
              title="Honorary Doctorates" 
              value={recommendationCounts['Honorary Doctorate'] || 0} 
              icon={StarIcon} 
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard 
              title="Certifications" 
              value={recommendationCounts['Certification Program'] || 0} 
              icon={WorkspacePremiumIcon} 
              delay={0.4}
            />
          </Grid>
        </Grid>

        {/* Charts Grid */}
        <Grid container spacing={4}>
          {/* Pie Chart: Recommendation Distribution */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              className="glass-panel"
              sx={{ p: 4, borderRadius: 3, height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', mb: 2 }}>
                Pathway Distribution
              </Typography>
              {hasPieData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        innerRadius: 40,
                        outerRadius: 85,
                        paddingAngle: 3,
                        cornerRadius: 5,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        labelStyle: { fill: chartTextColor, fontSize: 11 },
                        direction: 'column',
                        position: { vertical: 'middle', horizontal: 'right' }
                      }
                    }}
                    height={260}
                    width={480}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                  <Typography color="text.secondary">No recommendation data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Bar Chart: Qualification Distribution */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              className="glass-panel"
              sx={{ p: 4, borderRadius: 3, height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', mb: 2 }}>
                Qualifications Distribution
              </Typography>
              {hasBarData ? (
                <Box sx={{ height: '85%' }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: barXAxis }]}
                    series={[{ data: barSeries, color: mode === 'light' ? '#18181b' : '#f4f4f5' }]}
                    height={280}
                    margin={{ left: 40, right: 20, top: 20, bottom: 40 }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                  <Typography color="text.secondary">No qualification data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Line Chart: Monthly Submissions Trend */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              className="glass-panel"
              sx={{ p: 4, borderRadius: 3, height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', mb: 2 }}>
                Submission Volume Trend
              </Typography>
              {hasLineData ? (
                <Box sx={{ height: '85%' }}>
                  <LineChart
                    xAxis={[{ scaleType: 'point', data: lineXAxis }]}
                    series={[{ 
                      data: lineSeries, 
                      color: mode === 'light' ? '#000000' : '#ffffff',
                      area: true
                    }]}
                    height={280}
                    margin={{ left: 40, right: 30, top: 20, bottom: 40 }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                  <Typography color="text.secondary">No historical trend data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default Dashboard;
