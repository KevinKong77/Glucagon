var localNotification = {
    expiredMessage: 'Your Glucagon Kit \"AAA\" will expire on BBB. After that time, do not use it in an emergency situation.',
    repeatPracticeMessage: 'This is your 3-month reminder to practice the injection steps for Glucagon.',

    defaultObject: {
        title: 'Glucagon Notification',
        icon: 'icon',
        smallIcon: 'icon',
        sound: commonHelper.isAndroid() ? 'file://sounds/beep.mp3' : 'file://sounds/beep.caf',
        badge: 1
    },

    createNoticeObject: function (id, text, at) {
        var me = this;

        var newObject = {
            id: id,
            text: text,
            at: at
        };

        $.extend(newObject, me.defaultObject);

        return newObject;
    },

    cancelByIds: function (noticeIds, callBack) {
        var me = this;
        if (commonHelper.isTouchDevice()) {
            cordova.plugins.notification.local.cancel(noticeIds, callBack);
        }
        else {
            callBack();
        }
    },

    clearByIds: function (noticeIds, callBack) {
        var me = this;
        if (commonHelper.isTouchDevice()) {
            cordova.plugins.notification.local.clear(noticeIds, callBack);
        }
        else {
            callBack();
        }
    },

    cancelInvalid: function (callBack) {
        var me = this;

        var clearPluginLocalNotificationFun = function () {
            if (commonHelper.isTouchDevice()) {
                cordova.plugins.notification.local.getAll(function (notifications) {
                    if (commonHelper.isNullOrEmpty(notifications) || notifications.length == 0) {
                        callBack();
                    }
                    else {
                        var cancellingIds = new Array();
                        var checkedCount = 0;
                        var totalCheckedCount = notifications.length;
                        var checkedCompletedFun = function () {
                            checkedCount++;
                            if (checkedCount == totalCheckedCount) {
                                if (cancellingIds != null && cancellingIds.length > 0) {
                                    me.cancelByIds(cancellingIds, callBack);
                                }
                                else {
                                    callBack();
                                }
                            }
                        };

                        for (var i = 0; i < notifications.length; i++) {
                            if (notifications[i].title != me.defaultObject.title) {
                                checkedCompletedFun();
                            }
                            else {
                                var noticeId = parseInt(notifications[i].id);
                                var orderNumber = noticeId % 100;
                                var uniqueID = noticeId / 100;
                                localDB.checkMyLocalNotificationExist(uniqueID, orderNumber, function (result) {
                                    if (!result) {
                                        cancellingIds.push(noticeId);
                                        checkedCompletedFun();
                                    }
                                    else {
                                        checkedCompletedFun();
                                    }
                                });
                            }
                        }
                    }
                });
            }
            else {
                callBack();
            }
        };

        localDB.getInvalidMyLocalNotifications(function (records) {
            if (commonHelper.isNullOrEmpty(records) || records.length == 0) {
                clearPluginLocalNotificationFun();
            }
            else {
                var cancellingIds = new Array();
                var doneCount = 0;
                var totalCount = records.length;
                var doneCompletedFun = function () {
                    doneCount++;
                    if (doneCount == totalCount) {
                        if (commonHelper.isTouchDevice() && cancellingIds != null && cancellingIds.length > 0) {
                            me.cancelByIds(cancellingIds, clearPluginLocalNotificationFun);
                        }
                        else {
                            clearPluginLocalNotificationFun();
                        }
                    }
                };

                for (var i = 0; i < records.length; i++) {
                    var uniqueID = parseInt(records[i][appConfig.myLocalNotifications.fields.kitUniqueID.fieldName]);
                    var orderNumber = parseInt(records[i][appConfig.myLocalNotifications.fields.orderNumber.fieldName]);
                    var noticeId = uniqueID * 100 + orderNumber;

                    localDB.removeLocalNotification(uniqueID, orderNumber, function () {
                        cancellingIds.push(noticeId);
                        doneCompletedFun();
                    });
                }
            }
        });
    },

    insertForKit: function (objects, callBack) {
        var me = this;

        if (commonHelper.isTouchDevice()) {            
            cordova.plugins.notification.local.schedule(objects);
        }

        callBack();
    },

    insertForPractice: function (uniqueID, orderNumber, scheduledTime, callBack) {
        var me = this;

        if (commonHelper.isTouchDevice()) {
            cordova.plugins.notification.local.schedule(me.createNoticeObject(
                uniqueID * 100 + orderNumber,
                me.repeatPracticeMessage,
                scheduledTime
            ));
        }

        callBack();
    }
};
