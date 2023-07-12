// 1.0 - FUNCTIONS SECTION
// 1.1 - Functions - Weather API
function setCityHeader(response) {
  let setCity = document.querySelector("#current-city");
  setCity.innerHTML = `${response.data.city}`;
}

function setWeatherData(response) {
  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = `${Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date())}`;

  let currentWeatherIcon = document.querySelector("#today-weather-icon");
  currentWeatherIcon.innerHTML = `<img src="${response.data.condition.icon_url}" id="today-weather-icon" width="80"/>`;

  let todayTemp = document.querySelector("#today-temp");
  todayTemp.innerHTML = Math.round(response.data.temperature.current, 1);

  let todayWeatherDesc = document.querySelector("#today-weather-desc");
  todayWeatherDesc.innerHTML = response.data.condition.description;

  let todayWindspeed = document.querySelector("#today-windspeed");
  if (setUnits === "metric") {
    todayWindspeed.innerHTML = `${Math.round(
      response.data.wind.speed * 3.6,
      1
    )} km/h`;
  } else {
    todayWindspeed.innerHTML = `${Math.round(
      response.data.wind.speed * 1.609,
      1
    )} km/h`;
  }

  let todayPressure = document.querySelector("#today-pressure");
  todayPressure.innerHTML = `${Math.round(
    response.data.temperature.pressure,
    1
  )} hPa`;

  let todayFeelsLike = document.querySelector("#feels-like-temp");
  todayFeelsLike.innerHTML = `${Math.round(
    response.data.temperature.feels_like,
    1
  )}`;

  let todayHumidity = document.querySelector("#today-humidity");
  todayHumidity.innerHTML = `${Math.round(
    response.data.temperature.humidity,
    1
  )}%`;

  let lastUpdateData = document.querySelector("#last-update-weather");
  /*
  lastUpdateData.innerHTML = `${Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: "true",
    timeZoneName: "short",
  }).format(new Date(response.data.time * 1000))}`;
  */
}

function updateWeatherData(weatherUrl, forecastUrl) {
  axios.get(weatherUrl).then(setCityHeader);
  axios.get(weatherUrl).then(setWeatherData);
  let forecastButtonState = document.querySelector("#toggle-forecast");
  if (forecastButtonState.innerHTML === "Hide Forecast") {
    updateWeatherForecast(forecastUrl);
  }
}

// 1.2 - Functions - Search City Form
function capitaliseFirstLetter(word) {
  let firstLetterInput = word.charAt(0);
  firstLetterInput = firstLetterInput.toUpperCase();
  word = firstLetterInput + word.slice(1);

  return word;
}

function changeCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city-input");
  searchInput = capitaliseFirstLetter(searchInput.value.toLowerCase().trim());

  setLocation = searchInput;

  setLocationUrl = `https://api.shecodes.io/weather/v1/current?query=${setLocation}&key=${apiKey}&units=${setUnits}`;
  setForecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${setLocation}&key=${apiKey}&units=${setUnits}`;

  updateWeatherData(setLocationUrl, setForecastUrl);
}

// 1.3 - Functions - Current City Button
function updateDefaultLocation(response) {
  setLocation = response.data.city;
}
function changeCitybyCoords(position) {
  setLocationUrl = `https://api.shecodes.io/weather/v1/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${apiKey}&units=${setUnits}`;
  setForecastUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${apiKey}&units=${setUnits}`;
  axios.get(setLocationUrl).then(updateDefaultLocation);
  updateWeatherData(setLocationUrl, setForecastUrl);
}

function currCityButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(changeCitybyCoords);
}

// 1.4 - Functions - Unit Conversions
function setUnitConversionCTF(event) {
  event.preventDefault();

  setUnits = "imperial";
  setLocationUrl = `https://api.shecodes.io/weather/v1/current?query=${setLocation}&key=${apiKey}&units=${setUnits}`;
  setForecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${setLocation}&key=${apiKey}&units=${setUnits}`;

  unitConversionCTF.classList.add("disableLink");
  unitConversionFTC.classList.remove("disableLink");

  updateWeatherData(setLocationUrl, setForecastUrl);
}

function setUnitConversionFTC(event) {
  setUnits = "metric";
  setLocationUrl = `https://api.shecodes.io/weather/v1/current?query=${setLocation}&key=${apiKey}&units=${setUnits}`;
  setForecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${setLocation}&key=${apiKey}&units=${setUnits}`;
  unitConversionFTC.classList.add("disableLink");
  unitConversionCTF.classList.remove("disableLink");
  updateWeatherData(setLocationUrl, setForecastUrl);
}

// 1.5 Functions - Forecast Button

function forecastData(response) {
  let forecast = response.data.daily;

  let dayArr = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];

  let forecastHTML = `<div class="row"> `;

  forecast.forEach((forecastDay, index) => {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
    <div class=
    "forecast-day">${dayArr[new Date(forecastDay.time * 1000).getDay()]}</div>
    <div class="forecast-icon"><img src="${
      forecastDay.condition.icon_url
    }" alt="${forecastDay.condition.description}" width="50"/></div>
    <div class="forecast-min-max">${Math.round(
      forecastDay.temperature.minimum
    )}° | ${Math.round(forecastDay.temperature.maximum)}°</div></div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  let forecastElement = document.querySelector("#daily-forecast");
  forecastElement.innerHTML = forecastHTML;
}

function deactivateForecast() {
  let forecastElement = document.querySelector("#daily-forecast");
  forecastElement.innerHTML = "";
}

function updateWeatherForecast(url) {
  axios.get(url).then(forecastData);
}

function toggleForecast() {
  let forecastButtonState = document.querySelector("#toggle-forecast");
  if (forecastButtonState.innerHTML === "Show Forecast") {
    forecastButtonState.innerHTML = "Hide Forecast";
    updateWeatherForecast(setForecastUrl);
    let forecastElement = document.querySelector("#daily-forecast");
    forecastElement.classList.add("active-forecast-box");
  } else {
    forecastButtonState.innerHTML = "Show Forecast";
    deactivateForecast();
    let forecastElement = document.querySelector("#daily-forecast");
    forecastElement.classList.remove("active-forecast-box");
  }
}

function toggleTheme() {
  let toggleThemeState = document.querySelector("#toggle-theme");
  if (toggleThemeState.innerHTML.includes("Dark")) {
    toggleThemeState.innerHTML = "Light Theme";
    toggleThemeState.classList.add("btn-light");
    let bgChangeState = document.querySelector("body");
    bgChangeState.classList.add("bg-night");
  } else {
    toggleThemeState.innerHTML = "Dark Theme";
    toggleThemeState.classList.remove("btn-light");
    let bgChangeState = document.querySelector("body");
    bgChangeState.classList.remove("bg-night");
  }
}

// 2.0 - SCRIPT
// 2.1 - Script - Weather API
let setLocation = "Melbourne";
let setUnits = "metric";
let apiKey = "18a0ed27t1bf3oc3ff7b86307c44ff70";
let setLocationUrl = `https://api.shecodes.io/weather/v1/current?query=${setLocation}&key=${apiKey}&units=${setUnits}`;
let setForecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${setLocation}&key=${apiKey}&units=${setUnits}`;
updateWeatherData(setLocationUrl);

// 2.2 - Script - Search City Form
let searchCityButton = document.querySelector("#search-location-button");
searchCityButton.addEventListener("click", changeCity);

// 2.3 - Script - Current City Button
let currentCityButton = document.querySelector("#current-location-button");
currentCityButton.addEventListener("click", currCityButton);

// 2.4 - Script - Temperature units conversion
let unitConversionCTF = document.querySelector("#cel-to-feh");
unitConversionCTF.addEventListener("click", setUnitConversionCTF);
let unitConversionFTC = document.querySelector("#feh-to-cel");
unitConversionFTC.addEventListener("click", setUnitConversionFTC);

// 2.5 - Script Toggle Forecast
