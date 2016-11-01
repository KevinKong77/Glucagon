Ext.define(enumPageInfo.injectionStep01.nameSpace, {
    alias: [enumPageInfo.injectionStep01.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep01.name,
    isPainted: false,
    timer: null,
    constructor: function (config) {
        this.initConfig(config);
    },
    needleWholeOriginTop: null,
    needleLogoOriginTop: null,

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,

    initialHandTop: null,
    firstTime: true,
    whetherRestore: false,

    bottleLidOriginLeft: null,
    bottleLidOriginBottom: null,

    startX: null,
    startY: null,
    isCorrect: false,

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'slide',
                hidden: true,
                html: '<div class="wrap"></div>'
                        + '<div class="main" style="text-align:center" id="div_' + me.name + '_Main">'
                            + '<div class="injection_step injection_step_1 fixed_height">'
                                + '<img class="bottlelid_img" id="div_' + me.name + '_BottleLid" src="img/vp_bottleLid.png" height="15" alt="" style="visibility: hidden"/>'
                                + '<div id="div_' + me.name + '_Bottle" class="bottle">'
                                    + '<img src="img/vp_bottle.png" height="190" alt=""/>'
                                + '</div>'
                                + '<div class="needle"  id="div_' + me.name + '_Needle">'
                                    + '<img id="img_' + me.name + '_LogoNeedle" src="img/vp_logoNeedle.png" height="42" alt=""/>'
                                + '</div>'
                                + '<div class="hand_1" id="div_' + me.name + '_FlipVial_hand">'
                                    + '<img src="img/vp_flipVial_hand.png" height="159" alt=""/>'
                                + '</div>'
                                + '<div class="tips"  id="div_' + me.name + '_Tips">'
                                    + '<p id="p_' + me.name + '_Tips">Flip off the seal from the vial of Glucagon powder. Drag the icon with your finger</p>'
                                    + '<p id="p_' + me.name + '_CorrectTips">Correct!&nbsp;Next step</p>'
                                + '</div>'
                                + '<div class="act_btn">'
                                    + '<a id="link_' + me.name + '_BtnBack">'
                                        + '<img src="img/btn_back.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                                + '<div class="arrow_up" id="div_' + me.name + '_ArrowDown">'
                                    + '<img src="img/vp_arrowUp.png" height="99" alt=""/>'
                                + '</div>'
                                + '<div style="height:20px;width:20px" id="output"></div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        me.isCorrect = false;

                        $('#div_' + me.name + '_BottleLid').css('transform', 'rotate(0deg)');
                        $('#div_' + me.name + '_BottleLid').css('-webkit-transform', 'rotate(0deg)');

                        if (!me.isPainted) {
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            Base.zoomViewport();
                            me.initialHandTop = document.getElementById('div_' + me.name + '_FlipVial_hand').offsetTop;

                            var bottleHeight = document.getElementById('div_' + me.name + '_Bottle').offsetHeight;
                            var bottleBottom = parseInt($('#div_' + me.name + '_Bottle').css('bottom').replace('px', ''));
                            var bottleTopWidth = document.getElementById('div_' + me.name + '_BottleLid').offsetWidth;
                            var bottleTopLeft = Math.floor((document.body.offsetWidth - bottleTopWidth) / 2);

                            me.bottleLidOriginBottom = bottleHeight + bottleBottom - 15;
                            me.bottleLidOriginLeft = bottleTopLeft - 1.5 * userData.getValue(enumLocalStorageItem.imageZoom);

                            $('#div_' + me.name + '_BottleLid').css('bottom', me.bottleLidOriginBottom);
                            $('#div_' + me.name + '_BottleLid').css('left', me.bottleLidOriginLeft);
                            $('#div_' + me.name + '_BottleLid').css('visibility', 'visible');

                            me.registerEvent();
                            me.isPainted = true;
                        }

                        document.getElementById('div_' + me.name + '_FlipVial_hand').style.top = me.initialHandTop + "px";
                        $('#div_' + me.name + '_FlipVial_hand').fadeOut(1);

                        me.timer = window.setTimeout(function () {
                            $('#div_' + me.name + '_FlipVial_hand').fadeIn(1);
                            me.flipVialHandMoveUp();
                        }, 1000);

                        $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                        $('#div_' + me.name + '_Needle').css('visibility', 'visible');
                        $('#p_' + me.name + '_Tips').fadeIn(1);
                        $('#p_' + me.name + '_CorrectTips').fadeOut(1);
                        me.firstTime = true;

                        maskHelper.closeMask();
                    },
                    hide: function (sender, eOpts) {
                        window.clearTimeout(me.timer);
                        me.timer = null;

                        $('#div_' + me.name + '_BottleLid').removeAttr("style");
                        $('#div_' + me.name + '_BottleLid').css('bottom', me.bottleLidOriginBottom);
                        $('#div_' + me.name + '_BottleLid').css('left', me.bottleLidOriginLeft);
                        $('#div_' + me.name + '_BottleLid').css('visibility', 'visible');
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

    flipVialHandMoveUp: function () {
        var me = this;
        var methodName = me.name + '.flipVialHandMove';

        try {
            var flipVialHand = document.getElementById('div_' + me.name + '_FlipVial_hand');
            var divTips = document.getElementById('div_' + me.name + '_Tips');
            var initTop = flipVialHand.offsetTop;
            var targetTop = divTips.offsetTop + divTips.offsetHeight;

            if (initTop > targetTop) {
                flipVialHand.style.top = initTop - 2 * userData.getValue(enumLocalStorageItem.imageZoom) + "px";

                me.timer = window.setTimeout(function () {
                    me.flipVialHandMoveUp();
                }, 10);
            } else {
                window.clearTimeout(me.timer);
                me.timer = null;

                $('#div_' + me.name + '_FlipVial_hand').fadeOut(500);
                me.timer = window.setTimeout(function () {
                    flipVialHand.style.top = me.initialHandTop + "px";
                    $('#div_' + me.name + '_FlipVial_hand').fadeIn(1);
                    me.flipVialHandMoveUp();
                }, 4000);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    fingerSwipgeEvent: function (event) {
        var me = this;
        var methodName = me.name + '.fingerSwipgeEvent';

        var srcElement = Ext.get('div_' + me.name + '_Main').dom;
        var rect = document.getElementById('div_' + me.name + '_BottleLid');
        var radian = 80; //Parabolic Angle
        var step = 2 * userData.getValue(enumLocalStorageItem.imageZoom); // transverse velocity, add 5 every time

        try {

            if (commonHelper.isTouchDevice()) {
                srcElement.ontouchstart = function (e) {
                    if (me.isCorrect) {
                        return;
                    }

                    me.touchStartEvent(e.touches[0]);

                    document.ontouchmove = function (e) {
                        me.touchMoveEvent(e.touches[0]);
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
                    me.touchStartEvent(e);

                    document.onmousemove = function (e) {
                        me.touchMoveEvent(e);
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

    openBottleLid: function (rect, radian, step) {
        var me = this;

        var animate = function (opt) {
            var cos = Math.cos(opt.radian * Math.PI / 180);
            var sin = Math.sin(opt.radian * Math.PI / 180);
            var left = opt.rect.offsetLeft;
            var top = opt.rect.offsetTop;
            if (opt.radian > 0) {
                left += opt.step;
                opt.radian -= 1; //angle decrease 1 
                var a = left - opt.initLeft;
                var c = (a / cos);
                var b = (sin * c);
                //if (!opt.rect.style.top || parseInt(opt.rect.style.top.replace('px', '')) > opt.initTop - b) {
                if (a <= 45) {
                    opt.rect.style.left = opt.initLeft + a + "px";
                    opt.rect.style.top = opt.initTop - b + "px";

                    $('#div_' + me.name + '_BottleLid').css('transform', 'rotate(' + a + 'deg)');
                    $('#div_' + me.name + '_BottleLid').css('-webkit-transform', 'rotate(' + a + 'deg)');

                    me.timer = window.setTimeout(function () {
                        animate(opt);
                    }, 20);
                }
                else {
                    window.clearTimeout(me.timer);
                    me.timer = null;

                    document.getElementById('p_' + me.name + '_Tips').style.display = 'none';
                    $('#div_' + me.name + '_Tips').css('visibility', 'visible');
                    $('#p_' + me.name + '_CorrectTips').fadeIn(300);

                    maskHelper.createHiddenMask(1);
                    maskHelper.openMask();

                    me.timer = window.setTimeout(function () {
                        Base.gotoPage(enumPageInfo.injectionStep02);
                    }, 1300);
                }
            }
        }

        animate({
            step: step,
            rect: rect,
            radian: radian,
            initTop: rect.offsetTop,
            initLeft: rect.offsetLeft
        });

        me.firstTime = false;
    },

    touchStartEvent: function (e) {
        var me = this;
        var x = e.clientX;
        var y = e.clientY;
        me.startX = x;
        me.startY = y;
    },

    touchMoveEvent: function (e) {
        var me = this;

        if (me.isCorrect) {
            return;
        }

        var distinceX = e.clientX - me.startX;
        var distinceY = me.startY - e.clientY;

        if (Math.abs(distinceX) > 10 || distinceY <= 0) {
            return;
        }

        if (Math.sqrt(distinceX * distinceX + distinceY * distinceY) > 15) {
            me.isCorrect = true;
        }
    },

    touchEndEvent: function (e) {
        var me = this;
        var methodName = me.name + '.touchEndEvent';

        try {
            if (me.isCorrect) {
                var rect = document.getElementById('div_' + me.name + '_BottleLid');
                var radian = 80; //Parabolic Angle
                var step = 2 * userData.getValue(enumLocalStorageItem.imageZoom); // transverse velocity, add 5 every time

                $('#div_' + me.name + '_Tips').css('visibility', 'hidden');
                window.clearTimeout(me.timer);
                me.timer = null;

                me.openBottleLid(rect, radian, step);
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

    registerEvent: function () {
        var me = this;
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('img_' + me.name + '_LogoNeedle').on('tap', me.hideLogoNeedle, me);
            Ext.get('link_' + me.name + '_BtnBack').on('tap', me.link_BackEvent, me);

            me.fingerSwipgeEvent();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_BackEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_BackEvent';

        try {
            window.clearTimeout(me.timer);
            me.timer = null;

            Base.gotoPage(enumPageInfo.injectionStepGuide);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    hideLogoNeedle: function () {
        var me = this;
        var methodName = me.name + '.hideLogoNeedle';

        try {
            var srcElement = Ext.get('img_' + me.name + '_LogoNeedle').dom;

            if (commonHelper.isTouchDevice()) {
                srcElement.ontouchstart = function (e) {
                    $('#img_' + me.name + '_LogoNeedle').css('visibility', 'hidden');

                    document.ontouchend = function (e) {
                        $('#img_' + me.name + '_LogoNeedle').css('visibility', 'visible');
                    }
                }
            }
            else {
                srcElement.onmousedown = function (e) {
                    $('#img_' + me.name + '_LogoNeedle').css('visibility', 'hidden');

                    document.onmouseup = function (e) {
                        $('#img_' + me.name + '_LogoNeedle').css('visibility', 'visible');
                    }
                }
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});