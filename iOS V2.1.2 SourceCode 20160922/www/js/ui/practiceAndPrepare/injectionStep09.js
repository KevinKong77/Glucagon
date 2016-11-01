Ext.define(enumPageInfo.injectionStep09.nameSpace, {
    alias: [enumPageInfo.injectionStep09.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep09.name,
    isPainted: false,
    isCorrect: false,

    constructor: function (config) {
        this.initConfig(config);
    },

    topBarHeight: null,
    topLogoHeight: null,

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'slide',
                hidden: true,
                html: '<div class="main">' +
                          '<div class="injection_step injection_step_9 fixed_height">' +
                            '<div class="syringe_plugner"  id="div_' + me.name + '_SyringePlugner">' +
                                '<img src="img/needle_plunger_flip.png" height="190" alt=""/>' +
                            '</div>' +
                            '<div class="syringe" id="div_' + me.name + '_Syringe">' +
                                '<img id="img_' + me.name + '_NeedleBodyFlip" src="img/needle_body_flip.png" height="215" alt=""/>' +
                            '</div>' +
                            '<div class="bottle" id="div_' + me.name + '_Bottle">' +
                                '<img id="img_' + me.name + '_VialFlip" src="img/vp_vial_flip.png" height="135" alt=""/>' +
                            '</div>' +
                            '<div class="needle" id="div_' + me.name + '_Needle">' +
                                '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/></div>' +
                            '<div class="tips" id="div_' + me.name + '_Tips">' +
                              '<p id="p_' + me.name + '_Tips">Insert the same syringe into the vial</p>' +
                              '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>' +
                            '</div>' +
                            '<div class="act_btn">' +
                                '<a id="link_' + me.name + '_Back">' +
                                    '<img src="img/btn_back.png" height="37" alt=""/>' +
                                '</a>' +
                            '</div>' +
                            '<div class="arrow_up" id="div_' + me.name + '_ArrowUp">' +
                                '<img src="img/vp_arrowUp.png" height="99" alt=""/>' +
                            '</div>' +
                          '</div>' +
                      '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.isCorrect = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.syringeOriginTop = parseInt($('#div_' + me.name + '_Syringe').css('top').replace('px', ''));
                            me.syringePlugnerOriginTop = parseInt($('#div_' + me.name + '_SyringePlugner').css('top').replace('px', ''));
                            me.needleOriginTop = parseInt($('#div_' + me.name + '_Needle').css('top').replace('px', ''));
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        var test = parseInt($('#img_' + me.name + '_VialFlip').css('height').replace('px', ''));

                        $('#div_' + me.name + '_SyringePlugner').css('top', me.syringePlugnerOriginTop + 'px');
                        $('#div_' + me.name + '_Needle').css('top', me.needleOriginTop + 'px');
                        $('#div_' + me.name + '_Syringe').css('top', me.syringeOriginTop + 'px');

                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#div_' + me.name + '_ArrowUp').css('visibility', 'visible');

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
            $('#div_' + me.name + '_ArrowUp').css('visibility', 'hidden');

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
            var newTop = dragParameters.originTop - (dragParameters.originY - mouseObj.clientY) / userData.getValue(enumLocalStorageItem.bodyZoom);

            if ((me.firstClientY - mouseObj.clientY) / userData.getValue(enumLocalStorageItem.bodyZoom) < 0) {
                newTop = me.needleOriginTop;
            }

            if (me.needleOriginTop - newTop > dragParameters.distance) {
                newTop = me.needleOriginTop - dragParameters.distance;
            }

            $('#div_' + me.name + '_SyringePlugner').css('top', newTop - (me.needleOriginTop - me.syringePlugnerOriginTop) + 'px');
            $('#div_' + me.name + '_Needle').css('top', newTop + 'px');
            $('#div_' + me.name + '_Syringe').css('top', newTop - (me.needleOriginTop - me.syringeOriginTop) + 'px');

            if (me.needleOriginTop - newTop >= dragParameters.distance) {
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
                    Base.gotoPage(enumPageInfo.injectionStep10);
                }, 1000);
            }
            else {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#div_' + me.name + '_ArrowUp').css('visibility', 'visible');
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
            var originalPos = document.getElementById('div_' + me.name + '_Syringe').offsetTop; // +me.topBarHeight;
            var targetPos = parseInt($('#div_' + me.name + '_Bottle').css('height').replace('px', '')) + parseInt($('#div_' + me.name + '_Bottle').css('top').replace('px', '')) - 20 * userData.getValue(enumLocalStorageItem.imageZoom);
            var distance = originalPos - targetPos;

            var dragParameters = {
                originY: null,
                originTop: null,
                originalPos: originalPos,
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
            Base.gotoPage(enumPageInfo.injectionStep08);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});