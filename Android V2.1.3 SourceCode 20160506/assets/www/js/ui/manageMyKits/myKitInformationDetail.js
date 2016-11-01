Ext.define(enumPageInfo.myKitInformationDetail.nameSpace, {
    alias: [enumPageInfo.myKitInformationDetail.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.myKitInformationDetail.name,
    isPainted: false,

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,
    locationIsChanging: false,

    constructor: function (config) {
        this.initConfig(config);
    },

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'slide',
                hidden: true,
                html: '<div class="main kit_detail">'
                            + '<div class="top_action">'
                                + '<input type="button" id="btn_' + me.name + '_Cancel" value="Cancel" class="float_l">'
                                + '<input type="button" id="btn_' + me.name + '_Save" value="Save" class="float_r">'
                            + '</div>'
                            + '<h4 id="header_' + me.name + '_NewTitle" class="small_text none">Enter the location and expiration date of your kit, and set expiration date reminder(s).</h4>'
                            + '<ul>'
                                + '<li>'
                                    + '<label><strong>Location</strong></label>'
                                    + '<span id="span_' + me.name + '_Location">Enter kit location</span>'
                                    + '<input type="text" id="txt_' + me.name + '_Location">'
                                + '</li>'
                                + '<li>'
                                    + '<label><strong>Expires</strong></label>'
                                    + '<span id="span_' + me.name + '_Expired">Enter kit expiration date</span>'
                                    + '<input type="text" id="txt_' + me.name + '_Expired">'
                                + '</li>'
                            + '</ul>'
                            + '<h4 id="header_' + me.name + '_UpdateSubTitle" class="none">Set reminders</h4>'
                            + '<h4 id="header_' + me.name + '_NewSubTitle" class="small_text  none">Set reminders (you may select more than one reminder)</h4>'
                            + '<ul>'
                                + '<li id="li_' + me.name + '_EveryDay">'
                                    + '<label class="spe_check" id="lbl_' + me.name + '_EveryDay">'
                                        + '<input type="checkbox"> Every day (last week before expiration)'
                                    + '</label>'
                                + '</li>'
                                + '<li id="li_' + me.name + '_TwoWeeks">'
                                    + '<label class="spe_check" id="lbl_' + me.name + '_TwoWeeks">'
                                        + '<input type="checkbox"> Two weeks before expiration'
                                    + '</label>'
                                + '</li>'
                                + '<li id="li_' + me.name + '_OneMonth">'
                                    + '<label class="spe_check" id="lbl_' + me.name + '_OneMonth">'
                                        + '<input type="checkbox"> One month before expiration'
                                    + '</label>'
                                + '</li>'
                            + '</ul>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.locationIsChanging = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        Ext.get('btn_' + me.name + '_Save').dom.value = 'Save';

                        if (commonHelper.isNullOrEmpty(commonSession.selectedUniqueID)) {
                            localDB.generateKitNewID(function (newID) {
                                commonSession.selectedUniqueID = newID;
                                me.resetForm();
                                document.getElementById('header_' + me.name + '_NewTitle').setAttribute('class', 'small_text');
                                document.getElementById('header_' + me.name + '_UpdateSubTitle').setAttribute('class', 'none');
                                document.getElementById('header_' + me.name + '_NewSubTitle').setAttribute('class', 'small_text');
                                document.getElementById('span_' + me.name + '_Location').style.display = '';
                                document.getElementById('span_' + me.name + '_Expired').style.display = '';
                            });
                        }
                        else {
                            localDB.getMyKit(commonSession.selectedUniqueID, function (record) {
                                if (!commonHelper.isNullObject(record)) {
                                    me.resetForm();

                                    document.getElementById('header_' + me.name + '_NewTitle').setAttribute('class', 'small_text none');
                                    document.getElementById('header_' + me.name + '_UpdateSubTitle').setAttribute('class', '');
                                    document.getElementById('header_' + me.name + '_NewSubTitle').setAttribute('class', 'small_text none');

                                    var expiredDate = new Date(record[appConfig.myKits.fields.expiredTime.fieldName]);
                                    //Ext.getCmp('txt_' + me.name + '_Location').setValue(record[appConfig.myKits.fields.location.fieldName]);
                                    document.getElementById('txt_' + me.name + '_Location').value = record[appConfig.myKits.fields.location.fieldName];
                                    document.getElementById('txt_' + me.name + '_Expired').setAttribute('selDate', expiredDate);
                                    document.getElementById('txt_' + me.name + '_Expired').value = expiredDate.format('FULLDATE').replace(/&nbsp;/g, ' ');

                                    if (parseInt(record[appConfig.myKits.fields.reminderEveryDay.fieldName]) == 1) {
                                        document.getElementById('lbl_' + me.name + '_EveryDay').setAttribute('class', 'spe_check spe_check_sel');
                                    }
                                    if (parseInt(record[appConfig.myKits.fields.reminderTwoWeeksAge.fieldName]) == 1) {
                                        document.getElementById('lbl_' + me.name + '_TwoWeeks').setAttribute('class', 'spe_check spe_check_sel');
                                    }
                                    if (parseInt(record[appConfig.myKits.fields.reminderOneMonthAge.fieldName]) == 1) {
                                        document.getElementById('lbl_' + me.name + '_OneMonth').setAttribute('class', 'spe_check spe_check_sel');
                                    }
                                }

                                if (!commonHelper.isNullOrEmpty(commonSession.selectedDate_EN)) {
                                    document.getElementById('txt_' + me.name + '_Expired').setAttribute('selDate', commonSession.selectedDate);
                                    document.getElementById('txt_' + me.name + '_Expired').value = commonSession.selectedDate_EN.replace(/&nbsp;/g, ' ');
                                }

                                if (commonHelper.isNullOrEmpty(document.getElementById('txt_' + me.name + '_Location').value)) {
                                    document.getElementById('span_' + me.name + '_Location').style.display = '';
                                }
                                else {
                                    document.getElementById('span_' + me.name + '_Location').style.display = 'none';
                                }

                                if (commonHelper.isNullOrEmpty(document.getElementById('txt_' + me.name + '_Expired').getAttribute('selDate'))) {
                                    document.getElementById('span_' + me.name + '_Expired').style.display = '';
                                }
                                else {
                                    document.getElementById('span_' + me.name + '_Expired').style.display = 'none';
                                }
                            });
                        }
                    },
                    hide: function (sender, eOpts) {
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        var txtLocation = document.getElementById('txt_' + me.name + '_Location');
                        if (me.locationIsChanging && !commonHelper.isNullObject(txtLocation)) {
                            txtLocation.blur();
                        }
                    }
                }
            });

            me.setMainPanel(mainPanel);
            return mainPanel;
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    resetForm: function () {
        var me = this;
        var methodName = me.name + '.resetForm';

        try {
            //Ext.getCmp('txt_' + me.name + '_Location').setValue('');
            document.getElementById('txt_' + me.name + '_Location').value = '';
            document.getElementById('txt_' + me.name + '_Expired').removeAttribute('selDate');
            document.getElementById('txt_' + me.name + '_Expired').value = '';
            document.getElementById('lbl_' + me.name + '_EveryDay').setAttribute('class', 'spe_check');
            document.getElementById('lbl_' + me.name + '_TwoWeeks').setAttribute('class', 'spe_check');
            document.getElementById('lbl_' + me.name + '_OneMonth').setAttribute('class', 'spe_check');
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    registerEvent: function () {
        var me = this;
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('txt_' + me.name + '_Location').on('focus', me.txt_Location_FocusEvent, me);
            Ext.get('txt_' + me.name + '_Location').on('input', me.txt_Location_InputEvent, me);
            Ext.get('txt_' + me.name + '_Location').on('blur', me.txt_Location_BlurEvent, me);
            Ext.get('txt_' + me.name + '_Expired').on('tap', me.txt_Expired_FocusEvent, me);
            Ext.get('li_' + me.name + '_EveryDay').on('tap', me.li_EveryDay_CheckEvent, me);
            Ext.get('li_' + me.name + '_TwoWeeks').on('tap', me.li_TwoWeeks_CheckEvent, me);
            Ext.get('li_' + me.name + '_OneMonth').on('tap', me.li_OneMonth_CheckEvent, me);
            Ext.get('btn_' + me.name + '_Cancel').on('tap', me.btn_Cancel_Event, me);
            Ext.get('btn_' + me.name + '_Save').on('tap', me.btn_Save_Event, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    btn_Cancel_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.btn_Cancel_Event';

        try {
            commonSession.selectedUniqueID = null;
            commonSession.selectedDate = null;
            commonSession.selectedDate_EN = null;
            Base.backPage();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    btn_Save_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.btn_Save_Event';

        try {
            if (me.locationIsChanging) {
                me.locationIsChanging = false;
                return;
            }

            var txtLocation = document.getElementById('txt_' + me.name + '_Location');
            //var txtLocation = Ext.getCmp('txt_' + me.name + '_Location');
            var txtExpired = document.getElementById('txt_' + me.name + '_Expired');
            var everyDayCheckObj = document.getElementById('lbl_' + me.name + '_EveryDay');
            var twoWeeksCheckObj = document.getElementById('lbl_' + me.name + '_TwoWeeks');
            var oneMonthCheckObj = document.getElementById('lbl_' + me.name + '_OneMonth');
            var everyDayChecked = everyDayCheckObj.getAttribute('class').indexOf('spe_check_sel') < 0 ? false : true;
            var twoWeeksChecked = twoWeeksCheckObj.getAttribute('class').indexOf('spe_check_sel') < 0 ? false : true;
            var oneMonthChecked = oneMonthCheckObj.getAttribute('class').indexOf('spe_check_sel') < 0 ? false : true;

            if (commonHelper.isNullOrEmpty(txtLocation.value)) {
                msgHelper.showCustomAlert(null, 'Please enter a kit name.', null);
                return;
            }

            if (commonHelper.isNullOrEmpty(txtExpired.value)) {
                msgHelper.showCustomAlert(null, 'Please enter a expired date.', null);
                return;
            }

            var expiredTime = new Date(txtExpired.getAttribute('selDate'));
            var expiredDate = new Date((expiredTime.getMonth() + 1) + '/' + expiredTime.getDate() + '/' + expiredTime.getFullYear());
            var currentTime = new Date();
            var currentDate = new Date((currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear());
            var expiredFullTime = expiredTime.fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

            if (expiredDate <= currentDate) {
                msgHelper.showCustomAlert(null, 'You cannot set a date in the past.', null);
                return;
            }

            if (!everyDayChecked && !twoWeeksChecked && !oneMonthChecked) {
                msgHelper.showCustomAlert(null, 'You must set at least one reminder.', null);
                return;
            }

            var reminderEveryDay = everyDayChecked ? 1 : 0;
            var reminderTwoWeeksAge = twoWeeksChecked ? 1 : 0;
            var reminderOneMonthAge = oneMonthChecked ? 1 : 0;

            var insertNoticeParams = new Array();
            var noticeObjects = new Array();
            var eachNoticeObject = null;
            var scheduledTime;
            var orderNumber = 0;
            var firstNoticeTime;

            if (reminderOneMonthAge == 1 && expiredDate.dateAdd('d', -30) > currentDate) {
                scheduledTime = expiredDate.dateAdd('d', -30).fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                firstNoticeTime = scheduledTime;
                orderNumber++;
                insertNoticeParams.push(
                    [
                        commonSession.selectedUniqueID,
                        orderNumber,
                        scheduledTime
                    ]
                );

                noticeObjects.push(localNotification.createNoticeObject(
                    commonSession.selectedUniqueID * 100 + orderNumber,
                    localNotification.expiredMessage.replace('AAA', txtLocation.value).replace('BBB', expiredDate.format('M/D/Y')),
                    scheduledTime
                ));
            }

            if (reminderTwoWeeksAge == 1 && expiredDate.dateAdd('d', -14) > currentDate) {
                scheduledTime = expiredDate.dateAdd('d', -14).fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                if (commonHelper.isNullOrEmpty(firstNoticeTime)) {
                    firstNoticeTime = scheduledTime;
                }
                orderNumber++;
                insertNoticeParams.push(
                    [
                        commonSession.selectedUniqueID,
                        orderNumber,
                        scheduledTime
                    ]
                );

                noticeObjects.push(localNotification.createNoticeObject(
                    commonSession.selectedUniqueID * 100 + orderNumber,
                    localNotification.expiredMessage.replace('AAA', txtLocation.value).replace('BBB', expiredDate.format('M/D/Y')),
                    scheduledTime
                ));
            }

            if (reminderEveryDay == 1) {
                var triggerDate = currentDate;
                if (triggerDate < expiredDate.dateAdd('d', -7)) {
                    triggerDate = expiredDate.dateAdd('d', -7);
                }
                while (triggerDate < expiredDate) {
                    if (triggerDate == currentDate) {
                        scheduledTime = new Date(new Date().getTime() + 60 * 1000);
                    }
                    else {
                        scheduledTime = triggerDate.fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                    }

                    if (commonHelper.isNullOrEmpty(firstNoticeTime)) {
                        firstNoticeTime = scheduledTime;
                    }

                    orderNumber++;
                    insertNoticeParams.push(
                        [
                            commonSession.selectedUniqueID,
                            orderNumber,
                            scheduledTime
                        ]
                    );

                    noticeObjects.push(localNotification.createNoticeObject(
                        commonSession.selectedUniqueID * 100 + orderNumber,
                        localNotification.expiredMessage.replace('AAA', txtLocation.value).replace('BBB', expiredDate.format('M/D/Y')),
                        scheduledTime
                    ));

                    triggerDate = triggerDate.dateAdd('d', 1);
                }
            }

            var insertParams = [
                commonSession.selectedUniqueID,
                txtLocation.value,
                expiredFullTime,
                firstNoticeTime,
                reminderEveryDay,
                reminderTwoWeeksAge,
                reminderOneMonthAge
            ];

            myKitsManager.insertKit(commonSession.selectedUniqueID, txtLocation.value, insertParams, insertNoticeParams, noticeObjects, function () {
                Base.backPage();
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    txt_Location_FocusEvent: function (sender) {
        var me = this;
        var methodName = me.name + '.txt_Location_FocusEvent';

        try {
            me.locationIsChanging = true;
            Ext.get('btn_' + me.name + '_Save').dom.value = 'Done';
            window.setTimeout(function () {
                sender.target.setSelectionRange(0, sender.target.value.length);
            }, 50);
            //sender.target.focus();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    txt_Location_InputEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.txt_Location_InputEvent';

        try {
            if (commonHelper.isNullOrEmpty(sender.target.value)) {
                document.getElementById('span_' + me.name + '_Location').style.display = '';
            }
            else {
                document.getElementById('span_' + me.name + '_Location').style.display = 'none';
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    txt_Location_BlurEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.txt_Location_BlurEvent';

        try {
            Ext.get('btn_' + me.name + '_Save').dom.value = 'Save';
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    txt_Expired_FocusEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.txt_Expired_FocusEvent';

        try {
            var selectedDate = sender.target.getAttribute('selDate');

            if (commonHelper.isNullOrEmpty(selectedDate)) {
                selectedDate = new Date();
                commonSession.selectedDate_EN = null;
            }
            else {
                selectedDate = new Date(selectedDate);
                commonSession.selectedDate_EN = selectedDate.format('FULLDATE');
            }
            commonSession.selectedDate = selectedDate;
            Base.gotoPage(enumPageInfo.datePicker);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    li_EveryDay_CheckEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.li_EveryDay_CheckEvent';

        try {
            var checkObj = document.getElementById('lbl_' + me.name + '_EveryDay');
            if (checkObj.getAttribute('class').indexOf('spe_check_sel') < 0) {
                checkObj.setAttribute('class', checkObj.getAttribute('class') + ' spe_check_sel');
            }
            else {
                checkObj.setAttribute('class', checkObj.getAttribute('class').replace(' spe_check_sel', ''));
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    li_TwoWeeks_CheckEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.li_TwoWeeks_CheckEvent';

        try {
            var checkObj = document.getElementById('lbl_' + me.name + '_TwoWeeks');
            if (checkObj.getAttribute('class').indexOf('spe_check_sel') < 0) {
                checkObj.setAttribute('class', checkObj.getAttribute('class') + ' spe_check_sel');
            }
            else {
                checkObj.setAttribute('class', checkObj.getAttribute('class').replace(' spe_check_sel', ''));
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    li_OneMonth_CheckEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.li_OneMonth_CheckEvent';

        try {
            var checkObj = document.getElementById('lbl_' + me.name + '_OneMonth');
            if (checkObj.getAttribute('class').indexOf('spe_check_sel') < 0) {
                checkObj.setAttribute('class', checkObj.getAttribute('class') + ' spe_check_sel');
            }
            else {
                checkObj.setAttribute('class', checkObj.getAttribute('class').replace(' spe_check_sel', ''));
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});