Ext.define(enumPageInfo.manageMyKits.nameSpace, {
    alias: [enumPageInfo.manageMyKits.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.manageMyKits.name,
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
                          '<div class="instructions_small">It\'s important to keep Lilly Glucagon<sup>TM</sup> Emergency Kits wherever you spend time. Enter the locations and expiration dates of your kits, and view some important information about storing Glucagon.</div>' +
                          '<ul class="sub_nav" id="ul_' + me.name + '_Nav">'+
                            '<li id="li_' + me.name + '_GoToInformation" targetPage="enumPageInfo.myKitInformation"><a><span class="float_l">My Kit Information</span><span class="iocn_arrow"></span></a></li>' +
                            '<li id="li_' + me.name + '_GoToGlucagon" targetPage="enumPageInfo.storingGlucagon"><a><span class="float_l">Storing Glucagon</span><span class="iocn_arrow"></span></a></li>' +
                          '</ul>'+
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