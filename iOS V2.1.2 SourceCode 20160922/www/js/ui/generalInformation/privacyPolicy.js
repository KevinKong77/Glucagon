Ext.define(enumPageInfo.privacyPolicy.nameSpace, {
    alias: [enumPageInfo.privacyPolicy.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.privacyPolicy.name,
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
                      '<div class="logo"><img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/></div>' +
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
        var methodName = me.name + '.createScrollTextArea';

        try {
            var createScrollTextArea = Ext.create('Ext.Panel', {
                height: newHeight,
                id: 'div_' + me.name + '_Content',
                renderTo: 'div_' + me.name + '_Editor',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                html: '<div class="content">'
                            + '<p>'
                                + '<h2 style="margin-top: 0px;"> Glucagon: Mobile Application Privacy Policy </h2>'
                                + '<br />'
                                + '<strong>May 22, 2012</strong>'
                            + '</p>'
                            + '<p>'
                                + ' This privacy policy governs your use of a software application (“Application”) on a mobile device that was created by '
                                + 'Lilly USA, LLC. The Application includes a Glucagon kit management tool, virtual Glucagon administration practice and '
                                + 'emergency use instructions. '
                            + '</p>'
                            + '<p>'
                                + '<strong>What information does the Application obtain and how is it used?</strong>'
                            + '</p>'
                            + '<p>'
                                + ' <em>User Provided Information</em> &ndash; The Application obtains the information you provide'
                                + '<br />'
                                + 'when you enter information in two places:'
                            + '</p>'
                            + '<ul>'
                                + '<li>'
                                    + ' Your Glucagon kit location and expiration dates, located in the Manage My Kits section. This information includes: '
                                    + 'kit name, physical location and expiration date. '
                                + '</li>'
                                + '<li>'
                                    + ' Notes you enter in the Notes feature located in the bottom tool bar of the Application. '
                                + '</li>'
                            + '</ul>'
                            + '<p>'
                                + 'This information is stored locally on the device and is only visible to the person using the application. This information you '
                                + 'enter is not tracked or shared with anyone else at any time. '
                            + '</p>'
                            + '<p>'
                                + ' <em>Automatically Collected Information</em> &ndash; In addition, the Application may collect certain information '
                                + 'automatically, including the type of mobile device and operating system you use and information about the way you use '
                                + 'the Application. In order to collect this information, a unique identifier is temporarily assigned to your mobile device each '
                                + 'time you use the Application. This temporary unique identifier and the information it helps to collect will not include any '
                                + 'information that personally identifies you. For example, the Application may collect information such as the frequency and '
                                + 'duration of use, which screens you visit and for how long, and logging of technical issues experienced while using the '
                                + 'Application. This information will only be used to understand how you and other consumers interact with the Application in '
                                + 'order to make the experience and use better in the future. '
                            + '</p>'
                            + '<h2>Does the Application collect precise real time location information of the device?</h2>'
                            + '<p>'
                                + 'This Application does not collect precise information about the location of your mobile device.'
                            + '</p>'
                            + '<h2>Do third parties see and/or have access to information obtained by the Application?</h2>'
                            + '<p>'
                                + 'Yes. We will share the Automatically Collected Information with third parties only in the ways that are described in this privacy '
                                + 'statement.'
                            + '</p>'
                            + '<p>'
                                + ' We may disclose Automatically Collected Information:'
                                + '<ul>'
                                    + '<li>'
                                        + ' as required by law, such as to comply with a subpoena, or similar legal process; '
                                    + '</li>'
                                    + '<li>'
                                        + ' when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of '
                                        + 'others, investigate fraud, or respond to a government request; '
                                    + '</li>'
                                    + '<li>'
                                        + ' to our trusted services providers who work on our behalf, do not have an independent use of the information we disclose '
                                        + 'to them, and have agreed to adhere to the rules set forth in this privacy statement. '
                                    + '</li>'
                                    + '<li>'
                                        + ' if Lilly USA, LLC is involved in a merger, acquisition, or sale of all or a portion of its assets, you will be notified via email '
                                        + 'and/or a prominent notice on our Web site of any change in ownership or uses of this information, as well as any choices '
                                        + 'you may have regarding this information. '
                                    + '</li>'
                                + '</ul>'
                            + '</p>'
                            + '<h2>Automatic Data Collection and Advertising</h2>'
                            + '<p>'
                                + 'We may work with analytics companies to help us understand how the Application is being used, as referenced in the previous'
                                +' “Automatically Collected Information” section. We may gather this information by using pixels, cookies or web requests '
                                + '(HTTP requests). We do not utilize any of your Automatically Collected Information for or share with any third party advertising '
                                + 'networks.'
                            + '</p>'
                            + '<h2>What are my opt-out rights?</h2>'
                            + '<p>'
                                + '<em>Opt-out of all information collection by uninstalling the Application</em> &ndash; You can stop all collection of '
                                + 'information by the Application by uninstalling the Application. You may use the standard uninstall processes as may be available '
                                + 'as part of your mobile device or via the mobile application marketplace or network.'
                            + '</p>'
                            + '<h2>Data Retention Policy, Managing Your Information</h2>'
                            + '<p>'
                                + 'The User Provided data is retained locally on the device for as long as you use the Application. It is deleted when you remove '
                                + 'the Application from your device. '
                            + '</p>'
                            + '<h2>Security</h2>'
                            + '<p>'
                                + 'We use reasonable security measures to safeguard the analytics information that is collected.'
                            + '</p>'
                            + '<h2>Changes</h2>'
                            + '<p>'
                                + 'This Privacy Policy may be updated from time to time for any reason. When we do update it, for your convenience, '
                                + 'we will make the updated policy available on this page.'
                            + '</p>'
                            + '<h2>Your Consent</h2>'
                            + '<p>'
                                + 'By using the Services, you are consenting to our processing of Automatically Collected information as set forth in this Privacy '
                                + 'Policy now and as amended by us. "Processing” means using pixels, cookies or web requests (HTTP requests) on a '
                                + 'computer/hand held device or using or touching information in any way, including, but not limited to, collecting, storing, '
                                + 'deleting, using, combining and disclosing information, all of which activities will take place in the United States. If you reside '
                                + 'outside the U.S. your information will be transferred to the U.S., and processed and stored there under U.S. privacy standards. '
                                + 'By using the Application and providing information to us, you consent to such transfer to, and processing in, the U.S.'
                            + '</p>'
                            + '<p>'
                                + ' <b>Contact Us</b> '
                                + '<br />'
                                + '<br />'
                                + 'To be removed from our contact lists, please write to Lilly at the following address: '
                                + '<br />'
                                + '<br />'
                                + 'Eli Lilly and Company'
                                + '<br />'
                                + 'P.O. Box 6245'
                                + '<br />'
                                + 'Indianapolis, IN 46206-6245 '
                                + '<br />'
                                + '<br />'
                                + 'Or call Lilly toll-free at 1-800-LillyRx (1-800-545-5979). '
                                + '<br />'
                                + '<br />'
                                + 'Please note that you may continue to receive materials while we are updating our lists. '
                            + '</p>'
                        + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});