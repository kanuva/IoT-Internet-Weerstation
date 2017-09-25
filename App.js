//config express
var express = require('express'),
    bodyParser = require('body-parser'),
    sql = require('mssql');
var app = express();
app.use(bodyParser.json());

//config DB
var sqlConfig = {
    user: 'sa',
    password: 'Sebascent123',
    server: 'localhost',
    database: 'IoT_Week2'
};

//GET routes
app.get('/', function (req, res) {
    res.send('Hello World!')
});
app.get('/api/groet/:naam', function (req,res) {
    res.send('Hello ' +req.params.naam);
});

//POST routes
app.post('/api/temp', function(req,res) {
    console.log("binnengekomen temp is: " +req.body.celsius);
    sql.connect(sqlConfig).then(function(conn) {
        new sql.Request(conn).query('INSERT INTO Temperatuur VALUES ('+req.body.celsius+')').then(function(err,recordset){
            sql.close();
            return res.sendStatus(200);
        }).catch(function (err){
            console.log(err);
            sql.close();
            return res.sendStatus(500);
        })
    })
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});