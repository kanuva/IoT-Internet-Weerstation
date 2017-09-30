var SQLquery = require('./SQL Functions.js'),
    request = require('request'),
    updateStationState = require('./Update Station State.js');

module.exports = function getTemps(StationsWithOnState) {
    var StationsToTurnOff = [];
    if (StationsWithOnState.length > 0) {
        console.log("Ik zou moeten beginnen aan een of ander for loopje..");
        for (var i = 0; i < StationsWithOnState.length; i++) {
            (function (i) {
                var url = "http://192.168.137." + StationsWithOnState[i].Station_ID;
                console.log(url);
                request({
                    url: url,
                    method: 'GET',
                    timeout: 1000
                }, function (error, response, body) {
                    if (error) {
                        console.log("ERROR:");
                        console.log(error);
                        console.log("Resp: ");
                        console.log(response);
                        console.log("body");
                        console.log(body);
                        // updateStationState(StationsWithOnState[i].Station_ID, 'off', function () {
                        //     console.log("Het volgende station ID heb ik uitgezet: " + StationsWithOnState[i].Station_ID);
                        // })
                    }
                    else {
                        console.log(body);
                    }
                });
            })(i)
        }
        StationsWithOnState =[];
    }
};