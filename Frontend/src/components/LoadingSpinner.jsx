// src/components/LoadingSpinner.js
import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgress, Box, Typography } from '@mui/material'; // NEW MUI IMPORTS

function LoadingSpinner() {
  return (
    // Use MUI Box for centering, motion.div for animation on the container
    <motion.div
      className="spinner-container" // Keep this for outer layout if needed
      animate={{ opacity: [0.5, 1, 0.5] }} // Example: fade in/out the container
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 4, mb: 4 // MUI spacing
        }}
      >
        <CircularProgress color="primary" size={60} thickness={5} /> {/* MUI Spinner */}
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Fetching weather data...
        </Typography>
      </Box>
    </motion.div>
  );
}

export default LoadingSpinner;