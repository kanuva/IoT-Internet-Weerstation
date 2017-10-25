var SQLquery = require('./SQL Functions.js'),
    getDate = require('./Time Functions.js');

module.exports = function StoreNewID(id, _callback) {
    console.log("ID: " + id);
    //Hier wordt gekeken of het station_ID wat zich aanmeld al bekend is in de DB
    var query6 = "SELECT top 1 Station_ID from weatherstations where Station_State = 'Off' AND Station_ID = '" + id + "'";
    SQLquery(query6, function (result6) {
        //Het station_ID is nog niet eerder aangemeld of staat in de DB nog aan
        if (result6.rowsAffected[0] === 0) {
            var query = "SELECT top 1 Station_ID from weatherstations";
            SQLquery(query, function (result) {
                if (result.rowsAffected[0] === 0) {
                    //als er nog geen station bekend is in de DB wordt er een nieuwe ingezet (10)
                    var query1 = "INSERT INTO WeatherStations values (10, 'On' , '"+getDate.getTime()+"');";
                    SQLquery(query1, function (result) {
                        _callback("10")
                    });
                }
                else {
                    //Wanneer er wel minimaal een instaat wordt het eerst stationID opgevraagd wat op dit moment uit staat.
                    var query2 = "SELECT top 1 Station_ID from Weatherstations where station_state = 'Off'";
                    SQLquery(query2, function (result2) {
                        if (result2.rowsAffected[0] === 0) {
                            //Als er geen station_ID status off heeft wordt er een nieuwe ingezet met 1 hoger dan t hoogste ID wat er is
                            var query3 = "SELECT top 1 Station_ID + 1 as Station_ID from Weatherstations order by Station_ID desc";
                            SQLquery(query3, function (result3) {
                                var query4 = "INSERT INTO Weatherstations values ('" + result3.recordset[0].Station_ID + "','On', '"+getDate.getTime()+"')";
                                SQLquery(query4, function (result4) {
                                    _callback(result3.recordset[0].Station_ID.toString());
                                })
                            });
                        }
                        //Wanneer er een stationID uitstaat wordt dit hergebruikt
                        else {
                            var query5 = "UPDATE Weatherstations set Station_State = 'On', Station_On_Time = '"+getDate.getTime()+"' WHERE Station_ID = " + result2.recordset[0].Station_ID + "";
                            SQLquery(query5, function (result5) {
                                _callback(result2.recordset[0].Station_ID.toString());
                            })
                        }
                    });
                }
            });
        }
        //Het station ID is bekend en staat uit in de DB, het kan dus opnieuw worden aangezet
        else {
            var query7 = "UPDATE Weatherstations set Station_State = 'On', Station_On_Time = '"+getDate.getTime()+"' WHERE Station_ID = " + id + "";
            SQLquery(query7, function (result7) {
                _callback(id.toString());
            })
        }
    });
};