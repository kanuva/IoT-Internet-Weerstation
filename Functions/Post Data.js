var request = require('request'),
    getToken = require('./Get Token.js');

module.exports = function postData(body, _callback) {
    getToken(function (token) {
        for (var i = 0; i < body.length; i++) {
            request.post({
                url: "http://iot.jorgvisch.nl/api/weather",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: {
                    "Weatherstation": body[i][0][0],
                    "Timestamp": body[i][3][0] + "0000+02:00",
                    "Temperature": body[i][1][0].toString(),
                    "Illuminance": body[i][2][0] + '.0'
                },
                json: true
            }, (function (i) {
                return function (error, response, body) {
                    //console.log(body);
                    _callback(error);
                }
            }(i)));
        }
    });
};