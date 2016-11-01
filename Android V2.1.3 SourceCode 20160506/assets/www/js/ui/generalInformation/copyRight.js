Ext.define(enumPageInfo.copyRight.nameSpace, {
    alias: [enumPageInfo.copyRight.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.copyRight.name,
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
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                html: '<div class="content">'
                            + '<p>'
                                + '<strong>Copyright ©1994-2013 Eli Lilly and Company. All rights reserved. </strong>'
                                + '<br />'
                                + '<p>'
                                    + 'Lilly USA, LLC (also referred to as “Lilly”) is a wholly owned subsidiary of Eli Lilly and Company. This Copyright Policy '
                                    + 'applies to this mobile application and any promotional e-mail, text message, or other electronic content received by you '
                                    + 'in response to an opt-in registration from Lilly (collectively, the “Content”). Lilly grants you a personal, revocable, '
                                    + 'non-exclusive, non-transferrable, limited right to: (a) install the software associated with the mobile application on one or '
                                    + 'more mobile devices owned and controlled by you; (b) to access and use the mobile application using such mobile device(s) '
                                    + 'strictly in accordance with the terms and conditions of this Copyright Policy, as well as the Terms of Use; and (c) to use the '
                                    + 'Content for non-commercial purposes. No permission is granted to you to copy, reproduce, distribute, license, transfer, sale, '
                                    + 'transmit, upload, download, store, display in public, alter, modify or create derivative works of the Content. You may not '
                                    + 'remove any copyright, trademark or other proprietary notations from this mobile application or the Content.'
                                + '</p>'
                                + '<p>'
                                    + 'Lilly makes no warranties or representations that your use of any materials displayed on this mobile application or included '
                                    + 'with the Content will not infringe the rights of third parties. THIS MOBILE APPLICATION AND THE CONTENT ARE PROVIDED "AS '
                                    + 'IS". LILLY, ITS PARENT COMPANY, ITS AFFILIATES, ITS LICENSORS, AND ITS SUPPLIERS, TO THE FULLEST EXTENT PERMITTED BY LAW, '
                                    + 'DISCLAIM ALL WARRANTIES, EITHER EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE '
                                    + 'IMPLIED WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT OF THIRD PARTIES\' RIGHTS, AND FITNESS FOR '
                                    + 'PARTICULAR PURPOSE.'
                                + '</p>'
                                + '<p>'
                                    + 'Unless otherwise indicated, all logos, names, designs, and marks on this mobile application or in the Content are trademarks '
                                    + 'or service marks owned or used under license by Lilly. The use or misuse of any of these marks is strictly prohibited.'
                                + '</p>'
                                + '<p>'
                                    + 'Nothing contained herein shall be construed as conferring by implication, estoppel or otherwise any license or right under '
                                    + 'any patent or trademark of Lilly, its parent company, its affiliates or any third party. Except as expressly provided above, '
                                    + 'nothing contained herein shall be construed as conferring any license or right under any Lilly copyright.'
                                + '</p>'
                            + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});