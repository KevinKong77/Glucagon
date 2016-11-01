var myKitsManager = {
    insertKit: function (uniqueID, location, insertParams, insertNoticeParams, noticeObjects, callBack) {
        var me = this;
        var methodName = 'myKitsManager.insertKit';

        try {
            localDB.getMyLocalNotifications(uniqueID, location, function (records) {
                var insertKitFun = function () {
                    localDB.insertKit(uniqueID, location, insertParams, function () {
                        localDB.insertNotifications(uniqueID, location, insertNoticeParams, function () {
                            localNotification.insertForKit(noticeObjects, function () {
                                commonSession.selectedUniqueID = null;
                                commonSession.selectedDate = null;
                                commonSession.selectedDate_EN = null;
                                callBack();
                            });
                        });
                    });
                };

                if (commonHelper.isNullOrEmpty(records) || records.length == 0) {
                    insertKitFun();
                }
                else {
                    var cancellingIds = new Array();

                    for (var i = 0; i < records.length; i++) {
                        cancellingIds.push(parseInt(records[i][appConfig.myLocalNotifications.fields.kitUniqueID.fieldName]) * 100 + parseInt(records[i][appConfig.myLocalNotifications.fields.orderNumber.fieldName]));
                    }

                    if (commonHelper.isTouchDevice() && cancellingIds != null && cancellingIds.length > 0) {
                        localNotification.cancelByIds(cancellingIds, insertKitFun);
                    }
                    else {
                        insertKitFun();
                    }
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    removeKit: function (uniqueID, callBack) {
        var me = this;
        var methodName = 'myKitsManager.removeKit';

        try {
            localDB.getMyLocalNotifications(uniqueID, null, function (records) {
                var removeKitFun = function () {
                    localDB.removeMyKit(uniqueID, function () {
                        callBack();
                    });
                };

                if (commonHelper.isNullOrEmpty(records) || records.length == 0) {
                    removeKitFun();
                }
                else {
                    var cancellingIds = new Array();

                    for (var i = 0; i < records.length; i++) {
                        cancellingIds.push(parseInt(records[i][appConfig.myLocalNotifications.fields.kitUniqueID.fieldName]) * 100 + parseInt(records[i][appConfig.myLocalNotifications.fields.orderNumber.fieldName]));
                    }

                    if (commonHelper.isTouchDevice() && cancellingIds != null && cancellingIds.length > 0) {
                        localNotification.cancelByIds(cancellingIds, removeKitFun);
                    }
                    else {
                        removeKitFun();
                    }
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
};
