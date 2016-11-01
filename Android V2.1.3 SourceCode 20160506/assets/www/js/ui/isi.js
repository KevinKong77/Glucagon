Ext.define(enumPageInfo.isi.nameSpace, {
    alias: [enumPageInfo.isi.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.isi.name,
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
                            + '<div class="editor" id="div_' + me.name + '_Editor">'
                            + '</div>'
                        + '</div>'
                        + '<div class="popup_message_2" id="div_' + me.name + '_Popup">'
                            + '<a id="link_' + me.name + '_Yes">'
                                + '<img src="img/btn_alert_yes.png" height="45" alt=""/>'
                            + '</a>'
                            + '<a id="link_' + me.name + '_No">'
                                + '<img src="img/btn_alert_no.png" height="45" alt=""/>'
                            + '</a>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        document.getElementById('div_' + me.name + '_Popup').style.display = 'none';

                        if (!me.isPainted) {
                            me.topLogoHeight = Base.getOriginOffsetHeight('img_' + me.name + '_Logo');
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;

                            var editorMarginTop = parseInt($('#div_' + me.name + '_Editor').css('margin-top').replace('px', ''));
                            var editorMarginBottom = parseInt($('#div_' + me.name + '_Editor').css('margin-bottom').replace('px', ''));
                            var editorPaddingTop = parseInt($('#div_' + me.name + '_Editor').css('padding-top').replace('px', ''));
                            var editorPaddingBottom = parseInt($('#div_' + me.name + '_Editor').css('padding-bottom').replace('px', ''));
                            var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - editorMarginTop - editorMarginBottom - editorPaddingTop - editorPaddingBottom - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom);
                            document.getElementById('div_' + me.name + '_Editor').style.height = newHeight + 'px';
                            me.createScrollViewArea(newHeight);
                            me.registerEvent();
                            Base.zoomViewport();
                            me.isPainted = true;
                        }

                        if (!commonHelper.isNullObject(Ext.getCmp('div_' + me.name + '_Content')) && !Base.isBack) {
                            Ext.getCmp('div_' + me.name + '_Content').getScrollable().getScroller().scrollTo(0, 0);
                        }

                        if (commonSession.isReInit) {
                            if (
                                (Base.visitHistory_Workflow.length == 1)
                                ||
                                (
                                    Base.visitHistory_Workflow.length == 2
                                    && Base.visitHistory_Workflow[Base.visitHistory_Workflow.length - 2].originPageInfo.name == enumPageInfo.termsOfUse.name
                                )
                            ) {
                                document.getElementById('link_' + me.name + '_GoBack').style.display = 'none';
                                document.getElementById('link_' + me.name + '_GoNext').style.display = '';
                            }
                            else {
                                document.getElementById('link_' + me.name + '_GoBack').style.display = '';
                                document.getElementById('link_' + me.name + '_GoNext').style.display = 'none';
                            }
                        }
                        else {
                            document.getElementById('link_' + me.name + '_GoBack').style.display = '';
                            document.getElementById('link_' + me.name + '_GoNext').style.display = 'none';
                        }

                        if (!commonHelper.isNullOrEmpty(commonSession.agreeGuide) && commonSession.isReInit) {
                            if (commonHelper.isTouchDevice()) {
                                navigator.splashscreen.hide();
                            }
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
        var methodName = me.name + '.init';

        try {
            Ext.get('link_' + me.name + '_GoBack').on('tap', function () {
                Base.backPage();
            });

            Ext.get('link_' + me.name + '_GoNext').on('tap', function () {
                $('#div_' + me.name + '_Popup').fadeIn();
            });

            Ext.get('link_' + me.name + '_FDA').on('tap', function () {
                var msgContent = 'The link you clicked on will take you to a site maintained by a third party, which is solely responsible for its content. Lilly USA, LLC is not responsible for the privacy policy of any third-party websites.';
                msgHelper.showCustomConfirm(null, msgContent, 'Cancel', 'Continue', function (btn) {
                    if (btn == 'yes') {
                        window.open('http://www.fda.gov/medwatch', '_system');
                    }
                });
            });

            Ext.get('link_' + me.name + '_GotoInformationForUser').on('tap', function () {
                Base.gotoPage(enumPageInfo.informationForUser);
            });

            Ext.get('link_' + me.name + '_GotoInformationForPhysician').on('tap', function () {
                Base.gotoPage(enumPageInfo.informationForPhysician);
            });

            Ext.get('link_' + me.name + '_Yes').on('tap', me.link_Yes_ClickEvent, me);
            Ext.get('link_' + me.name + '_No').on('tap', me.link_No_ClickEvent, me);
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Yes_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Yes_ClickEvent';

        try {
            commonSession.isReInit = false;
            if (!commonSession.agreeGuide) {
                Base.gotoPage(enumPageInfo.overview);
            }
            else {
                Base.gotoPage(enumPageInfo.landing);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_No_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_No_ClickEvent';

        try {
            $('#div_' + me.name + '_Popup').fadeOut();
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
                                + '<strong>Indication</strong><br />'
                                + 'Glucagon is a treatment for insulin coma or insulin reaction resulting from severe low blood sugar.'
                            + '</p>'
                            + '<p><strong>Important Safety Information for Glucagon</strong></p>'
                            + '<span>'
                                + '<strong>What is the most important information I should know about Glucagon?</strong>'
                                + '<ul>'
                                    + '<li>Glucagon should not be used if you have pheochromocytoma or if you are allergic to Glucagon. </li>'
                                    + '<li>Make sure you tell your healthcare provider if you have been diagnosed with or have been suspected of having an insulinoma as Glucagon should be used cautiously in this situation.</li>'
                                    + '<li>You and anyone who may need to help you during an emergency should become familiar with how to use Glucagon before an emergency arises. Read the Information for the User provided in the kit.</li>'
                                    + '<li>Make sure that your relatives or close friends know that if you become unconscious, medical assistance must always be sought. If you are unconscious, Glucagon can be given while awaiting medical assistance.</li>'
                                    + '<li>Do not use the kit after the date stamped on the bottle label. </li>'
                                    + '<li>If you have questions concerning the use of this product, consult a doctor, nurse or pharmacist.</li>'
                                + '</ul>'
                            + '</span>'
                            + '<p>'
                                + '<strong>WARNING:</strong>'
                                + ' YOU MAY BE IN A COMA FROM SEVERE HYPERGLYCEMIA (HIGH BLOOD GLUCOSE) RATHER THAN HYPOGLYCEMIA. IN SUCH A CASE, YOU WILL <strong>NOT</strong> RESPOND TO GLUCAGON AND REQUIRE IMMEDIATE MEDICAL ATTENTION.'
                            + '</p>'
                            + '<p>'
                                + '<strong>Who should not use Glucagon?</strong><br>'
                                + 'Glucagon should not be used if you have pheochromocytoma or if you are allergic to Glucagon.'
                            + '</p>'
                            + '<p>'
                                + '<strong>What should I tell my doctor before taking Glucagon?</strong><br>'
                                + 'Tell your doctor about all of your medical conditions and prescription and over-the-counter drugs. Tell your doctor if you have been diagnosed with or have been suspected of having pheochromocytoma or an insulinoma.'
                            + '</p>'
                            + '<span>'
                                + '<strong>How should I use Glucagon?</strong>'
                                + '<ul>'
                                    + '<li>Act quickly. Prolonged unconsciousness may be harmful.</li>'
                                    + '<li>Make sure your family and friends know to turn you on your side to prevent choking if you are unconscious.</li>'
                                    + '<li>The contents of the syringe are inactive and must be mixed with the Glucagon in the accompanying bottle immediately before giving injection. Do not prepare Glucagon for Injection until you are ready to use it.</li>'
                                    + '<li>Glucagon should not be used unless the solution is clear and of a water-like consistency.</li>'
                                    + '<li>The usual adult dose is 1 mg (1 unit). For children weighing less than 44 lbs (20 kg), give ½ adult dose (0.5 mg). For children, withdraw ½ of the solution from the bottle (0.5 mg mark on syringe). Discard unused portion.</li>'
                                    + '<li>You should eat as soon as you awaken and are able to swallow. Inform a doctor or emergency services immediately.<strong> </strong></li>'
                                + '</ul>'
                            + '</span>'
                            + '<span>'
                                + '<strong>What is some important Information I should know about Low Blood Sugar (Hypoglycemia)?</strong>'
                                + '<ul>'
                                    + '<li>Early symptoms of low blood sugar include: sweating, drowsiness, dizziness, sleep disturbances, palpitation, anxiety, tremor, blurred vision, hunger, slurred speech, restlessness, depressed mood, tingling in the hands, feet, lips, or tongue, irritability, lightheadedness, abnormal behavior, inability to concentrate, unsteady movement, headache, and personality changes. These symptoms may be different for each person and can happen suddenly.  </li>'
                                    + '<li>If your low blood sugar is not treated, you may progress to severe low blood sugar that can include: disorientation, seizures, unconsciousness, and death.</li>'
                                    + '<li>Low blood sugar symptoms should be treated with a quick source of sugar which should always be carried with you. If you do not improve or you are unable to take a quick source of sugar, you should be treated with Glucagon or with intravenous glucose at a medical facility. </li>'
                                + '</ul>'
                            + '</span>'
                            + '<span>'
                                + '<strong>What are the possible side effects of </strong>'
                                + '<strong>Glucagon? </strong>'
                                + '<ul>'
                                    + '<li>Severe side effects are very rare, although nausea and vomiting may occur occasionally.</li>'
                                    + '<li>A few people may be allergic to Glucagon or to one of the inactive ingredients in Glucagon, or may experience rapid heart beat for a short while.</li>'
                                    + '<li>If you experience any other reactions which are likely to have been caused by Glucagon, please contact your doctor. </li>'
                                + '</ul>'
                            + '</span>'
                            + '<p>'
                                + 'You are encouraged to report negative side effects of prescription drugs to the FDA.<br/>'
                                + 'Visit <a id="link_' + me.name + '_FDA">www.fda.gov/medwatch</a>, or call <br />'
                                + '1-800-FDA-1088.'
                            + '</p>'
                            + '<span>'
                                + '<strong>How should I store Glucagon?</strong>'
                                + '<ul>'
                                    + '<li>Before dissolving Glucagon with diluting solution, store the kit at controlled room temperature between 20° to 25°C (68°<br/>to 77°F).</li>'
                                    + '<li>After dissolving Glucagon with diluting solution, use immediately. <strong>Discard any unused portion. </strong>Glucagon should be clear and of a water-like consistency at time of use. </li>'
                                + '</ul>'
                            + '</span>'
                            + '<p>'
                                + '<strong>Glucagon is available by prescription only.</strong>'
                            + '</p>'
                            + '<p>'
                                + '<strong>For more safety information, please see <a id="link_' + me.name + '_GotoInformationForUser">Information for the User</a> and <a id="link_' + me.name + '_GotoInformationForPhysician">Information for the Physician</a>.</strong>'
                            + '</p>'
                            + '<p>HI GLUC CON ISI 09OCT2014</p>'
                            + '<p>You can view the Important Safety Information at any time by clicking the <img src="img/btn_isi.png" height="18" alt=""/> icon in the upper right of your screen.</p>'
                            + '<p align="center">'
                                + '<br />'
                                + '<a id="link_' + me.name + '_GoBack" style="display: none">'
                                    + '<img src="img/info_btn_goBack.png" height="37" alt=""/>'
                                + '</a>'
                                + '<a id="link_' + me.name + '_GoNext" style="display: none">'
                                    + '<img src="img/btn_next.png" height="37" alt=""/>'
                                + '</a>'
                            + '</p>'
                        + '</div>'
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});