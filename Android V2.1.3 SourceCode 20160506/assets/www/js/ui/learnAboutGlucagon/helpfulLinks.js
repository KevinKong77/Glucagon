Ext.define(enumPageInfo.helpfulLinks.nameSpace, {
    alias: [enumPageInfo.helpfulLinks.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.helpfulLinks.name,
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
                html: '<div class="main">'
                            + '<div class="logo float_l">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="logo_r float_r">'
                                + '<img src="img/logo_lilly.png" height="19" alt=""/>'
                            + '</div>'
                            + '<div class="clearit"></div>'
                            + '<div class="editor">'
                                + '<div class="content nolidisc">'
                                    + '<p>Learn more by exploring these websites.</p>'
                                    + '<h1>Learn about Glucagon:</h1>'
                                    + '<ul>'
                                        + '<li><a id="link_' + me.name + '_LillyGlucagon">www.LillyGlucagon.com</a></li>'
                                    + '</ul>'
                                    + '<h1>Learn about type 1 diabetes:</h1>'
                                    + '<ul>'
                                        + '<li><a id="link_' + me.name + '_JDRF">JDRF</a></li>'
                                        + '<li><a id="link_' + me.name + '_CWD">Children with Diabetes</a></li>'
                                        + '<li><a id="link_' + me.name + '_NDEP">National Diabetes Education Program</a></li>'
                                        + '<li><a id="link_' + me.name + '_ADA">American Diabetes Association</a></li>'
                                    + '</ul>'
                                + '</div>'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Base.zoomViewport();

                            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
                            Ext.get('link_' + me.name + '_LillyGlucagon').on('tap', me.link_OuterWebSite_TapEvent, me);
                            Ext.get('link_' + me.name + '_JDRF').on('tap', me.link_OuterWebSite_TapEvent, me);
                            Ext.get('link_' + me.name + '_CWD').on('tap', me.link_OuterWebSite_TapEvent, me);
                            Ext.get('link_' + me.name + '_NDEP').on('tap', me.link_OuterWebSite_TapEvent, me);
                            Ext.get('link_' + me.name + '_ADA').on('tap', me.link_OuterWebSite_TapEvent, me);

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

    link_OuterWebSite_TapEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_OuterWebSite_TapEvent';

        try {
            var senderId = sender.target.id.split('_')[2];
            if (senderId == 'LillyGlucagon') {
                window.open('http://www.LillyGlucagon.com', '_system');
            }
            else {
                var msgContent = 'The link you clicked on will take you to a site maintained by a third party, which is solely responsible for its content. Lilly USA, LLC is not responsible for the privacy policy of any third-party websites.';
                msgHelper.showCustomConfirm(null, msgContent, 'Cancel', 'Continue', function (btn) {
                    if (btn == 'yes') {
                        switch (senderId) {
                            case 'JDRF':
                                window.open('http://www.jdrf.org/index.cfm?page_id=103438', '_system');
                                break;
                            case 'CWD':
                                window.open('http://www.childrenwithdiabetes.com', '_system');
                                break;
                            case 'NDEP':
                                window.open('http://www.ndep.nih.gov/i-have-diabetes', '_system');
                                break;
                            case 'ADA':
                                window.open('http://www.diabetes.org/diabetes-basics/type-1', '_system');
                                break;
                        }
                    }
                });
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});