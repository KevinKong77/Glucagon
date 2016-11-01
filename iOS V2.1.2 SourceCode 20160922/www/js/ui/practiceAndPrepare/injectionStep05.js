﻿Ext.define(enumPageInfo.injectionStep05.nameSpace, {
    alias: [enumPageInfo.injectionStep05.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep05.name,
    isPainted: false,
    isCorrect: false,

    constructor: function (config) {
        this.initConfig(config);
    },

    topBarHeight: null,
    syringePlugnerOriginBottom: null,
    needleOriginBottom: null,
    needleLogoMiddlePos: null,
    firstClientY: null,

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'slide',
                hidden: true,
                html: '<div class="main">'
                            + '<div class="injection_step injection_step_5 fixed_height">'
                                + '<div class="syringe_plugner" id="div_' + me.name + '_SyringePlugner">'
                                    + '<img src="img/needle_plunger.png" height="190" alt=""/>'
                                + '</div>'
                                + '<div class="syringe" id="div_' + me.name + '_Syringe">'
                                    + '<img src="img/needle_body.png" height="215" alt=""/>'
                                + '</div>'
                                + '<div class="bottle">'
                                    + '<img src="img/vp_bottle.png" height="130" alt=""/>'
                                + '</div>'
                                + '<div class="needle" id="div_' + me.name + '_Needle">'
                                    + '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>'
                                + '</div>'
                                + '<div class="tips" id="div_' + me.name + '_Tips">'
                                    + '<p id="p_' + me.name + '_Tips">Then inject the entire contents of the syringe into the vial of Glucagon powder</p>'
                                    + '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>'
                                + '</div>'
                                + '<div class="act_btn">'
                                    + '<a id="link_' + me.name + '_Back">'
                                        + '<img src="img/btn_back.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                                + '<div class="arrow_down" id="div_' + me.name + '_ArrowDown">'
                                    + '<img src="img/vp_arrowDown.png" height="99" alt=""/>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.isCorrect = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.syringePlugnerOriginBottom = parseInt($('#div_' + me.name + '_SyringePlugner').css('bottom').replace('px', ''));
                            me.needleOriginBottom = parseInt($('#div_' + me.name + '_Needle').css('bottom').replace('px', ''));
                            me.needleLogoMiddlePos = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.needleOriginBottom - parseInt($('#img_' + me.name + '_LogoNeedle').css('height').replace('px', '')) / 2;
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        $('#div_' + me.name + '_SyringePlugner').css('bottom', me.syringePlugnerOriginBottom + 'px');
                        $('#div_' + me.name + '_Needle').css('bottom', me.needleOriginBottom + 'px');
                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#div_' + me.name + '_ArrowDown').css('visibility', 'visible');
                        $('#p_' + me.name + '_Tips').fadeIn(1);
                        $('#p_' + me.name + '_CorrectTips').fadeOut(1);

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

    touchStartEvent: function (mouseObj, dragParameters) {
        var me = this;
        var methodName = me.name + '.touchStartEvent';

        try {
            $('#div_' + me.name + '_Tips').css('visibility', 'hidden');
            $('#div_' + me.name + '_Needle').css('visibility', 'hidden');
            $('#div_' + me.name + '_ArrowDown').css('visibility', 'hidden');

            dragParameters.originY = mouseObj.clientY;
            if (commonHelper.isNullOrEmpty(me.firstClientY)) {
                me.firstClientY = dragParameters.originY;
            }
            dragParameters.originBottom = parseInt($('#div_' + me.name + '_Needle').css('bottom').replace('px', ''));
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
            var newBottom = dragParameters.originBottom - (mouseObj.clientY - dragParameters.originY) / userData.getValue(enumLocalStorageItem.bodyZoom);

            if ((mouseObj.clientY - me.firstClientY) / userData.getValue(enumLocalStorageItem.bodyZoom) < 0) {
                newBottom = me.needleOriginBottom;
            }

            if (me.needleOriginBottom - newBottom > dragParameters.distance) {
                newBottom = me.needleOriginBottom - dragParameters.distance;
            }

            $('#div_' + me.name + '_SyringePlugner').css('bottom', newBottom - (me.needleOriginBottom - me.syringePlugnerOriginBottom) + 'px');
            $('#div_' + me.name + '_Needle').css('bottom', newBottom + 'px');

            if (me.needleOriginBottom - newBottom >= dragParameters.distance) {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#p_' + me.name + '_Tips').fadeOut(1);
                $('#p_' + me.name + '_CorrectTips').fadeIn(300);
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
                    Base.gotoPage(enumPageInfo.injectionStep06);
                }, 1000);
            }
            else {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#div_' + me.name + '_ArrowDown').css('visibility', 'visible');
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
            var targetPos = document.getElementById('div_' + me.name + '_Syringe').offsetTop + me.topBarHeight;
            var distance = (targetPos - me.needleLogoMiddlePos) / 2 + 5;

            var dragParameters = {
                originY: null,
                originBottom: null,
                targetPos: targetPos,
                distance: distance
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
            Base.gotoPage(enumPageInfo.injectionStep04);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});