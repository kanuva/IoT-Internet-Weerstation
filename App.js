//config express
var express = require('express'),
    SQLquery = require('./Functions/SQL Functions.js'),
    GetTemps = require('./Functions/Get Temps.js'),
    bodyParser = require('body-parser'),
    storeNewID = require('./Functions/Store New ID.js');
var app = express();
app.use(bodyParser.json());
//GET routes
app.get('/', function (req, res) {
        res.sendFile('./Public/index.html' , { root : __dirname});
    }
);

//POST routes
app.post('/api/report', function (req, res) {
        if (req.body.ID && req.headers['content-type'] === 'application/json') {
            storeNewID(req.body.ID, function (result) {
                console.log("result: " + result);
                res.send(result);
            });
        }
        else {
            res.sendStatus(400);
        }
    }
);


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
        GetTemps(StationsWithOnState);
    });
    setTimeout(askTemp, 30000)
}