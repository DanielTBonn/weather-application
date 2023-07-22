var resultData = [];
var today = dayjs().format('M/D/YYYY');
var weatherCards = $("[id^=weather-card]");
console.log(weatherCards);
console.log(weatherCards.length)
console.log(today);

// Adding a weathermap to grab weather emojis depending on climate conditions
const weatherMap = new Map([
    ["Clear", '<i class="fa-solid fa-sun"></i>'],
    ["Clouds", '<i class="fa-solid fa-cloud"></i>'],
    ["Drizzle", '<i class="fa-solid fa-cloud-sun-rain"></i>'],
    ["Rain", '<i class="fa-solid fa-cloud-rain"></i>'],
    ["Thunderstorm", '<i class="fa-solid fa-cloud-bolt"></i>'],
    ["Snow", '<i class="fa-solid fa-snowflake"></i>']
]);

// This function grabs the openweathermap API data and returns info that will be extracted
function getApi(requestUrl) {
    console.log(requestUrl);

    // fetch grabs our api
    fetch (requestUrl , {}) 
    .then(function (response) {
        console.log(response);
        var newResponse = response.json();
        console.log(newResponse);
        return newResponse;
    })
    // info is taken from data and fills out the cards of the page
    .then(function (data) {
        console.log(data)
        // Adds weather data for the current day
        var currentDate = dayjs(data.list[0].dt_txt).format('M/D/YYYY');
        resultData = [[currentDate , data.list[0].weather[0].main],  "Temp: " + convertFarenheit(data.list[0].main.temp) + " \u00B0F", "Wind: " + data.list[0].wind.speed, "Humidity: " + data.list[0].main.humidity + "%"];
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
            // Adds weather data for the respective day
            currentDate = dayjs(info.dt_txt).format('M/D/YYYY');
            resultData = [[currentDate , info.weather[0].main], "Temp: " + convertFarenheit(info.main.temp) + " \u00B0F", "Wind: " + info.wind.speed, "Humidity: " + info.main.humidity + "%"];
            setData(resultData, "#" + weatherCards[i].id)
        }

        return data
        
    });
    
}

var apiKey = "2f8d2f4d2713c98d73c6bee0108a1778";
var requestUrl = 
"https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=" + apiKey;


var weatherData = getApi(requestUrl);
console.log(weatherData);
console.log(resultData);

// Sets the data to the element we are targeting
function setData(arr, eVal) {
    var currentEl = $(eVal);
    console.log(currentEl)
    // Loops through all of the different weather cards children [date/climate, temp, wind, humidity]
    $.each(currentEl.children("p"), function(index) { 
        // adds the date and current weather conditions if it is the first index and the rest of the information in the second
        if (index === 0) {
            // console.log($(this))
            // console.log(arr[1])
            $(this).text(arr[0][0] + " ");
            $(this).append(weatherMap.get(arr[0][1]))
        } else {
            $(this).text(arr[index]);

        }
    });
}

function convertFarenheit(temp) {
    return ((temp - 273.15) * (9/5) + 32).toFixed(2);
}