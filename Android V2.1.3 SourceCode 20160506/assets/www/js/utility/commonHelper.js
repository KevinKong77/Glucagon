var commonHelper = {
    newGuid: function () {
        var guid = '';
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += '-';
        }
        return guid;
    },

    newTempID: function () {
        var me = this;

        var currentDate = new Date();
        var fullYear = currentDate.getFullYear().toString();
        var fullMonth = currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1).toString() : (currentDate.getMonth() + 1).toString();
        var fullDate = currentDate.getDate() < 10 ? '0' + currentDate.getDate().toString() : currentDate.getDate().toString();
        var fullHour = currentDate.getHours() < 10 ? '0' + currentDate.getHours().toString() : currentDate.getHours().toString();
        var fullMinute = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
        var fullSecond = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds().toString() : currentDate.getSeconds().toString();

        var returnValue = fullYear + fullMonth + fullDate + fullHour + fullMinute + fullSecond;
        returnValue = Math.round(returnValue);
        if (tempGuidIdentifier[0] != returnValue) {
            tempGuidIdentifier[0] = returnValue;
            tempGuidIdentifier[1] = 0;
        }
        else {
            tempGuidIdentifier[1] = tempGuidIdentifier[1] + 1;
        }

        returnValue = parseInt(tempGuidIdentifier[0].toString() + tempGuidIdentifier[1].toString());

        return returnValue;
    },

    isNullOrEmpty: function (value) {
        if (value == null)
            return true;

        if (value == undefined)
            return true;

        if (value == 'undefined')
            return true;

        if (Ext.String.trim(value.toString()) == '')
            return true;

        return false;
    },

    isNullObject: function (value) {
        if (value == null)
            return true;

        if (value == undefined)
            return true;

        return false;
    },

    isNotNumber: function (value) {
        if (!this.isNullOrEmpty(value)) {
            return !isFinite(value);
        }
        else {
            return true;
        }
    },

    isTouchDevice: function () {
        return Ext.feature.has.Touch;
    },

    isIOS: function () {
        if (((/ipad/gi).test(window.navigator.appVersion)) || ((/iphone/gi).test(window.navigator.appVersion))) {
            return true;
        }

        return false;
    },

    isIPhone: function () {
        if ((/iphone/gi).test(window.navigator.appVersion)) {
            return true;
        }

        return false;
    },

    isAndroid: function () {
        if (((/android/gi).test(window.navigator.appVersion)) || ((/Linux/gi).test(window.navigator.appVersion))) {
            return true;
        }

        return false;
    },

    isNexus: function () {
        if (this.isAndroid()) {
            if ((/Nexus/gi).test(window.navigator.appVersion)) {
                return true;
            }

            return false;
        }

        return false;
    },

    isStandalone: function () {
        if (this.isIpad()) {
            return window.navigator.standalone;
        }

        return false;
    },

    isNumberFieldType: function (fieldTypeName) {
        if (
            fieldTypeName.toLowerCase().indexOf('int') >= 0
            || fieldTypeName.toLowerCase().indexOf('double') >= 0
            || fieldTypeName.toLowerCase().indexOf('float') >= 0
            || fieldTypeName.toLowerCase().indexOf('decimal') >= 0
        ) {
            return true;
        }

        return false;
    },

    getNavigatorInfo: function () {
        var returnValue = '';

        returnValue += 'appCodeName:' + window.navigator.appCodeName;
        returnValue += '<br/>' + 'appName:' + window.navigator.appName;
        returnValue += '<br/>' + 'appVersion:' + window.navigator.appVersion;
        returnValue += '<br/>' + 'cookieEnabled:' + window.navigator.cookieEnabled;
        returnValue += '<br/>' + 'language:' + window.navigator.language;
        returnValue += '<br/>' + 'onLine:' + window.navigator.onLine;
        returnValue += '<br/>' + 'platform:' + window.navigator.platform;
        returnValue += '<br/>' + 'vendor:' + window.navigator.vendor;
        returnValue += '<br/>' + 'isStandalone:' + window.navigator.standalone;

        return returnValue;
    },

    destroyElement: function (parentId) {
        if (this.isNullOrEmpty(Ext.get(parentId))) {
            return;
        }

        for (var i = Ext.get(parentId).dom.children.length - 1; i >= 0; i--) {
            this.destroyChildElements(Ext.get(parentId).dom.children[i]);
        }
    },

    destroyChildElements: function (parentObj) {
        if (this.isNullObject(parentObj)) {
            return;
        }

        if (this.isNullObject(parentObj.children) || parentObj.children.length == 0) {
            return;
        }

        for (var i = parentObj.children.length - 1; i >= 0; i--) {
            this.destroyChildElements(parentObj.children[i]);
        }

        if (!this.isNullOrEmpty(Ext.getDom(parentObj).id)) {
            Ext.get(Ext.getDom(parentObj).id).removeListener();
            Ext.get(Ext.getDom(parentObj).id).destroy();
        }
    }
}