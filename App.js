//config express
var express = require('express'),
    bodyParser = require('body-parser'),
    sql = require('mssql'),
    request = require('request'),
    Athentication = require('./lib/Authentication.js');
var app = express();
var token;
var tokenExpired;

app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    askTemp();
});

//config DB
var sqlConfig = {
    user: 'sa',
    password: 'Sebascent123',
    server: 'localhost',
    database: 'IoT_Weerstation_Gateway'
};

//GET routes
app.get('/', function (req, res) {
    getToken(function () {
        console.log();
        res.send(token);
    });
});

app.get('/api/groet/:naam', function (req, res) {
    res.send('Hello ' + req.params.naam);
});

//POST routes
app.post('/api/report', function (req, res) {
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
                else{
                    var newID = result.recordset[0].Station_ID;
                    newID++;
                    console.log(newID);
                    var query2 = "INSERT INTO WeatherStations values ("+newID+", 'On');";
                    SQLquery(query2, function (result) {
                        res.send(newID.toString());
                    });
                }
            });

        }
        else {
            var query = "UPDATE WeatherStations set Station_State = 'On' WHERE Station_ID = "+req.body.ID+"";
            SQLquery(query, function (result) {
                res.send(req.body.ID.toString())
            });
        }
    }
);

app.post('/api/temp', function (req, res) {
    getToken(function () {
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
});


//functies
function postData(body, _callback) {
    request.post({
        url: "http://iot.jorgvisch.nl/api/weather",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: {
            "Weatherstation": body.station_ID,
            "Timestamp": getTime() + '0000+02:00',
            "Temperature": body.Temperature,
            "Illuminance": body.Illuminance
        },
        json: true
    }, function (error, response, body) {
        //console.log("error: " + error);
        _callback(error);
        //console.log(response);
        //console.log(body);
    });
}

function getToken(_callback) {
    var newExpireDate = new Date();
    newExpireDate.setHours(newExpireDate.getHours() + 4);
    newExpireDate = newExpireDate.toISOString().replace('Z', '');

    var currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);
    currentTime = currentTime.toISOString().replace('Z', '');
    if (tokenExpired < getTime()) {
        askNewToken(newExpireDate, function (Token) {
            tokenExpired = newExpireDate;
            token = Token.access_token;
            _callback();
            return Token.access_token;
        });
    }
    else if (!token) {
        var query = "SELECT top 1 Access_token, Expire_time FROM Token where Issued_time < GETDATE() AND Expire_time > GETDATE() order by Issued_time desc";
        SQLquery(query, function (result) {
            if (result.rowsAffected[0] === 0) {
                askNewToken(newExpireDate, function (Token) {
                    tokenExpired = newExpireDate;
                    _callback();
                    return Token.Access_token;
                });
            }
            else if (result.rowsAffected[0] > 0) {
                tokenExpired = result.recordset[0].Expire_time.toISOString();
                token = result.recordset[0].Access_token;
                _callback();
                return result.recordset[0].Access_token;
            }
        });
    }
    else if (token && tokenExpired > currentTime) {
        _callback();
        return token;
    }
}


function askNewToken(date, _callback) {
    request({
        url: "http://iot.jorgvisch.nl/Token",
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "grant_type=password&username=" + Athentication.username + "&password=" + Athentication.password + "",
        json: true
    }, function (error, response, body) {
        token = 'Bearer ' + body.access_token;
        var query = "INSERT INTO Token values ('Bearer " + body.access_token + "','" + getTime() + "','" + date + "')";
        SQLquery(query, function (result) {
            token = "Bearer " + body.access_token;
            tokenExpired = date;
            _callback(body);
        });
    });
}


function getTime() {
    var date = new Date();
    date.setHours(date.getHours() + 2);
    return date.toISOString().replace('Z', '');
}

function SQLquery(query, _callback) {
    sql.connect(sqlConfig).then(function (conn) {
        new sql.Request(conn).query(query).then(function (err, recordset) {
            sql.close();
            _callback(err);
        }).catch(function (err) {
            sql.close();
            console.log(err);
            _callback(false);
        })
    })
}

function askTemp() {
    //HIER KOMT DE FUNCTIE OM ELKE 10 MINUTEN AAN ALLE STATION ID'S DIE AANSTAAN DE TEMP TE VRAGEN
    var query = "SELECT Station_ID from WeatherStations WHERE Station_State = 'On'";
    SQLquery(query, function (result) {
        for (var i= 0; i < result.recordset.length; i++) {
            console.log(result.recordset[i].Station_ID);
        }
    });
    console.log("Ik herhaal dit doodleuk elke 10 seconden");
    setTimeout(askTemp, 10000)
}