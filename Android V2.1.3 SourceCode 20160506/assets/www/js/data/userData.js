var userData = {
    setValue: function (key, value) {
        var me = this;
        var methodName = 'userData.setValue';

        try {
            window.localStorage.removeItem(key);
            window.localStorage.setItem(key, value);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    removeValue: function (key) {
        var me = this;
        var methodName = 'userData.removeValue';

        try {
            window.localStorage.removeItem(key);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    getValue: function (key) {
        var me = this;
        var methodName = 'userData.getValue';

        try {
            return window.localStorage.getItem(key);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
};