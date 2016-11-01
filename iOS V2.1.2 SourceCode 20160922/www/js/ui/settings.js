Ext.define(enumPageInfo.settings.nameSpace, {
    alias: [enumPageInfo.settings.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.settings.name,
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
                showAnimation: 'cube',
                hidden: true,
                html: '<div class="main settings">'
                            + '<div class="logo">'
                                + '<img src="img/logo_glucagon.png" id="img_' + me.name + '_Logo" height="52" alt=""/>'
                            + '</div>'
                            + '<section>'
                                + '<h4>'
                                    + '<img src="img/logo_needle_small.png" height="19" alt=""/> Audio Guide'
                                    + '<div class="btn_radio" id="div_' + me.name + '_Audio"></div>'
                                + '</h4>'
                                + '<p>Turn accompanying audio on or off.</p>'
                            + '</section>'
                            + '<section>'
                                + '<h4>'
                                    + '<img src="img/logo_needle_small.png" height="19" alt=""/> Manual Control'
                                    + '<div class="btn_radio" id="div_' + me.name + '_ManualPlay"></div>'
                                + '</h4>'
                                + '<p>Turn manual control on or off.</p>'
                                + '<p><span>On:</span><span>Control the tutorial by swiping from one screen to the next.</span></p>'
                                + '<p><span>Off:</span><span>The tutorial will play automatically.</span></p>'
                                + '<div class="clearit"></div>'
                            + '</section>'
                        + '</div>'
                        + '<div class="btn_save">'
                            + '<a id="link_' + me.name + '_Save">'
                                + '<img src="img/emergencySetup_btnSaveSettings.png" height="36" alt=""/>'
                            + '</a>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            me.registerEvent();
                            me.createToggleButtons();
                            me.isPainted = true;
                        }

                        Ext.getCmp('toggle_' + me.name + '_Audio').setValue(Base.getSoundStatus());
                        Ext.getCmp('toggle_' + me.name + '_ManualPlay').setValue(Base.getManualPlayStatus());
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
            Ext.get('link_' + me.name + '_Save').on('tap', me.link_Save_ClickEvent, me);
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Save_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Save_ClickEvent';

        try {
            Base.setSoundStatus(Ext.getCmp('toggle_' + me.name + '_Audio').getValue());
            Base.setManualPlayStatus(Ext.getCmp('toggle_' + me.name + '_ManualPlay').getValue());
            Base.backPage();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    createToggleButtons: function () {
        var me = this;
        var methodName = me.name + '.createToggleButtons';

        try {
            Ext.create('Ext.field.Toggle', {
                id: 'toggle_' + me.name + '_Audio',
                renderTo: 'div_' + me.name + '_Audio',
                listeners: {
                    change: function (sender, newValue, oldValue, eOpts) {
                        Base.setSoundStatus(Ext.getCmp('toggle_' + me.name + '_Audio').getValue());
                    }
                }
            });

            Ext.create('Ext.field.Toggle', {
                id: 'toggle_' + me.name + '_ManualPlay',
                renderTo: 'div_' + me.name + '_ManualPlay',
                listeners: {
                    change: function (sender, newValue, oldValue, eOpts) {
                        Base.setManualPlayStatus(Ext.getCmp('toggle_' + me.name + '_ManualPlay').getValue());
                    }
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});
