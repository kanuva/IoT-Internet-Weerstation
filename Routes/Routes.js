var express = require('express'),
    bodyParser = require('body-parser'),
    SQLquery = require('../Functions/SQL Functions.js'),
    getToken = require('../Functions/Get Token.js'),
    getTime = require('../Functions/Time Functions.js'),
    postData = require('../Functions/Post Data.js');
var router = express();
router.use(bodyParser.json());


router.get('/', function (req, res) {
    getToken(function (result) {
        res.send(result);
    });
});

router.get('/api/groet/:naam', function (req, res) {
    res.send('Hello ' + req.params.naam);
});

//POST routes
router.post('/api/report', function (req, res) {
        if (req.body.ID < 10) {
            //genereer nieuw id op basis van wat we kennen
            var query = "SELECT top 1 Station_ID FROM WeatherStations ORDER BY Station_ID DESC";
            SQLquery(query, function (result) {
                if (result.rowsAffected[0] === 0) {
                    var query1 = "INSERT INTO WeatherStations values (10, 'On');";
                    SQLquery(query1, function (result) {
                        res.send("10");
                    });
                }
                else {
                    var newID = result.recordset[0].Station_ID;
                    newID++;
                    var query2 = "INSERT INTO WeatherStations values (" + newID + ", 'On');";
                    SQLquery(query2, function (result) {
                        res.send(newID.toString());
                    });
                }
            });

        }
        else {
            var query = "UPDATE WeatherStations set Station_State = 'On' WHERE Station_ID = " + req.body.ID + "";
            SQLquery(query, function (result) {
                res.send(req.body.ID.toString())
            });
        }
    }
);

router.post('/api/temp', function (req, res) {
    getToken(function (token) {
        if (!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json') !== 0) {
            return res.sendStatus(412);
        }
        else {
            var query = "INSERT INTO Measuredata (Station_ID, time, Temperature_celsius, illuminate) VALUES ('" + req.body.station_ID + "','" + getTime() + "'," + req.body.Temperature + "," + req.body.Illuminance + ")";
            SQLquery(query, function (result) {
                if (result) {
                    postData(req.body,token, function (error) {
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