var token;
var tokenExpired;
var SQLquery = require('./SQL Functions.js'),
    request = require('request'),
    getTime = require('../Functions/Time Functions.js'),
    Authentication = require('../Authentication/JorgVischServer');


module.exports = function getToken(_callback) {
    if (tokenExpired < getTime.getTime()) {
        //console.log("Server moet een nieuwe token aanvragen omdat deze verlopen is");
        askNewToken(getTime.getFutureTime(), function (Token) {
            tokenExpired = getTime.getFutureTime();
            token = Token.access_token;
            _callback(token);
            return Token.access_token;
        });
    }
    else if (!token) {
        //console.log("Server heeft nog geen token, dus ik ga kijken of ik iets in de DB heb staan");
        var query = "SELECT top 1 Access_token, Expire_time FROM Token where Issued_time < GETDATE() AND Expire_time > GETDATE() order by Issued_time desc";
        SQLquery(query, function (result) {
            if (result.rowsAffected[0] === 0) {
                //console.log("Er stond niks in de DB dus ik moest naar de server voor een nieuw token");
                askNewToken(getTime.getFutureTime(), function (Token) {
                    tokenExpired = getTime.getFutureTime();
                    _callback(token);
                    return Token.Access_token;
                });
            }
            else if (result.rowsAffected[0] > 0) {
                //console.log("Er stond wel iets in de DB wat voldeed aan de vraag, nieuw token wordt gezet");
                tokenExpired = result.recordset[0].Expire_time.toISOString();
                token = result.recordset[0].Access_token;
                _callback(token);
                return result.recordset[0].Access_token;
            }
        });
    }
    else if (token && tokenExpired > getTime.getTime()) {
        //console.log("er is gewoon een token...");
        _callback(token);
        return token;
    }
};

function askNewToken(date, _callback) {
    request({
        url: "http://iot.jorgvisch.nl/Token",
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "grant_type=password&username=" + Authentication.username + "&password=" + Authentication.password + "",
        json: true
    }, function (error, response, body) {
        token = 'Bearer ' + body.access_token;
        var query = "INSERT INTO Token values ('Bearer " + body.access_token + "','" + getTime.getTime() + "','" + date + "')";
        SQLquery(query, function (result) {
            token = "Bearer " + body.access_token;
            tokenExpired = date;
            _callback(body);
        });
    });
}