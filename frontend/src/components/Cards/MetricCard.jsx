import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import CountUp from '../Common/CountUp';

export const MetricCard = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Card 
        className="glow-card"
        sx={{ 
          height: '100%', 
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            {Icon && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 1, 
                  borderRadius: '6px',
                  bgcolor: 'background.surface',
                  color: 'text.primary'
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </Box>
            )}
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontFamily: 'Outfit',
              letterSpacing: '-0.03em',
              color: 'text.primary'
            }}
          >
            <CountUp to={value} />
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
