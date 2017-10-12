var SQLquery = require('./SQL Functions.js');

module.exports = function StoreNewID(id,_callback) {
    var query = "SELECT top 1 Station_ID from weatherstations";
    SQLquery(query, function (result) {
        if (result.rowsAffected[0] === 0) {
            var query1 = "INSERT INTO WeatherStations values (10, 'On');";
            SQLquery(query1, function (result) {
                _callback("10")
            });
        }
        else {
            var query2 = "SELECT top 1 Station_ID from Weatherstations where station_state = 'Off'";
            SQLquery(query2, function (result2) {
                if (result2.rowsAffected[0] === 0) {
                    var query3 = "SELECT top 1 Station_ID + 1 as Station_ID from Weatherstations order by Station_ID desc";
                    SQLquery(query3, function(result3) {
                        var query4 = "INSERT INTO Weatherstations values ('"+result3.recordset[0].Station_ID+"','On')";
                        SQLquery(query4, function(result4) {
                            _callback (result3.recordset[0].Station_ID.toString());
                        })
                    });
                }
                else {
                    var query5 = "UPDATE Weatherstations set Station_State = 'On' WHERE Station_ID = "+result2.recordset[0].Station_ID+"";
                    SQLquery(query5,function(result5) {
                        _callback(result2.recordset[0].Station_ID.toString());
                    })
                }
            });
        }
    });
};