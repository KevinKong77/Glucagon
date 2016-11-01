Ext.define(enumPageInfo.landing.nameSpace, {
    alias: [enumPageInfo.landing.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.landing.name,
    isPainted: false,
    constructor: function (config) {
        this.initConfig(config);
    },

    appRootDirName: 'test',
    fullPath: null,

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'fade',
                hidden: true,
                html: '<div class="main landing">'
                            + '<div class="logo">'
                                + '<img src="img/home_logo.png" height="85" alt=""/>'
                            + '</div>'
                            + '<ul class="main_nav" id="ul_' + me.name + '_Nav">'
                                + '<li id="li_' + me.name + '_GotoEmergencyInstructions" targetPage="enumPageInfo.emergencyInstructions"><img src="img/btn_home_emergencyInstructions.png" height="51"/></li>'
                                + '<li id="li_' + me.name + '_GotoPracticeAndPrepare" targetPage="enumPageInfo.practiceAndPrepare"><img src="img/logo_needle_small.png" height="19" alt=""/>Practice and Prepare</li>'
                                + '<li id="li_' + me.name + '_GotoManageMyKits" targetPage="enumPageInfo.manageMyKits"><img src="img/logo_needle_small.png" height="19" alt=""/>Manage My Kits</li>'
                                + '<li id="li_' + me.name + '_GotoLearnAboutGlucagon" targetPage="enumPageInfo.learnAboutGlucagon"><img src="img/logo_needle_small.png" height="19" alt=""/>Learn About Glucagon</li>'
                                + '<li id="li_' + me.name + '_GotoISI" targetPage="enumPageInfo.isi"><img src="img/logo_needle_small.png" height="19" alt=""/>Important Safety Information <a id="link_' + me.name + '_ISI"><img src="img/btn_isi.png" height="19" alt="" /></a></li>'
                                + '<li id="li_' + me.name + '_GotoInformationForUser" targetPage="enumPageInfo.informationForUser"><img src="img/logo_needle_small.png" height="19" alt=""/>Information for the User</li>'
                                + '<li id="li_' + me.name + '_GotoInformationForPhysician" targetPage="enumPageInfo.informationForPhysician"><img class="landing_isi_icon" src="img/logo_needle_small.png" height="19" alt=""/>Information for the Physician</li>'
                            + '</ul>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();
                        if (!me.isPainted) {
                            if (commonHelper.isTouchDevice()) {
                                navigator.splashscreen.hide();
                            }

                            me.init();
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

    init: function () {
        var me = this;
        var methodName = me.name + '.init';

        try {
            var liItems = Ext.DomQuery.select('ul[id=ul_' + me.name + '_Nav] li');
            for (var i = 0; i < liItems.length; i++) {
                Ext.get(liItems[i].id).on('touchstart', function (sender, event) {
                    $('#' + this.id).css('color', '#aaa');
                });

                Ext.get(liItems[i].id).on('touchend', function (sender, event) {
                    $('#' + this.id).css('color', '');
                });

                Ext.get(liItems[i].id).on('tap', function (sender, event) {
                    Base.gotoPage(eval(this.getAttribute('targetPage')));
                });
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});
