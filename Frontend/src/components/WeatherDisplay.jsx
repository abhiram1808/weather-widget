import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material'; // NEW IMPORTS

function WeatherDisplay({ weatherData, unitSymbol }) {
  if (!weatherData) {
    return null;
  }

  return (
    <Card sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ color: 'primary.main', mb: 2, fontWeight: 'semibold' }}>
          {weatherData.name}
        </Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
          {weatherData.main.temp}{unitSymbol}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
            style={{ width: 64, height: 64, marginRight: 8 }}
          />
          <Typography variant="h6" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {weatherData.weather[0].description}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          Humidity: {weatherData.main.humidity}%
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Wind Speed: {weatherData.wind.speed} m/s
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WeatherDisplay;