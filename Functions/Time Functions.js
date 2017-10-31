module.exports = {
    getTime: function () {
        return calculateDate(1).toISOString().replace('Z', '');
    },

    getFutureTime: function () {
        return calculateDate(3).toISOString().replace('Z', '');
    },
    timeConversion: function (millisec) {
        //Deze functie maak van millisecs de volgende format HH:MM:SS:mmm
        //Get hours from milliseconds
        var hours = millisec / (1000*60*60);
        var absoluteHours = Math.floor(hours);
        var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

        //Get remainder from hours and convert to minutes
        var minutes = (hours - absoluteHours) * 60;
        var absoluteMinutes = Math.floor(minutes);
        var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

        //Get remainder from minutes and convert to seconds
        var seconds = (minutes - absoluteMinutes) * 60;
        var absoluteSeconds = Math.floor(seconds);
        var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


        return {h:parseInt(h), m:parseInt(m), s:parseInt(s), ms:parseInt(millisec.toString().slice(-3))};
        //h + ':' + m + ':' + s  + ':' + millisec.toString().slice(-3);
    },
    addTime: function(datum, TimeToAdd) {
        //telt bij de datum nieuwe tijd bij. De format van TimeToAdd is: HH:MM:SS:mmm, datum is een isostring
        datum.setHours(datum.getHours() + TimeToAdd.h);
        datum.setMinutes(datum.getMinutes() + TimeToAdd.m);
        datum.setSeconds(datum.getSeconds() + TimeToAdd.s);
        datum.setMilliseconds(datum.getMilliseconds() + TimeToAdd.ms);
        return datum;
    }
};

function calculateDate(hoursToAdd) {
    var date = new Date();
    date.setHours(date.getHours() + hoursToAdd);
    return date
}

