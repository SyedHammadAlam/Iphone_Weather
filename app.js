document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "0fcc0319f7f3be470eb965d93cc454b6";
    const defaultCity = "Paris";
  
    function fetchWeatherData(cityName) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
      fetch(weatherUrl)
        .then((response) => response.json())
        .then((weatherData) => {
          const latitude = weatherData.coord.lat;
          const longitude = weatherData.coord.lon;
  
          const city = weatherData.name;
          const tempInKelvin = weatherData.main.temp;
          const tempInCelsius = (tempInKelvin - 273.15).toFixed(0);
  
          const weatherDesc = weatherData.weather[0].description;
          const tempHigh = (weatherData.main.temp_max - 273.15).toFixed(0);
          const tempLow = (weatherData.main.temp_min - 273.15).toFixed(0);
  
          // Update the UI
          document.getElementById("location").querySelector("h1").textContent = city;
          document.getElementById("currentTemp").textContent = `${tempInCelsius}°C`;
          document.getElementById("weatherCondition").textContent = weatherDesc;
          document.getElementById("temperatureRange").textContent = `H: ${tempHigh}°C  L: ${tempLow}°C`;
  
          // Fetch hourly forecast data
          getHourlyForecast(latitude, longitude);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
    }
  
    function getHourlyForecast(lat, lon) {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      fetch(forecastUrl)
        .then((response) => response.json())
        .then((forecastData) => {
          const hourlyForecastContainer = document.getElementById("hourlyForecast");
          hourlyForecastContainer.innerHTML = "";
  
          forecastData.list.slice(0, 5).forEach((forecastItem, index) => {
            const forecastHourElement = document.createElement("div");
            forecastHourElement.className = "hourly-weather";
  
            const forecastTime = new Date(forecastItem.dt * 1000).getHours();
            const timeLabel = index === 0 ? "Now" : forecastTime > 12 ? `${forecastTime - 12} PM` : `${forecastTime} AM`;
  
            const forecastTemp = Math.round(forecastItem.main.temp);
            const forecastIconCode = forecastItem.weather[0]?.icon;
            const iconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}@2x.png`;
  
            forecastHourElement.innerHTML = `
              <h5>${timeLabel}</h5>
              <img src="${iconUrl}" alt="weather icon" />
              <p>${forecastTemp}°C</p>`;
            hourlyForecastContainer.appendChild(forecastHourElement);
          });
        })
        .catch((error) => console.error("Error fetching hourly forecast:", error));
    }
  
    // Call the function to fetch weather data
    fetchWeatherData(defaultCity);
  });
  