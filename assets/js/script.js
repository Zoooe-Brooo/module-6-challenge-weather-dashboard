const searchFormEl = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-button');
const searchHistoryEl = document.getElementById('search-history');
const currentWeatherEl = document.getElementById('current-weather');
const currentCity = document.getElementById('current-city');
const currentTemp = document.getElementById('current-temp');
const currentWind = document.getElementById('current-wind');
const currentHumidity = document.getElementById('current-humidity');
const forecastHeader = document.getElementById('forecast-header');
const forecastContainer = document.getElementById('forecast');

let searchHistoryList = JSON.parse(localStorage.getItem('search-history-list')) || [];

function searchCity(event) {
  event.preventDefault();
  
  const city = cityInput.value.trim();

  if (city && !searchHistoryList.includes(city)) {
    fetchWeather(city);
    saveToLocalStorage(city);
    renderSearchHistory();
  } else if (city) {
    fetchWeather(city);
  }
}

function fetchWeather(city) {
  const APIKey = "679aec2d75b9281a253c0028e5cf4db8";
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  
  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
  
    .then(function (weatherData) {
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;

      fetchForcast(lat, lon);
      displayWeather(weatherData);
      })
        
    .catch(function (error) {
      console.error(error);
      alert(`No weather data found for ${city}!`);
    });
}

function fetchForcast(lat, lon) {
  const APIKey = "679aec2d75b9281a253c0028e5cf4db8";
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  fetch(forecastURL)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
    })
  
  .then(function (forecastData) {
    if (!forecastData) {
      alert(`No weather forecast data found!`);
    } else {
      forecastContainer.innerHTML = '';
            
      let index = [7, 15, 23, 31, 39]
      for (let i = 0; i < index.length; i++) {
        let forecastIndex = index[i];
        displayForecast(forecastData.list[forecastIndex]);
      }

      forecastHeader.classList.remove('hidden');
    }
  })
        
  .catch(function (error) {
    console.error(error);
  });
}

function displayWeather(data) {
  const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentCity.innerHTML = `${data.name} (${new Date(data.dt * 1000).toLocaleDateString()}) <img src="${iconURL}" alt="Weather icon">`;
  const tempCelsius = (data.main.temp - 273.15).toFixed(2);
  currentTemp.textContent = `Temp: ${tempCelsius} °C`;
  currentWind.textContent = `Wind: ${data.wind.speed} MPH`;
  currentHumidity.textContent = `Humidity: ${data.main.humidity} %`;

  currentWeatherEl.classList.remove('hidden');
}

function displayForecast(forecast) {
  const forecastElement = document.createElement('div');
  forecastElement.classList.add('forecast-card');

  const dateEl = document.createElement('h4');
  dateEl.textContent = new Date(forecast.dt * 1000).toLocaleDateString();

  const iconURL = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
  const iconEl = document.createElement('img');
  iconEl.src = iconURL;
  iconEl.alt = "Weather icon";

  const tempEl = document.createElement('p');
  const tempCelsius = (forecast.main.temp - 273.15).toFixed(2);
  tempEl.textContent = `Temp: ${tempCelsius} °C`;

  const windEl = document.createElement('p');
  windEl.textContent = `Wind: ${forecast.wind.speed} MPH`;

  const humidityEl = document.createElement('p');
  humidityEl.textContent = `Humidity: ${forecast.main.humidity} %`;

  forecastElement.append(dateEl, iconEl, tempEl, windEl, humidityEl);
  forecastContainer.append(forecastElement);
}

function saveToLocalStorage(city) {
  searchHistoryList.push(city);
  localStorage.setItem('search-history-list', JSON.stringify(searchHistoryList));
}

function renderSearchHistory() {
  searchHistoryEl.innerHTML = ''; 

  searchHistoryList.forEach(city => {
    const historyButton = document.createElement('button');
    historyButton.textContent = city;
    historyButton.classList.add('history-button');
    historyButton.addEventListener('click', () => {
      fetchWeather(city);
    });
    searchHistoryEl.appendChild(historyButton);
  });
}

renderSearchHistory();

searchFormEl.addEventListener('submit', searchCity);
