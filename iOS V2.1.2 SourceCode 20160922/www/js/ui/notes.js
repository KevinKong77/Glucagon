Ext.define(enumPageInfo.notes.nameSpace, {
    alias: [enumPageInfo.notes.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.notes.name,
    isPainted: false,
    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,
    stepValue: 1,
    constructor: function (config) {
        this.initConfig(config);
    },
    tmpHeight: null,
    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'cube',
                hidden: true,
                html: '<div class="main" id="div_' + me.name + '_Main">'
                            + '<div class="logo">'
                                + '<img src="img/logo_glucagon.png" id="img_' + me.name + '_Logo" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="editor" id="div_' + me.name + '_Editor">'
                            + '</div>'
                            + '<div class="notePrivacy" id="div_' + me.name + '_Privacy">'
                                + 'Lilly does not monitor these notes for any adverse events entered. '
                                + 'You are encouraged to report negative side effects of prescription drugs to the FDA. '
                                + 'Visit <a id="link_' + me.name + '_FDA">www.fda.gov/medwatch</a> or call 1-800-FDA-1088.'
                            + '</div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            Ext.get('link_' + me.name + '_FDA').on('tap', me.link_OuterWebSite_TapEvent, me);

                            me.topLogoHeight = Base.getOriginOffsetHeight('img_' + me.name + '_Logo');
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;

                            var mainPaddingTop = parseInt($('#div_' + me.name + '_Main').css('padding-top').replace('px', ''));
                            var mainPaddingBottom = parseInt($('#div_' + me.name + '_Main').css('padding-bottom').replace('px', ''));
                            var editorMarginTop = parseInt($('#div_' + me.name + '_Editor').css('margin-top').replace('px', ''));
                            var editorMarginBottom = parseInt($('#div_' + me.name + '_Editor').css('margin-bottom').replace('px', ''));
                            var editorPaddingTop = parseInt($('#div_' + me.name + '_Editor').css('padding-top').replace('px', ''));
                            var editorPaddingBottom = parseInt($('#div_' + me.name + '_Editor').css('padding-bottom').replace('px', ''));
                            var privacyHeight = document.getElementById('div_' + me.name + '_Privacy').offsetHeight;

                            Base.zoomViewport();
                            me.tmpHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - mainPaddingTop - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom) - editorMarginTop - editorPaddingTop - editorMarginBottom - editorPaddingBottom - privacyHeight - me.bottomBarHeight;
                            document.getElementById('div_' + me.name + '_Editor').style.height = me.tmpHeight + 'px';
                            me.createScrollTextArea(me.tmpHeight);

                            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);

                            me.isPainted = true;
                        }
                    },
                    hide: function (sender, eOpts) {
                        var textArea = Ext.getCmp('txt_' + enumPageInfo.scrollTextArea.name + '_Notes');
                        if (!commonHelper.isNullOrEmpty(textArea)) {
                            userData.setValue(enumLocalStorageItem.notes, textArea.getValue());
                            textArea.setPlaceHolder('Tab here to add notes');
                        }
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
            var msgContent = 'The link you clicked on will take you to a site maintained by a third party, which is solely responsible for its content. Lilly USA, LLC is not responsible for the privacy policy of any third-party websites.';
            msgHelper.showCustomConfirm(null, msgContent, 'Cancel', 'Continue', function (btn) {
                if (btn == 'yes') {
                    window.open('http://www.fda.gov/medwatch', '_system');
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    createScrollTextArea: function (newHeight) {
        var me = this;
        var methodName = me.name + '.createScrollTextArea';

        try {
            var createScrollTextArea = Ext.create(enumPageInfo.scrollTextArea.nameSpace, {
                height: newHeight,
                cls: 'note_editor',
                id: 'div_' + me.name + '_Notes',
                renderTo: 'div_' + me.name + '_Editor'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});
