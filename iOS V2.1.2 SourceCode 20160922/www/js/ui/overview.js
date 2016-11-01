Ext.define(enumPageInfo.overview.nameSpace, {
    alias: [enumPageInfo.overview.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.overview.name,
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
                showAnimation: 'cube',
                hidden: true,
                html: '<div class="main fixed_height">'
                            + '<div class="bg_content"></div>'
                        + '</div>'
                        + '<div class="act_btn_next">'
                            + '<a id="link_' + me.name + '_Next">'
                                + '<img src="img/btn_next.png" height="37" alt=""/>'
                            + '</a>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        if (!me.isPainted) {
                            me.registerEvent();
                            Base.zoomViewport();
                            me.isPainted = true;
                        }

                        if (!commonSession.agreeGuide) {
                            userData.setValue(enumLocalStorageItem.agreeGuide, true);
                            commonSession.agreeGuide = true;
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
        var methodName = me.name + '.init';

        try {
            Ext.get('link_' + me.name + '_Next').on('tap', me.link_Next_ClickEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Next_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Next_ClickEvent';

        try {
            Base.gotoPage(enumPageInfo.landing);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});