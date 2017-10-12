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
        storeNewID(req.body.ID, function (result) {
            console.log("result: " + result);
            res.send(result);
        });
    }
);

router.post('/api/temp', function (req, res) {
    if (!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json') !== 0) {
        return res.sendStatus(412);
    }
    else {
        var query = "INSERT INTO Measuredata (Station_ID, time, Temperature_celsius, illuminate) VALUES ('" + req.body.station_ID + "','" + getTime() + "'," + req.body.Temperature + "," + req.body.Illuminance + ")";
        SQLquery(query, function (result) {
            if (result) {
                postData(req.body, function (error) {
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

module.exports = router;