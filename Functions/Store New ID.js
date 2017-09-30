var SQLquery = require('./SQL Functions.js');

module.exports = function StoreNewID(_callback) {
    var query = "SELECT top 1 Station_ID FROM WeatherStations ORDER BY Station_ID DESC";
    SQLquery(query, function (result) {
        if (result.rowsAffected[0] === 0) {
            var query1 = "INSERT INTO WeatherStations values (10, 'On');";
            SQLquery(query1, function (result) {
                _callback("10")
            });
        }
        else {
            var newID = result.recordset[0].Station_ID;
            newID++;
            var query2 = "INSERT INTO WeatherStations values (" + newID + ", 'On');";
            SQLquery(query2, function (result) {
                console.log("Als servert stuur ik dit nieuwe ID op: " + newID.toString());
                _callback(newID.toString());
            });
        }
    });
};