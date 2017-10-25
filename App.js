//config express
var express = require('express'),
    path = require('path'),
    SQLquery = require('./Functions/SQL Functions.js'),
    GetTemps = require('./Functions/Get Temps.js'),
    bodyParser = require('body-parser'),
    storeNewID = require('./Functions/Store New ID.js');
var app = express();
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.json());
//GET routes
app.get('/', function (req, res) {
        res.sendFile('./Public/index.html' , { root : __dirname});
    }
);

app.get('/api/getStations',function(req,res) {
    var query1= 'SELECT Station_ID from Measuredata group by Station_ID';
    SQLquery(query1, function(result) {
       res.send(result.recordset);
    });
});

app.get('/api/getStationData/:station_ID', function (req, res) {
    var query2 = 'Select * from Measuredata where Station_ID = ' + req.params.station_ID + 'ORDER BY Time desc';
    SQLquery(query2, function(result) {
        if (!result) {
            res.sendStatus(500);
        }
        else {
            res.send(result.recordset);
        }
    })
});

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
    var query = "SELECT Station_ID, Station_On_Time from WeatherStations WHERE Station_State = 'On'";
    SQLquery(query, function (result) {
        for (var i = 0; i < result.recordset.length; i++) {
            StationsWithOnState.push(result.recordset[i])
        }
        GetTemps(StationsWithOnState);
    });
    setTimeout(askTemp, 30000)
}