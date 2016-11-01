Ext.define(enumPageInfo.storingGlucagon.nameSpace, {
    alias: [enumPageInfo.storingGlucagon.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.storingGlucagon.name,
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
                html: '<div class="main">'+
                          '<div class="logo"><img src="img/logo_glucagon.png" id="img_' + me.name + '_Logo" height="52" alt=""/></div>'+
                          '<div class="editor">'+
                            '<div class="content kit_cont">'+
                              '<ul>'+
                                '<li>Before dissolving Glucagon with diluting solution, store the kit at controlled room temperature between 20° to 25°C (68° to 77°F).</li>'+
                                '<li>After dissolving Glucagon with diluting solution, use immediately. <strong>Discard any unused portion.</strong> Glucagon should be clear and of a water-like consistency at time of use.</li>'+
                              '</ul>'+
                            '</div>'+
                          '</div>' +
                      '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Base.zoomViewport();
                            
                            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
                            
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
    }
});