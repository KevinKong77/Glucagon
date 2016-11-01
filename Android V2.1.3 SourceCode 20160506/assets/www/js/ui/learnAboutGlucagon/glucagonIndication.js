Ext.define(enumPageInfo.glucagonIndication.nameSpace, {
    alias: [enumPageInfo.glucagonIndication.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.glucagonIndication.name,
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
                html: '<div class="main">' +
                      '<div class="logo float_l"><img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/></div>' +
                      '<div class="logo_r float_r"><img src="img/logo_lilly.png" height="19" alt=""/></div>' +
                      '<div class="clearit"></div>' +
                      '<div class="editor" id="div_' + me.name + '_Editor">' +
                      '</div>' +
                    '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            me.topLogoHeight = Base.getOriginOffsetHeight('img_' + me.name + '_Logo');
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;

                            var editorMarginTop = parseInt($('#div_' + me.name + '_Editor').css('margin-top').replace('px', ''));
                            var editorMarginBottom = parseInt($('#div_' + me.name + '_Editor').css('margin-bottom').replace('px', ''));
                            var editorPaddingTop = parseInt($('#div_' + me.name + '_Editor').css('padding-top').replace('px', ''));
                            var editorPaddingBottom = parseInt($('#div_' + me.name + '_Editor').css('padding-bottom').replace('px', ''));
                            Base.zoomViewport();
                            var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom) - editorMarginTop - editorMarginBottom - editorPaddingTop - editorPaddingBottom;
                            document.getElementById('div_' + me.name + '_Editor').style.height = newHeight + 'px';
                            me.createScrollTextArea(newHeight);

                            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);

                            me.isPainted = true;
                        }

                        if (!commonHelper.isNullObject(Ext.getCmp('div_' + me.name + '_Content')) && !Base.isBack) {
                            Ext.getCmp('div_' + me.name + '_Content').getScrollable().getScroller().scrollTo(0, 0);
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

    createScrollTextArea: function (newHeight) {
        var me = this;
        var methodName = me.name + '.createScrollTextArea';

        try {
            var iframeUrl = 'iframe.htm';
            var createScrollTextArea = Ext.create('Ext.Panel', {
                height: newHeight,
                id: 'div_' + me.name + '_Content',
                renderTo: 'div_' + me.name + '_Editor',
                cls: 'scrollableContent',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                html: '<div class="content">'
                            + '<h1>Indication</h1>'
                            + '<p>Glucagon is a treatment for insulin coma or insulin reaction resulting from severe low blood sugar.</p>'
                            + '<br/>'
                            + '<h1>Select Safety Information</h1>'
                            + '<p>'
                                + 'Make sure you tell your healthcare provider if you have been diagnosed with or have been suspected of '
                                + 'having an insulinoma as Glucagon should be used cautiously in this situation. '
                                + '<strong>Warning:</strong> You may be in a coma from severe hyperglycemia (high blood glucose) rather '
                                + 'than hypoglycemia. In such a case, you will <strong>not</strong> respond to Glucagon and require immediate '
                                + 'medical attention. Tell your doctor about all of your medical conditions and prescription and over-the-counter drugs.'
                            + '</p>'
                        + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});