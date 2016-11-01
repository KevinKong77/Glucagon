Ext.define(enumPageInfo.injectionStepGuide.nameSpace, {
    alias: [enumPageInfo.injectionStepGuide.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStepGuide.name,
    isPainted: false,
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
                            + '<div class="logo float_l">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="logo_r float_r">'
                                + '<img src="img/logo_lilly.png" height="19" alt=""/>'
                            + '</div>'
                            + '<div class="clearit"></div>'
                            + '<div class="injection_step injection_step_guide relative">'
                                + '<img src="img/vp_intro_contents.png" height="362" alt="" class="bg"/>'
                                + '<p class="intro_1">Glucagon Kit box</p>'
                                + '<p class="intro_2">Vial of Glucagon powder</p>'
                                + '<p class="intro_3">Syringe and cap</p>'
                                + '<div class="btn_next none" id="div_' + me.name + '_BtnNext">'
                                    + '<a id="link_' + me.name + '_BeginStep">'
                                        + '<img src="img/btn_next.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                                + '<div class="popup_info_1" id="div_' + me.name + '_PopInfo1">'
                                    + '<h3>Practice Giving an Injection</h3>'
                                    + '<p>This simulation will help you become familiar with the differnet parts of the Glucagon kit as well as the steps you would take in preparing and giving a Glucagon injection.</p>'
                                    + '<h3>Select Safety Information</h3>'
                                    + '<p>Glucagon should not be used if you have pheochromocytoma or if you are allergic to Glucagon.</p>'
                                    + '<p></p>'
                                    + '<a id="link_' + me.name + '_Practice">'
                                        + '<img src="img/btn_practice.png" height="44" alt=""/>'
                                    + '</a>'
                                + '</div>'
                                + '<div class="popup_info_2 none" id="div_' + me.name + '_PopInfo2">'
                                    + '<a id="link_' + me.name + '_Next">'
                                        + '<img src="img/btn_next.png" height="37" alt=""/>'
                                    + '</a>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!(Base.visitHistory[Base.visitHistory.length - 2].originPageInfo.name == enumPageInfo.injectionStep01.name || Base.isBack)) {
                            document.getElementById('div_' + me.name + '_PopInfo1').style.display = '';
                            document.getElementById('div_' + me.name + '_PopInfo2').style.display = 'none';
                            document.getElementById('div_' + me.name + '_BtnNext').style.display = 'none';
                        }

                        if (!me.isPainted) {
                            me.registerEvent();
                            Base.zoomViewport();
                            me.isPainted = true;
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
            Ext.get('link_' + me.name + '_Practice').on('tap', me.link_Practice_Event, me);
            Ext.get('link_' + me.name + '_Next').on('tap', me.link_Next_Event, me);
            Ext.get('link_' + me.name + '_BeginStep').on('tap', me.link_BeginStep_Event, me);
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Practice_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Practice_Event';

        try {
            document.getElementById('div_' + me.name + '_PopInfo1').style.display = 'none';
            $('#div_' + me.name + '_PopInfo2').fadeIn(400);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Next_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Next_Event';

        try {
            document.getElementById('div_' + me.name + '_PopInfo2').style.display = 'none';
            $('#div_' + me.name + '_BtnNext').fadeIn(400);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_BeginStep_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_BeginStep_Event';

        try {
            Base.gotoPage(enumPageInfo.injectionStep01);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});