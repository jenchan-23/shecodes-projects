// 1.0 - FUNCTIONS SECTION
// 1.3 - Functions - Weather API
function setCityHeader(response) {
  let setCity = document.querySelector("#current-city");
  setCity.innerHTML = response.data.name;
}

function setTempData(response) {
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
  let searchInput = document.querySelector("#city-name");
  searchInput = capitaliseFirstLetter(searchInput.value.toLowerCase().trim());

  let setLocation = null;

  // Set location variable depending if country code is part of input
  if (searchInput.includes(",")) {
    let extractCountryCode = searchInput
      .substring(searchInput.indexOf(",") + 1)
      .toUpperCase();
    let extractCityName = searchInput.substring(0, searchInput.length - 3);
    setLocation = `${extractCityName},${extractCountryCode}`;
  } else {
    let extractCityName = searchInput;
    setLocation = extractCityName;
  }

  let setLocationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${setLocation}&appid=${apiKey}&units=${defaultUnits}`;

  updateWeatherData(setLocationUrl);
}

// 1.5 - Functions - Current City Button
function changeCitybyCoords(position) {
  let setLocationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${defaultUnits}`;
  updateWeatherData(setLocationUrl);
}

function currCityButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(changeCitybyCoords);
}

// 2.0 - SCRIPT
// 2.1 - Script - Date and Time

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

let currWeatherDate = document.querySelector("#current-date");
currWeatherDate.innerHTML = currentDateTime;

// 2.2 - Script - Weather API
// 2.2.1 - Scipt - Default City/Units on load
let defaultLocation = "Melbourne,AU";
let defaultUnits = "metric";
let apiKey = "7059cb165caa3316bff682d263a01b1e";
let locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}&units=${defaultUnits}`;
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
