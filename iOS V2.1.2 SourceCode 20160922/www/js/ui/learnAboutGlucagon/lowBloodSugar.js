Ext.define(enumPageInfo.lowBloodSugar.nameSpace, {
    alias: [enumPageInfo.lowBloodSugar.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.lowBloodSugar.name,
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
                            + '<h1>Severe low blood sugar (hypoglycemia)</h1>'
                            + '<p>'
                                + '<strong>can happen.</strong> If not treated quickly, mild or moderate low blood sugar can become severe. '
                                + 'In these cases you may lose consciousness.'
                            + '</p>'
                            + '<br/>'
                            + '<p>'
                                + 'If you are physically unable to eat or drink a rapid acting source of glucose, you will need a Glucagon shot—and a friend, '
                                + 'family member, or coworker will need to give it to you.'
                            + '</p>'
                            + '<br/>'
                            + '<h1>Select Safety Information</h1>'
                            + '<p>'
                                + 'Make sure that your relatives or close friends know that if you become unconscious, medical assistance must always be '
                                + 'sought. If you are unconscious, Glucagon can be given while awaiting medical assistance.'
                            + '</p>'
                        + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});