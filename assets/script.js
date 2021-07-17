var searchFormEl = document.querySelector('#search-form');
var inputEl = document.querySelector('#search-input');
var previousSearchesEl = document.querySelector('#previous-searches');
var cityDateEl = document.querySelector('#city-date');
var currentTempEl = document.querySelector('#current-temp');
var currentWindEl = document.querySelector('#current-wind');
var currentHumidityEl = document.querySelector('#current-humidity');
var currentUvEl = document.querySelector('#current-uv');
var searchList = JSON.parse(localStorage.getItem("Search History")) || [];
var forecastEl = document.querySelector('#forecast');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var cityQuery = inputEl.value;

  if (!cityQuery) {
    console.error('You must enter a city name.');
    return;
  }

  searchApi(cityQuery);
  saveCitySearch(cityQuery);
}

function searchApi(cityQuery) {
  var currentWxUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityQuery + '&units=imperial&appid=208d873c4b4df3505fa91990e6501772';
  var today = moment();

  fetch(currentWxUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })  
    .then(function (currentWx) {
      console.log(currentWx);

      var wxIcon = currentWx.weather[0].icon;
      var wxIconSource = "http://openweathermap.org/img/wn/" + wxIcon + "@2x.png";
      var img = document.createElement('img');
      img.src = wxIconSource;
      cityDateEl.textContent = cityQuery + ' ' + today.format("L");
      cityDateEl.appendChild(img);

      currentTempEl.textContent = "Temp: " + currentWx.main.temp + '°F';
      currentWindEl.textContent = "Wind: " + currentWx.wind.speed + ' MPH';
      currentHumidityEl.textContent = "Humidity: " + currentWx.main.humidity + '%';
      
      var lat = currentWx.coord.lat;
      var long = currentWx.coord.lon;
      var forecastWxUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&appid=208d873c4b4df3505fa91990e6501772";
  
      fetch(forecastWxUrl)
        .then (function (response) {
          return response.json();
        })
        .then(function (currentUV) {
          var cityUv = currentUV.current.uvi;
          currentUvEl.textContent = "UV Index: " + cityUv;
        })
      })

      //create h3 element that reads 5-Day Forecast
      //give it textContent
      //append it to forecast
      //for loop 

    .catch(function(error) {
      console.error(error);
    });

}

function saveCitySearch (cityQuery) {
  //city name is saved to local storage, button element is created with city name, button has addEventListener to run with city name passed into it
  searchList.push(cityQuery);
  localStorage.setItem("Search History", JSON.stringify(searchList));
  var citySearchEl = document.createElement("button");
  citySearchEl.setAttribute("type", "button");
  citySearchEl.setAttribute("value", cityQuery);
  citySearchEl.setAttribute("class", "city-button");
  previousSearchesEl.append(citySearchEl);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

//need an onload function to render previous city searches from local storage

