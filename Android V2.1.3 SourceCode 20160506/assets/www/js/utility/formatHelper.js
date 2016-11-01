var formatHelper = {
    toRound: function (value, decimals) {
        if (decimals == null || decimals == 0) {
            return parseInt(value);
        }

        var base = Math.pow(10, decimals);
        var f_x = Math.round(value * base) / base;

        return f_x;
    },

    toInteger: function (value) {
        if (commonHelper.isNotNumber(value)) {
            value = 0;
        }
        return Math.round(value);
    },

    toFloat: function (value, decimals) {
        if (commonHelper.isNotNumber(value)) {
            value = 0;
        }

        if (commonHelper.isNullOrEmpty(decimals)) {
            var dotIndex = value.toString().indexOf('.');

            if (dotIndex < 0) {
                decimals = 0;
            }
            else {
                var intLength = value.toString().substr(0, dotIndex).length;
                decimals = value.toString().length - intLength - 1;
            }
        }

        return this.toRound(value, decimals);
    },

    toBoolean: function (value) {
        var tempValue = value.toString().toUpperCase();

        if (tempValue == 'TRUE' || tempValue == '1') {
            return true;
        }
        return false;
    },

    toPercent: function (value, decimals) {
        if (commonHelper.isNotNumber(value)) {
            value = 0;
        }

        return this.toFloat(value * 100.0, decimals);
    },

    reFormatNegative: function (value) {
        if (commonHelper.isNotNumber(value)) {
            return '';
        }

        if (value < 0) {
            return '(' + Math.abs(value) + ')';
        }
        else {
            return value.toString();
        }
    },

    toAccountingString: function (value, decimals) {
        var isNegative = false;
        if (value.toString().indexOf('-') == 0) {
            isNegative = true;
        }
        var absValue = value.toString().replace('-', '');
        var tmpStr;

        var intStr = Math.floor(absValue).toString();
        var decimalsStr = absValue.toString().substring(intStr.length); //include dot symbol

        if (intStr.length <= 3) {
            tmpStr = absValue.toString();
        }
        else {
            var commaCount = Math.floor(intStr.length / 3);
            var commaLeftStr = intStr.substr(0, intStr.length - commaCount * 3);
            var commaRightStr = intStr.substring(intStr.length - commaCount * 3);
            tmpStr = commaLeftStr + (commonHelper.isNullOrEmpty(commaLeftStr) ? '' : ',');

            for (var i = 0; i < commaCount; i++) {
                tmpStr += commaRightStr.substr(i * 3, 3);
                if (i < commaCount - 1) {
                    tmpStr += ',';
                }
            }

            tmpStr += decimalsStr;
        }

        if (commonHelper.isNullOrEmpty(decimals)) {

        }
        else {
            var zeroCount = 0;
            var dotIndex = tmpStr.indexOf('.');
            if (dotIndex < 0) {
                zeroCount = decimals;
            }
            else {
                zeroCount = decimals - (tmpStr.length - dotIndex - 1);
                if (zeroCount < 0) {
                    zeroCount = -1 * zeroCount;
                }
            }

            if (zeroCount == decimals) {
                tmpStr += '.';
            }

            for (var i = 0; i < zeroCount; i++) {
                tmpStr += '0';
            }
        }

        if (isNegative) {
            tmpStr = '-' + tmpStr;
        }

        return tmpStr;
    },

    fromPercent: function (value) {
        if (commonHelper.isNotNumber(value)) {
            value = 0;
        }

        var decimalLength;

        var dotIndex = value.toString().indexOf('.');

        if (dotIndex < 0) {
            decimalLength = 2;
        }
        else {
            var intLength = value.toString().substr(0, dotIndex).length;
            decimalLength = value.toString().length - intLength - 1 + 2;
        }

        return this.toFloat(value / 100, decimalLength);
    },

    toHexColor: function (r, g, b) {
        var hex = '#';
        var hexStr = '0123456789ABCDEF';
        // R
        low = r % 16;
        high = (r - low) / 16;
        hex += hexStr.charAt(high) + hexStr.charAt(low);
        // G
        low = g % 16;
        high = (g - low) / 16;
        hex += hexStr.charAt(high) + hexStr.charAt(low);
        // B
        low = b % 16;
        high = (b - low) / 16;
        hex += hexStr.charAt(high) + hexStr.charAt(low);

        return hex;
    },

    toArrayValue: function (arr, field) {
        var ln = arr.length;
        var nArr = new Array();
        for (var i = 0; i < ln; i++)
            nArr.push(arr[i][field]);

        return nArr;
    },

    toTimeFormat: function (date) {
        return date.getTime();
    },

    stringToHex: function (s) {
        var r = '';
        var hexes = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
        for (var i = 0; i < s.length; i++) {
            r += hexes[s.charCodeAt(i) >> 4] + hexes[s.charCodeAt(i) & 0xf];
        }

        return r;
    },

    hexToString: function (s) {
        var r = '';
        for (var i = 0; i < s.length; i += 2) {
            var sxx = parseInt(s.substring(i, i + 2), 16);
            r += String.fromCharCode(sxx);
        }
        return r;
    }
}