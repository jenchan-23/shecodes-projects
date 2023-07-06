// 1.0 - FUNCTIONS SECTION
// 1.3 - Functions - Weather API
function setCityHeader(response) {
  let setCity = document.querySelector("#current-city");
  setCity.innerHTML = response.data.name;
}

function setTempData(response) {
  let currentDateTime = Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: "true",
    timeZoneName: "short",
  }).format(new Date());

  let lastUpdateWeatherDate = document.querySelector("#current-date");

  lastUpdateWeatherDate.innerHTML = currentDateTime;
  let todayTemp = document.querySelector("#today-temp");

  todayTemp.innerHTML = Math.round(response.data.main.temp, 1);

  let todayMinTemp = document.querySelector("#today-min-temp");
  todayMinTemp.innerHTML = Math.round(response.data.main.temp_min, 1);

  let todayMaxTemp = document.querySelector("#today-max-temp");
  todayMaxTemp.innerHTML = Math.round(response.data.main.temp_max, 1);

  let todayWeatherDesc = document.querySelector("#today-weather-desc");
  todayWeatherDesc.innerHTML = response.data.weather[0].description;

  let todayWindspeed = document.querySelector("#today-windspeed");
  todayWindspeed.innerHTML = `${Math.round(response.data.wind.speed, 1)} m/s`;

  let todayPressure = document.querySelector("#today-pressure");
  todayPressure.innerHTML = `${Math.round(response.data.main.pressure, 1)} hPa`;

  let todayFeelsLike = document.querySelector("#feels-like-temp");
  todayFeelsLike.innerHTML = `${Math.round(response.data.main.feels_like, 1)}`;

  let todayHumidity = document.querySelector("#today-humidity");
  todayHumidity.innerHTML = `${Math.round(response.data.main.humidity, 1)}%`;
}

function updateWeatherData(url) {
  axios.get(url).then(setCityHeader);
  axios.get(url).then(setTempData);
}

// 1.4 - Functions - Search City Form
function capitaliseFirstLetter(word) {
  let firstLetterInput = word.charAt(0);
  firstLetterInput = firstLetterInput.toUpperCase();
  word = firstLetterInput + word.slice(1);

  return word;
}

function changeCity(event) {
  event.preventDefault();
  let setLocation = document.querySelector("#city-name");
  setLocation = capitaliseFirstLetter(setLocation.value.toLowerCase().trim());

  let setLocationUrl = `https://api.shecodes.io/weather/v1/current?query=${setLocation}&key=${apiKey}&units=${defaultUnits}`;

  updateWeatherData(setLocationUrl);
}

// 1.5 - Functions - Current City Button
function changeCitybyCoords(position) {
  let setLocationUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=${defaultUnits}`;
  updateWeatherData(setLocationUrl);
}

function currCityButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(changeCitybyCoords);
}

// 2.0 - SCRIPT
// 2.1 - Script - Date and Time

// 2.2 - Script - Weather API
// 2.2.1 - Scipt - Default City/Units on load
let defaultLocation = "Melbourne";
let defaultUnits = "metric";
let apiKey = "18a0ed27t1bf3oc3ff7b86307c44ff70";
let locationUrl = `https://api.shecodes.io/weather/v1/current?query=${defaultLocation}&key=${apiKey}&units=${defaultUnits}`;
updateWeatherData(locationUrl);

/* let currentWeatherDesc = axios.get(cityUrl).then(weatherDescID);
console.log(currentWeatherDesc);
*/
// 2.3 - Script - Search City Form
let searchCityButton = document.querySelector("form");
searchCityButton.addEventListener("submit", changeCity);

// 2.4 - Script - Current City Button
let currentCityButton = document.querySelector("#current-location-button");
currentCityButton.addEventListener("click", currCityButton);
