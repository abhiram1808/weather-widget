import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import LoadingSpinner from './components/LoadingSpinner';

import {
  Box,
  Typography,
  CssBaseline,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, blueGrey, amber, lightBlue } from '@mui/material/colors';

const API_KEY = '5cc9567b308728c4c5195face5a3d5ec';

const customTheme = createTheme({
  palette: {
    primary: {
      main: lightBlue[700],
    },
    secondary: {
      main: amber[500],
    },
    error: {
      main: red[500],
    },
    background: {
      default: blueGrey[50],
      paper: '#ffffff',
    },
    text: {
      primary: blueGrey[900],
      secondary: blueGrey[700],
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem' },
    h4: { fontSize: '2rem' },
    h5: { fontSize: '1.5rem' },
    h6: { fontSize: '1.2rem' },
    body1: { fontSize: '1rem' },
    subtitle1: { fontSize: '1rem' },
    caption: { fontSize: '0.8rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px !important',
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.08)',
        }
      }
    }
  }
});

function App() {
  // NEW: Initialize city from localStorage or default to empty string
  const [city, setCity] = useState(() => {
    const savedCity = localStorage.getItem('weatherAppCity');
    return savedCity ? savedCity : '';
  });

  // NEW: Initialize units from localStorage or default to 'metric'
  const [units, setUnits] = useState(() => {
    const savedUnits = localStorage.getItem('weatherAppUnits');
    return savedUnits ? savedUnits : 'metric';
  });

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  
  const [isGeolocationMode, setIsGeolocationMode] = useState(() => {
    // NEW: Initialize geolocation mode based on whether a city was saved
    const savedCity = localStorage.getItem('weatherAppCity');
    return !savedCity; // If no saved city, default to geolocation mode
  });
  const [initialLoad, setInitialLoad] = useState(true);

  // NEW useEffect to save city to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weatherAppCity', city);
  }, [city]);

  // NEW useEffect to save units to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weatherAppUnits', units);
  }, [units]);

  // Effect for initial geolocation fetch or city search on initial load/mode change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setWeatherData(null);
      setForecastData(null);
      setError(null);

      let currentWeatherUrl = '';
      let forecastUrl = '';

      if (isGeolocationMode) {
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser. Please use a modern browser.");
          setLoading(false);
          setInitialLoad(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setCoords({ latitude: lat, longitude: lon });
            setError(null);
            setInitialLoad(false);

            currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

            await Promise.all([
              fetchWeatherFromUrl(currentWeatherUrl),
              fetchForecastFromUrl(forecastUrl)
            ]);
            setLoading(false);
          },
          (geoError) => {
            let geoErrorMessage = "Location permission denied. Please allow access to see the weather.";
            if (geoError.code === geoError.PERMISSION_DENIED) {
              geoErrorMessage = "Location permission denied. Please allow access to see the weather.";
            } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
              geoErrorMessage = "Location information is unavailable. Please check your device settings.";
            } else if (geoError.code === geoError.TIMEOUT) {
              geoErrorMessage = "Getting your location timed out. Please try again.";
            }
            setError(geoErrorMessage);
            setLoading(false);
            setInitialLoad(false);
            console.error("Geolocation error:", geoError);
          },
          { timeout: 10000 }
        );
      } else {
        if (city) {
          currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;
          forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`;
          
          await Promise.all([
            fetchWeatherFromUrl(currentWeatherUrl),
            fetchForecastFromUrl(forecastUrl)
          ]);
          setLoading(false);
        } else {
          setLoading(false);
        }
        setInitialLoad(false);
      }
    };

    fetchData();
  }, [isGeolocationMode, city, units]);

  const fetchWeatherFromUrl = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `Failed to fetch current weather: HTTP status ${response.status}.`;
        switch (response.status) {
          case 400: errorMessage = "Bad request. Please check the city name."; break;
          case 401: errorMessage = "Authentication error. Please check your OpenWeatherMap API key. It might be invalid or not yet active."; break;
          case 404: errorMessage = "City not found. Please check the spelling or try a different city."; break;
          case 429: errorMessage = "Too many requests. You have exceeded the API call limit. Please wait and try again later."; break;
          case 500: case 502: case 503: case 504:
            errorMessage = "Server error. OpenWeatherMap's servers are experiencing issues. Please try again later."; break;
          default: errorMessage = `An unexpected error occurred (Status: ${response.status}). ${errorData.message || ''}`; break;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching current weather data:", err);
      setError(err.message);
      setWeatherData(null);
    }
  };

  const fetchForecastFromUrl = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `Failed to fetch forecast: HTTP status ${response.status}.`;
        switch (response.status) {
          case 400: errorMessage = "Bad request for forecast. Please check the city name."; break;
          case 401: errorMessage = "Authentication error. Please check your OpenWeatherMap API key."; break;
          case 404: errorMessage = "Forecast not found for this city. This is unusual."; break;
          case 429: errorMessage = "Too many requests for forecast. Please wait."; break;
          default: errorMessage = `An unexpected forecast error occurred (Status: ${response.status}). ${errorData.message || ''}`; break;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      const processedForecast = processForecastData(data.list);
      setForecastData(processedForecast);
    } catch (err) {
      console.error("Error fetching forecast data:", err);
      if (!error) {
        setError(err.message);
      }
      setForecastData(null);
    }
  };

  const processForecastData = (list) => {
    const dailyData = {};
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          timestamp: item.dt,
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          weather: {},
          icon: item.weather[0].icon,
          description: item.weather[0].description
        };
      } else {
        dailyData[dayKey].minTemp = Math.min(dailyData[dayKey].minTemp, item.main.temp_min);
        dailyData[dayKey].maxTemp = Math.max(dailyData[dayKey].maxTemp, item.main.temp_max);
      }
      const weatherId = item.weather[0].id;
      if (!dailyData[dayKey].weather[weatherId]) {
          dailyData[dayKey].weather[weatherId] = {
              count: 0,
              icon: item.weather[0].icon,
              description: item.weather[0].description
          };
      }
      dailyData[dayKey].weather[weatherId].count++;
    });
    const forecastArray = Object.values(dailyData).map(day => {
        let mostFrequentWeather = null;
        let maxCount = 0;
        for (const id in day.weather) {
            if (day.weather[id].count > maxCount) {
                maxCount = day.weather[id].count;
                mostFrequentWeather = day.weather[id];
            }
        }
        if (mostFrequentWeather) {
            day.icon = mostFrequentWeather.icon;
            day.description = mostFrequentWeather.description;
        }
        return day;
    });
    forecastArray.sort((a, b) => a.timestamp - b.timestamp);
    return forecastArray.slice(0, 5);
  };

  // Modified handleSearchCity to update isGeolocationMode
  const handleSearchCity = (cityValue) => {
    setCity(cityValue);
    setIsGeolocationMode(false); // When city is searched, switch to city mode
    setCoords(null);
  };

  // Modified handleUseMyLocation to update isGeolocationMode and clear city
  const handleUseMyLocation = () => {
    setIsGeolocationMode(true); // When using geolocation, switch to geo mode
    setCity(''); // Clear city when using geolocation
    setWeatherData(null);
    setForecastData(null);
    setCoords(null);
    setLoading(true);
    setError(null);
  };

  const handleUnitsChange = (event, newUnits) => {
    if (newUnits !== null) {
      setUnits(newUnits);
    }
  };
  
  let initialDisplayMessage = null;
  if (initialLoad) {
      initialDisplayMessage = "Enter a city name or use your location to see the weather.";
  } else if (!loading && !error && !weatherData && !forecastData) {
      initialDisplayMessage = "No weather data available. Please try again with a different city or location.";
  }

  const unitSymbol = units === 'metric' ? '°C' : '°F';

  return (
     <ThemeProvider theme={customTheme}>
      <CssBaseline />
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 4, sm: 6, md: 8 },
          minHeight: '100vh',
          boxSizing: 'border-box',
          px: { xs: 2, sm: 3, md: 4 },
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: 3,
            p: { xs: 3, sm: 4, md: 5 },
            textAlign: 'center',
            // --- MODIFIED WIDTH PROPERTIES HERE ---
            maxWidth: { xs: '95%', sm: '600px', md: '800px', lg: '1000px' }, // Increased max-width for wider layout
            width: '100%', // Ensures it always takes 100% of available space up to maxWidth
            // --- END MODIFIED WIDTH PROPERTIES ---
            mt: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Weather Viewer
          </Typography>
          
          <SearchBar 
            onSearchCity={handleSearchCity} 
            onUseMyLocation={handleUseMyLocation} 
            initialCity={city} // Pass initialCity to SearchBar for pre-filling
          />

          <ToggleButtonGroup
            value={units}
            exclusive
            onChange={handleUnitsChange}
            aria-label="text alignment"
            sx={{ mt: 3, mb: 3 }}
          >
            <ToggleButton value="metric" aria-label="celsius">
              °C
            </ToggleButton>
            <ToggleButton value="imperial" aria-label="fahrenheit">
              °F
            </ToggleButton>
          </ToggleButtonGroup>

          {loading && <LoadingSpinner />} 
          
          {error && (
            <Typography variant="body1" color="error" sx={{ fontWeight: 'bold', mt: 2 }}>
              {error}
            </Typography>
          )}
          {!loading && !error && !weatherData && !forecastData && initialDisplayMessage && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {initialDisplayMessage}
            </Typography>
          )}

          {weatherData && !loading && !error && (
            <WeatherDisplay weatherData={weatherData} unitSymbol={unitSymbol} />
          )}

          {forecastData && !loading && !error && (
            <ForecastDisplay forecastData={forecastData} unitSymbol={unitSymbol} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;