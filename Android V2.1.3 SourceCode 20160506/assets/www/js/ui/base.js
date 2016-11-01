var Base = {
    pageContentList: [
        { pageInfo: enumPageInfo.overview, object: null, class: null },
		{ pageInfo: enumPageInfo.landing, object: null, class: null },
        { pageInfo: enumPageInfo.notes, object: null, class: null },
        { pageInfo: enumPageInfo.emergencyInstructions, object: null, class: null },
        { pageInfo: enumPageInfo.practiceAndPrepare, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStepGuide, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep01, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep02, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep03, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep04, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep05, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep06, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep07, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep08, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep09, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep10, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep11, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep12, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep13, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep14, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStep15, object: null, class: null },
        { pageInfo: enumPageInfo.injectionStepCompleted, object: null, class: null },

        { pageInfo: enumPageInfo.manageMyKits, object: null, class: null },
        { pageInfo: enumPageInfo.myKitInformation, object: null, class: null },
        { pageInfo: enumPageInfo.myKitInformationDetail, object: null, class: null },
        { pageInfo: enumPageInfo.storingGlucagon, object: null, class: null },

        { pageInfo: enumPageInfo.learnAboutGlucagon, object: null, class: null },
        { pageInfo: enumPageInfo.glucagonIndication, object: null, class: null },
        { pageInfo: enumPageInfo.lowBloodSugar, object: null, class: null },
        { pageInfo: enumPageInfo.glucagonTips, object: null, class: null },
        { pageInfo: enumPageInfo.helpfulLinks, object: null, class: null },

        { pageInfo: enumPageInfo.isi, object: null, class: null },

        { pageInfo: enumPageInfo.informationForUser, object: null, class: null },

        { pageInfo: enumPageInfo.informationForPhysician, object: null, class: null },

        { pageInfo: enumPageInfo.generalInformation, object: null, class: null },
        { pageInfo: enumPageInfo.termsOfUse, object: null, class: null },
        { pageInfo: enumPageInfo.privacyPolicy, object: null, class: null },
        { pageInfo: enumPageInfo.copyRight, object: null, class: null },
        { pageInfo: enumPageInfo.askLilly, object: null, class: null },

        { pageInfo: enumPageInfo.datePicker, object: null, class: null },
        { pageInfo: enumPageInfo.settings, object: null, class: null }
	],

    visitHistory: null,
    visitHistory_Workflow: null,

    readInformationForUserHistory: null,
    readInformationForPhysicianHistory: null,

    isBack: false,

    button_notes_resources: {
        normal: 'btn_notes.png',
        red: 'btn_notes_red.png',
        notext: 'btn_notes_notext.png'
    },

    button_settings_resources: {
        normal: 'btn_settings.png',
        red: 'btn_settings_red.png'
    },

    button_info_resources: {
        normal: 'btn_info.png',
        red: 'btn_info_red.png',
        notext: 'btn_info_notext.png'
    },

    setZoomValue: function () {
        var w = $(window).width();
        var p = $(window).height() / $(window).width();
        var n = $(window).height() / 480;
        var l = $(window).width() / 320;

        if (w == 768) {
            userData.setValue(enumLocalStorageItem.bodyZoom, 1);
            userData.setValue(enumLocalStorageItem.imageZoom, 2);
        }
        else {
            var realP = p <= 1.5 ? n : l;
            userData.setValue(enumLocalStorageItem.bodyZoom, realP);
            userData.setValue(enumLocalStorageItem.imageZoom, 1);
        }

        $("body").css("zoom", userData.getValue(enumLocalStorageItem.bodyZoom));
    },

    zoomViewport: function () {
        var p = $(window).height() / $(window).width();
        var n = $(window).height() / 480;
        var l = $(window).width() / 320;
        var m = $(window).width() / n / 2 + 57;
        var w = $(window).width();
        var curPage = Base.visitHistory[Base.visitHistory.length - 1].originPageInfo;

        if (w == 768) {
            $("img").each(function () {
                if (commonHelper.isNullOrEmpty($(this).attr('isZoomed'))) {
                    $(this).attr("height", $(this).height() * userData.getValue(enumLocalStorageItem.imageZoom));
                    $(this).attr("isZoomed", true);
                }
            });

            if (curPage.name == enumPageInfo.overview.name) {
                $(".fixed_height").height($(window).height() - 80);
            }
            else {
                $(".fixed_height").height($(window).height() - 100);
            }
        }
        else {
            switch (curPage.name) {
                case enumPageInfo.landing.name:
                    p <= 1.5 ? $(".landing").css({ "margin-top": ($(window).height() / n - 480) / 2, "box-shadow": "none" }) : $(".landing").css({ "margin-top": ($(window).height() / l - 480) / 2, "box-shadow": "none" });  //Calculate the margin-top of the 'main' area  /* Update By Jean On 27/10/2014 */
                    break;
                case enumPageInfo.emergencyInstructions.name:
                    p <= 1.5 ? $(".media").css({ "margin-top": ($(window).height() / n - 480) / 2, "box-shadow": "none" }) : $(".media").css({ "margin-top": ($(window).height() / l - 480) / 2, "box-shadow": "none" });  //Calculate the margin-top of the 'media' area  /* Update By Jean On 27/10/2014 */
                    $(".info").css("top", parseInt($(".media").css("margin-top")) + parseInt($(".info").css("top")) - 8);  //Calculate the top of the 'info' area  /* Update By Jean On 27/10/2014 */
                    break;
                case enumPageInfo.injectionStepGuide.name:
                    p <= 1.5 ? $(".injection_step_guide").css("margin-top", ($(window).height() / n - 480) / 2) : $(".injection_step_guide").css("margin-top", ($(window).height() / l - 480) / 2);  //Calculate the margin-top of the 'injection_step_guide' area  /* Update By Jean On 27/10/2014 */
                    break;
                case enumPageInfo.injectionStep01.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_1 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_1 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep02.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_2 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_2 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep03.name:
                case enumPageInfo.injectionStep04.name:
                case enumPageInfo.injectionStep05.name:
                case enumPageInfo.injectionStep06.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    break;
                case enumPageInfo.injectionStep07.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_7 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_7 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep08.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_8 .btn_next").css({ "right": ($(window).width() / n - 210) / 2, "top": parseInt($(".injection_step_8 .btn_next").css("top")) + parseInt(($(window).height() / n - 480) / 2 + 10) }) : $(".injection_step_8 .btn_next").css({ "right": ($(window).width() / l - 210) / 2, "top": parseInt($(".injection_step_8 .btn_next").css("top")) + parseInt(($(window).height() / l - 480) / 2 + 10) });  //Calculate how far to the right and top for the 'btn_next' button  /* Update By Jean On 28/10/2014 */
                    p <= 1.5 ? $(".injection_step_8 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_8 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10)  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep09.name:
                case enumPageInfo.injectionStep10.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    break;
                case enumPageInfo.injectionStep11.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_11 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_11 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep12.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_12 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_12 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep13.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_13 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_13 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep14.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_14 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_14 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStep15.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".injection_step_15 .tips").css("margin-top", ($(window).height() / n - 480) / 2 + 10) : $(".injection_step_15 .tips").css("margin-top", ($(window).height() / l - 480) / 2 + 10);  //Calculate the margin-top of the 'tips' area  /* Update By Jean On 28/10/2014 */
                    break;
                case enumPageInfo.injectionStepCompleted.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    break;
                case enumPageInfo.myKitInformation.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 50) : $(".fixed_height").height($(window).height() / l - 50);  // Calculate the height of the main area
                    p <= 1.5 ? $(".kit_list").css("max-height", $(window).height() / n - 350) : $(".kit_list").css("max-height", $(window).height() / l - 350);  // Calculate the height of the 'kit_list' area
                    break;
                case enumPageInfo.informationForUser.name:
                    //p <= 1.5 ? $(".fixed_height_pdf").height($(window).height() / n - 50) : $(".fixed_height_pdf").height($(window).height() / l - 50);  // Calculate the height of the 'pdf_wrap' area
                    break;
                case enumPageInfo.informationForPhysician.name:
                    //p <= 1.5 ? $(".fixed_height_pdf").height($(window).height() / n - 50) : $(".fixed_height_pdf").height($(window).height() / l - 50);  // Calculate the height of the 'pdf_wrap' area
                    break;
                case enumPageInfo.overview.name:
                    p <= 1.5 ? $(".fixed_height").height($(window).height() / n - 40) : $(".fixed_height").height($(window).height() / l - 40);  // Calculate the height of the 'main' area
                    break;
            }
        }
    },

    getOriginOffsetHeight: function (ctlId) {
        var ctl = document.getElementById(ctlId);
        if (commonHelper.isNullOrEmpty(ctl.getAttribute('isZoomed'))) {
            return ctl.offsetHeight;
        }
        else {
            return ctl.offsetHeight / userData.getValue(enumLocalStorageItem.imageZoom);
        }
    },

    registerSubNavListTouchEvent: function (ctlId) {
        var w = $(window).width();
        var curPageName = Base.visitHistory[Base.visitHistory.length - 1].originPageInfo.name;
        var borderColor = (curPageName == enumPageInfo.myKitInformation.name) ? '#e5a750' : '#aaa';

        Ext.get(ctlId).on('touchstart', function (sender, event) {
            $('#' + ctlId).css('background-color', 'rgba(0,0,0,.1)');
            $('#' + ctlId).find("a").css("border-width", "0");
            $('#' + ctlId).prev().find("a").css("border-width", "0");
            if ($('#' + ctlId).is(":first-child")) $('#' + ctlId).parents(".sub_nav").css("border-top-color", "rgba(0,0,0,.1)");
            if ($('#' + ctlId).is(":last-child")) $('#' + ctlId).parents(".sub_nav").css("border-bottom-color", "rgba(0,0,0,.1)");
        });

        Ext.get(ctlId).on('touchend', function (sender, event) {
            $('#' + ctlId).css('background-color', '');
            w == 768 ? $('#' + ctlId).find("a").css("border-width", "2px") : $('#' + ctlId).find("a").css("border-width", "1px");
            w == 768 ? $('#' + ctlId).prev().find("a").css("border-width", "2px") : $('#' + ctlId).prev().find("a").css("border-width", "1px");
            if ($('#' + ctlId).is(":first-child")) $('#' + ctlId).parents(".sub_nav").css("border-top-color", borderColor);
            if ($('#' + ctlId).is(":last-child")) $('#' + ctlId).parents(".sub_nav").css("border-bottom-color", borderColor);
        });
    },

    getImageNewHeight: function (height) {
        var w = $(window).width();

        if (w == 768) {
            return height * userData.getValue(enumLocalStorageItem.imageZoom);
        }
        else {
            return height;
        }
    },

    pauseEvent: function () {
        if (!commonHelper.isNullObject(Base.visitHistory)) {
            var currentPage = Base.visitHistory[Base.visitHistory.length - 1];
            switch (currentPage.originPageInfo.name) {
                case enumPageInfo.emergencyInstructions.name:
                    Base.pageContentList[currentPage.index].class.pausedEvent();
                    break;
                case enumPageInfo.injectionStep07.name:
                    if (commonHelper.isTouchDevice()) {
                        accelerometerMonitor.stopWatch();
                    }
                    break;
            }
        }
    },

    appLogoTapEvent: function () {
        var me = this;
        var methodName = 'Base.appLogoTapEvent';

        try {
            if (commonSession.agreeGuide && !commonSession.isReInit) {
                Base.gotoPage(enumPageInfo.landing);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    displayBar: function () {
        var me = this;
        var currentPage = me.visitHistory[me.visitHistory.length - 1];

        document.getElementById('span_footer_stepNumber').innerText = '';

        var btnBack = $('#btn_top_Back');
        var btnISI = $('#btn_top_ISI');
        var spanStepNumber = $('#span_footer_stepNumber');
        var middleText = $('#span_footer_desc');
        var middleLogo = $('#img_footer_logoLilly');
        var imgNotes = $('#img_footer_Notes');
        var imgSettings = $('#img_footer_Settings');
        var imgInfo = $('#img_footer_Info');

        spanStepNumber.css('display', 'none');
        middleText.css('display', 'none');
        middleLogo.css('display', 'none');
        imgNotes.css('display', 'none');
        imgSettings.css('display', 'none');
        imgInfo.css('display', 'none');

        switch (currentPage.originPageInfo.name) {
            case enumPageInfo.overview.name:
                //Top
                document.getElementById('headerTitle').innerText = '';
                btnBack.css('display', 'none');
                btnISI.css('display', '');
                //Bottom
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.landing.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                //Bottom
                middleLogo.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.normal);
                imgNotes.css('display', '');
                imgSettings.css('display', 'none');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.normal);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.emergencyInstructions.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', '');
                btnISI.css('display', '');
                //Bottom
                middleText.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.notext);
                imgNotes.css('display', '');
                imgSettings.attr('src', 'img/' + Base.button_settings_resources.normal);
                imgSettings.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.practiceAndPrepare.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', '');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.notext);
                imgNotes.css('display', '');
                imgSettings.attr('src', 'img/' + Base.button_settings_resources.normal);
                imgSettings.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.injectionStepGuide.name:
            case enumPageInfo.injectionStep01.name:
            case enumPageInfo.injectionStep02.name:
            case enumPageInfo.injectionStep03.name:
            case enumPageInfo.injectionStep04.name:
            case enumPageInfo.injectionStep05.name:
            case enumPageInfo.injectionStep06.name:
            case enumPageInfo.injectionStep07.name:
            case enumPageInfo.injectionStep08.name:
            case enumPageInfo.injectionStep09.name:
            case enumPageInfo.injectionStep10.name:
            case enumPageInfo.injectionStep11.name:
            case enumPageInfo.injectionStep12.name:
            case enumPageInfo.injectionStep13.name:
            case enumPageInfo.injectionStep14.name:
            case enumPageInfo.injectionStep15.name:
            case enumPageInfo.injectionStepCompleted.name:
                btnBack.css('display', '');
                btnISI.css('display', '');
                //Top
                document.getElementById('headerTitle').innerText = enumPageInfo.injectionStepGuide.title;
                if (
                    currentPage.originPageInfo.name != enumPageInfo.injectionStepGuide.name
                    && currentPage.originPageInfo.name != enumPageInfo.injectionStepCompleted.name
                ) {
                    //Bottom
                    document.getElementById('span_footer_stepNumber').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                }

                if (currentPage.originPageInfo.name == enumPageInfo.injectionStepCompleted.name) {
                    middleLogo.css('display', '');
                }

                //Bottom
                spanStepNumber.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.isi.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnISI.css('display', '');
                if (
                    Base.visitHistory_Workflow.length == 2
                    && Base.visitHistory_Workflow[Base.visitHistory_Workflow.length - 2].originPageInfo.name == enumPageInfo.termsOfUse.name
                ) {
                    btnBack.css('display', 'none');
                }
                else {
                    btnBack.css('display', '');
                }

                //Bottom
                middleLogo.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.notext);
                imgNotes.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.manageMyKits.name:
            case enumPageInfo.myKitInformation.name:
            case enumPageInfo.myKitInformationDetail.name:
            case enumPageInfo.storingGlucagon.name:
            case enumPageInfo.learnAboutGlucagon.name:
            case enumPageInfo.glucagonIndication.name:
            case enumPageInfo.lowBloodSugar.name:
            case enumPageInfo.glucagonTips.name:
            case enumPageInfo.helpfulLinks.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', '');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.notext);
                imgNotes.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.generalInformation.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', 'none');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.red);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.termsOfUse.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                if (commonHelper.isNullOrEmpty(commonSession.agreeGuide)) {
                    btnBack.css('display', 'none');
                    btnISI.css('display', 'none');
                }
                else {
                    btnBack.css('display', '');
                    btnISI.css('display', '');
                }

                //Bottom
                middleLogo.css('display', '');
                if (!commonHelper.isNullOrEmpty(commonSession.agreeGuide)) {
                    imgInfo.attr('src', 'img/' + Base.button_info_resources.red);
                    imgInfo.css('display', '');
                }
                break;
            case enumPageInfo.privacyPolicy.name:
            case enumPageInfo.copyRight.name:
            case enumPageInfo.askLilly.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', '');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.red);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.notes.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', 'none');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.red);
                imgNotes.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.datePicker.name:
                //Top
                btnBack.css('display', '');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgNotes.attr('src', 'img/' + Base.button_notes_resources.normal);
                imgNotes.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.normal);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.settings.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', 'none');
                btnISI.css('display', '');
                //Bottom
                middleLogo.css('display', '');
                imgSettings.attr('src', 'img/' + Base.button_settings_resources.red);
                imgSettings.css('display', '');
                imgInfo.attr('src', 'img/' + Base.button_info_resources.notext);
                imgInfo.css('display', '');
                break;
            case enumPageInfo.informationForUser.name:
            case enumPageInfo.informationForPhysician.name:
                //Top
                document.getElementById('headerTitle').innerText = me.visitHistory[me.visitHistory.length - 1].title;
                btnBack.css('display', '');
                btnISI.css('display', '');
                break;
        }
    },

    displayMenu: function () {
        var me = this;
        var currentPage = me.visitHistory[me.visitHistory.length - 1];
        var topMenu = Ext.getCmp('ctlTopMenu');
        var bottomMenu = Ext.getCmp('ctlBottomMenu');

        switch (currentPage.originPageInfo.name) {
            case enumPageInfo.landing.name:
                topMenu.setHidden(true);
                bottomMenu.setHidden(false);
                break;
            case enumPageInfo.informationForUser.name:
            case enumPageInfo.informationForPhysician.name:
                topMenu.setHidden(false);
                bottomMenu.setHidden(true);
                break;
            default:
                topMenu.setHidden(false);
                bottomMenu.setHidden(false);
                break;
        }
    },

    getSoundStatus: function () {
        var me = this;
        var soundStatus = userData.getValue(enumLocalStorageItem.soundStatus);
        if (commonHelper.isNullOrEmpty(soundStatus)) {
            me.setSoundStatus(1);
            return 1;
        }

        return formatHelper.toInteger(soundStatus);
    },

    setSoundStatus: function (status) {
        userData.setValue(enumLocalStorageItem.soundStatus, status);
    },

    getManualPlayStatus: function () {
        var me = this;
        var manualPlayStatus = userData.getValue(enumLocalStorageItem.manualPlayStatus);
        if (commonHelper.isNullOrEmpty(manualPlayStatus)) {
            me.setManualPlayStatus(1);
            return 1;
        }

        return formatHelper.toInteger(manualPlayStatus);
    },

    setManualPlayStatus: function (status) {
        userData.setValue(enumLocalStorageItem.manualPlayStatus, status);
    },

    addVisitHistory: function (visitObject, isBack) {
        var me = this;

        if (visitObject.originPageInfo.name == enumPageInfo.landing.name) {
            me.visitHistory = new Array();
            me.visitHistory.push(visitObject);
            me.visitHistory_Workflow = new Array();
            me.visitHistory_Workflow.push(visitObject);
        }
        else {
            if (commonHelper.isNullOrEmpty(me.visitHistory)) {
                me.visitHistory = new Array();
            }

            me.visitHistory.push(visitObject);

            if (commonHelper.isNullOrEmpty(me.visitHistory_Workflow)) {
                me.visitHistory_Workflow = new Array();
            }

            if (commonHelper.isNullOrEmpty(isBack) || !isBack) {
                me.visitHistory_Workflow.push(visitObject);
            }
        }

        userData.setValue(enumLocalStorageItem.lastPageName, visitObject.originPageInfo.name);
    },

    createInnerPanels: function () {
        var me = this;

        for (var i = 0; i < me.pageContentList.length; i++) {
            me.pageContentList[i].class = Ext.create(me.pageContentList[i].pageInfo.nameSpace);
            me.pageContentList[i].object = me.pageContentList[i].class.createPanel();
        }
    },

    initReadInformationForUserHistory: function () {
        var me = this;

        if (commonHelper.isNullOrEmpty(Base.readInformationForUserHistory)) {
            Base.readInformationForUserHistory = {};
            Base.readInformationForUserHistory[enumPageInfo.landing.name] = 0;
            Base.readInformationForUserHistory[enumPageInfo.emergencyInstructions.name] = 0;
            Base.readInformationForUserHistory[enumPageInfo.isi.name] = 0;
            Base.readInformationForUserHistory[enumPageInfo.glucagonTips.name] = 0;
            Base.readInformationForUserHistory[enumPageInfo.injectionStepCompleted.name] = 0;
        }
    },

    initReadInformationForPhysicianHistory: function () {
        var me = this;

        if (commonHelper.isNullOrEmpty(Base.readInformationForPhysicianHistory)) {
            Base.readInformationForPhysicianHistory = {};
            Base.readInformationForPhysicianHistory[enumPageInfo.landing.name] = 0;
            Base.readInformationForPhysicianHistory[enumPageInfo.isi.name] = 0;
        }
    },

    backPage: function (isOriginButton) {
        var me = this;

        if (me.visitHistory_Workflow[me.visitHistory_Workflow.length - 1].originPageInfo.name.indexOf('injectionStep') >= 0) {
            if (!commonHelper.isNullOrEmpty(isOriginButton)) {
                me.visitHistory_Workflow.splice(me.visitHistory_Workflow.length - 1, 1);
            }
            else {
                for (var i = me.visitHistory_Workflow.length - 1; i >= 0; i--) {
                    if (me.visitHistory_Workflow[i].originPageInfo.name == enumPageInfo.practiceAndPrepare.name) {
                        break;
                    }
                    else {
                        me.visitHistory_Workflow.splice(i, 1);
                    }
                }
            }
        }
        else {
            if (!commonHelper.isNullOrEmpty(isOriginButton) && document.getElementById('img_footer_Info').getAttribute('src') == 'img/' + Base.button_info_resources.red) {
                for (var i = me.visitHistory_Workflow.length - 1; i >= 0; i--) {
                    if (me.visitHistory_Workflow[i].originPageInfo.name == enumPageInfo.generalInformation.name) {
                        me.visitHistory_Workflow.splice(i, 1);
                        break;
                    }
                    else {
                        me.visitHistory_Workflow.splice(i, 1);
                    }
                }
            }
            else {
                me.visitHistory_Workflow.splice(me.visitHistory_Workflow.length - 1, 1);
            }
        }

        if (me.visitHistory_Workflow.length == 0) {
            commonSession.isReInit = false;
            if (!commonSession.agreeGuide) {
                userData.setValue(enumLocalStorageItem.agreeGuide, true);
                commonSession.agreeGuide = true;
            }
            Base.gotoPage(enumPageInfo.landing);
        }
        else {
            Base.gotoPage(me.visitHistory_Workflow[me.visitHistory_Workflow.length - 1].originPageInfo, me.visitHistory_Workflow[me.visitHistory_Workflow.length - 1].title, true);
        }
    },

    gotoPage: function (pageInfo, newTitle, isBack) {
        var me = this;
        var visitObject = {
            originPageInfo: pageInfo,
            title: pageInfo.title,
            index: null
        };

        me.isBack = commonHelper.isNullOrEmpty(isBack) ? false : isBack;

        if (!commonHelper.isNullOrEmpty(newTitle)) {
            visitObject.title = newTitle;
        }

        if (!commonHelper.isNullOrEmpty(Base.visitHistory) && Base.visitHistory.length > 0) {
            Base.pageContentList[Base.visitHistory[Base.visitHistory.length - 1].index].object.hide();
        }

        Ext.getCmp('containerMain').removeAll(false, true);

        for (var i = 0; i < Base.pageContentList.length; i++) {
            if (Base.pageContentList[i].pageInfo.name == pageInfo.name) {
                visitObject.index = i;
                me.addVisitHistory(visitObject, isBack);

                Ext.getCmp('containerMain').setItems(Base.pageContentList[i].object);
                Base.pageContentList[i].object.show();
                Base.displayMenu();
                break;
            }
        }
    }
};