

function getWeather() {
    const apiKey = '61072a85cff2e8ad6b210fc224cc01c7';
    const city = document.getElementById('city').ariaValueMax;

    if (!city) {
        alert('Please enter a city');
        return;
    }

const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/wweather?q=${city}&appid=${apiKey}';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}';
}

function getWeather() {
    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
    })
    .catch(error => {
        console.error('Error fetching current weather data:', error);
        alert('Error fetching current weather data. Please try again.');
    });
}

function getWeather() {

    fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
        displayHourlyForecast(data.list);
    })
    .catch(error => {
        console.error('Error fetching hourly forecast data:', error);
        alert('Error fetching hourly forecast data. Please try again.');
    });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    //Clear previous content 
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
}

function displayWeather(data) {
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = '<p>${data.message}</p>';
    } else {

        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = 'https://openweathermap.org/img/wn/${iconCode}@4x.png';

        const temperatureHTML = '<p>${temperature}</p>';

        const weatherHtml = '<p>${cityName}</p> <p>${description}</p>';

        tempDivInfo.innerHTML= temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description; 

        showImage();
    }
    
}

function displayHourlyForecast(hourlyData) {

    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0,24);

    next24Hours.forEach(item => {
        
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = 'https://openweathermap.org/img/wn/${iconCode}.png';

        const hourlyItemHtml = '<div class = "hourly-item"> <span>${hour}:00</span> <img src="${iconUrl}" alt="Hourly Weather Icon"> <span>${temperature}</span> </div>';
        hourlyForecastDiv.innerHTML += hourlyItemHtml;

    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
