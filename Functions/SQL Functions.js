var sql = require('mssql'),
    sqlConfig = require('../Authentication/SQL Authentication.js');

module.exports = function SQLquery(query, _callback) {
    sql.connect(sqlConfig).then(function (conn) {
        new sql.Request(conn).query(query).then(function (err, recordset) {
            sql.close(function () {
                _callback(err);
            });

        }).catch(function (err) {
            sql.close(function () {
                console.log(err);
                _callback(false);
            });
        })
    })
};