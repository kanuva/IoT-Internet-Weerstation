var request = require('request'),
    updateStationState = require('./Update Station State.js'),
    getTime = require('./Time Functions.js'),
    StoreMeasureData = require('./Store Measure data.js');

module.exports = function getTemps(StationsWithOnState) {
    var StationsToTurnOff = [];
    var incommingTemps= [];
    var toTurnoff = 0;
    var toProcess = 0;
    for (var i = 0; i < StationsWithOnState.length; i++) {
        request({
            url: "http://192.168.137." + StationsWithOnState[i].Station_ID,
            method: 'GET',
            timeout: 9500
        }, (function (i) {
            return function (error, response, body) {
                if (error) {
                    StationsToTurnOff.push(StationsWithOnState[i].Station_ID);
                    toTurnoff++;
                }
                else {
                    incommingTemps.push([[StationsWithOnState[i].Station_ID], [JSON.parse(body.trim()).temp], [JSON.parse(body.trim()).Illuminance], [getTime()]]);
                    toProcess++;

                }
                if (toTurnoff + toProcess === StationsWithOnState.length) {
                    updateStationState(StationsToTurnOff, 'Off',function() {
                        if (toTurnoff + toProcess === StationsWithOnState.length && incommingTemps.length > 0) {
                            StoreMeasureData(incommingTemps, function() {

                            });
                        }
                    });
                }

            };

        }(i)));

    }
};