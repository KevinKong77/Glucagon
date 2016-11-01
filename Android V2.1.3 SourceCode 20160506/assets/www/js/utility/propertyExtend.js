String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.allTrim = function () {
    return this.replace(/ /g, "");
}

Array.prototype.contain = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            return true;
        }
    }

    return false;
}

Array.prototype.containProperty = function (item, pName) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][pName] == item) {
            return true;
        }
    }

    return false;
}

Date.prototype.format = function (formating) {
    var monthEN = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    var weekEN = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'
    ];

    switch (formating) {
        case "WM": //week + month
            return weekEN[this.getDay()] + '&nbsp;' + monthEN[this.getMonth()];
            break;
        case "W": //week
            return weekEN[this.getDay()];
        case "FULLTIME": //week days mon year hh: mm
            var hours = this.getHours();
            if (hours.toString().length == 1) {
                hours = '0' + hours.toString();
            }
            var mins = this.getMinutes();
            if (mins.toString().length == 1) {
                mins = '0' + mins.toString();
            }
            return weekEN[this.getDay()] + '&nbsp;' + this.getDate() + '&nbsp;' + monthEN[this.getMonth()] + '&nbsp;' + this.getFullYear() + '&nbsp;' + hours.toString() + ':' + mins.toString();
        case "FULLDATE": //week, MON DATE, YEAR
            return weekEN[this.getDay()] + ',&nbsp;' + monthEN[this.getMonth()] + '&nbsp;' + this.getDate() + ',&nbsp;' + this.getFullYear();
        case "M/D/Y":
            return this.getMonth() + 1 + '/' + this.getDate() + '/' + this.getFullYear();
        case "M/D/Y hh:mm:ss":
            return this.getMonth() + 1 + '/' + this.getDate() + '/' + this.getFullYear() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
        default:
            return this.toString();
            break;
    }
}

Date.prototype.dateAdd = function (interval, number) {
    var date = new Date(this);
    switch (interval.toLowerCase()) {
        case "y": return new Date(date.setFullYear(this.getFullYear() + number));
        case "m": return new Date(date.setMonth(this.getMonth() + number));
        case "d": return new Date(date.setDate(this.getDate() + number));
        case "w": return new Date(date.setDate(this.getDate() + 7 * number));
        case "h": return new Date(date.setHours(this.getHours() + number));
        case "n": return new Date(date.setMinutes(this.getMinutes() + number));
        case "s": return new Date(date.setSeconds(this.getSeconds() + number));
        case "l": return new Date(date.setMilliseconds(this.getMilliseconds() + number));
    }
}

Date.prototype.fillHMS = function (hours, mins, seconds) {
    var date = new Date(this);

    date.setHours(hours);
    date.setMinutes(mins);
    date.setSeconds(seconds);

    return new Date(date);
}

Date.prototype.greatThan = function (dateCompare, days) {
    var selfValue = this.getFullYear() * 10000 + (this.getMonth() + 1) * 100 + this.getDate();
    if (!commonHelper.isNullOrEmpty(days)) {
        dateCompare = dateCompare.dateAdd('d', formatHelper.toInteger(days));
    }
    var compareValue = dateCompare.getFullYear() * 10000 + (dateCompare.getMonth() + 1) * 100 + dateCompare.getDate();
    return selfValue >= compareValue;
}