var oldVersionManager = {
    callBack: null,
    historyDataFileEntry: null,

    lastStepFun: function () {
        var me = this;

        if (commonHelper.isNullOrEmpty(userData.getValue(enumLocalStorageItem.oldDataProcessed))) {
            userData.setValue(enumLocalStorageItem.oldDataProcessed, true);
        }

        maskHelper.closeMask();

        if (appConfig.isTransitional) {
            me.callBack();
        }
        else {
            if (commonHelper.isNullOrEmpty(me.historyDataFileEntry)) {
                me.callBack();
            }
            else {
                fileHelper.removeFile(me.historyDataFileEntry, function () {
                    oldVersionManager.callBack();
                }, function () {
                    oldVersionManager.callBack();
                });
            }
        }
    },

    importOldData: function (callBack) {
        var me = this;
        me.callBack = callBack;

        if (!commonHelper.isNullOrEmpty(userData.getValue(enumLocalStorageItem.oldDataProcessed))) {
            me.lastStepFun();
        }
        else {
            if (!commonHelper.isIOS()) {
                me.lastStepFun();
            }
            else {
                maskHelper.createMask(1, 'Please wait while importing the old data...');
                maskHelper.openMask();

                fileHelper.requestFileSystem(function (fsRoot) {
                    oldVersionManager.onRequestFileSystemSucFun(fsRoot);
                }, function (error) {
                    oldVersionManager.lastStepFun();
                });
            }
        }
    },

    //Private method, after the file request is requested
    onRequestFileSystemSucFun: function (fsRoot) {
        var me = this;
        fileHelper.getFile(fsRoot, appConfig.historyDataFileName, function (fileEntry) {
            if (commonHelper.isNullOrEmpty(fileEntry)) {
                oldVersionManager.lastStepFun();
            }
            else {
                oldVersionManager.historyDataFileEntry = fileEntry;
                fileHelper.readTextFile(fileEntry, function (content) {
                    oldVersionManager.processHistoryData(content);
                });
            }
        }, function (error) {
            oldVersionManager.lastStepFun();
        });
    },

    processHistoryData: function (content) {
        var me = this;
        if (commonHelper.isNullOrEmpty(content)) {
            oldVersionManager.lastStepFun();
        }
        else {
            var newContent = content.substr(1, content.length - 2);
            var contentArray = newContent.split(')(');
            if (commonHelper.isNullOrEmpty(contentArray) || contentArray.length != 4) {
                oldVersionManager.lastStepFun();
            }
            else {
                var doneCount = 0;
                var totalCount = contentArray.length - 1;
                var doneCompletedFun = function () {
                    doneCount++;
                    if (doneCount == totalCount) {
                        oldVersionManager.lastStepFun();
                    }
                };

                oldVersionManager.processSettingsInfo(contentArray[0], doneCompletedFun);
                oldVersionManager.processNotesInfo(contentArray[1], doneCompletedFun);
                oldVersionManager.processNotificationsInfo(contentArray[2], contentArray[3], doneCompletedFun);
            }
        }
    },

    processSettingsInfo: function (data, callBack) {
        var me = this;
        if (!commonHelper.isNullOrEmpty(data) && data != 'NULL') {
            var settingsArray = data.split('|');
            if (!commonHelper.isNullOrEmpty(settingsArray) && settingsArray.length == 2) {
                userData.setValue(enumLocalStorageItem.soundStatus, parseInt(settingsArray[0]));
                userData.setValue(enumLocalStorageItem.manualPlayStatus, parseInt(settingsArray[1]));
            }
        }
        callBack();
    },

    processNotesInfo: function (data, callBack) {
        var me = this;
        if (!commonHelper.isNullOrEmpty(data) && data != 'NULL') {
            var newData = '';
            if (data.indexOf('|r|n') < 0) {
                newData = data;
            }
            else {
                var dataArray = data.split('|r|n');
                for (var i = 0; i < dataArray.length; i++) {
                    newData += dataArray[i] + '\r\n';
                }
            }

            userData.setValue(enumLocalStorageItem.notes, newData);
        }
        callBack();
    },

    processNotificationsInfo: function (kitsData, vpData, callBack) {
        var me = this;
        me.processKitsInfo(kitsData, function () {
            oldVersionManager.processVPInfo(vpData, callBack);
        });
    },

    processKitsInfo: function (data, callBack) {
        var me = this;
        if (commonHelper.isNullOrEmpty(data) || data == 'NULL') {
            callBack();
        }
        else {
            var newKits = data.substr(1, data.length - 2);
            var kitsArray = newKits.split('][');
            if (commonHelper.isNullOrEmpty(kitsArray) || kitsArray.length == 0) {
                callBack();
            }
            else {
                var currentIndex = -1;
                var currentKit = null;
                var currentKitArray = null;

                var importOldDataFun = function () {
                    currentIndex++;
                    if (currentIndex == kitsArray.length) {
                        callBack();
                    }
                    else {
                        currentKit = kitsArray[currentIndex];
                        if (commonHelper.isNullOrEmpty(currentKit)) {
                            importOldDataFun();
                        }
                        else {
                            currentKitArray = currentKit.split('|');
                            if (commonHelper.isNullOrEmpty(currentKitArray) || currentKitArray.length != 5) {
                                importOldDataFun();
                            }
                            else {
                                var location = currentKitArray[0];
                                var expiredTime = new Date(currentKitArray[1]);
                                var expiredDate = new Date((expiredTime.getMonth() + 1) + '/' + expiredTime.getDate() + '/' + expiredTime.getFullYear());
                                var currentTime = new Date();
                                var currentDate = new Date((currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear());
                                var expiredFullTime = expiredTime.fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                                var reminderEveryDay = parseInt(currentKitArray[2]);
                                var reminderTwoWeeksAge = parseInt(currentKitArray[3]);
                                var reminderOneMonthAge = parseInt(currentKitArray[4]);

                                commonSession.selectedUniqueID = null;
                                localDB.generateKitNewID(function (newID) {
                                    commonSession.selectedUniqueID = newID;

                                    var insertNoticeParams = new Array();
                                    var noticeObjects = new Array();
                                    var scheduledTime;
                                    var orderNumber = 0;
                                    var firstNoticeTime;

                                    if (reminderOneMonthAge == 1) {
                                        scheduledTime = expiredDate.dateAdd('d', -30).fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                                        firstNoticeTime = scheduledTime;
                                        if (expiredDate.dateAdd('d', -30) > currentDate) {
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
                                                localNotification.expiredMessage.replace('AAA', location).replace('BBB', expiredDate.format('M/D/Y')),
                                                scheduledTime
                                            ));
                                        }
                                    }

                                    if (reminderTwoWeeksAge == 1) {
                                        scheduledTime = expiredDate.dateAdd('d', -14).fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                                        if (commonHelper.isNullOrEmpty(firstNoticeTime)) {
                                            firstNoticeTime = scheduledTime;
                                        }
                                        if (expiredDate.dateAdd('d', -14) > currentDate) {
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
                                                localNotification.expiredMessage.replace('AAA', location).replace('BBB', expiredDate.format('M/D/Y')),
                                                scheduledTime
                                            ));
                                        }
                                    }

                                    if (reminderEveryDay == 1) {
                                        if (currentDate >= expiredDate) {
                                            scheduledTime = expiredDate.dateAdd('d', -7).fillHMS(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
                                            if (commonHelper.isNullOrEmpty(firstNoticeTime)) {
                                                firstNoticeTime = scheduledTime;
                                            }
                                        }
                                        else {
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
                                                    localNotification.expiredMessage.replace('AAA', location).replace('BBB', expiredDate.format('M/D/Y')),
                                                    scheduledTime
                                                ));

                                                triggerDate = triggerDate.dateAdd('d', 1);
                                            }
                                        }
                                    }

                                    var insertParams = [
                                        commonSession.selectedUniqueID,
                                        location,
                                        expiredFullTime,
                                        firstNoticeTime,
                                        reminderEveryDay,
                                        reminderTwoWeeksAge,
                                        reminderOneMonthAge
                                    ];

                                    myKitsManager.insertKit(commonSession.selectedUniqueID, location, insertParams, insertNoticeParams, noticeObjects, function () {
                                        importOldDataFun();
                                    });
                                });
                            }
                        }
                    }
                };

                importOldDataFun();
            }
        }
    },

    processVPInfo: function (data, callBack) {
        var me = this;
        if (commonHelper.isNullOrEmpty(data) || data == 'NULL') {
            callBack();
        }
        else {
            var currentTime = new Date();
            var scheduledTime = new Date(data);
            if (currentTime >= scheduledTime) {
                callBack();
            }
            else {
                var uniqueID = 1;
                var orderNumber = 1;

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
                                callBack();
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
        }
    }
};