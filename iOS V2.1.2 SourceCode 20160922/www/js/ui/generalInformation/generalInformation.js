Ext.define(enumPageInfo.generalInformation.nameSpace, {
    alias: [enumPageInfo.generalInformation.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.generalInformation.name,
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
                html: '<div class="main" id="div_' + me.name + '_Main">' +
                      '<div class="logo"><img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/></div>' +
                      '<ul class="sub_nav" id="ul_' + me.name + '_Nav">' +
                        '<li id="link_' + me.name + '_TermsOfUse" targetPage="enumPageInfo.termsOfUse"><a><span class="float_l">Terms of Use</span><span class="iocn_arrow"></span></a></li>' +
                        '<li id="link_' + me.name + '_PrivacyPolicy" targetPage="enumPageInfo.privacyPolicy"><a><span class="float_l">Privacy Policy</span><span class="iocn_arrow"></span></a></li>' +
                        '<li id="link_' + me.name + '_CopyRight" targetPage="enumPageInfo.copyRight"><a><span class="float_l">Copyright</span><span class="iocn_arrow"></span></a></li>' +
                        '<li id="link_' + me.name + '_AskLilly" targetPage="enumPageInfo.askLilly"><a><span class="float_l">Ask Lilly</span><span class="iocn_arrow"></span></a></li>' +
                      '</ul>' +
                      '</div>' +
                      '<div class="copyright">GL93677 03/2015 &copy;Lilly USA, LLC 2015. All rights reserved. <br/>' +
                      'This app is intended for US residents ages 18 and over.' +
                      '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            me.topLogoHeight = Base.getOriginOffsetHeight('img_' + me.name + '_Logo');
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;

                            Base.zoomViewport();

                            var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom);
                            document.getElementById('div_' + me.name + '_Main').style.height = newHeight + 'px';
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