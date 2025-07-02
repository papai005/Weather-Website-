const cityInput=document.querySelector(".city-input");
const searchButton=document.querySelector(".search-btn");
const currentWeatherDiv=document.querySelector(".current-weather");
const weatherCardsDiv=document.querySelector(".weather-cards");

const API_KEY="b7c76efc21526844b055ab43d07ca5e1";

const createweatherCard= (cityName, weatherItem, index) => {
    if(index === 0){  //html for the main weathwe card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature:<span>${(weatherItem.main.temp - 273.15).toFixed(2)}</span><sup>o</sup> </h4>
                    <h4>Wind:${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity:${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }else{  //html for the other five day forecast card
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>Temp:<span>${(weatherItem.main.temp - 273.15).toFixed(2)}</span><sup>o</sup>C</h4>
                <h4>Wind:${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}

const getWeatherDetails =(cityName, lat, lon) => {
    const WEATHER_API_URL =`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        //filter
        const uniqueForecastDays=[];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastData = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastData)) {
                return uniqueForecastDays.push(forecastData);
            }
        });

        //clearing previous data
        cityInput.value="";
        currentWeatherDiv.innerHTML="";
        weatherCardsDiv.innerHTML="";

        //creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) =>{
            if(index === 0){
               currentWeatherDiv.insertAdjacentHTML("beforeend",createweatherCard(cityName, weatherItem, index)); 
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",createweatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error occurred while fatching the weather forecast!")
    });
}

const getCityCoordinates = ()=> {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    //grt entered city coordinates (lat, lon, name) from the api response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name ,lat , lon }=data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fatching the coordinates!");
    })
}

searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e.key === "Enter" && getCityCoordinates);