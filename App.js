//config express
var express = require('express'),
    bodyParser = require('body-parser'),
    sql = require('mssql'),
    request = require('request');
var app = express();
var token;

app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

//config DB
var sqlConfig = {
    user: 'sa',
    password: 'Sebascent123',
    server: 'localhost',
    database: 'IoT_Week2'
};

//GET routes
app.get('/', function (req, res) {
    request.get({
        url: 'http://iot.jorgvisch.nl/api/Time',
        headers: {
            Authorization: 'Bearer oPczmuUXynd-V-I7YcLgyxe7tugaeMfGN9U2rsv8fgu5RNwvoQEjRi_9bcai3xiIBZsS0yD4KHuJJX6KZHZruUOGm0tkx-oHBMhym1cyqGzKD-8THFd9Jj9dSfz1L55Ka-vSZj9ybOyT8c-aHkl--HlHcd8PWRIVM7OnWBQQ7g4ike4nq2HENOpVhoQ3cT3X_tg5N5NYp0JeT3IMcD5KqA2e2L3B8vWn0pSQ5rX_VEQct1Bf-981LJBPi6iNU_bUpCdCDQhff17278SgjVo7Wiy9FQeJi-uNTHI6FIALcYXTBRo7846X-D5OashNJdFGjJBR7saDSlHcJcdWnhNOQ3bz26T1a1GLvWQ8B69FB129PJUMMaZJq0yfrEC-9RKazYNn8htlNFx4QGJWV9a04QiKFCc0MM5eBVgQh67CZYKWeH1SObpPu33NFV1bJ-nlRaNb6S-JRWxoZGkIuCukwdZ3PqC_A4PFS_6YbxlieHp24BZYaNjOCvgzUyxIhtlU'
        }
    }).on('response',
        function (error, response, body) {
            console.log(response);
        });
    var date = new Date();
    date.setHours(date.getHours() + 2);
    res.send('tijd: ' + date.toISOString().replace('Z', '') + '000Z+02:00');
});
app.get('/api/groet/:naam', function (req, res) {
    res.send('Hello ' + req.params.naam);
});

//POST routes
app.post('/api/temp', function (req, res) {
    if (!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json') !== 0) {
        return res.sendStatus(412);
    }
    sql.connect(sqlConfig).then(function (conn) {
        new sql.Request(conn).query('INSERT INTO Temperatuur VALUES (' + req.body.Temperature + ')').then(function (err, recordset) {
            sql.close();
            postData(req.body);
            return res.sendStatus(200);
        }).catch(function (err) {
            console.log(err);
            sql.close();
            return res.sendStatus(500);
        })
    })
});


//functies
function postData(body) {
    var date = new Date();
    date.setHours(date.getHours() + 2);
    request.post({
        url: "http://iot.jorgvisch.nl/api/weather",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer qqmNkj4r3vO99K80yDTgj_ilbuIU4ulJWLTh4xhURVgUA9mpBeARNIN1x3b0u3DGjSl0YaWf2ABDK1r0zI_o9UU34oaMAbqbKaF4R4IyKF2YbQwLKs5PH1IZtMyKJNCdRGzFWjG-0n1tVJvVOHpxTDvRvMCBH_1YLb07vIN8I84dHYb4T9DZPb8qZrPnqpGv7Y4SmHLxq0yhMdBJDabeu4QB7Z1W92EYU67fCYsx--WJYgm_JNNPy5KmpzXXV4F2Vbf9LynC3CwDa6dm2kSMyYRjp-ebf5JuWdRpMAZO5SrkYeWwK5kxNKpb_Ai275mwvW5W40SaIsWMqgomEPR8Fc1flBSiVZsMPiGu3E0FYcNIEUreXB4ikwtBjTHyjsrKLZXB0_i1C4FcqhB7viI02ykH8OwkWjJ0hnishvHcEROGVsDBqRZevIz0mPo9NZZpCek7HMjuLgQUPufYC0GJlHrwc4cfeL19skn3YTu9xelye89bjhtJqWB1dBMfSn_w'
        },
        body: {
            "Weatherstation": body.station_ID,
            "Timestamp": date.toISOString().replace('Z', '') + '0000+02:00',
            "Temperature": body.Temperature,
            "Illuminance": body.Illuminance
        },
        json: true
    }, function (error, response, body) {
        console.log("error: " +error);
        //console.log(response);
        //console.log(body);
    });
}

function getToken() {
    if (!token) {
        request({
            url: "http://iot.jorgvisch.nl/Token",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=password&username=vincent_vanrossum@hotmail.com&password=Sebascent!123",
            json: true
        }, function (error, response, body) {
            if (body.error.match(/tokenrequest_overload.*/)) {
                console.log(response);
            }
            token = 'Bearer ' + body.access_token;
            console.log(body);
        });
    }
}

// function getLoginpage() {
//     request.get({
//         url: 'http://iot.jorgvisch.nl/Account/Login'
//     }).on('response',
//         function (error, response, body) {
//
//         //Hier probeer ik in te loggen op jorgvisch.nl
//
//             request.post({
//                 url: 'http://iot.jorgvisch.nl/Account/Login',
//                 headers: {
//                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//                     "Content-Type": "application/x-www-form-urlencoded"
//                 },
//                 body:
//                     "__RequestVerificationToken=8MkrngbDJs128umplmLjmQdavv-RsImtYU3_gX-vgJD7sqFMugoYNvLEEKCcNMf-0q_ybcZAP5q_l1UvYsvqrdSiErIqggthma2NjMmJ4Sc1&Email=vincent_vanrossum@hotmail.com&password=Sebascent!123"
//             }).on('response',
//                 function (err, resp, bod) {
//
//                     //Als het inloggen gelukt is probeer ik hier het resetrokenrequest form aan te vragen
//
//                     request.post({
//                         url: 'http://iot.jorgvisch.nl/Manage/ResetTokenRequest',
//                         headers: {
//                             'Content-type': 'application/x-www-form-urlencoded'
//                         },
//                         body: "resettoken=Reset token"
//                     }).on('response',
//                         function (err, resp, bod) {
//                             console.log(bod);
//                         })
//                 })
//         });
// }