Ext.define(enumPageInfo.injectionStep02.nameSpace, {
    alias: [enumPageInfo.injectionStep02.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep02.name,
    isPainted: false,
    isCorrect: false,

    needleLogoOriginLeft: null,
    needleLogoMiddlePos: null,
    needleOriginRight: null,
    handOriginRight: null,
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
                html: '<div class="wrap"></div>'
                        + '<div class="main">'
                            + '<div class="injection_step injection_step_2 fixed_height">'
                                + '<div class="bottle" id="div_' + me.name + '_Bottle">'
                                    + '<img id="img_' + me.name + '_Bottle" src="img/vp_bottle.png" height="190" alt=""/>'
                                + '</div>'
                                + '<div class="needle" id="div_' + me.name + '_Needle">'
                                    + '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>'
                                + '</div>'
                                + '<div class="hand_2" id="div_' + me.name + '_Hand">'
                                    + '<img id="img_' + me.name + '_Hand" src="img/vp_cottonSwab.png" height="202" alt=""/>'
                                + '</div>'
                                + '<div class="tips" id="div_' + me.name + '_Tips">'
                                    + '<p id="p_' + me.name + '_Tips">Wipe the bottle stopper with an alcohol swab</p>'
                                    + '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>'
                                + '</div>'
                                + '<div class="act_btn">'
                                    + '<a id="link_' + me.name + '_Back">'
                                        + '<img src="img/btn_back.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        $('#img_' + me.name + '_Hand').fadeIn(200);
                        me.isCorrect = false;

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.needleOriginRight = parseInt($('#div_' + me.name + '_Needle').css('right').replace('px', ''));
                            me.handOriginLeft = parseInt($('#div_' + me.name + '_Hand').css('right').replace('px', ''));
                            me.needleLogoOriginLeft = document.getElementById('img_' + me.name + '_LogoNeedle').offsetLeft - me.needleOriginRight;
                            me.needleLogoMiddlePos = me.needleLogoOriginLeft + document.getElementById('img_' + me.name + '_LogoNeedle').offsetWidth / 2;
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        $('#div_' + me.name + '_Needle').css('right', me.needleOriginRight + 'px');
                        $('#div_' + me.name + '_Hand').css('right', me.handOriginLeft + 'px');
                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
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

            dragParameters.originX = mouseObj.clientX;
            if (commonHelper.isNullOrEmpty(me.firstClientX)) {
                me.firstClientX = dragParameters.originX;
            }

            dragParameters.needleOriginRight = parseInt($('#div_' + me.name + '_Needle').css('right').replace('px', ''));
            dragParameters.handOriginRight = parseInt($('#div_' + me.name + '_Hand').css('right').replace('px', ''));
            dragParameters.diffValue = dragParameters.needleOriginRight - dragParameters.handOriginRight;
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
            var newRight = dragParameters.needleOriginRight + (dragParameters.originX - mouseObj.clientX) / userData.getValue(enumLocalStorageItem.bodyZoom);

            if ((me.firstClientX - mouseObj.clientX) < 0) {
                newRight = me.needleOriginRight;
            }

            if (newRight - me.needleOriginRight > dragParameters.distance) {
                newRight = dragParameters.distance + me.needleOriginRight;
            }

            $('#div_' + me.name + '_Needle').css('right', newRight + 'px');
            $('#div_' + me.name + '_Hand').css('right', newRight - dragParameters.diffValue);

            if (newRight - me.needleOriginRight >= dragParameters.distance) {
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
                    Base.gotoPage(enumPageInfo.injectionStep03);
                }, 1000);
            }
            else {
                $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                $('#div_' + me.name + '_Needle').css('visibility', 'visible');
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
            var targetPos = Math.floor(document.getElementById('img_' + me.name + '_Bottle').offsetLeft + (document.getElementById('img_' + me.name + '_Bottle').offsetWidth / 2));
            var distance = me.needleLogoMiddlePos - targetPos + 10 * userData.getValue(enumLocalStorageItem.imageZoom);

            var dragParameters = {
                originX: null,
                needleOriginRight: null,
                handOriginRight: null,
                diffValue: null,
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
            Base.gotoPage(enumPageInfo.injectionStep01);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});