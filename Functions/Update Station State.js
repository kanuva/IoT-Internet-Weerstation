var SQLquery = require('./SQL Functions.js');

module.exports = function updateStationState(id,state, _callback) {
    var query = "UPDATE WeatherStations set Station_State = '"+state+"' WHERE Station_ID = " + id + "";
    SQLquery(query, function (result) {
        _callback();
    });
};