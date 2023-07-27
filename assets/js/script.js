// essential variables created
var apiKey = "2f8d2f4d2713c98d73c6bee0108a1778";
var resultData = [];
var today = dayjs().format('M/D/YYYY');
var weatherCards = $("[id^=weather-card]");

// This will ensure the page always loads with city data the first time 
$(function() {
    if (!localStorage.getItem("cities")) {
        convertGeocode("Austin", "");
    } else {
        var cities = getStorage();
        convertGeocode(cities[0], "");
    }
});

// Adds newly selected city to local storage if not already present
function addCityLocalStorage(city) {
    var cities = getStorage();
    if (cities.includes(city)) {
        return;
    } else {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        appendCity(city);
    }
}

// retrieves localStorage of cities as an array
function getStorage(){
    var cities = [];

    if (localStorage.cities) {
        cities = JSON.parse(localStorage.cities)
    }
    return cities;
}

// when the page is loaded everything in localStorage.cities is displayed
function displaySearches() {
    var cities = getStorage();
    for (let i = 0; i < cities.length; i++) {
        appendCity(cities[i]);
    }
}

// This function grabs the openweathermap API data and returns info that will be extracted
function getApi(newUrl) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + newUrl.lat + "&lon=" + newUrl.lon + "&appid=" + apiKey;

    // fetch grabs our api
    fetch (requestUrl , {}) 
    .then(function (response) {
        return response.json();
    })
    // info is taken from data and fills out the cards of the page
    .then(function (data) {
        // Adds weather data for the current day, grabs the current date, and the weather icon associated with the present conditions
        var cityName = data.city.name;
        addCityLocalStorage(cityName);
        var currentDate = dayjs(data.list[0].dt_txt).format('M/D/YYYY');
        var weatherIcon = 'https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon +'@2x.png';
        resultData = [[cityName + " " + "(" + currentDate + ")"  , weatherIcon],  "Temp: " + convertFarenheit(data.list[0].main.temp) + " \u00B0F", "Wind: " + converWindMPH(data.list[0].wind.speed) + " MPH", "Humidity: " + data.list[0].main.humidity + "%"];
        setData(resultData, ".todays-weather");

        // For loop prints weather info to the weatherCards in the 5 day forecast section
        for (i = 0; i < weatherCards.length; i++) {
            // Had to develop this if/else block for instances where weather data briefly only covers 5 days including the current day's forecast at 0:00 military time
            var info;
            if (i === (weatherCards.length - 1)) {
                info = data.list[(i * 8) + 7];
            } else {
                info = data.list[(i * 8) + 8];
            }
            // Adds weather data for the respective day, grabs the respective date, and the weather icon associated with the present conditions
            currentDate = dayjs(info.dt_txt).format('M/D/YYYY');
            weatherIcon = 'https://openweathermap.org/img/wn/' + info.weather[0].icon +'@2x.png';
            resultData = [[currentDate , weatherIcon], "Temp: " + convertFarenheit(info.main.temp) + " \u00B0F", "Wind: " + converWindMPH(info.wind.speed) + " MPH", "Humidity: " + info.main.humidity + "%"];
            setData(resultData, "#" + weatherCards[i].id)
        }
    });
}

// Sets the data to the element we are targeting
function setData(arr, eVal) {
    var currentEl = $(eVal);
    // Loops through all of the different weather cards children [date/climate, temp, wind, humidity]
    $.each(currentEl.children("p"), function(index) { 
        // adds the date and current weather conditions if it is the first index and the rest of the information in the second
        if (index === 0) {
            $(this).text(arr[0][0] + " ");
            var addIcon = document.createElement("img");
            addIcon.setAttribute("src", arr[0][1]);
            addIcon.setAttribute("class", "icon");
            $(this).append(addIcon)
        } else {
            $(this).text(arr[index]);

        }
    });
}

// converts temp to farenheit
function convertFarenheit(temp) {
    return ((temp - 273.15) * (9/5) + 32).toFixed(2);
}

// converts windspeed to MPH
function converWindMPH(wind) {
    return (wind * 2.237).toFixed(2);
}

// grabs the geocode from the city name (optional functionality for country to be implemented)
function convertGeocode(city, country) {
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + country  + "&limit=5&appid=" + apiKey;
    
    fetch(requestUrl, {})
    .then(function(response) {
        if (response.status !== 200){
            console.log("Error");
            window.alert("There was an error with the response");
        } else {
            return response.json();
        }
    })
    .then(function(data) {
        getApi(data[0]);
    })
}

// initializes any selectables on the page
$( function() {
    $( "#selectable" ).selectable();
} );

// ensures all items with the ui-widget-content class are selectable
function setSelectables() {
    var searchLi = $(".ui-widget-content");
    searchLi.selectable({
        selecting: function(event, ui) {
            var city = $(this).text();
            convertGeocode(city, "");
        }
    })
}

// button that searches for the city when clicked
$(".searchBtn").on("click", function () {
    var city = $(this).prev().val();
    convertGeocode(city, "");
})

// function that appends new searches to the search list
function appendCity(city) {
    var addCityLi = $("#selectable");
    var cityLi = $('<li class="ui-widget-content"></li>').text(city);
    addCityLi.append(cityLi);
    setSelectables();
}

// displays previous searches everytime the page is loaded
displaySearches();