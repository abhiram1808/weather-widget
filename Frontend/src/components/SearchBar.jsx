import React, { useState, useEffect } from 'react'; // ADD useEffect
import { Box, TextField, Button } from '@mui/material';

function SearchBar({ onSearchCity, onUseMyLocation, initialCity }) {
  const [cityInput, setCityInput] = useState(initialCity || '');

  // NEW: Update cityInput if initialCity changes from parent (e.g., when localStorage loads it)
  useEffect(() => {
    setCityInput(initialCity || '');
  }, [initialCity]); // Re-run effect when initialCity prop changes

  const handleCityChange = (event) => {
    setCityInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (cityInput.trim()) {
      onSearchCity(cityInput.trim());
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center', mb: 2 }}>
        <TextField
          label="Enter city name"
          variant="outlined"
          value={cityInput}
          onChange={handleCityChange}
          sx={{ width: { xs: '70%', sm: '250px' } }}
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ px: 3 }}
        >
          Search
        </Button>
      </Box>
      <Button
        onClick={onUseMyLocation}
        variant="contained"
        color="success"
        sx={{ width: { xs: '100%', sm: '320px' } }}
      >
        Use My Location
      </Button>
    </Box>
  );
}

export default SearchBar;