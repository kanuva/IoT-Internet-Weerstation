//config express
var express = require('express'),
    request = require('request'),
    updateStationState = (require('./Functions/Update Station State.js')),
    SQLquery = require('./Functions/SQL Functions.js'),
    GetTemps = require('./Functions/Get Temps.js');
var app = express();

app.use(require('./Routes/Routes.js'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    askTemp();
});


//HERHALENDE FUNCTIE
function askTemp() {
    //HIER KOMT DE FUNCTIE OM ELKE 10 MINUTEN AAN ALLE STATION ID'S DIE AANSTAAN DE TEMP TE VRAGEN
    var StationsWithOnState = [];
    var query = "SELECT Station_ID from WeatherStations WHERE Station_State = 'On'";
    SQLquery(query, function (result) {
        for (var i = 0; i < result.recordset.length; i++) {
            StationsWithOnState.push(result.recordset[i])
        }
        console.log(StationsWithOnState);
        GetTemps(StationsWithOnState);
    });

    console.log("Ik herhaal dit doodleuk elke 10 seconden");
    setTimeout(askTemp, 100000)
}