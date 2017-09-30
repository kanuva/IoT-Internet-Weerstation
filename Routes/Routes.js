var express = require('express'),
    bodyParser = require('body-parser'),
    SQLquery = require('../Functions/SQL Functions.js'),
    getToken = require('../Functions/Get Token.js'),
    getTime = require('../Functions/Time Functions.js'),
    postData = require('../Functions/Post Data.js'),
    storeNewID = require('../Functions/Store New ID.js');
var router = express();
router.use(bodyParser.json());


router.get('/', function (req, res) {
    getToken(function (result) {
        res.send(result);
    });
});

router.get('/api/groet/:naam', function (req, res) {
    console.log(req.params.naam);
    res.send('Hello ' + req.params.naam);
});

//POST routes
router.post('/api/report', function (req, res) {
        console.log("Er komt een nieuw id binnen: " + req.body.ID);
        if (req.body.ID < 10) {
            //genereer nieuw id op basis van wat we kennen
            storeNewID(function (result) {
                res.send(result);
            })
        }
        else {
            var query = "SELECT Station_ID FROM WeatherStations WHERE Station_ID = " + req.body.ID + " ORDER BY Station_ID DESC";
            SQLquery(query, function (result) {
                if (result.rowsAffected[0] === 0) { //nu komt er een nieuw station ID binnen, wat nog niet bekend is maar wel hoger dan 10 is..
                    console.log("Er is een nieuw ID binnengekomen wat ik nog niet ken: " + req.body.ID);
                    storeNewID(function(result){
                        res.send(result);
                    })
                }
                else { //hier komt een stationID binnen wat al wel bekend is
                    var query = "UPDATE WeatherStations set Station_State = 'On' WHERE Station_ID = " + req.body.ID + "";
                    SQLquery(query, function (result) {
                        res.send(req.body.ID.toString())
                    });
                }
            });

        }
    }
);

router.post('/api/temp', function (req, res) {
    console.log("Er komt iets binnen op /api/temp");
    console.log(req);
    getToken(function (token) {
        if (!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json') !== 0) {
            return res.sendStatus(412);
        }
        else {
            var query = "INSERT INTO Measuredata (Station_ID, time, Temperature_celsius, illuminate) VALUES ('" + req.body.station_ID + "','" + getTime() + "'," + req.body.Temperature + "," + req.body.Illuminance + ")";
            SQLquery(query, function (result) {
                if (result) {
                    postData(req.body, token, function (error) {
                        if (!error) {
                            return res.sendStatus(200);
                        }
                        else {
                            return res.sendStatus(500);
                        }
                    });
                }
                else {
                    return res.sendStatus(500);
                }
            })
        }
    });
});

module.exports = router;