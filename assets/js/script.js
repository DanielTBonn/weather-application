var resultData = [];
var today = dayjs().format('M/D/YYYY');
var weatherCards = $("[id^=weather-card]");
console.log(weatherCards);
console.log(weatherCards.length)
console.log(today);
var ele = document.createElement("i")
ele.setAttribute("class", "fa-solid fa-snowflake")
console.log(ele)
$(".todays-weather").append(ele)

// Adding a weathermap to grab weather emojis depending on climate conditions
const weatherMap = new Map([
    ["snow", '<i class="fa-solid fa-snowflake"></i>']
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
        console.log(data.weather)
        resultData = ["Date: " + today ,"Climate:  " + data.list[0].weather[0].main, "Temp: " + data.list[0].main.temp, "Wind: " + data.list[0].wind.speed, "Humidity: " + data.list[0].main.humidity];
        setData(resultData, ".todays-weather");

        for (i = 0; i < weatherCards.length; i++) {
            var info = data.list[(i * 3) + 3];
            resultData = ["Date: " + today ,"Climate: " + info.weather[0].main, "Temp: " + info.main.temp, "Wind: " + info.wind.speed, "Humidity: " + info.main.humidity];
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
            $(this).append(weatherMap.get("snow"))
        } else {
            console.log(index);
            $(this).text(arr[index]);

        }
    });
}


