Ext.define(enumPageInfo.injectionStep08.nameSpace, {
    alias: [enumPageInfo.injectionStep08.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.injectionStep08.name,
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
                      '<div class="injection_step injection_step_8 fixed_height">' +
                        '<div class="bottle"><img src="img/vp_do_not_use.png" height="260" alt=""/></div>' +
                        '<div class="tips">' +
                          '<p>Glucagon should not be used unless the solution is clear and of a water-like consistency</p>' +
                        '</div>' +
                        '<div class="act_btn"><img id="img_' + me.name + '_BtnBack" src="img/btn_back.png" height="37" alt=""/></div>' +
                        '<div class="btn_next"><img id="img_' + me.name + '_BtnNext" src="img/btn_next.png" height="37" alt=""/></div>' +
                      '</div>' +
                      '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.registerEvent();
                            me.isPainted = true;
                        }

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

    registerEvent: function () {
        var me = this;
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('img_' + me.name + '_BtnBack').on('tap', me.link_BackEvent, me);
            Ext.get('img_' + me.name + '_BtnNext').on('tap', me.link_NextEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_BackEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_BackEvent';

        try {
            Base.gotoPage(enumPageInfo.injectionStep07);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_NextEvent: function () {
        var me = this;
        var methodName = me.name + '.link_NextEvent';

        try {
            Base.gotoPage(enumPageInfo.injectionStep09);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});