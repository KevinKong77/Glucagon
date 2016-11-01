var maskHelper = {
    loadMask: null,

    createMask: function (index, message) {
        if (maskHelper.loadMask != null) {
            maskHelper.loadMask.destroy();
        }

        if (commonHelper.isNullOrEmpty(message))
            message = 'Loading...'

        maskHelper.loadMask = Ext.create('Ext.LoadMask', {
            message: message,
            zIndex: 9999 + index,
            html: '',
            fullscreen: true
        });

        maskHelper.loadMask.hide();
    },

    createHiddenMask: function (index) {
        if (maskHelper.loadMask != null) {
            maskHelper.loadMask.destroy();
        }
        
        maskHelper.loadMask = Ext.create('Ext.Mask', {
            zIndex: 9999 + index,
            fullscreen: true
        });

        maskHelper.loadMask.hide();
    },

    openMask: function () {
        if (maskHelper.loadMask != null) {
            maskHelper.loadMask.show();
        }
    },

    setNewMessage: function (msg) {
        if (maskHelper.loadMask != null) {
            maskHelper.loadMask.setMessage(msg);
            maskHelper.loadMask.updateHtml('');
        }
        else {
            this.createMask(1, msg);
            this.openMask();
        }
    },

    refreshProgressValue: function (value) {
        var html = '';
        html += '<div class="loadMask">';
        html += '<div class="loadPercent">' + formatHelper.toPercent(value, 1) + '&nbsp;%&nbsp;completed' + '</div>';
        html += '<div style="width: ' + formatHelper.toPercent(value, 2) + '%;" class="loadProgress"></div>';
        html += '</div>';

        if (maskHelper.loadMask != null) {
            maskHelper.loadMask.updateHtml(html);
        }
        else {
            this.createMask(1, '');
            this.openMask();
            maskHelper.loadMask.updateHtml(html);
        }
    },

    closeMask: function () {
        if (maskHelper.loadMask != null) {
            maskHelper.loadMask.hide();
        }
    }
};
