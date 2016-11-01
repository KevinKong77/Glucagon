﻿Ext.define(enumPageInfo.askLilly.nameSpace, {
    alias: [enumPageInfo.askLilly.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.askLilly.name,
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
                html: '<div class="main">' 
                            + '<div class="logo">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="editor" id="div_' + me.name + '_Editor"></div>' 
                        + '</div>',
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
                            var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - editorMarginTop - editorMarginBottom - editorPaddingTop - editorPaddingBottom - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom);
                            document.getElementById('div_' + me.name + '_Editor').style.height = newHeight + 'px';
                            me.createScrollViewArea(newHeight);

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

    createScrollViewArea: function (newHeight) {
        var me = this;
        var methodName = me.name + '.createScrollViewArea';

        try {
            var createScrollViewArea = Ext.create('Ext.Panel', {
                height: newHeight,
                id: 'div_' + me.name + '_Content',
                renderTo: 'div_' + me.name + '_Editor',
                cls: 'scrollableContent',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                html: '<div class="content">' 
                            + '<p>'
                                + 'If you have additional questions about Glucagon, call The Lilly Answers Center at'
                                + '<br />' 
                                + '1-800-LillyRx (1-800-545-5979), Monday through Friday, 9 am to 8 pm EST. This toll-free number will connect you with a '
                                + 'trained professional who can provide additional information. This is an information service provided by Eli Lilly and '
                                + 'Company. It is not meant to replace your healthcare provider\'s advice. Your own healthcare provider is the best source '
                                + 'of information regarding your health.'
                            + '</p>' 
                            + '<p>'
                                + 'If you have a medical emergency, call your emergency telephone hotline (usually 911). For non-urgent medical advice, please '
                                + 'contact your healthcare provider.'
                            + '</p>' 
                        + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});