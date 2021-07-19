var today = moment();
var searchFormEl = document.querySelector('#search-form');
var inputEl = document.querySelector('#search-input');
var previousSearchesEl = document.querySelector('#previous-searches');
var cityDateEl = document.querySelector('#city-date');
var currentTempEl = document.querySelector('#current-temp');
var currentWindEl = document.querySelector('#current-wind');
var currentHumidityEl = document.querySelector('#current-humidity');
var currentUvEl = document.querySelector('#current-uv');
var searchList = JSON.parse(localStorage.getItem("Search History")) || [];
var forecastEl = document.querySelector('#forecast-section');
var oldSearchEl = document.querySelector('#old-search');
var newSearchEl = document.querySelector('#new-search');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var cityQuery = inputEl.value;

  if (!cityQuery) {
    console.error('You must enter a city name.');
    return;
  }

  getWx(cityQuery);
  saveCitySearch(cityQuery);
}

function getWx(cityQuery) {
  var currentWxUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityQuery + '&units=imperial&appid=208d873c4b4df3505fa91990e6501772';
  // var today = moment();

  fetch(currentWxUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })  
    .then(function (currentWx) {
      // console.log(currentWx);
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
      var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=minutely,hourly,alerts&appid=208d873c4b4df3505fa91990e6501772";

      fetch(oneCallUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          console.log(response);
          var currentUv = response.current.uvi;
          currentUvEl.textContent = "UV Index: " + currentUv;
          var fiveDayForecast = document.createElement("h3");
          fiveDayForecast.textContent = "5-Day Forecast";
          forecastEl.append(fiveDayForecast);
          var forecastCards = document.querySelectorAll(".forecast");
          for (var i = 0; i < forecastCards.length; i++) {
            forecastDate = document.createElement("h3");
            var newDate = today.add((i + 1), 'days');
            forecastDate.textContent = newDate.format('L');
            forecastCards.append(forecastDate);
            var forecastWxIcon = response.daily[i + 1].weather[0].icon;
            var forecastWxIconSource = "http://openweathermap.org/img/wn/" + forecastWxIcon + "@2x.png";
            var icon = document.createElement('img');
            icon.src = forecastWxIconSource;
            forecastCards.append(icon);
            forecastTempEl = document.createElement('p');
            forecastTempEl.textContent = "Temp: " + response.daily[i+1].temp.max + '°F';
            forecastCards.append(forecastTempEl);
            forecastWindEl = document.createElement('p');
            forecastWindEl.textContent = "Wind: " + response.daily[i+1].wind_speed + ' MPH';
            forecastCards.append(forecastWindEl);
            forecastHumidityEl = document.createElement('p');
            forecastHumidityEl.textContent = "Humidity: " + response.daily[i+1].humidity + '%';
            forecastCards.append(forecastHumidityEl);
          }
        })  
    })

    .catch(function(error) {
      console.error(error);
    });

}

function saveCitySearch (event) {
  //city name is saved to local storage, button element is created with city name, button has addEventListener to run with city name passed into it
  searchList.push(event);
  localStorage.setItem("Search History", JSON.stringify(searchList));
  var newSearchEl = document.createElement("button");
  newSearchEl.setAttribute("type", "button");
  newSearchEl.setAttribute("value", event);
  newSearchEl.setAttribute("class", "btn btn-info btn-block");
  newSearchEl.setAttribute("id", "new-search");
  newSearchEl.textContent = event;
  previousSearchesEl.append(newSearchEl);
}

function init () {

  if (!localStorage.getItem("Search History")) {
    return;
  }

  else {

    for (var i = 0; i < searchList.length; i++) {
      var oldSearchEl = document.createElement("button");
      oldSearchEl.setAttribute("type", "button");
      oldSearchEl.setAttribute("value", searchList[i]);
      oldSearchEl.setAttribute("class", "btn btn-info btn-block");
      oldSearchEl.setAttribute("id", "old-search");
      oldSearchEl.textContent = searchList[i];
      previousSearchesEl.append(oldSearchEl);
    }
  }
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
// oldSearchEl.addEventListener('click', getWx(oldSearchEl.value));
// newSearchEl.addEventListener("click", getWx(newSearchEl.value));

init ();