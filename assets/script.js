var searchFormEl = document.querySelector('#search-form');
var cityDateEl = document.querySelector('#city-date');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var cityQuery = document.querySelector('#search-input').value;

  if (!cityQuery) {
    console.error('You must enter a city name.');
    return;
  }

//   var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  // location.assign(queryString);

  searchApi(cityQuery);
}

function searchApi(cityQuery) {
  var weatherQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityQuery + '&appid=208d873c4b4df3505fa91990e6501772';
  var today = moment();

  fetch(weatherQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })  
    .then(function (cityWxResults) {
      console.log(cityWxResults);
      var wxIcon = cityWxResults.weather[0].icon;
      var wxIconSource = "http://openweathermap.org/img/wn/" + wxIcon + "@2x.png";
      var img = document.createElement('img');
      img.src = wxIconSource;
      cityDateEl.textContent = cityQuery + ' ' + today.format("L");
      cityDateEl.appendChild(img);
    })
    .catch(function(error) {
      console.error(error);
    });
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

