Ext.define(enumPageInfo.termsOfUse.nameSpace, {
    alias: [enumPageInfo.termsOfUse.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.termsOfUse.name,
    isPainted: false,

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,
    iAgreeButtonHeight: null,
    iAgreeButtonMarginTop: null,
    iAgreeButtonMarginBottom: null,

    editorMarginTop: null,
    editorMarginBottom: null,
    editorPaddingTop: null,
    editorPaddingBottom: null,

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
                html: '<div class="main guide" id="div_' + me.name + '_MainGuide">'
                            + '<div class="logo">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png" height="52" alt=""/>'
                            + '</div>'
                            + '<div class="editor" id="div_' + me.name + '_Editor"></div>'
                            + '<div class="btn" id="div_' + me.name + '_IAgree" style="display: none"><a id="link_' + me.name + '_IAgree">I Agree</a></div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        $('#div_' + me.name + '_IAgree').fadeOut();

                        if (!me.isPainted) {
                            me.topLogoHeight = Base.getOriginOffsetHeight('img_' + me.name + '_Logo');
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;

                            me.iAgreeButtonHeight = parseInt($('#link_' + me.name + '_IAgree').css('height').replace('px', ''));
                            me.iAgreeButtonMarginTop = parseInt($('#link_' + me.name + '_IAgree').css('margin-top').replace('px', ''));
                            me.iAgreeButtonMarginBottom = parseInt($('#link_' + me.name + '_IAgree').css('margin-bottom').replace('px', ''));

                            me.editorMarginTop = parseInt($('#div_' + me.name + '_Editor').css('margin-top').replace('px', ''));
                            me.editorMarginBottom = parseInt($('#div_' + me.name + '_Editor').css('margin-bottom').replace('px', ''));
                            me.editorPaddingTop = parseInt($('#div_' + me.name + '_Editor').css('padding-top').replace('px', ''));
                            me.editorPaddingBottom = parseInt($('#div_' + me.name + '_Editor').css('padding-bottom').replace('px', ''));

                            Base.zoomViewport();
                            me.registerEvent();
                        }

                        var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - me.editorMarginTop - me.editorMarginBottom - me.editorPaddingTop - me.editorPaddingBottom - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom);
                        if (commonHelper.isNullOrEmpty(commonSession.agreeGuide)) {
                            newHeight = newHeight - me.iAgreeButtonHeight - me.iAgreeButtonMarginTop - me.iAgreeButtonMarginBottom - 10;
                            document.getElementById('div_' + me.name + '_MainGuide').setAttribute('class', 'main guide');
                            $('#div_' + me.name + '_IAgree').fadeIn();
                        }
                        else {
                            document.getElementById('div_' + me.name + '_MainGuide').setAttribute('class', 'main');
                        }

                        document.getElementById('div_' + me.name + '_Editor').style.height = newHeight + 'px';

                        if (!me.isPainted) {
                            me.createScrollViewArea(newHeight);
                            me.isPainted = true;
                        }
                        else {
                            Ext.getCmp('div_' + me.name + '_Content').setHeight(newHeight);
                        }

                        if (!commonHelper.isNullObject(Ext.getCmp('div_' + me.name + '_Content')) && !Base.isBack) {
                            Ext.getCmp('div_' + me.name + '_Content').getScrollable().getScroller().scrollTo(0, 0);
                        }

                        if (commonHelper.isNullOrEmpty(commonSession.agreeGuide)) {
                            if (commonHelper.isTouchDevice()) {
                                navigator.splashscreen.hide();
                            }

                            userData.setValue(enumLocalStorageItem.agreeGuide, false);
                            commonSession.agreeGuide = false;
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
                                + '<strong style="font-weight:bold !important;">Terms of Use </strong>'
                            + '</p>'
                            + '<p>'
                                + 'Lilly USA, LLC (also referred to as "Lilly") is a wholly owned subsidiary of Eli Lilly and Company. By using this mobile application, '
                                + 'you acknowledge that you have read, understand and agree to be bound by the following terms and all applicable laws and '
                                + 'regulations. If you do not agree to these Terms of Use, you are not permitted to access, download or use this mobile '
                                + 'application. The information provided in this mobile application (collectively, the "Content") is presented in summary form, '
                                + 'is general in nature, and is provided for informational purposes only. The mobile application and the Content are intended only '
                                + 'for the purpose of helping patients and family members better understand certain health conditions and treatment options. '
                                + 'The Content is not intended in any way to be a substitute for professional medical advice and should not be interpreted as '
                                + 'treatment recommendations. Only a physician who has had an opportunity to interact with the patient in person, with access '
                                + 'to the patient\'s records and the opportunity to conduct appropriate follow-up, can provide recommendations for treatment.'
                            + '</p>'
                            + '<p>'
                                + 'ALWAYS SEEK THE ADVICE OF YOUR PHYSICIAN OR OTHER QUALIFIED HEALTH PROVIDER WITH ANY QUESTIONS YOU MAY '
                                + 'HAVE REGARDING A MEDICAL CONDITION. Neither the Content nor any other service offered by or through this mobile '
                                + 'application is intended to be relied on for medical diagnosis or treatment. Never disregard medical advice or delay in seeking '
                                + 'it because of something you have read in this mobile application or in the Content. '
                            + '</p>'
                            + '<p>'
                                + 'THIS MOBILE APPLICATION AND THE CONTENT ARE PROVIDED "AS IS". LILLY, ITS PARENT COMPANY, ITS AFFILIATES, ITS '
                                + 'LICENSORS, AND ITS SUPPLIERS, TO THE FULLEST EXTENT PERMITTED BY LAW, DISCLAIM ALL WARRANTIES, EITHER EXPRESS '
                                + 'OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, '
                                + 'NON-INFRINGEMENT OF THIRD PARTIES\' RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE. SPECIFICALLY, LILLY, ITS PARENT '
                                + 'COMPANY, ITS AFFILIATES, ITS LICENSORS, AND ITS SUPPLIERS MAKE NO REPRESENTATIONS OR WARRANTIES ABOUT THE '
                                + 'SECURITY OF THE MOBILE APPLICATION OR ABOUT THE ACCURACY, RELIABILITY, COMPLETENESS, CURRENTNESS, SUITABILITY '
                                + 'OR TIMELINESS OF THE CONTENT, SOFTWARE, TEXT, GRAPHICS, TOOLS, LINKS, PRESCRIBING INFORMATION, MEDICATION '
                                + 'GUIDES, OR OTHER COMMUNICATIONS PROVIDED IN OR THROUGH THE USE OF THIS MOBILE APPLICATION, OR ANY SITE '
                                + 'OR SITES "LINKED" TO THIS MOBILE APPLICATION. LILLY MAKES NO WARRANTY THAT THIS MOBILE APPLICATION WILL BE '
                                + 'AVAILABLE, UNINTERRUPTED, ERROR FREE OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.'
                            + '</p>'
                            + '<p>'
                                + 'TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LILLY, ITS PARENT COMPANY, ITS AFFILIATES, '
                                + 'ITS LICENSORS, ITS SUPPLIERS, OR ANY THIRD PARTIES MENTIONED ON THIS MOBILE APPLICATION BE LIABLE FOR ANY '
                                + 'DAMAGES (INCLUDING, WITHOUT LIMITATION, INCIDENTAL AND CONSEQUENTIAL DAMAGES, PERSONAL INJURY/WRONGFUL '
                                + 'DEATH, LOST PROFITS, OR DAMAGES RESULTING FROM LOST DATA OR BUSINESS INTERRUPTION) RESULTING FROM THE USE '
                                + 'OR INABILITY TO USE THIS MOBILE APPLICATION OR THE CONTENT, OR ANY FAILURE OF PERFORMANCE, ERROR, OMISSION, '
                                + 'INTERRUPTION, EFFECT, DELAY OR DEFECT IN OPERATION OR TRANSMISSION, VIRUS, LINE SYSTEM FAILURE, OR LOSS OF USE '
                                + 'RELATED TO THIS MOBILE APPLICATION, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, '
                                + 'AND WHETHER OR NOT LILLY IS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IF YOU ARE DISSATISFIED WITH THIS '
                                + 'MOBILE APPLICATION OR THESE TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO REMOVE THIS MOBILE '
                                + 'APPLICATION FROM YOUR MOBILE DEVICE AND DISCONTINUE ITS USE.'
                            + '</p>'
                            + '<p>'
                                + 'Lilly does not warrant that the mobile application will be compatible or interoperable with your mobile device or any '
                                + 'hardware, software, equipment or device installed on your mobile device or used by you to access and use the mobile '
                                + 'application in connection with your mobile device ("Accessories"). You acknowledge that compatibility and interoperability '
                                + 'problems: (a) may cause the performance of the mobile application, your mobile device and any Accessories to diminish '
                                + 'or fail completely; (b) may result in permanent damage to your mobile device and any Accessories; (c) may result in a loss '
                                + 'of data on your mobile device or Accessories; or (d) may result in the corruption of software and files located on your '
                                + 'mobile device and any Accessories. You acknowledge and agree that Lilly and its parent company, affiliates, licensors and '
                                + 'suppliers shall have no liability to you for any losses suffered resulting from or arising in connection with compatibility '
                                + 'or interoperability problems.'
                            + '</p>'
                            + '<p>'
                                + 'Any claims arising in connection with your use of this mobile application or any Content must be brought within one (1) year '
                                + 'of the date of the event giving rise to such action occurred. </p>'
                            + '<p>'
                                + 'As a resource to our users, this mobile application provides links to other websites. However, because Lilly does not control the '
                                + 'content of the websites we may link to, and due to their constantly changing nature, Lilly cannot be responsible for the content, '
                                + 'practices or standards of third party sites. Inclusion of any third party link does not imply a recommendation or endorsement '
                                + 'by Lilly. Lilly is not responsible for and will not have any liability for any damages or injuries of any kind arising in connection '
                                + 'with the content of linked third party sites, sites framed within this mobile application, or third-party advertisements. Lilly does '
                                + 'not make any representations regarding the content or accuracy of third-party sites. Your use of third-party sites is at your '
                                + 'own risk and subject to the terms and conditions of use for such sites.'
                            + '</p>'
                            + '<p>'
                                + 'It is your responsibility to ensure that your mobile device meets all the necessary technical specifications to enable you to '
                                + 'access and use the mobile application. When using this mobile application, information will be transmitted over a medium that '
                                + 'is beyond the control and jurisdiction of Lilly and its suppliers. Accordingly, Lilly assumes no liability for or relating to the delay, '
                                + 'failure, interruption, or corruption of any data or other information transmitted in connection with use of this mobile application. '
                            + '</p>'
                            + '<p>'
                                + 'You are responsible for the accuracy of any information that you provide to Lilly through this mobile application, including any '
                                + 'comments, feedback, remarks, suggestions, ideas, notes, drawings, graphics, concepts, or other information. You agree not to '
                                + 'submit or transmit any material that is unlawful, threatening, libelous, defamatory, obscene, pornographic, profane, or might in '
                                + 'any other way violate any law, regulation, or rule. You are solely responsible for any material you submit to this mobile '
                                + 'application. Lilly may from time to time monitor, review and, in its sole discretion make modifications to this mobile application; '
                                + 'however, Lilly is not obligated to do so. Except as expressly set forth in this mobile application, if you submit any information '
                                + 'to Lilly, you are giving that information to Lilly free of charge and such information shall be deemed to be non-confidential and '
                                + 'Lilly, its parent company and affiliates shall have no obligation of any kind with respect to such information and shall be free to '
                                + 'reproduce, use, disclose and distribute the information to others without limitation, without your consent or any compensation '
                                + 'to you or anyone else. Lilly, its parent company and affiliates shall be free to use any ideas, concepts, know-how or techniques '
                                + 'contained in such information for any purpose whatsoever including but not limited to developing, manufacturing and '
                                + 'marketing products incorporating such information. '
                            + '</p>'
                            + '<p>'
                                + 'When you sign up to use a special feature of this mobile application, you may be asked to agree to special terms governing '
                                + 'your use of the special feature by checking a box or click on a button marked "I agree." This type of agreement is known as '
                                + 'a "click-through" agreement. If any of the terms of the click-through agreement are different than the terms of these Terms '
                                + 'of Use, the terms of the click-through agreement will supplement or amend these Terms of Use, but only with respect to the '
                                + 'matters governed by the "click-through agreement."'
                            + '</p>'
                            + '<p>'
                                + 'Through your usage of this mobile application, you may submit and/or Lilly may gather certain limited information about you '
                                + 'and your mobile application usage. Subject to and in accordance with the Privacy Statement, Lilly is free to use such information '
                                + 'for any purpose Lilly deems appropriate, including marketing purposes. '
                            + '</p>'
                            + '<p>'
                                + 'The mobile application may utilize or include third party software that is subject to open source and third party license terms '
                                + '("Third Party Software"). You acknowledge and agree that your right to use such Third Party Software as part of the mobile '
                                + 'application is subject to and governed by these Terms of Use and conditions of the open source or third party license '
                                + 'applicable to such Third Party Software, including, without limitation, any applicable acknowledgements, license terms and '
                                + 'disclaimers contained therein. In the event of a conflict between these Terms of Use and the terms of such open source or '
                                + 'third party licenses, the terms of the open source or third party licenses shall control with regard to your use of the relevant '
                                + 'Third Party Software. In no event shall the mobile application or components thereof be deemed to be "open source" or "public '
                                + 'domain" software.'
                            + '</p>'
                            + '<p>'
                                + 'Lilly is located in Indianapolis, Indiana, in the United States of America (USA). This mobile application is intended for the '
                                + 'exclusive use of residents of the USA. Access to the content may not be legal by certain persons or in certain countries outside '
                                + 'of the USA. Any offer for any product or service made in this mobile application is void where prohibited by law. If you access '
                                + 'this mobile application from outside the United States, you do so at your own risk and are responsible for compliance with '
                                + 'the laws of your jurisdiction. '
                            + '</p>'
                            + '<p>'
                                + 'These Terms of Use are governed by the internal substantive laws of the State of Indiana, without resort to its conflict of laws '
                                + 'principles. If any provision of these Terms of Use is found to be invalid by any court having competent jurisdiction, the invalidity '
                                + 'of such provision shall not affect the validity of the remaining provisions of these Terms of Use. You expressly agree that '
                                + 'exclusive jurisdiction for any dispute with Lilly, or in any way relating to your use of this mobile application, resides in the '
                                + 'courts of the State of Indiana. '
                            + '</p>'
                            + '<p>'
                                + 'Lilly may modify these Terms of Use at any time without notice to you. Lilly may terminate this agreement, terminate your '
                                + 'access to all or part of this mobile application, or suspend any user\'s access to all or part of this mobile application, at any '
                                + 'time, without notice to you, if it believes, in its sole judgment, that you have breached or may breach any term or condition '
                                + 'of this agreement, or for its convenience. You may terminate this agreement at any time by destroying all materials received '
                                + 'from this mobile application and ceasing to use this mobile application.'
                            + '</p>'
                            + '<p>'
                                + 'Your use of this mobile application is also subject to the Copyright Policy and the Privacy Statement. Except as expressly '
                                + 'provided in a particular "legal notice" on this mobile application, these Terms of Use constitute the entire agreement between '
                                + 'you and Lilly with respect to the use of this mobile application and the content in this mobile application. '
                            + '</p>'
                        + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    registerEvent: function () {
        var me = this;
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('link_' + me.name + '_IAgree').on('tap', me.link_IAgree_Event, me);
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_IAgree_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_IAgree_Event';

        try {
            Base.gotoPage(enumPageInfo.isi);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});