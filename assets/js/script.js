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
    var resolve = fetch (requestUrl , {}) 
    .then(function (response) {
        console.log(response);
        var newResponse = response.json();
        console.log(newResponse);
        return newResponse;
    })
    // info is taken from data and fills out the cards of the page
    .then(function (data) {
        console.log(data)
        resultData = ["Date: " + today , data.list[0].weather[0].main, "Temp: " + data.list[0].main.temp, "Wind: " + data.list[0].wind.speed, "Humidity: " + data.list[0].main.humidity + "%"];
        setData(resultData, ".todays-weather");

        for (i = 0; i < weatherCards.length; i++) {
            var info = data.list[(i * 3) + 3];
            resultData = ["Date: " + today , info.weather[0].main, "Temp: " + info.main.temp, "Wind: " + info.wind.speed, "Humidity: " + info.main.humidity + "%"];
            setData(resultData, "#" + weatherCards[i].id)
        }


        return data
        
    });
    
    return resolve;
}


var requestUrl = 
"https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=2f8d2f4d2713c98d73c6bee0108a1778";



var weatherData = getApi(requestUrl);
console.log(weatherData);
console.log(resultData);

function setData(arr, eVal) {

    var currentEl = $(eVal);
    console.log(currentEl)
    $.each(currentEl.children("p"), function(index) { 
        if (index === 1) {
            console.log($(this))
            console.log(arr[1])
            $(this).append(weatherMap.get(arr[1]))
        } else {
            $(this).text(arr[index]);

        }
    });
}


