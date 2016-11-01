var localDB = {
    myDB: null,
    createSql: function (tableSchema, tableName) {
        if (commonHelper.isNullOrEmpty(tableName)) {
            tableName = tableSchema.tableName;
        }

        var tmpSql = 'Create Table If Not Exists ' + tableName + '(';
        for (var field in tableSchema.fields) {
            tmpSql += tableSchema.fields[field].fieldName
                                    + ' ' + tableSchema.fields[field].fieldType
                                    + ' ' + tableSchema.fields[field].fieldNullable + ',';
        }
        if (tmpSql.lastIndexOf(',') == tmpSql.length - 1) {
            tmpSql = tmpSql.substr(0, tmpSql.length - 1);
        }
        tmpSql += ')';

        return tmpSql;
    },

    generateKitNewID: function (callBack) {
        var me = this;
        var methodName = 'localDB.generateKitNewID';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Select ' + appConfig.myKits.fields.uniqueID.fieldName
                                            + ' From ' + appConfig.myKits.tableName
                                            + ' Order By ' + appConfig.myKits.fields.uniqueID.fieldName + ' Asc';

                        transaction.executeSql(execSql, null, function (transaction, results) {
                            var newID;
                            var currentID, nextID;

                            if (commonHelper.isNullOrEmpty(results) || results.rows.length == 0) {
                                newID = 10;
                            }
                            else {
                                for (var i = 0; i < results.rows.length; i++) {
                                    currentID = parseInt(results.rows.item(i)[appConfig.myKits.fields.uniqueID.fieldName]);
                                    if (i == results.rows.length - 1) {
                                        newID = currentID + 1;
                                        break;
                                    }
                                    else {
                                        nextID = parseInt(results.rows.item(i + 1)[appConfig.myKits.fields.uniqueID.fieldName]);
                                        if (currentID + 1 < nextID) {
                                            newID = currentID + 1;
                                            break;
                                        }
                                    }
                                }
                            }

                            callBack(newID);
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    getMyKits: function (callBack) {
        var me = this;
        var methodName = 'localDB.getMyKits';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Select * From ' + appConfig.myKits.tableName;

                        transaction.executeSql(execSql, null, function (transaction, results) {
                            var returnList = new Array();
                            if (!commonHelper.isNullOrEmpty(results)) {
                                for (var i = 0; i < results.rows.length; i++) {
                                    returnList.push(results.rows.item(i));
                                }
                            }

                            callBack(returnList);
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    getMyKit: function (uniqueID, callBack) {
        var me = this;
        var methodName = 'localDB.getMyKit';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Select * From ' + appConfig.myKits.tableName + ' Where ' + appConfig.myKits.fields.uniqueID.fieldName + '=?';

                        transaction.executeSql(execSql, [uniqueID], function (transaction, results) {
                            if (!commonHelper.isNullOrEmpty(results) && results.rows.length == 1) {
                                callBack(results.rows.item(0));
                            }

                            callBack(null);
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    getMyLocalNotifications: function (kitUniqueID, location, callBack) {
        var me = this;
        var methodName = 'localDB.getMyLocalNotifications';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var param = new Array();
                        param.push(kitUniqueID);

                        var execSql = 'Select A.* From ' + appConfig.myLocalNotifications.tableName + ' A'
                                            + ' Inner Join ' + appConfig.myKits.tableName + ' B'
                                            + ' On A.' + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + '=B.' + appConfig.myKits.fields.uniqueID.fieldName
                                            + ' Where '
                                            + ' A.' + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + '=?';

                        if (!commonHelper.isNullOrEmpty(location)) {
                            param.push(location);
                            execSql += ' Or B.' + appConfig.myKits.fields.location.fieldName + '=?';
                        }

                        transaction.executeSql(execSql, param, function (transaction, results) {
                            var returnList = new Array();
                            if (!commonHelper.isNullOrEmpty(results)) {
                                for (var i = 0; i < results.rows.length; i++) {
                                    returnList.push(results.rows.item(i));
                                }
                            }

                            callBack(returnList);
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    checkMyLocalNotificationExist: function (kitUniqueID, orderNumber, callBack) {
        var me = this;
        var methodName = 'localDB.checkMyLocalNotificationExist';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Select * From ' + appConfig.myLocalNotifications.tableName
                                            + ' Where '
                                            + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + '=? '
                                            + ' And '
                                            + appConfig.myLocalNotifications.fields.orderNumber.fieldName + '=?';

                        transaction.executeSql(execSql, [kitUniqueID, orderNumber], function (transaction, results) {
                            if (!commonHelper.isNullOrEmpty(results)) {
                                callBack(true);
                            }
                            else {
                                callBack(false);
                            }
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    getInvalidMyLocalNotifications: function (callBack) {
        var me = this;
        var methodName = 'localDB.getInvalidMyLocalNotifications';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Select * From ' + appConfig.myLocalNotifications.tableName;

                        transaction.executeSql(execSql, null, function (transaction, results) {
                            var returnList = new Array();
                            var currentTime = new Date();
                            if (!commonHelper.isNullOrEmpty(results)) {
                                for (var i = 0; i < results.rows.length; i++) {
                                    if (new Date(results.rows.item(i)[appConfig.myLocalNotifications.fields.scheduledTime.fieldName]).getTime() <= currentTime.getTime()) {
                                        returnList.push(results.rows.item(i));
                                    }
                                }
                            }

                            callBack(returnList);
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    removeLocalNotification: function (kitUniqueID, orderNumber, callBack) {
        var me = this;
        var methodName = 'localDB.removeLocalNotification';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Delete From ' + appConfig.myLocalNotifications.tableName
                                            + ' Where '
                                            + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + '=?'
                                            + ' And '
                                            + appConfig.myLocalNotifications.fields.orderNumber.fieldName + '=?';

                        transaction.executeSql(execSql, [kitUniqueID, orderNumber], function (transaction, results) {
                            callBack();
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    insertKit: function (uniqueID, location, params, callBack) {
        var me = this;
        var methodName = 'localDB.insertKit';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var removeSql = 'Delete From ' + appConfig.myKits.tableName
                                            + ' Where '
                                            + appConfig.myKits.fields.uniqueID.fieldName + '=?'
                                            + ' Or '
                                            + appConfig.myKits.fields.location.fieldName + '=?';

                        var execSql = 'Insert Into ' + appConfig.myKits.tableName
                                + '('
                                    + appConfig.myKits.fields.uniqueID.fieldName
                                    + ',' + appConfig.myKits.fields.location.fieldName
                                    + ',' + appConfig.myKits.fields.expiredTime.fieldName
                                    + ',' + appConfig.myKits.fields.firstNoticeTime.fieldName
                                    + ',' + appConfig.myKits.fields.reminderEveryDay.fieldName
                                    + ',' + appConfig.myKits.fields.reminderTwoWeeksAge.fieldName
                                    + ',' + appConfig.myKits.fields.reminderOneMonthAge.fieldName
                                + ')'
                                + ' Values(?,?,?,?,?,?,?)';

                        transaction.executeSql(removeSql, [uniqueID, location], function (transaction, results) {
                            transaction.executeSql(execSql, params, function (transaction, results) {
                                callBack();
                            }, function (transaction, results) {
                                throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                            });
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + removeSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    removeMyKit: function (uniqueID, callBack) {
        var me = this;
        var methodName = 'localDB.removeMyKit';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var execSql = 'Delete From ' + appConfig.myKits.tableName + ' Where ' + appConfig.myKits.fields.uniqueID.fieldName + '=?';
                        var exec1Sql = 'Delete From ' + appConfig.myLocalNotifications.tableName + ' Where ' + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + '=?';

                        transaction.executeSql(execSql, [uniqueID], function (transaction, results) {
                            transaction.executeSql(exec1Sql, [uniqueID], function (transaction, results) {
                                callBack();
                            }, function (transaction, results) {
                                throw new Error(methodName + '.executeSql(' + exec1Sql + '):' + results);
                            });
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    insertNotifications: function (kitUniqueID, location, params, callBack) {
        var me = this;
        var methodName = 'localDB.insertNotifications';

        try {
            var beginFun = function () {
                me.myDB.transaction(
                    function (transaction) {
                        var removeParam = new Array();
                        removeParam.push(kitUniqueID);

                        var removeSql = 'Delete From ' + appConfig.myLocalNotifications.tableName
                                                + ' Where '
                                                + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + '=?';

                        if (!commonHelper.isNullOrEmpty(location)) {
                            removeParam.push(location);
                            removeSql += ' Or ' + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName + ' In '
                                                + '('
                                                    + 'Select ' + appConfig.myKits.fields.uniqueID.fieldName
                                                    + ' From ' + appConfig.myKits.tableName
                                                    + ' Where '
                                                    + appConfig.myKits.fields.location.fieldName + '=?'
                                                + ')';
                        }

                        var execSql = 'Insert Into ' + appConfig.myLocalNotifications.tableName
                                + '('
                                + appConfig.myLocalNotifications.fields.kitUniqueID.fieldName
                                + ',' + appConfig.myLocalNotifications.fields.orderNumber.fieldName
                                + ',' + appConfig.myLocalNotifications.fields.scheduledTime.fieldName
                                + ')'
                                + ' Values(?,?,?)';

                        transaction.executeSql(removeSql, removeParam, function (transaction, results) {
                            if (commonHelper.isNullOrEmpty(params) || params.length == 0) {
                                callBack();
                            }
                            else {
                                var doneCount = 0;
                                var totalCount = params.length;
                                var doneCompletedFun = function () {
                                    doneCount++;
                                    if (doneCount == totalCount) {
                                        callBack();
                                    }
                                };

                                for (var i = 0; i < params.length; i++) {
                                    var eachParam = params[i];
                                    transaction.executeSql(execSql, eachParam, function (transaction, results) {
                                        doneCompletedFun();
                                    }, function (transaction, results) {
                                        throw new Error(methodName + '.executeSql(' + execSql + '):' + results);
                                    });
                                }
                            }
                        }, function (transaction, results) {
                            throw new Error(methodName + '.executeSql(' + removeSql + '):' + results);
                        });
                    }
                );
            };

            if (commonHelper.isNullOrEmpty(me.myDB)) {
                me.openDB(beginFun);
            }
            else {
                beginFun();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    openDB: function (callBack) {
        var me = this;
        var methodName = 'localDB.openDB';

        try {
            if (!window.openDatabase) {
                throw new Error('Databases are not supported in this browser.');
            }
            else {
                me.myDB = window.openDatabase(appConfig.dbName, appConfig.dbVersion, appConfig.dbDesc, appConfig.dbSize);
                if (commonHelper.isNullOrEmpty(me.myDB)) {
                    throw new Error('Database can not be opened. ');
                }

                var sqlList = new Array();
                var tmpSql = '';
                //my kits
                sqlList.push(me.createSql(appConfig.myKits));
                //my local notifications
                sqlList.push(me.createSql(appConfig.myLocalNotifications));

                var doneCount = 0;
                var stepCount = sqlList.length;
                var stepCompletedFun = function () {
                    doneCount++;
                    if (doneCount == stepCount) {
                        callBack();
                    }
                };

                me.myDB.transaction(
                    function (transaction) {
                        for (var i = 0; i < sqlList.length; i++) {
                            transaction.executeSql(sqlList[i], null, stepCompletedFun, function (transaction, results) {
                                throw new Error(methodName + '.executeSql(' + sqlList[i] + '):' + results);
                            });
                        }
                    }
                );
            }
        }
        catch (e) {
            throw new Error(methodName + ': ' + e.message);
        }
    }
};