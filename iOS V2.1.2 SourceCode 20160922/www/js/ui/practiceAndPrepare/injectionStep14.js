Ext.define(enumPageInfo.injectionStep14.nameSpace, {
    alias: [enumPageInfo.injectionStep14.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep14.name,
    isPainted: false,
    isCorrect: false,

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,

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
                html: '<div class="main">' +
                          '<div class="injection_step injection_step_14 fixed_height">' +
                            '<div class="skin_cover"><!--Make the picture as a background-image--></div>' +
                            '<div class="skin"><!--Make the picture as a background-image--></div>' +
                            '<div class="syringe_plugner" id="div_' + me.name + '_SyringePlugner">' +
                                '<img src="img/needle_plunger_left.png" height="38" alt=""/>' +
                            '</div>' +
                            '<div class="syringe" id="div_' + me.name + '_Syringe">' +
                                '<img id="img_' + me.name + '_Syringe" src="img/needle_body_left.png" height="72" alt=""/>' +
                            '</div>' +
                            '<div class="needle" id="div_' + me.name + '_Needle">' +
                                '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>' +
                            '</div>' +
                            '<div class="tips" id="div_' + me.name + '_Tips">' +
                              '<p id="p_' + me.name + '_Tips">Withdraw the needle. Apply light pressure against the injection site.</p>' +
                              '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>' +
                            '</div>' +
                            '<div class="act_btn">' +
                                '<a id="link_' + me.name + '_Back">' +
                                    '<img src="img/btn_back.png" height="37" alt=""/>' +
                                '</a>' +
                            '</div>' +
                            '<div class="arrow_right" id="div_' + me.name + '_ArrowRight">' +
                                '<img src="img/vp_arrowLeft.png" height="66" alt=""/>' +
                            '</div>' +
                          '</div>' +
                      '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.isCorrect = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.needleOriginLeft = parseInt($('#div_' + me.name + '_Needle').css('left').replace('px', ''));
                            me.syringePlugnerOriginLeft = parseInt($('#div_' + me.name + '_SyringePlugner').css('left').replace('px', ''));
                            me.syringeOriginLeft = parseInt($('#div_' + me.name + '_Syringe').css('left').replace('px', ''));
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        $('#div_' + me.name + '_Needle').css('left', me.needleOriginLeft + 'px');
                        $('#div_' + me.name + '_SyringePlugner').css('left', me.syringePlugnerOriginLeft + 'px');
                        $('#div_' + me.name + '_Syringe').css('left', me.syringeOriginLeft + 'px');
                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#div_' + me.name + '_ArrowRight').css('visibility', 'visible');
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
            $('#div_' + me.name + '_ArrowRight').css('visibility', 'hidden');

            dragParameters.originX = mouseObj.clientX;

            if (commonHelper.isNullOrEmpty(me.firstClientX)) {
                me.firstClientX = dragParameters.originX;
            }
            dragParameters.originLeft = parseInt($('#div_' + me.name + '_Needle').css('left').replace('px', ''));
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
            var newLeft = dragParameters.originLeft + (mouseObj.clientX - dragParameters.originX) / userData.getValue(enumLocalStorageItem.bodyZoom);

            if ((mouseObj.clientX - me.firstClientX) / userData.getValue(enumLocalStorageItem.bodyZoom) < 0) {
                newLeft = me.needleOriginLeft;
            }

            if (newLeft - me.needleOriginLeft > dragParameters.distance) {
                newLeft = dragParameters.distance + me.needleOriginLeft;
            }

            $('#div_' + me.name + '_SyringePlugner').css('left', newLeft - (me.needleOriginLeft - me.syringePlugnerOriginLeft) + 'px');
            $('#div_' + me.name + '_Needle').css('left', newLeft + 'px');
            $('#div_' + me.name + '_Syringe').css('left', newLeft - (me.needleOriginLeft - me.syringeOriginLeft) + 'px');

            if (newLeft - me.needleOriginLeft >= dragParameters.distance) {
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
                    Base.gotoPage(enumPageInfo.injectionStep15);
                }, 1000);
            }
            else {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                $('#div_' + me.name + '_ArrowRight').css('visibility', 'visible');
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
            var distance = document.getElementById('img_' + me.name + '_Syringe').offsetWidth / 4;

            var dragParameters = {
                originX: null,
                originLeft: null,
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
            Base.gotoPage(enumPageInfo.injectionStep13);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});