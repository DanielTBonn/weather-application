var resultData = [];
var today = dayjs().format('M/D/YYYY');
console.log(today);

// This function grabs the openweathermap API data and returns info that will be extracted
function getApi(requestUrl) {
    console.log(requestUrl);

    var resolve = fetch (requestUrl , {}) 
    .then(function (response) {
        console.log(response);
        var newResponse = response.json();
        console.log(newResponse);
        return newResponse;
    })
    .then(function (data) {
        console.log(data)
        console.log(data.weather)
        resultData = ["Date: " + today ,"Climate: " + data.weather[0].main, "Temp: " + data.main.temp, "Wind: " + data.wind.speed, "Humidity: " +data.main.humidity];
        setData(resultData);

      
        return data
        
    });
    
    return resolve;
}


var requestUrl = 
"api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=2f8d2f4d2713c98d73c6bee0108a1778";

requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=2f8d2f4d2713c98d73c6bee0108a1778";


var weatherData = getApi(requestUrl);
console.log(weatherData);
console.log(resultData);

function setData(arr) {

    var todayEl = $(".todays-weather");
    $.each(todayEl.children("p"), function(index) { 
        console.log(index);
        $(this).text(arr[index]);
    });
}


