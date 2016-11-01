Ext.define(enumPageInfo.learnAboutGlucagon.nameSpace, {
    alias: [enumPageInfo.learnAboutGlucagon.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.learnAboutGlucagon.name,
    isPainted: false,

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
                      '<div class="logo"><img src="img/logo_glucagon.png" id="img_' + me.name + '_Logo" height="52" alt=""/></div>' +
                      '<div class="instructions_small">View information about Glucagon and severe low blood sugar, and access helpful links where you can learn more.</div>' +
                      '<ul class="sub_nav" id="ul_' + me.name + '_Nav">' +
                        '<li id="link_' + me.name + '_Indication" targetPage="enumPageInfo.glucagonIndication"><a><span class="float_l">Glucagon Indication</span><span class="iocn_arrow"></span></a></li>' +
                        '<li id="link_' + me.name + '_BloodSugar" targetPage="enumPageInfo.lowBloodSugar"><a><span class="float_l">About Severe Low Blood Sugar</span><span class="iocn_arrow"></span></a></li>' +
                        '<li id="link_' + me.name + '_Tips" targetPage="enumPageInfo.glucagonTips"><a><span class="float_l">Glucagon Tips</span><span class="iocn_arrow"></span></a></li>' +
                        '<li id="link_' + me.name + '_Helpful" targetPage="enumPageInfo.helpfulLinks"><a><span class="float_l">Helpful Links</span><span class="iocn_arrow"></span></a></li>' +
                      '</ul>' +
                      '</div>',
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
                        //me.destroySlides();                        
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
                    Base.gotoPage(eval(this.getAttribute('targetPage')));
                });
            }
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});