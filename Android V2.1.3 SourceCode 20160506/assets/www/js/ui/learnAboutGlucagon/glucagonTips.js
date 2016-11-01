Ext.define(enumPageInfo.glucagonTips.nameSpace, {
    alias: [enumPageInfo.glucagonTips.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.glucagonTips.name,
    isPainted: false,
    carouselWidth: null,
    carouselHeight: null,
    introSources: [
        'If you take insulin, you should have at least one Lilly Glucagon<sup>TM</sup> Emergency Kit on hand wherever you spend time.',
        'Ask your healthcare provider about the benefits of an additional Lilly Glucagon<sup>TM</sup> Emergency Kit. That way, you can be prepared at home, at work, and wherever you spend time.',
        '<strong>Select Safety Information</strong><br />You and anyone who may need to help you during an emergency should become familiar with how to use Glucagon before an emergency arises. Read the <a id="link_' + enumPageInfo.glucagonTips.name + '_GotoInformationForUser">Information for the User</a> provided in this application.',
        '<strong>Select Safety Information</strong><br />Make sure that your relatives or close friends know that if you become unconscious, medical assistance must always be sought. If you are unconscious, Glucagon can be given while awaiting medical assistance.',
        '<strong>Important Safety Information</strong><br />Do not use the Kit after the date stamped on the bottle label.',
        '<strong>Important Safety Information</strong><br />If you have questions concerning the use of this product, consult a doctor, nurse of pharmacist.'
    ],

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
                html: '<div class="main" id="div_' + me.name + '_Main">'
                            + '<div class="logo" id="div_' + me.name + '_Logo">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div id="div_' + me.name + '_SlideShow" class="slide_show">'
                                + '<div class="left" id="div_' + me.name + '_SlideLeft">'
                                    + '<span id="span_' + me.name + '_LeftArrow" style="display:none"><!--Left arrow--></span>'
                                + '</div>'
                                + '<div class="center" id="div_' + me.name + '_SlideMiddle">'
                                + '</div>'
                                + '<div class="right" id="div_' + me.name + '_SlideRight">'
                                    + '<span id="span_' + me.name + '_RightArrow"><!--Right arrow--></span>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.createIntroCarouselPanel();
                            me.bindIntroData();
                            me.registerEvent();
                            me.isPainted = true;
                        }

                        if (!Base.isBack) {
                            Ext.getCmp('car_' + me.name + '_SlideMiddle').setActiveItem(0);
                        }
                        else {
                            me.carsouelActiveEvent();
                        }
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
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
            Ext.get('span_' + me.name + '_LeftArrow').on('tap', me.gotoPrevTip_TapEvent, me);
            Ext.get('span_' + me.name + '_RightArrow').on('tap', me.gotoNextTip_TapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    createIntroCarouselPanel: function () {
        var me = this;
        var methodName = me.name + '.createIntroCarouselPanel';

        try {
            var createMediaCarouselPanel = Ext.create('Ext.Carousel', {
                bodyBorder: false,
                height: '100%',
                width: '100%',
                id: 'car_' + me.name + '_SlideMiddle',
                renderTo: 'div_' + me.name + '_SlideMiddle',
                indicator: false,
                defaults: {
                    styleHtmlContent: true
                },
                listeners: {
                    painted: function (sender, eOpts) {
                    },
                    activeitemchange: function (sender, value, oldValue, eOpts) {
                        me.carsouelActiveEvent();
                    }
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    carsouelActiveEvent: function () {
        var me = this;
        var methodName = me.name + '.carsouelActiveEvent';

        try {
            if (!commonHelper.isNullOrEmpty(Ext.get('link_' + me.name + '_GotoInformationForUser'))) {
                Ext.get('link_' + me.name + '_GotoInformationForUser').un('tap', me.gotoInformationForUser_TapEvent, me);
                Ext.get('link_' + me.name + '_GotoInformationForUser').on('tap', me.gotoInformationForUser_TapEvent, me);
            }

            if (Ext.getCmp('car_' + me.name + '_SlideMiddle').getActiveIndex() == 0) {
                $(".slide_show .left span").hide();
                $(".slide_show .right span").show();
            }
            else if (Ext.getCmp('car_' + me.name + '_SlideMiddle').getActiveIndex() == me.introSources.length - 1) {
                $(".slide_show .left span").show();
                $(".slide_show .right span").hide();
            }
            else {
                $(".slide_show .left span").show();
                $(".slide_show .right span").show();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    bindIntroData: function () {
        var me = this;
        var methodName = me.name + '.bindIntroData';

        try {
            var itemList = new Array();

            for (var i = 0; i < me.introSources.length; i++) {
                itemList.push(
                    me.createIntroSlidePanel(me.introSources[i])
                );
            }

            Ext.getCmp('car_' + me.name + '_SlideMiddle').setItems(itemList);
        }
        catch (e) {
            Base.errorHandler(methodName, e);
        }
    },

    createIntroSlidePanel: function (introData) {
        var me = this;
        var methodName = me.name + '.createIntroSlidePanel';

        try {
            var createSlidePanel = Ext.create('Ext.Panel', {
                html: '<div class="liDiv"><div>' + introData + '</div></div>'
            });

            return createSlidePanel;
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    gotoInformationForUser_TapEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.gotoInformationForUser_TapEvent';

        try {
            Base.gotoPage(enumPageInfo.informationForUser);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    gotoPrevTip_TapEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.gotoPrevTip_TapEvent';

        try {
            var currentIndex = Ext.getCmp('car_' + me.name + '_SlideMiddle').getActiveIndex();
            if (currentIndex > 0) {
                Ext.getCmp('car_' + me.name + '_SlideMiddle').previous();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    gotoNextTip_TapEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.gotoNextTip_TapEvent';

        try {
            var currentIndex = Ext.getCmp('car_' + me.name + '_SlideMiddle').getActiveIndex();
            if (currentIndex < me.introSources.length - 1) {
                Ext.getCmp('car_' + me.name + '_SlideMiddle').next();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});