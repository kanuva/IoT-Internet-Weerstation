var getTime = require('../Functions/Time Functions.js'),
    request = require('request');

module.exports = function postData(body,token, _callback) {
    console.log(token.getToken);
    request.post({
        url: "http://iot.jorgvisch.nl/api/weather",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: {
            "Weatherstation": body.station_ID,
            "Timestamp": getTime() + '0000+02:00',
            "Temperature": body.Temperature,
            "Illuminance": body.Illuminance
        },
        json: true
    }, function (error, response, body) {
        console.log("error: " + error);
        _callback(error);
        //console.log(response);
        //console.log(body);
    });
};