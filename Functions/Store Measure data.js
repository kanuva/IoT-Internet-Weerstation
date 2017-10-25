var SQLquery = require('./SQL Functions.js'),
    PostData = require('./Post Data.js'),
    getDate = require('./Time Functions.js');

module.exports = function StoreMeasureData(data, _callback) {

    var query = "INSERT INTO Measuredata VALUES";
    data.forEach(function (item, index) {
        item[3][0] = getDate.timeConversion(item[3][0]);
        item[4][0] = getDate.addTime(item[4][0], item[3][0]);
        item[4][0] = item[4][0].toISOString().replace('Z', '');
        query = query + "("+item[0]+", '"+item[4]+"', "+item[1]+","+item[2]+"),";
    });
    query = query.slice(0, -1);
    SQLquery(query, function (result) {
        PostData(data, function() {

        })
    });
};