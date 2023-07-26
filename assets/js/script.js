var resultData = [];
var today = dayjs().format('M/D/YYYY');
var weatherCards = $("[id^=weather-card]");
// console.log(weatherCards);
// console.log(weatherCards.length)
// console.log(today);

// This function grabs the openweathermap API data and returns info that will be extracted
function getApi(newUrl) {
    console.log(newUrl);

    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + newUrl.lat + "&lon=" + newUrl.lon + "&appid=" + apiKey;

    // fetch grabs our api
    fetch (requestUrl , {}) 
    .then(function (response) {
        var newResponse = response.json();
        return newResponse;
    })
    // info is taken from data and fills out the cards of the page
    .then(function (data) {
        console.log(data)
        // Adds weather data for the current day, grabs the current date, and the weather icon associated with the present conditions
        var cityName = data.city.name;
        var currentDate = dayjs(data.list[0].dt_txt).format('M/D/YYYY');
        var weatherIcon = 'https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon +'@2x.png';
        resultData = [[cityName + " " + currentDate , weatherIcon],  "Temp: " + convertFarenheit(data.list[0].main.temp) + " \u00B0F", "Wind: " + converWindMPH(data.list[0].wind.speed) + " MPH", "Humidity: " + data.list[0].main.humidity + "%"];
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

        // return data
        
    });
    
}

var apiKey = "2f8d2f4d2713c98d73c6bee0108a1778";
var requestUrl = 
"https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=" + apiKey;


// getApi(requestUrl);
// console.log(weatherData);
// console.log(resultData);

// Sets the data to the element we are targeting
function setData(arr, eVal) {
    var currentEl = $(eVal);
    // console.log(currentEl)
    // Loops through all of the different weather cards children [date/climate, temp, wind, humidity]
    $.each(currentEl.children("p"), function(index) { 
        // adds the date and current weather conditions if it is the first index and the rest of the information in the second
        if (index === 0) {
            // console.log($(this))
            // console.log(arr[1])
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

function convertFarenheit(temp) {
    return ((temp - 273.15) * (9/5) + 32).toFixed(2);
}

function converWindMPH(wind) {
    return (wind * 2.237).toFixed(2);
}

function convertGeocode(city, country) {
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city+ "," + country  + "&limit=5&appid=" + apiKey;
    console.log(requestUrl);
    
    fetch(requestUrl, {})
    .then(function(response) { 
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log(data[0]);
        getApi(data[0]);
    })
}


$( function() {
    $( "#selectable" ).selectable();


  } );
  
$(".btn").on("click", function (event) {
    $(this).text("hi")

})

convertGeocode("London", "");