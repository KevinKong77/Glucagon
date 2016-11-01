Ext.define(enumPageInfo.injectionStep12.nameSpace, {
    alias: [enumPageInfo.injectionStep12.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep12.name,
    isPainted: false,
    isCorrect: false,

    needleOriginMarginLeft: null,
    syringeOriginMarginLeft: null,
    syringePlugnerOriginMarginLeft: null,
    syringeOriginLeft: null,
    skinCoverOriginLeft: null,
    skinCoverOriginWidth: null,
    firstClientX: null,

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
                html: '<div class="main">'
                            + '<div class="injection_step injection_step_12 fixed_height">'
                                + '<div class="skin_cover" id="div_' + me.name + '_SkinCover"></div>'
                                + '<div class="skin" id="div_' + me.name + '_Skin"></div>'
                                + '<div class="syringe_plugner" id="div_' + me.name + '_SyringePlugner">'
                                    + '<img src="img/needle_plunger_left.png" height="38" alt=""/>'
                                + '</div>'
                                + '<div class="syringe" id="div_' + me.name + '_Syringe">'
                                    + '<img id="img_' + me.name + '_Syringe" src="img/needle_body_left.png" height="72" alt=""/>'
                                + '</div>'
                                + '<div class="needle" id="div_' + me.name + '_Needle">'
                                    + '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>'
                                + '</div>'
                                + '<div class="tips" id="div_' + me.name + '_Tips">'
                                    + '<p id="p_' + me.name + '_Tips">Insert the needle into the loose tissue under the injection site</p>'
                                    + '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>'
                                + '</div>'
                                + '<div class="act_btn">'
                                    + '<a id="link_' + me.name + '_Back">'
                                        + '<img src="img/btn_back.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                                + '<div class="arrow_left" id="div_' + me.name + '_ArrowLeft">'
                                    + '<img src="img/vp_arrowLeft.png" height="66" alt=""/>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.isCorrect = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.needleOriginMarginLeft = parseInt($('#div_' + me.name + '_Needle').css('margin-left').replace('px', ''));
                            me.syringeOriginMarginLeft = parseInt($('#div_' + me.name + '_Syringe').css('margin-left').replace('px', ''));
                            me.syringePlugnerOriginMarginLeft = parseInt($('#div_' + me.name + '_SyringePlugner').css('margin-left').replace('px', ''));
                            me.syringeOriginLeft = document.getElementById('img_' + me.name + '_Syringe').offsetLeft;
                            me.skinCoverOriginLeft = document.getElementById('div_' + me.name + '_SkinCover').offsetLeft;
                            me.skinCoverOriginWidth = document.getElementById('div_' + me.name + '_SkinCover').offsetWidth;
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        $('#div_' + me.name + '_Needle').css('margin-left', me.needleOriginMarginLeft + 'px');
                        $('#div_' + me.name + '_Syringe').css('margin-left', me.syringeOriginMarginLeft + 'px');
                        $('#div_' + me.name + '_SyringePlugner').css('margin-left', me.syringePlugnerOriginMarginLeft + 'px');
                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#div_' + me.name + '_ArrowLeft').css('visibility', 'visible');
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
            $('#div_' + me.name + '_ArrowLeft').css('visibility', 'hidden');

            dragParameters.originX = mouseObj.clientX;

            if (commonHelper.isNullOrEmpty(me.firstClientX)) {
                me.firstClientX = dragParameters.originX;
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
            var newMarginLeft = (me.firstClientX - mouseObj.clientX) / userData.getValue(enumLocalStorageItem.bodyZoom);

            if ((me.firstClientX - mouseObj.clientX) < 0) {
                newMarginLeft = 0;
            }

            if (newMarginLeft > dragParameters.distance) {
                newMarginLeft = dragParameters.distance;
            }

            $('#div_' + me.name + '_Needle').css('margin-left', (me.needleOriginMarginLeft - newMarginLeft) + 'px');
            $('#div_' + me.name + '_Syringe').css('margin-left', (me.syringeOriginMarginLeft - newMarginLeft) + 'px');
            $('#div_' + me.name + '_SyringePlugner').css('margin-left', (me.syringePlugnerOriginMarginLeft - newMarginLeft) + 'px');

            if (newMarginLeft >= dragParameters.distance) {
                $('#p_' + me.name + '_Tips').fadeOut(1);
                $('#p_' + me.name + '_CorrectTips').fadeIn(300);
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
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
                    Base.gotoPage(enumPageInfo.injectionStep13);
                }, 1000);
            }
            else {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#div_' + me.name + '_ArrowLeft').css('visibility', 'visible');
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
            var targetPos = me.skinCoverOriginLeft + (me.skinCoverOriginWidth * userData.getValue(enumLocalStorageItem.imageZoom) / 2);
            var distance = me.syringeOriginLeft + me.skinCoverOriginWidth * userData.getValue(enumLocalStorageItem.imageZoom) - targetPos;

            var dragParameters = {
                originX: null,
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
            Base.gotoPage(enumPageInfo.injectionStep11);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});