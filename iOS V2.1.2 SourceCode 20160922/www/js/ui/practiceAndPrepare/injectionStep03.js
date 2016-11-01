Ext.define(enumPageInfo.injectionStep03.nameSpace, {
    alias: [enumPageInfo.injectionStep03.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep03.name,
    isPainted: false,
    isCorrect: false,

    constructor: function (config) {
        this.initConfig(config);
    },

    topBarHeight: null,
    syringeCoverOriginTop: null,
    needleOriginTop: null,
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
                html: '<div class="wrap"></div>'
                        + '<div class="main">'
                            + '<div class="injection_step injection_step_3 fixed_height">'
                                + '<div class="syringe" id="div_' + me.name + '_Syringe">'
                                    + '<img src="img/needle_whole.png" height="477" alt=""/>'
                                + '</div>'
                                + '<div class="syringe_cover" id="div_' + me.name + '_SyringeCover">'
                                    + '<img src="img/needle_cover.png" height="149" alt=""/>'
                                + '</div>'
                                + '<div class="needle" id="div_' + me.name + '_Needle">'
                                    + '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>'
                                + '</div>'
                                + '<div class="tips" id="div_' + me.name + '_Tips">'
                                    + '<p id="p_' + me.name + '_Tips1">'
                                        + 'Remove the needle cover from the syringe'
                                    + '</p>'
                                    + '<p id="p_' + me.name + '_Tips2">'
                                        + '<br/>DO NOT REMOVE THE PLASTIC CLIP FROM THE SYRINGE, as this may allow the push rod to come out of the syringe'
                                    + '</p>'
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
                            me.syringeCoverOriginTop = parseInt($('#div_' + me.name + '_SyringeCover').css('top').replace('px', ''));
                            me.needleOriginTop = parseInt($('#div_' + me.name + '_Needle').css('top').replace('px', ''));
                            me.needleLogoMiddlePos = me.topBarHeight + me.needleOriginTop + parseInt($('#img_' + me.name + '_LogoNeedle').css('height').replace('px', '')) / 2;
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        $('#div_' + me.name + '_SyringeCover').css('top', me.syringeCoverOriginTop + 'px');
                        $('#div_' + me.name + '_Needle').css('top', me.needleOriginTop + 'px');
                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#div_' + me.name + '_ArrowDown').css('visibility', 'visible');
                        $('#p_' + me.name + '_Tips1').fadeIn(1);
                        $('#p_' + me.name + '_Tips2').fadeIn(1);
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

            dragParameters.originTop = parseInt($('#div_' + me.name + '_Needle').css('top').replace('px', ''));
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
            var newTop = (mouseObj.clientY - dragParameters.originY) / userData.getValue(enumLocalStorageItem.bodyZoom) + dragParameters.originTop;

            if ((mouseObj.clientY - me.firstClientY) / userData.getValue(enumLocalStorageItem.bodyZoom) < 0) {
                newTop = dragParameters.originTop;
            }

            if (newTop - me.needleOriginTop > dragParameters.distance) {
                newTop = dragParameters.distance + me.needleOriginTop;
            }

            $('#div_' + me.name + '_SyringeCover').css('top', newTop - (me.needleOriginTop - me.syringeCoverOriginTop) + 'px');
            $('#div_' + me.name + '_Needle').css('top', newTop + 'px');

            if (newTop - me.needleOriginTop >= dragParameters.distance) {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#p_' + me.name + '_Tips1').fadeOut(1);
                $('#p_' + me.name + '_Tips2').fadeOut(1);
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
                    Base.gotoPage(enumPageInfo.injectionStep04);
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
            var syringeTop = parseInt($('#div_' + me.name + '_Syringe').css('top').replace('px', ''));
            var syringeHeight = document.getElementById('div_' + me.name + '_Syringe').offsetHeight;
            var targetPos = syringeHeight + syringeTop + me.topBarHeight + 20 * userData.getValue(enumLocalStorageItem.imageZoom);
            var distance = targetPos - me.needleLogoMiddlePos;

            var dragParameters = {
                originY: null,
                originTop: null,
                syringeTop: syringeTop,
                syringeHeight: syringeHeight,
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
            Base.gotoPage(enumPageInfo.injectionStep02);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});