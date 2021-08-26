// select element
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    units: "celsius"
}

// App cosnt and var
const KELVIN = 273;
// API key
const key = "dffeaa8c6a50ca7fb8a2b7661495f6d7";

// check if browser supports geolocation
if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// set User's postion
function setPosition(postion) {
    let latitude = postion.coords.latitude;
    let longitude = postion.coords.longitude;

    getWeather(latitude, longitude);
}

// show error message
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// get weather from API
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    // console.log(api);

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconID = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

// display Weather
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F convert
function CelsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

// click at temperature element
tempElement.addEventListener("click", function() {
   if (weather.temperature.value === undefined) {
       return;
   } 
   if (weather.temperature.units === "celsis") {
       let fahrenheit = CelsiusToFahrenheit(weather.temperature.value);
       fahrenheit = Math.floor(fahrenheit);

       tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
       weather.temperature.units = "fahrenheit";
   } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.units = "celsis";
   }
});