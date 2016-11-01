localStorage.removeItem('ExtLoaded');
var tempGuidIdentifier = [0, 0];
var deviceHeight, deviceWidth, deviceRatio;
if ($(window).height() == 736 && $(window).width() == 414) { //6ps
    deviceHeight = 736;
    deviceWidth = 414;
    deviceRatio = 1.777;
}
else if ($(window).height() == 667 && $(window).width() == 375) {// 6~6s
    deviceHeight = 667;
    deviceWidth = 375;
    deviceRatio = 1.778;
}
else if ($(window).height() == 568 && $(window).width() == 320) {// 5~5s
    deviceHeight = 568;
    deviceWidth = 320;
    deviceRatio = 1.775;
}
else {
    deviceHeight = 480;
    deviceWidth = 320;
    deviceRatio = 1.5;
}

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        if (commonHelper.isTouchDevice()) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        else {
            app.startSencha();
        }

    },
    onDeviceReady: function () {
        document.addEventListener('pause', Base.pauseEvent, false);
        app.receivedEvent();
    },
    receivedEvent: function () {
        app.startSencha();
    },
    startSencha: function () {
        Ext.override(Ext.util.SizeMonitor, {
            constructor: function (config) {
                var namespace = Ext.util.sizemonitor;

                if (Ext.browser.is.Firefox) {
                    return new namespace.OverflowChange(config);
                }
                else if (Ext.browser.is.WebKit) {
                    if (!Ext.browser.is.Silk && Ext.browser.engineVersion.gtEq('535') && !Ext.browser.engineVersion.ltEq('537.36')) {
                        return new namespace.OverflowChange(config);
                    }
                    else {
                        return new namespace.Scroll(config);
                    }
                }
                else if (Ext.browser.is.IE11) {
                    return new namespace.Scroll(config);
                }
                else {
                    return new namespace.Scroll(config);
                }
            }
        });

        Ext.override(Ext.util.PaintMonitor, {
            constructor: function (config) {
                if (Ext.browser.is.Firefox || (Ext.browser.is.WebKit && Ext.browser.engineVersion.gtEq('536') && !Ext.browser.engineVersion.ltEq('537.36') && !Ext.os.is.Blackberry)) {
                    return new Ext.util.paintmonitor.OverflowChange(config);
                }
                else {
                    return new Ext.util.paintmonitor.CssAnimation(config);
                }
            }
        });

        Ext.application({
            name: 'App',
            fullscreen: true,
            launch: function () {
                var me = this;
                var methodName = 'app.launch';

                try {
                    window.onerror = function (errorMsg, url, lineNumber) {
                        var showErrorEvent = function () {
                            var errorTemplate = '<table width="100%" border="0" cellPadding="0" cellspacing="0" style="text-align:left; word-break: break-word;">'
															+ '<tr>'
																+ '<td>LineNumber:&nbsp;&nbsp;&nbsp;&nbsp;' + lineNumber + '</td>'
															+ '</tr>'
															+ '<tr>'
																+ '<td>Url:</td>'
															+ '</tr>'
															+ '<tr>'
																+ '<td>' + url + '</td>'
															+ '</tr>'
															+ '<tr>'
																+ '<td>Message:</td>'
															+ '</tr>'
															+ '<tr>'
																+ '<td>' + errorMsg + '</td>'
															+ '</tr>'
														+ '</table>';


                            try {
                                msgHelper.showAlert(EnumAlertType.Error, errorTemplate);
                            }
                            catch (e) {
                                alert(errorMsg + '<br/>' + url + '<br/>' + lineNumber);
                            }
                        };

                        //                        if (url.indexOf('sencha-touch-all.js') >= 0) {
                        //                            return;
                        //                        }

                        showErrorEvent();
                    }

                    localStorage.removeItem('ExtLoaded');
                    localStorage.setItem('ExtLoaded', true);

                    var mainContainer = Ext.create('Ext.Container', {
                        fullscreen: true,
                        id: 'appContainer',
                        items: [
                            {
                                xtype: 'topbar',
                                id: 'ctlTopMenu',
                                docked: 'top'
                            },
                            {
                                xtype: 'bottombar',
                                id: 'ctlBottomMenu',
                                docked: 'bottom'
                            },
                            {
                                xtype: 'container',
                                id: 'containerMain',
                                height: '100%',
                                width: '100%'
                            }
                        ],
                        listeners: {
                            painted: function (sender, eOpts) {
                                Base.setZoomValue();
                                Base.createInnerPanels();
                                Base.initReadInformationForUserHistory();
                                Base.initReadInformationForPhysicianHistory();

                                if (commonHelper.isTouchDevice()) {
                                    try {
                                        StatusBar.hide();
                                    } catch (e) {

                                    }

                                    if (commonHelper.isAndroid()) {
                                        MobileAccessibility.usePreferredTextZoom(false);

                                        cordova.plugins.notification.badge.hasPermission(function (granted) {
                                            if (!granted) {
                                                cordova.plugins.notification.badge.promptForPermission();
                                            }
                                        });
                                    }                                    

                                    cordova.plugins.notification.local.on('click', function (notification) {
                                        localNotification.clearByIds([notification.id], function () {
                                            cordova.plugins.notification.badge.clear();
                                        });
                                    });

                                    cordova.plugins.notification.local.on("schedule", function (notification) {
                                        //alert("scheduled: " + notification.id);
                                    });

                                    cordova.plugins.notification.local.on("trigger", function (notification) {
                                        //alert("triggered: " + notification.id);
                                        //cordova.plugins.notification.badge.increase();                                        
                                    });
                                }

                                localDB.openDB(function () {
                                    oldVersionManager.importOldData(function () {
                                        localNotification.cancelInvalid(function () {
                                            commonSession.isReInit = true;
                                            commonSession.agreeGuide = null;

                                            if (commonHelper.isNullOrEmpty(userData.getValue(enumLocalStorageItem.agreeGuide))) {
                                                Base.gotoPage(enumPageInfo.termsOfUse);
                                            }
                                            else {
                                                commonSession.agreeGuide = formatHelper.toBoolean(userData.getValue(enumLocalStorageItem.agreeGuide));
                                                if (commonSession.isReInit) {
                                                    Base.gotoPage(enumPageInfo.isi);
                                                }
                                                else {
                                                    Base.gotoPage(enumPageInfo.landing);
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        }
                    });
                }
                catch (e) {
                    alert(e.message);
                }
            }
        });
    }
};