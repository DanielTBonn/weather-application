
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
        console.log(data);
    });

    return resolve;
}

var requestUrl = 
"api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=2f8d2f4d2713c98d73c6bee0108a1778";

requestUrl = "api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=2f8d2f4d2713c98d73c6bee0108a1778";
var finished = getApi(requestUrl);
console.log(finished);