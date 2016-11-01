Ext.define(enumPageInfo.practiceAndPrepare.nameSpace, {
    alias: [enumPageInfo.practiceAndPrepare.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.practiceAndPrepare.name,
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
                            + '<div class="logo">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="instructions_small">'
                                + 'Practice the steps for giving a Glucagon injection using your touch screen or watch a tutorial. You can manage audio and play control settings for the tutorial using the '
                                + '<a id="link_' + me.name + '_Settings">'
                                    + '<img src="img/btn_settings.png" height="18" alt=""/>'
                                + '</a>'
                                + ' button at the bottom of your screen.'
                            + '</div>'
                            + '<ul class="sub_nav" id="ul_' + me.name + '_Nav">'
                                + '<li id="li_' + me.name + '_GotoInjectionStep" targetPage="enumPageInfo.injectionStepGuide">'
                                    + '<a>'
                                        + '<span class="float_l">Practice Injection Steps</span>'
                                        + '<span class="iocn_arrow"></span>'
                                    + '</a>'
                                + '</li>'
                                + '<li id="li_' + me.name + '_GotoWatchTutorial" targetPage="enumPageInfo.emergencyInstructions">'
                                    + '<a>'
                                        + '<span class="float_l">Watch a Tutorial</span>'
                                        + '<span class="iocn_arrow"></span>'
                                    + '</a>'
                                + '</li>'
                            + '</ul>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.registerEvent();
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
            var liItems = Ext.DomQuery.select('ul[id=ul_' + me.name + '_Nav] li');
            for (var i = 0; i < liItems.length; i++) {
                Base.registerSubNavListTouchEvent(liItems[i].id);

                Ext.get(liItems[i].id).on('tap', function (sender, event) {
                    if (eval(this.getAttribute('targetPage')).name == enumPageInfo.emergencyInstructions.name) {
                        Base.gotoPage(eval(this.getAttribute('targetPage')), 'Watch a Tutorial');
                    } 
                    else {
                        Base.gotoPage(eval(this.getAttribute('targetPage')));
                    }
                });
            }
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});