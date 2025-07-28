import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material'; // NEW IMPORTS

function ForecastDisplay({ forecastData, unitSymbol }) {
  if (!forecastData || forecastData.length === 0) {
    return null;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
      <Typography variant="h5" component="h3" sx={{ color: 'text.primary', mb: 3, fontWeight: 'semibold' }}>
        5-Day Forecast
      </Typography>
      <Grid container spacing={2} justifyContent="center"> {/* MUI Grid for responsive layout */}
        {forecastData.map((day, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={index}> {/* Responsive sizing */}
            <Card sx={{ bgcolor: 'background.default', border: '1px solid #f0f0f0', borderRadius: '8px', boxShadow: 1 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}> {/* Override default padding */}
                <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1, fontWeight: 'medium' }}>
                  {formatDate(day.timestamp)}
                </Typography>
                <img
                  src={`http://openweathermap.org/img/w/${day.icon}.png`}
                  alt={day.description}
                  style={{ width: 56, height: 56, margin: '0 auto', display: 'block', marginBottom: 4 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                  {Math.round(day.minTemp)}{unitSymbol} / {Math.round(day.maxTemp)}{unitSymbol}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {day.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ForecastDisplay;