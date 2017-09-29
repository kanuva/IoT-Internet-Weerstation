module.exports = function getTime() {
    var date = new Date();
    date.setHours(date.getHours() + 2);
    return date.toISOString().replace('Z', '');
};