Weather Viewer App
A modern, responsive weather application built with React that displays current weather conditions and a 5-day forecast for any city, or your current location using geolocation. The app features a clean Material-UI design, dynamic loading animations, and persistent user settings.

✨ Features
Current Weather Display: Shows temperature, weather description, humidity, and wind speed.

5-Day Forecast: Provides a simplified daily forecast with min/max temperatures and primary weather conditions.

Geolocation Support: Automatically fetches weather for the user's current location (requires browser permission).

City Search: Allows users to manually search for weather data by city name.

Units Toggle: Switch between Celsius (°C) and Fahrenheit (°F) for temperature display.

Persistent Settings: Remembers the last searched city and preferred temperature unit using localStorage.

Responsive Design: Adapts gracefully to various screen sizes (mobile, tablet, desktop) using Material-UI's responsive utilities.

Robust Error Handling: Provides specific and user-friendly messages for API errors, geolocation issues, and network problems.

Dynamic Loading Spinner: Features a smooth, animated loading spinner powered by Framer Motion.

Custom Theming: Utilizes Material-UI's theming capabilities for consistent branding and styling.

Static Background Image: A visually appealing static background image to enhance the user interface.

🚀 Technologies Used
React.js: Frontend JavaScript library for building user interfaces.

Material-UI (MUI): A comprehensive React UI framework implementing Google's Material Design.

Framer Motion: A production-ready motion library for React.

OpenWeatherMap API: For fetching current weather and forecast data.

localStorage: For client-side data persistence (user preferences).

web-vitals: For measuring and reporting on real user performance metrics.

⚙️ Setup and Installation
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm or Yarn

Steps
Clone the repository (if applicable) or create a new React app:

npx create-react-app weather-widget
cd weather-widget

Install dependencies:

npm install @mui/material @emotion/react @emotion/styled framer-motion @fontsource/roboto web-vitals
# or
yarn add @mui/material @emotion/react @emotion/styled framer-motion @fontsource/roboto web-vitals

🔑 API Keys
This application relies on external APIs. You must obtain your own API keys and configure them in the project.

OpenWeatherMap API Key:

Go to OpenWeatherMap API.

Sign up for a free account.

Find your API key in your account settings.

Open src/App.js and replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual key:

const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

Unsplash Access Key (Optional - Dynamic Backgrounds):

Note: As of the last update, the dynamic background feature using Unsplash is currently disabled/reverted to static due to Unsplash API review times. If you wish to re-enable it in the future, you will need an Unsplash Access Key.

Go to Unsplash Developers.

Create an account and a new application to get your Access Key.

If you re-enable the dynamic background code, you would place your key here (currently commented out):

// const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

▶️ Running the Application
After installing dependencies and configuring API keys:

npm start
# or
yarn start

This will open the application in your browser, usually at http://localhost:3000.

🖥️ Usage
Initial Load: The app will attempt to get your geolocation and display weather for your current location. You may be prompted by your browser to allow location access.

Search by City: Type a city name into the input field and click "Search Weather" or press Enter.

Use My Location: Click the "Use My Location" button to switch back to geolocation-based weather.

Toggle Units: Click the "°C" or "°F" buttons to switch between Celsius and Fahrenheit. Your preference will be saved for future visits.

📂 Project Structure
weather-widget/
├── public/
│   ├── index.html           # Main HTML file
│   └── ...                  # Other static assets
├── src/
│   ├── App.js               # Main application component, state management, API calls, theming
│   ├── App.css              # (Empty/Deleted) All component styles moved to MUI
│   ├── index.js             # React app entry point, global imports
│   ├── index.css            # Global CSS (body background, font imports)
│   ├── reportWebVitals.js   # Performance reporting setup
│   ├── components/
│   │   ├── SearchBar.js     # Input field and buttons for city search/geolocation
│   │   ├── WeatherDisplay.js# Displays current weather data
│   │   ├── ForecastDisplay.js# Displays 5-day weather forecast
│   │   └── LoadingSpinner.js# Animated loading indicator
│   └── ...                  # Other default create-react-app files
├── package.json             # Project dependencies and scripts
├── README.md                # This file
└── ...                      # Other config files (e.g., .gitignore)

💡 Future Enhancements (Optional)
Light/Dark Mode Toggle: Implement a dynamic theme switcher for light and dark modes.

More Weather Details: Display additional weather parameters (e.g., pressure, sunrise/sunset times).

Search History: Store a list of recently searched cities.

Error Boundaries: Implement React Error Boundaries for more graceful error handling in component trees.

Improved Forecast UI: More detailed daily breakdowns or hourly forecasts.

Unit Conversion for Wind Speed: Currently only temperature unit changes, but wind speed also changes based on metric/imperial. Could explicitly label units for wind.

Dynamic Background Images (Re-enable): Once your Unsplash API key is approved, re-integrate the dynamic background image fetching based on city.

Weather Icons: Replace OpenWeatherMap's default icons with custom SVG icons or a weather icon library for a more cohesive look.
