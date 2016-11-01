Ext.define(enumPageInfo.injectionStep07.nameSpace, {
    alias: [enumPageInfo.injectionStep07.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep07.name,
    isPainted: false,
    isCorrect: false,

    constructor: function (config) {
        this.initConfig(config);
    },

    needleLogoOriginLeft: null,
    needleLogoMiddlePos: null,
    needleOriginMarginLeft: null,
    bottleOriginMarginLeft: null,
    leftDistance: null,
    rightDistance: null,
    firstClientX: null,
    leftBoundValue: null,
    rightBoundValue: null,
    maxStrickCount: 4,

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'slide',
                hidden: true,
                html: '<div class="main">'
                            + '<div class="injection_step injection_step_7 fixed_height">'
                                + '<div class="bottle" id="div_' + me.name + '_Bottle">'
                                    + '<img id="img_' + me.name + '_Bottle" src="img/vp_vial_side.png" height="90" alt=""/>'
                                + '</div>'
                                + '<div class="needle" id="div_' + me.name + '_Needle">'
                                    + '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>'
                                + '</div>'
                                + '<div class="tips" id="div_' + me.name + '_Tips">'
                                    + '<p id="p_' + me.name + '_Tips">Then gently swirl the vial until the liquid becomes clear. (swirl your phone to see how this works)</p>'
                                    + '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>'
                                + '</div>'
                                + '<div class="act_btn">'
                                    + '<a id="link_' + me.name + '_Back">'
                                        + '<img src="img/btn_back.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                                + '<div class="arrow_left_right">'
                                    + '<img src="img/vp_shake_arrows.png" height="47" alt=""/>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    show: function (sender, eOpts) {
                        if (commonHelper.isTouchDevice()) {
                            accelerometerMonitor.startWatch(function (marginValue, isShakeEnough) {
                                me.accelerometerMonitorEvent(marginValue, isShakeEnough);
                            });
                        }
                    },
                    hide: function (sender, eOpts) {
                        if (commonHelper.isTouchDevice()) {
                            accelerometerMonitor.stopWatch();
                        }

                    },
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.isCorrect = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.needleLogoOriginLeft = document.getElementById('img_' + me.name + '_LogoNeedle').offsetLeft;
                            me.needleLogoMiddlePos = me.needleLogoOriginLeft + document.getElementById('img_' + me.name + '_LogoNeedle').offsetWidth / 2;
                            me.needleOriginMarginLeft = parseInt($('#div_' + me.name + '_Needle').css('margin-left').replace('px', ''));
                            me.bottleOriginMarginLeft = parseInt($('#div_' + me.name + '_Bottle').css('margin-left').replace('px', ''));
                            me.leftBoundValue = document.getElementById('img_' + me.name + '_Bottle').offsetLeft + 10;
                            me.rightBoundValue = me.leftBoundValue + document.getElementById('img_' + me.name + '_Bottle').offsetWidth;
                            me.leftDistance = (me.needleLogoMiddlePos - me.leftBoundValue) / 2;
                            me.rightDistance = (me.rightBoundValue - me.needleLogoMiddlePos) / 2;
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft + 'px');
                        $('#div_' + me.name + '_Bottle').css('margin-left', me.bottleOriginMarginLeft + 'px');
                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#p_' + me.name + '_Tips').fadeIn(1);
                        $('#p_' + me.name + '_CorrectTips').fadeOut(1);

                        maskHelper.closeMask();
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

    accelerometerMonitorEvent: function (marginValue, isShakeEnough) {
        var me = this;
        var methodName = me.name + '.accelerometerMonitorEvent';

        try {
            if (marginValue >= me.leftDistance) {
                marginValue = me.leftDistance;
            }

            if (marginValue * -1 >= me.rightDistance) {
                marginValue = me.rightDistance * -1;
            }

            $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft - marginValue + 'px');
            $('#div_' + me.name + '_Bottle').css('margin-left', me.bottleOriginMarginLeft - marginValue + 'px');

            if (isShakeEnough) {
                me.isCorrect = true;
                accelerometerMonitor.stopWatch();
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#p_' + me.name + '_Tips').fadeOut(1);
                $('#p_' + me.name + '_CorrectTips').fadeIn(300);
                $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft + 'px');
                $('#div_' + me.name + '_Bottle').css('margin-left', me.bottleOriginMarginLeft + 'px');

                maskHelper.createHiddenMask(1);
                maskHelper.openMask();

                window.setTimeout(function () {
                    Base.gotoPage(enumPageInfo.injectionStep08);
                }, 2000);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    touchStartEvent: function (mouseObj, dragParameters) {
        var me = this;
        var methodName = me.name + '.touchStartEvent';

        try {
            $('#div_' + me.name + '_Tips').css('visibility', 'hidden');
            $('#div_' + me.name + '_Needle').css('visibility', 'hidden');

            dragParameters.leftStrickCount = 0;
            dragParameters.rightStrickCount = 0;
            dragParameters.curPos = '';
            dragParameters.originX = mouseObj.clientX;

            if (commonHelper.isNullOrEmpty(me.firstClientX)) {
                me.firstClientX = dragParameters.originX;
            }

            if (commonHelper.isTouchDevice()) {
                accelerometerMonitor.stopWatch();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    touchMoveEvent: function (mouseObj, dragParameters) {
        var me = this;
        var methodName = me.name + '.touchMoveEvent';

        try {
            if (me.isCorrect) {
                return;
            }
            var newMarginLeft = (dragParameters.originX - mouseObj.clientX) / userData.getValue(enumLocalStorageItem.bodyZoom);

            $('#div_' + me.name + '_Needle').css('margin-left', (me.needleOriginMarginLeft - newMarginLeft) + 'px');
            $('#div_' + me.name + '_Bottle').css('margin-left', (me.bottleOriginMarginLeft - newMarginLeft) + 'px');

            if (mouseObj.clientX <= dragParameters.leftMarginValue || mouseObj.clientX >= dragParameters.rightMarginValue) {
                if (commonHelper.isTouchDevice()) {
                    document.ontouchmove = null;
                    document.ontouchend = null;
                }
                else {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft + 'px');
                $('#div_' + me.name + '_Bottle').css('margin-left', me.bottleOriginMarginLeft + 'px');
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                return;
            }

            if (newMarginLeft >= me.leftDistance) {
                if (
                dragParameters.curPos != 'left'
                &&
                (
                    dragParameters.leftStrickCount == dragParameters.rightStrickCount
                    || dragParameters.leftStrickCount == dragParameters.rightStrickCount - 1
                )
            ) {
                    dragParameters.leftStrickCount++;
                    dragParameters.curPos = 'left';
                }
            }

            if (newMarginLeft * -1 >= me.rightDistance) {
                if
            (
                dragParameters.curPos != 'right'
                &&
                (
                    dragParameters.rightStrickCount == dragParameters.leftStrickCount
                    || dragParameters.rightStrickCount == dragParameters.leftStrickCount - 1
                )
            ) {
                    dragParameters.rightStrickCount++;
                    dragParameters.curPos = 'right';
                }
            }

            if (dragParameters.leftStrickCount + dragParameters.rightStrickCount >= me.maxStrickCount) {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#p_' + me.name + '_Tips').fadeOut(1);
                $('#p_' + me.name + '_CorrectTips').fadeIn(300);
                $('#div_' + me.name + '_Bottle').css('margin-left', me.bottleOriginMarginLeft);
                $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft + 'px');
                me.isCorrect = true;
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    touchEndEvent: function () {
        var me = this;
        var methodName = me.name + '.touchEndEvent';

        try {
            if (me.isCorrect) {
                maskHelper.createHiddenMask(1);
                maskHelper.openMask();

                window.setTimeout(function () {
                    Base.gotoPage(enumPageInfo.injectionStep08);
                }, 1000);
            }
            else {
                $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft + 'px');
                $('#div_' + me.name + '_Bottle').css('margin-left', me.bottleOriginMarginLeft + 'px');
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');

                if (commonHelper.isTouchDevice()) {
                    accelerometerMonitor.startWatch(function (marginValue, isShakeEnough) {
                        me.accelerometerMonitorEvent(marginValue, isShakeEnough);
                    });
                }
            }

            if (commonHelper.isTouchDevice()) {
                document.ontouchmove = null;
                document.ontouchend = null;
            }
            else {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    needleDragEvent: function () {
        var me = this;
        var methodName = me.name + '.needleDragEvent';

        try {
            var srcElement = Ext.get('img_' + me.name + '_LogoNeedle').dom;
            var leftMarginValue = 0;
            var rightMarginValue = document.body.scrollWidth;
            var leftStrickCount;
            var rightStrickCount;
            var curPos;

            var dragParameters = {
                originX: null,
                leftMarginValue: leftMarginValue,
                rightMarginValue: rightMarginValue,
                leftStrickCount: leftStrickCount,
                rightStrickCount: rightStrickCount,
                curPos: curPos
            };

            if (commonHelper.isTouchDevice()) {
                srcElement.ontouchstart = function (e) {
                    if (me.isCorrect) {
                        return;
                    }

                    me.touchStartEvent(e.touches[0], dragParameters);

                    document.ontouchmove = function (e) {
                        me.touchMoveEvent(e.touches[0], dragParameters);
                    }

                    document.ontouchend = function (e) {
                        me.touchEndEvent();
                    }
                }
            }
            else {
                srcElement.onmousedown = function (e) {
                    if (me.isCorrect) {
                        return;
                    }

                    me.touchStartEvent(e, dragParameters);

                    document.onmousemove = function (e) {
                        me.touchMoveEvent(e, dragParameters);
                    }

                    document.onmouseup = function (e) {
                        me.touchEndEvent();
                    }
                }
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    registerEvent: function () {
        var me = this;
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('link_' + me.name + '_Back').on('tap', me.link_BackEvent, me);
            me.needleDragEvent();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_BackEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_BackEvent';

        try {
            Base.gotoPage(enumPageInfo.injectionStep06);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});