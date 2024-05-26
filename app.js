const API_KEY = "031939e6ecdb70228e8e25afdf70578c";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

const cityName = document.getElementById("cityName");
const image = document.getElementById("image");
const country = document.getElementById("country");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const errorMsg = document.querySelector(".error");
const cityInput = document.getElementById("cityInput");

window.addEventListener("load", initialize);

function initialize() {
  if (navigator.geolocation) {
    getLocation();
  } else {
    console.log("Your browser does not support geolocation.");
    displayError("Geolocation is not supported by your browser.");
  }
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      fetchWeatherData(latitude, longitude);
    },
    (err) => {
      console.log(err);
      displayError("Failed to get your location.");
    }
  );
}

async function fetchWeatherData(latitude, longitude) {
  try {
    const response = await fetch(
      `${BASE_URL}lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const data = await response.json();
    if (response.ok) {
      showData(data);
    } else {
      handleError(data);
    }
  } catch (error) {
    console.error(error);
    displayError("An error occurred while fetching weather data.");
  }
}

async function fetchCityWeather(city) {
  try {
    const response = await fetch(`${BASE_URL}q=${city}&appid=${API_KEY}`);
    const data = await response.json();
    if (response.ok) {
      showData(data);
    } else {
      handleError(data);
    }
  } catch (error) {
    console.error(error);
    displayError("An error occurred while fetching weather data.");
  }
}

function showData(data) {
  cityName.textContent = data.name;
  country.textContent = data.sys.country;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Speed: ${data.wind.speed} km/h`;

  const icon = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  image.src = iconUrl;

  errorMsg.textContent = "";
  errorMsg.classList.remove("error");
}

function handleError(data) {
  if (data.message === "city not found") {
    displayError("City not found. Please check the city name and try again.");
  } else {
    displayError("An error occurred: " + data.message);
  }
}

function displayError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("error");
}

function getCityData() {
  const cityValue = cityInput.value.trim();
  if (cityValue === "") {
    displayError("Please enter a city name.");
  } else {
    fetchCityWeather(cityValue);
  }
}

document.getElementById("cityButton").addEventListener("click", getCityData);
