var SQLquery = require('./SQL Functions.js');

module.exports = function updateStationState(id, state, _callback) {
    if (id.length > 0) {
        var query = "UPDATE WeatherStations set Station_state = '" + state + "' WHERE ";
        id.forEach(function (item, index) {
            query = query + "Station_ID = " + item + " OR ";
        });
        query = query.slice(0, -4);
        console.log(query);
         var query = "UPDATE WeatherStations set Station_State = '"+state+"' WHERE Station_ID = " + id + "";
         SQLquery(query, function (result) {
            _callback();
         });
    }
    else{
        _callback();
    }
};