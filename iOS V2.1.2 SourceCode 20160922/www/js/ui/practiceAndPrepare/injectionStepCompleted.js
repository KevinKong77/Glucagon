Ext.define(enumPageInfo.injectionStepCompleted.nameSpace, {
    alias: [enumPageInfo.injectionStepCompleted.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStepCompleted.name,
    isPainted: false,

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,

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
                html: '<div class="main">'
                            + '<div class="injection_step injection_step_completed fixed_height">'
                                + '<div class="tips">'
                                    + '<p>You have completed the practice steps. Keep in mind that these are not the complete instructions. For complete instructions on how to administer Glucagon, please see the <a id="link_' + me.name + '_GotoInformationForUser">Information for the User</a>.</p>'
                                + '</div>'
                                + '<ul class="btn">'
                                    + '<li id="li_' + me.name + '_Repeat"><a>Repeat Practice</a></li>'
                                    + '<li id="li_' + me.name + '_GotoHome"><a>Return to Home Screen</a></li>'
                                + '</ul>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            me.init();
                            Base.zoomViewport();

                            Ext.get('link_' + me.name + '_GotoInformationForUser').on('tap', function () {
                                Base.gotoPage(enumPageInfo.informationForUser);
                            }, me);

                            me.isPainted = true;
                        }

                        maskHelper.closeMask();
                    },
                    hide: function (sender, eOpts) {

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

    init: function () {
        var me = this;
        var methodName = me.name + '.init';

        try {
            Ext.get('li_' + me.name + '_Repeat').on('tap', function (sender, event) {
                Base.gotoPage(enumPageInfo.injectionStepGuide);
            });

            Ext.get('li_' + me.name + '_GotoHome').on('tap', function (sender, event) {
                msgHelper.showCustomConfirm('Set a reminder', 'Would you like a reminder to practice these steps in 3 months?', 'No', 'Yes', function (btn) {
                    if (btn == 'yes') {
                        var uniqueID = 1;
                        var orderNumber = 1;
                        var scheduledTime = new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000);

                        var insertNoticeParams = [
                            [
                                uniqueID,
                                orderNumber,
                                scheduledTime
                            ]
                        ];

                        localDB.getMyLocalNotifications(uniqueID, null, function (records) {
                            var resetLocalNotificationFun = function () {
                                localDB.insertNotifications(uniqueID, null, insertNoticeParams, function () {
                                    localNotification.insertForPractice(uniqueID, orderNumber, scheduledTime, function () {
                                        msgHelper.showCustomAlert('A reminder has been set', 'You will receive a reminder in 3 months to practice these steps again.', function () {
                                            Base.gotoPage(enumPageInfo.landing);
                                        });
                                    });
                                });
                            };

                            if (commonHelper.isNullOrEmpty(records) || records.length == 0) {
                                resetLocalNotificationFun();
                            }
                            else {
                                var cancellingIds = new Array();

                                for (var i = 0; i < records.length; i++) {
                                    cancellingIds.push(parseInt(records[i][appConfig.myLocalNotifications.fields.kitUniqueID.fieldName]) * 100 + parseInt(records[i][appConfig.myLocalNotifications.fields.orderNumber.fieldName]));
                                }

                                if (commonHelper.isTouchDevice() && cancellingIds != null && cancellingIds.length > 0) {
                                    localNotification.cancelByIds(cancellingIds, resetLocalNotificationFun);
                                }
                                else {
                                    resetLocalNotificationFun();
                                }
                            }
                        });
                    }

                    if (btn == 'no') {
                        Base.gotoPage(enumPageInfo.landing);
                    }
                });
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});