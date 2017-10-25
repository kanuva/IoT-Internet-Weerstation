module.exports = {
    getTime: function () {
        return calculateDate(2).toISOString().replace('Z', '');
    },

    getFutureTime: function () {
        return calculateDate(4).toISOString().replace('Z', '');
    }
};

function calculateDate(hoursToAdd) {
    var date = new Date();
    date.setHours(date.getHours() + hoursToAdd);
    return date
}
