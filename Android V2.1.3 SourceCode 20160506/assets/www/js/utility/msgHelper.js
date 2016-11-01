var msgHelper = {
    showAlert: function (title, message, callback) {
        callback = commonHelper.isNullObject(callback) ? Ext.emptyFn : callback;

        window.setTimeout(function () {
            Ext.Msg.alert(title, message, callback);
            Ext.Msg.setZIndex(99999);
        }, 100);
    },

    showPrompt: function (title, message, callback) {
        var me = this;

        window.setTimeout(function () {
            Ext.Msg.prompt(title, message, function (btn, text) {
                callback(btn, text);
            });
            Ext.Msg.setZIndex(99999);
        }, 100);
    },

    showConfirm: function (title, message, callback) {
        var me = this;

        window.setTimeout(function () {
            Ext.Msg.confirm(title, message, function (buttonId, value, opt) {
                callback(buttonId);
            });
            Ext.Msg.setZIndex(99999);
        }, 100);
    },

    msgCallBack: null,

    showCustomAlert: function (title, message, callBack) {
        msgHelper.msgCallBack = callBack;
        var titleDisplay = '';
        if (commonHelper.isNullOrEmpty(title)) {
            titleDisplay = 'none';
        }

        if (commonHelper.isNullOrEmpty(Ext.getCmp('divCustomAlert'))) {
            var xx = Ext.create('Ext.Panel', {
                id: 'divCustomAlert',
                cls: 'customMsg',
                modal: true,
                centered: true,
                fullscreen: true,
                zIndex: 9999,
                html: '<div class="cover_bg"></div>'
                        + '<div class="popup_message_3">'
                            + '<div class="title" id="divCustomAlert_Title" style="display:' + titleDisplay + '">' + title + '</div>'
                            + '<p id="divCustomAlert_Content">' + message + '</p>'
                            + '<div class="bottom_act">'
                                + '<a id="divCustomAlert_btnOK" class="full"><strong>OK</strong></a>'
                            + '</div>'
                        + '</div>'
            }).show();

            Ext.get('divCustomAlert_btnOK').on('tap', function () {
                Ext.getCmp('divCustomAlert').hide();
                if (!commonHelper.isNullOrEmpty(msgHelper.msgCallBack)) {
                    msgHelper.msgCallBack();
                }
            });
        }
        else {
            Ext.getCmp('divCustomAlert').show();
            Ext.get('divCustomAlert_Title').dom.innerHTML = title;
            Ext.get('divCustomAlert_Title').dom.style.display = titleDisplay;
            Ext.get('divCustomAlert_Content').dom.innerHTML = message;
        }
    },

    showCustomConfirm: function (title, message, btn1, btn2, callBack) {
        msgHelper.msgCallBack = callBack;
        var titleDisplay = '';
        if (commonHelper.isNullOrEmpty(title)) {
            titleDisplay = 'none';
        }

        if (commonHelper.isNullOrEmpty(Ext.getCmp('divCustomConfirm'))) {
            var xx = Ext.create('Ext.Panel', {
                id: 'divCustomConfirm',
                cls: 'customMsg',
                modal: true,
                centered: true,
                fullscreen: true,
                zIndex: 9999,
                html: '<div class="cover_bg"></div>'
                        + '<div class="popup_message_3">'
                            + '<div class="title" id="divCustomConfirm_Title" style="display:' + titleDisplay + '">' + title + '</div>'
                            + '<p id="divCustomConfirm_Content">' + message + '</p>'
                            + '<div class="bottom_act">'
                                + '<a id="divCustomConfirm_btnLeft">' + btn1 + '</a>&nbsp;'
                                + '<a id="divCustomConfirm_btnRight"><strong>' + btn2 + '</strong></a>'
                            + '</div>'
                        + '</div>'
            }).show();

            Ext.get('divCustomConfirm_btnLeft').on('tap', function () {
                Ext.getCmp('divCustomConfirm').hide();
                if (!commonHelper.isNullOrEmpty(msgHelper.msgCallBack)) {
                    msgHelper.msgCallBack('no');
                }
            });

            Ext.get('divCustomConfirm_btnRight').on('tap', function () {
                Ext.getCmp('divCustomConfirm').hide();
                if (!commonHelper.isNullOrEmpty(msgHelper.msgCallBack)) {
                    msgHelper.msgCallBack('yes');
                }
            });
        }
        else {
            Ext.getCmp('divCustomConfirm').show();
            Ext.get('divCustomConfirm_Title').dom.style.display = titleDisplay;
            Ext.get('divCustomConfirm_Title').dom.innerHTML = title;
            Ext.get('divCustomConfirm_Content').dom.innerHTML = message;
            Ext.get('divCustomConfirm_btnLeft').dom.innerHTML = btn1;
            Ext.get('divCustomConfirm_btnRight').dom.innerHTML = '<strong>' + btn2 + '</strong>';
        }
    },

    showCustomConfirmBottom: function (title, message, btn1, btn2, callBack) {
        msgHelper.msgCallBack = callBack;
        var titleDisplay = '';
        if (commonHelper.isNullOrEmpty(title)) {
            titleDisplay = 'none';
        }

        if (commonHelper.isNullOrEmpty(Ext.getCmp('divCustomConfirmBottom'))) {
            var xx = Ext.create('Ext.Panel', {
                id: 'divCustomConfirmBottom',
                cls: 'customMsg',
                modal: true,
                centered: true,
                fullscreen: true,
                zIndex: 9999,
                html: '<div class="cover_bg"></div>'
                        + '<div class="popup_message_4">'
                            + '<div class="title" id="divCustomConfirmBottom_Title" style="display:' + titleDisplay + '">' + title + '</div>'
                            + '<p id="divCustomConfirmBottom_Content">' + message + '</p>'
                            + '<div class="bottom_act">'
                                + '<a id="divCustomConfirmBottom_btnLeft">' + btn1 + '</a>&nbsp;'
                                + '<a id="divCustomConfirmBottom_btnRight"><strong>' + btn2 + '</strong></a>'
                            + '</div>'
                        + '</div>'
            }).show();

            Ext.get('divCustomConfirmBottom_btnLeft').on('tap', function () {
                Ext.getCmp('divCustomConfirmBottom').hide();
                if (!commonHelper.isNullOrEmpty(msgHelper.msgCallBack)) {
                    msgHelper.msgCallBack('no');
                }
            });

            Ext.get('divCustomConfirmBottom_btnRight').on('tap', function () {
                Ext.getCmp('divCustomConfirmBottom').hide();
                if (!commonHelper.isNullOrEmpty(msgHelper.msgCallBack)) {
                    msgHelper.msgCallBack('yes');
                }
            });
        }
        else {
            Ext.getCmp('divCustomConfirmBottom').show();
            Ext.get('divCustomConfirmBottom_Title').dom.style.display = titleDisplay;
            Ext.get('divCustomConfirmBottom_Title').dom.innerHTML = title;
            Ext.get('divCustomConfirmBottom_Content').dom.innerHTML = message;
            Ext.get('divCustomConfirmBottom_btnLeft').dom.innerHTML = btn1;
            Ext.get('divCustomConfirmBottom_btnRight').dom.innerHTML = '<strong>' + btn2 + '</strong>';
        }
    }
};
