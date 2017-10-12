var SQLquery = require('./SQL Functions.js'),
    PostData = require('./Post Data.js');

module.exports = function StoreMeasureData(data, _callback) {
    var query = "INSERT INTO Measuredata VALUES";
    data.forEach(function (item, index) {
        query = query + "("+item[0]+", '"+item[3]+"', "+item[1]+","+item[2]+"),";
    });
    query = query.slice(0, -1);
    SQLquery(query, function (result) {
        PostData(data, function() {

        })
    });
};