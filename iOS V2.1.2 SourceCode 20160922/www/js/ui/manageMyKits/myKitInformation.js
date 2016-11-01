Ext.define(enumPageInfo.myKitInformation.nameSpace, {
    alias: [enumPageInfo.myKitInformation.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.myKitInformation.name,
    isPainted: false,

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,
    btnAddHeight: null,
    kitList: null,

    startX: null,
    startY: null,

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
                html: '<div class="main fixed_height">'
                            + '<div class="logo" id="div_' + me.name + '_Logo">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="instructions_small" id="div_' + me.name + '_InstructionsSmall">'
                                + '<img id="img_' + me.name + '_InstructionsSmall" src="img/myKit_infoEnterKitLocation.png" height="42" alt=""/>'
                            + '</div>'
                            + '<div class="kit_list" id="div_' + me.name + '_KitList">'
                            + '</div>'
                            + '<div class="btn_add" id="btn_' + me.name + '_Add">Add...</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        cordova.plugins.notification.badge.clear();
                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.createKitListPanel();
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        me.bindMyKits(true);
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

    registerEvent: function () {
        var me = this;
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('btn_' + me.name + '_Add').on('tap', me.btn_Add_Event, me);
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    btn_Add_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.btn_Add_Event';

        try {
            commonSession.selectedUniqueID = null;
            Base.gotoPage(enumPageInfo.myKitInformationDetail);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    createKitListPanel: function () {
        var me = this;
        var methodName = me.name + '.createKitListPanel';

        try {
            var createMediaCarouselPanel = Ext.create('Ext.Container', {
                id: 'pnl_' + me.name + '_KitList',
                renderTo: 'div_' + me.name + '_KitList',
                cls: 'kit_list_panel scrollableContent',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    bindMyKits: function (needAlert) {
        var me = this;
        var methodName = me.name + '.bindMyKits';

        try {
            if (!commonHelper.isNullOrEmpty(me.kitList) && me.kitList.length > 0) {
                for (var i = 0; i < me.kitList.length; i++) {
                    Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).un('touchstart', me.kitList_Item_TouchStartEvent, me);
                    //Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).un('touchend', me.kitList_Item_TouchEndEvent, me);
                    Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).un('tap', me.kitList_Item_TapEvent, me);
                    //Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).un('swipe', me.kitList_Item_SwipeEvent, me);
                    Ext.get('btn_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName] + '_Delete').un('tap', me.kitList_Item_DeleteEvent, me);
                }
            }

            var expiredTime, expiredDate, firstNoticeTime, firstNoticeDate;
            var currentTime = new Date();
            var currentDate = new Date((currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear());
            var reminderEveryDay, reminderTwoWeeksAge, reminderOneMonthAge;
            var msgList = new Array();

            localDB.getMyKits(function (results) {
                me.kitList = results;
                var innerHtml = '';

                if (!commonHelper.isNullOrEmpty(results) && results.length > 0) {
                    innerHtml += '<ul class="sub_nav">';
                    for (var i = 0; i < results.length; i++) {
                        expiredTime = new Date(results[i][appConfig.myKits.fields.expiredTime.fieldName]);
                        expiredDate = new Date((expiredTime.getMonth() + 1) + '/' + expiredTime.getDate() + '/' + expiredTime.getFullYear());
                        if (commonHelper.isNullOrEmpty(results[i][appConfig.myKits.fields.firstNoticeTime.fieldName])) {
                            firstNoticeTime = null;
                            firstNoticeDate = null;
                        }
                        else {
                            firstNoticeTime = new Date(results[i][appConfig.myKits.fields.firstNoticeTime.fieldName]);
                            firstNoticeDate = new Date((firstNoticeTime.getMonth() + 1) + '/' + firstNoticeTime.getDate() + '/' + firstNoticeTime.getFullYear());
                        }

                        reminderEveryDay = parseInt(results[i][appConfig.myKits.fields.reminderEveryDay.fieldName]);
                        reminderTwoWeeksAge = parseInt(results[i][appConfig.myKits.fields.reminderTwoWeeksAge.fieldName]);
                        reminderOneMonthAge = parseInt(results[i][appConfig.myKits.fields.reminderOneMonthAge.fieldName]);

                        if
                        (
                            (reminderTwoWeeksAge == 1 && expiredDate.dateAdd('d', -14) <= currentDate)
                            || (reminderOneMonthAge == 1 && expiredDate.dateAdd('d', -30) <= currentDate)
                        ) {
                            msgList.push(localNotification.expiredMessage.replace('AAA', results[i][appConfig.myKits.fields.location.fieldName]).replace('BBB', new Date(results[i][appConfig.myKits.fields.expiredTime.fieldName]).format('M/D/Y')));
                        }

                        innerHtml += '<li isDeleting="false" id="li_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '">'
                                            + '<a id="link_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '">'
                                                + results[i][appConfig.myKits.fields.location.fieldName]
                                                + '&nbsp;';

                        if (currentDate >= expiredDate) {
                            innerHtml += '<span class="float_r red" id="span_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '">'
                                                    + 'Expired'
                                                    + '<strong id="btn_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '_Delete">Delete</strong>'
                                            + '</span>';
                        }
                        else {
                            if (commonHelper.isNullOrEmpty(firstNoticeDate) || currentDate >= firstNoticeDate) {
                                innerHtml += '<span class="float_r red" id="span_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '">'
                                                    + 'Expires&nbsp;'
                                                    + new Date(results[i][appConfig.myKits.fields.expiredTime.fieldName]).format('M/D/Y')
                                                    + '<strong id="btn_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '_Delete">Delete</strong>'
                                            + '</span>';
                            }
                            else {
                                innerHtml += '<span class="float_r green" id="span_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '">'
                                                    + 'OK'
                                                    + '<strong id="btn_' + me.name + '_' + results[i][appConfig.myKits.fields.uniqueID.fieldName] + '_Delete">Delete</strong>'
                                            + '</span>';
                            }
                        }

                        innerHtml += '</a>'
                                    + '</li>';
                    }

                    innerHtml += '</ul>';
                }
                else {
                    innerHtml = '&nbsp;';
                }

                Ext.getCmp('pnl_' + me.name + '_KitList').setHtml(innerHtml);

                if (!commonHelper.isNullOrEmpty(me.kitList) && me.kitList.length > 0) {
                    for (var i = 0; i < me.kitList.length; i++) {
                        if (userData.getValue(enumLocalStorageItem.imageZoom) == 2) {
                            $('#li_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).css('text-indent', '0px');
                            $('#li_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).css('margin-right', '-140px');
                        }
                        else {
                            $('#li_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).css('text-indent', '0px');
                            $('#li_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).css('margin-right', '-70px');
                        }

                        Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).on('touchstart', me.kitList_Item_TouchStartEvent, me);
                        //Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).on('touchend', me.kitList_Item_TouchEndEvent, me);
                        Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).on('tap', me.kitList_Item_TapEvent, me);
                        //Ext.get('link_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName]).on('swipe', me.kitList_Item_SwipeEvent, me);
                        Ext.get('btn_' + me.name + '_' + me.kitList[i][appConfig.myKits.fields.uniqueID.fieldName] + '_Delete').on('tap', me.kitList_Item_DeleteEvent, me);
                    }
                }

                if (needAlert && msgList.length > 0) {
                    var startIndex = 0;
                    var afterAlterFunction = function () {
                        if (startIndex <= msgList.length - 1) {
                            msgHelper.showCustomAlert(null, msgList[startIndex], afterAlterFunction);
                            startIndex++;
                        }
                        else {
                            return;
                        }
                    };
                    afterAlterFunction();
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    kitList_Item_TouchStartEvent: function (event) {
        var me = this;
        var methodName = me.name + '.kitList_Item_TouchStartEvent';

        try {
            var w = $(window).width();
            var ctlId = event.target.id;
            var targetUniqueID = ctlId.split('_')[2];
            $('#' + ctlId).parents(".sub_nav li").css('background-color', 'rgba(0,0,0,.1)');
            $('#' + ctlId).parents(".sub_nav li").find("a").css("border-width", "0");
            $('#' + ctlId).parents(".sub_nav li").prev().find("a").css("border-width", "0");
            if ($('#' + ctlId).parents(".sub_nav li").is(":first-child")) $('#' + ctlId).parents(".sub_nav").css("border-top-color", "rgba(0,0,0,.1)");
            if ($('#' + ctlId).parents(".sub_nav li").is(":last-child")) $('#' + ctlId).parents(".sub_nav").css("border-bottom-color", "rgba(0,0,0,.1)");

            if (commonHelper.isTouchDevice()) {
                me.startX = event.event.touches[0].clientX;
                me.startY = event.event.touches[0].clientY;

                document.ontouchmove = function (e) {
                    me.kitList_Item_TouchMoveEvent(e.touches[0], targetUniqueID);
                }

                document.ontouchend = function (e) {
                    me.kitList_Item_TouchEndEvent(e.touches[0], targetUniqueID);
                }
            }
            else {
                me.startX = event.event.clientX;
                me.startY = event.event.clientY;

                document.onmousemove = function (e) {
                    me.kitList_Item_TouchMoveEvent(e, targetUniqueID);
                }

                document.onmouseup = function (e) {
                    me.kitList_Item_TouchEndEvent(e, targetUniqueID);
                }
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    kitList_Item_TouchMoveEvent: function (event, targetUniqueID) {
        var me = this;
        var methodName = me.name + '.kitList_Item_TouchMoveEvent';

        try {
            var me = this;
            var isDeleting = formatHelper.toBoolean(Ext.get('li_' + me.name + '_' + targetUniqueID).dom.getAttribute('isDeleting'));

            var distinceX = me.startX - event.clientX;
            var distinceY = me.startY - event.clientY;

            if (Math.abs(distinceY) > 10) {
                return;
            }

            if (!isDeleting && distinceX > 0 && Math.sqrt(distinceX * distinceX + distinceY * distinceY) > 15) {
                if (userData.getValue(enumLocalStorageItem.imageZoom) == 2) {
                    $('#li_' + me.name + '_' + targetUniqueID).css('text-indent', '-140px');
                    $('#li_' + me.name + '_' + targetUniqueID).css('margin-right', '0px');
                }
                else {
                    $('#li_' + me.name + '_' + targetUniqueID).css('text-indent', '-70px');
                    $('#li_' + me.name + '_' + targetUniqueID).css('margin-right', '0px');
                }
                Ext.get('li_' + me.name + '_' + targetUniqueID).dom.setAttribute('isDeleting', 'true');
                Ext.get('link_' + me.name + '_' + targetUniqueID).un('tap', me.kitList_Item_TapEvent, me);
            }

            if (isDeleting && distinceX < 0 && Math.sqrt(Math.abs(distinceX) * Math.abs(distinceX) + distinceY * distinceY) > 15) {
                if (userData.getValue(enumLocalStorageItem.imageZoom) == 2) {
                    $('#li_' + me.name + '_' + targetUniqueID).css('text-indent', '0px');
                    $('#li_' + me.name + '_' + targetUniqueID).css('margin-right', '-140px');
                }
                else {
                    $('#li_' + me.name + '_' + targetUniqueID).css('text-indent', '0px');
                    $('#li_' + me.name + '_' + targetUniqueID).css('margin-right', '-70px');
                }
                Ext.get('li_' + me.name + '_' + targetUniqueID).dom.setAttribute('isDeleting', 'false');
                Ext.get('link_' + me.name + '_' + targetUniqueID).on('tap', me.kitList_Item_TapEvent, me);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    kitList_Item_TouchEndEvent: function (event, targetUniqueID) {
        var me = this;
        var methodName = me.name + '.kitList_Item_TouchEndEvent';

        try {
            if (commonHelper.isTouchDevice()) {
                document.ontouchmove = null;
                document.ontouchend = null;
            }
            else {
                document.onmousemove = null;
                document.onmouseup = null;
            }

            var w = $(window).width();
            var ctlId = 'li_' + me.name + '_' + targetUniqueID;
            $('#' + ctlId).css('background-color', '');
            w == 768 ? $('#' + ctlId).find("a").css("border-width", "2px") : $('#' + ctlId).find("a").css("border-width", "1px");
            w == 768 ? $('#' + ctlId).prev().find("a").css("border-width", "2px") : $('#' + ctlId).prev().find("a").css("border-width", "1px");
            if ($('#' + ctlId).is(":first-child")) $('#' + ctlId).parents(".sub_nav").css("border-top-color", '#e5a750');
            if ($('#' + ctlId).is(":last-child")) $('#' + ctlId).parents(".sub_nav").css("border-bottom-color", '#e5a750');
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    kitList_Item_TapEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.kitList_Item_TapEvent';

        try {
            commonSession.selectedUniqueID = sender.target.id.split('_')[2];
            Base.gotoPage(enumPageInfo.myKitInformationDetail);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    kitList_Item_DeleteEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.kitList_Item_DeleteEvent';

        try {
            var targetUniqueID = sender.target.id.split('_')[2];
            myKitsManager.removeKit(targetUniqueID, function () {
                me.bindMyKits(false);
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});
