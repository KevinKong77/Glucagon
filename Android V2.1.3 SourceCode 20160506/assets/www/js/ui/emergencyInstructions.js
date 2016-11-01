Ext.define(enumPageInfo.emergencyInstructions.nameSpace, {
    alias: [enumPageInfo.emergencyInstructions.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.emergencyInstructions.name,
    isPainted: false,
    mediaSources: [
        { index: 0, name: 'step01', style: { width: 250, height: 250 }, audioObject: null, desc: 'Flip off the seal from the vial of Glucagon powder.' },
        { index: 1, name: 'step02', style: { width: 220, height: 200 }, audioObject: null, desc: 'Remove the needle cover from the syringe. DO NOT REMOVE THE PLASTIC CLIP FROM THE SYRINGE, as this may allow the push rod to come out of the syringe.' },
        { index: 2, name: 'step03', style: { width: 220, height: 200 }, audioObject: null, desc: 'Insert the needle into the rubber stopper on the vial, then inject the entire contents of the syringe into the vial of Glucagon powder.' },
        { index: 3, name: 'step04', style: { width: 210, height: 200 }, audioObject: null, desc: 'Remove the syringe from the vial, then gently swirl the vial until the liquid becomes clear. Glucagon should not be used unless the solution is clear and of a water-like consistency.' },
        { index: 4, name: 'step05', style: { width: 200, height: 210 }, audioObject: null, desc: 'Insert the same syringe into the vial and slowly withdraw all of the liquid. In children weighing less than 44 pounds, withdraw half the liquid (0.5 mark on the syringe).' },
        { index: 5, name: 'step06', style: { width: 250, height: 169 }, audioObject: null, desc: 'Cleanse site on buttock, arm, or thigh and inject Glucagon immediately after mixing, and then withdraw the needle. Apply light pressure against the injection site.' },
        { index: 6, name: 'step07', style: { width: 250, height: 169 }, audioObject: null, desc: 'Turn the person on his/her side. When an unconscious person awakens, he/she may vomit.' },
        { index: 7, name: 'step07_2.mp3', style: { width: 0, height: 0 }, audioObject: null, desc: '<font color="red">Call 911 immediately after administering Glucagon.</font> If the person does not awaken within 15 minutes, you may administer a second dose of Glucagon, if previously instructed by your healthcare provider to do so. <br /><br />As soon as the person is awake and able to swallow, give him/her a fast-acting source of sugar (such as fruit juice) followed by a snack or meal containing both protein and carbohydrates (such as cheese and crackers, or a peanut butter sandwich).' },
        { index: 8, name: 'step08.mp3', style: { width: 0, height: 0 }, audioObject: null, desc: 'Discard any unused <br/> reconstituted Glucagon.' },
        { index: 9, name: 'step09.mp3', style: { width: 0, height: 0 }, audioObject: null, desc: 'Remember to notify your healthcare provider that an episode of severe hypoglycemia has occurred. <br /><br /> These are not the complete instructions. For complete instructions on how to administer Glucagon, please see the <br /> <a id="link_' + enumPageInfo.emergencyInstructions.name + '_GotoInformationForUser">Information for the User</a>.' }
    ],
    soundIcons: [
        'img/emergencyInstructions_btnSoundOff.png',
        'img/emergencyInstructions_btnSoundOn.png'
    ],

    topBarHeight: null,
    bottomBarHeight: null,
    topLogoHeight: null,
    audioInterval: null,

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
                            + '<div class="logo float_l" id="div_' + me.name + '_Logo">'
                                + '<img id="img_' + me.name + '_Logo" src="img/logo_glucagon.png"  height="52" alt=""/>'
                            + '</div>'
                            + '<div class="action float_r">'
                                + '<span id="span_' + me.name + '_MuteText">Press for Audio</span>'
                                + '<a id="link_' + me.name + '_Sound"><img id="img_' + me.name + '_Sound" src="" height="35" alt=""/></a>'
                            + '</div>'
                            + '<div class="clearit"></div>'
                            + '<div class="info" id="div_' + me.name + '_Info">'
                                + '<a id="link_' + me.name + '_Begin"><img src="img/btn_begin.png" height="45" alt=""/></a>'
                            + '</div>'
                            + '<div id="div_' + me.name + '_Media" class="introMedia">'
                            + '</div>'
                        + '</div>',

                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!Base.isBack) {
                            document.getElementById('div_' + me.name + '_Media').style.visibility = 'hidden';
                            document.getElementById('div_' + me.name + '_Info').style.display = '';
                        }

                        if (!me.isPainted) {
                            me.topLogoHeight = Base.getOriginOffsetHeight('img_' + me.name + '_Logo');
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;
                            Base.zoomViewport();
                            var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - me.topLogoHeight * userData.getValue(enumLocalStorageItem.imageZoom);
                            document.getElementById('div_' + me.name + '_Media').style.height = newHeight + 'px';
                            //document.getElementById('div_' + me.name + '_Info').style.height = (newHeight) + 'px';
                            me.createMediaCarouselPanel(newHeight);
                            me.bindMediaData();

                            me.registerEvent();
                            me.isPainted = true;
                        }

                        me.paintedSoundIcon();
                        me.destroySlides();

                        if (Base.visitHistory[Base.visitHistory.length - 1].title == 'Watch a Tutorial') {
                            document.getElementById('div_' + me.name + '_Info').setAttribute('class', 'watch_info');
                        }
                        else {
                            document.getElementById('div_' + me.name + '_Info').setAttribute('class', 'info');
                        }

                        if (!Base.isBack) {
                            Ext.getCmp('car_' + me.name + '_Media').setActiveItem(0);
                        }
                        else {
                            me.carsouelActiveEvent();
                        }
                    },
                    hide: function (sender, eOpts) {
                        me.destroySlides();
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
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('link_' + me.name + '_Begin').on('tap', me.link_Begin_ClickEvent, me);
            Ext.get('link_' + me.name + '_Sound').on('tap', me.link_Sound_ClickEvent, me);
            Ext.get('img_' + me.name + '_Logo').on('tap', Base.appLogoTapEvent, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    gotoInformationForUser_TapEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.gotoInformationForUser_TapEvent';

        try {
            Base.gotoPage(enumPageInfo.informationForUser);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_RepeatYes_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_RepeatYes_ClickEvent';

        try {
            Ext.getCmp('car_' + me.name + '_Media').setActiveItem(0);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_RepeatNo_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_RepeatNo_ClickEvent';

        try {
            Base.gotoPage(enumPageInfo.landing);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Begin_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Begin_ClickEvent';

        try {
            document.getElementById('div_' + me.name + '_Media').style.visibility = 'visible';
            var currentActiveIndex = Ext.getCmp('car_' + me.name + '_Media').getActiveIndex();
            document.getElementById('div_' + me.name + '_Info').style.display = 'none';

            window.setTimeout(function () {
                me.playVideo();
            }, 200);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Sound_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.link_Sound_ClickEvent';

        try {
            var newSoundStatus = Base.getSoundStatus() == 1 ? 0 : 1;
            Base.setSoundStatus(newSoundStatus);
            me.paintedSoundIcon();
            var audioObject;
            for (var i = 0; i < me.mediaSources.length; i++) {
                audioObject = me.mediaSources[i].audioObject;
                if (commonHelper.isNullObject(audioObject)) {
                    continue;
                }

                if (newSoundStatus == 1) {
                    audioObject.setVolume(1.0);
                }
                else {
                    audioObject.setVolume(0.0);
                }
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    paintedSoundIcon: function () {
        var me = this;
        var methodName = me.name + '.paintedSoundIcon';

        try {
            var soundStatus = Base.getSoundStatus();
            Ext.get('img_' + me.name + '_Sound').dom.src = me.soundIcons[soundStatus];
            Ext.get('span_' + me.name + '_MuteText').dom.style.visibility = soundStatus == 0 ? 'visible' : 'hidden';
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    createMediaCarouselPanel: function (controlHeight) {
        var me = this;
        var methodName = me.name + '.createMediaCarouselPanel';

        try {
            var createMediaCarouselPanel = Ext.create('Ext.Carousel', {
                bodyBorder: false,
                height: controlHeight,
                id: 'car_' + me.name + '_Media',
                renderTo: 'div_' + me.name + '_Media',
                indicator: false,
                defaults: {
                    styleHtmlContent: true
                },
                listeners: {
                    painted: function (sender, eOpts) {
                    },
                    activeitemchange: function (sender, value, oldValue, eOpts) {
                        me.carsouelActiveEvent();
                    }
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    carsouelActiveEvent: function () {
        var me = this;
        var methodName = me.name + '.carsouelActiveEvent';

        try {
            if (!commonHelper.isNullOrEmpty(Ext.get('link_' + me.name + '_GotoInformationForUser'))) {
                Ext.get('link_' + me.name + '_GotoInformationForUser').un('tap', me.gotoInformationForUser_TapEvent, me);
                Ext.get('link_' + me.name + '_GotoInformationForUser').on('tap', me.gotoInformationForUser_TapEvent, me);
            }

            if (!commonHelper.isNullOrEmpty(Ext.get('link_' + me.name + '_RepeatYes'))) {
                Ext.get('link_' + me.name + '_RepeatYes').un('tap', me.link_RepeatYes_ClickEvent, me);
                Ext.get('link_' + me.name + '_RepeatYes').on('tap', me.link_RepeatYes_ClickEvent, me);
            }

            if (!commonHelper.isNullOrEmpty(Ext.get('link_' + me.name + '_RepeatNo'))) {
                Ext.get('link_' + me.name + '_RepeatNo').un('tap', me.link_RepeatNo_ClickEvent, me);
                Ext.get('link_' + me.name + '_RepeatNo').on('tap', me.link_RepeatNo_ClickEvent, me);
            }

            if (Ext.get('div_' + me.name + '_Info').dom.style.display == 'none') {
                me.destroySlides();
                me.playVideo();
            }

            if (Ext.getCmp('car_' + me.name + '_Media').getActiveIndex() == 9) {
                $('#span_footer_desc').fadeOut();
            }
            else {
                $('#span_footer_desc').fadeIn();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    img_Slide_LoadEvent: function (sender, event) {
        var me = this;
        var methodName = me.name + '.img_Slide_LoadEvent';

        try {
            if (sender.src.indexOf('.gif') > 0) {
                me.playAudioAfterGifLoaded();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    playAudioAfterGifLoaded: function () {
        var me = this;
        var methodName = me.name + '.playAudioAfterGifLoaded';

        try {
            var currentActiveIndex = Ext.getCmp('car_' + me.name + '_Media').getActiveIndex();
            var audioObject = me.mediaSources[currentActiveIndex].audioObject;
            var imgElement = Ext.get('img_' + me.name + '_Slide_' + currentActiveIndex);
            var soundStatus = Base.getSoundStatus();
            if (!commonHelper.isNullObject(audioObject)) {
                audioObject.play();
                audioObject.setVolume(soundStatus * 1.0);

                me.audioInterval = window.setInterval(function () {
                    audioObject.getCurrentPosition(function (position) {
                        //document.getElementById('headerTitle').innerHTML = position + 'AAA' + audioObject.getDuration();
                        if (position < 0) { //ios: -1; android:-0.001
                            window.clearInterval(me.audioInterval);
                            me.audioInterval = null;
                            audioObject.release();
                            //                            if (!commonHelper.isNullObject(imgElement)) {
                            //                                imgElement.dom.src = 'media/' + me.mediaSources[currentActiveIndex].name + '-end.png';
                            //                            }

                            if (Base.getManualPlayStatus() == 0) {
                                window.setTimeout(function () {
                                    if (currentActiveIndex + 1 < me.mediaSources.length) {
                                        //Ext.getCmp('car_' + me.name + '_Media').setActiveItem(currentActiveIndex + 1);
                                        Ext.getCmp('car_' + me.name + '_Media').next();
                                    }
                                }, 1500);
                            }
                        }
                    }, function (e) {
                        throw new Error(methodName + ':' + e.message);
                    });
                }, 100);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    playVideo: function () {
        var me = this;
        var methodName = me.name + '.playVideo';

        try {
            var currentActiveIndex = Ext.getCmp('car_' + me.name + '_Media').getActiveIndex();

            if (me.mediaSources[currentActiveIndex].name.indexOf('.mp3') > 0) {
                me.playAudioAfterGifLoaded();
            }
            else {
                var imgElement = Ext.get('img_' + me.name + '_Slide_' + currentActiveIndex);
                if (commonHelper.isNullOrEmpty(imgElement.dom.onload)) {
                    imgElement.dom.onload = function () {
                        me.img_Slide_LoadEvent(this, event);
                    };
                }
                imgElement.dom.src = 'media/' + me.mediaSources[currentActiveIndex].name + '.gif';
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    pausedEvent: function () {
        var me = this;
        var methodName = me.name + '.pausedEvent';

        try {
            if (!commonHelper.isNullOrEmpty(me.audioInterval)) {
                window.clearInterval(me.audioInterval);
                me.audioInterval = null;
            }

            var currentActiveIndex = Ext.getCmp('car_' + me.name + '_Media').getActiveIndex();
            var imgElement = Ext.get('img_' + me.name + '_Slide_' + currentActiveIndex);
            var audioObject = me.mediaSources[currentActiveIndex].audioObject;
            if (!commonHelper.isNullObject(imgElement)) {
                imgElement.dom.src = 'media/' + me.mediaSources[currentActiveIndex].name + '-end.png';
            }

            if (!commonHelper.isNullObject(audioObject)) {
                audioObject.stop();
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    destroySlides: function () {
        var me = this;
        var methodName = me.name + '.destroySlides';

        try {
            if (!commonHelper.isNullOrEmpty(me.audioInterval)) {
                window.clearInterval(me.audioInterval);
                me.audioInterval = null;
            }
            var imgElement, audioObject;
            var src = 'media/blank.png';
            for (var i = 0; i < me.mediaSources.length; i++) {
                imgElement = Ext.get('img_' + me.name + '_Slide_' + i);
                audioObject = me.mediaSources[i].audioObject;
                if (!commonHelper.isNullObject(imgElement)) {
                    imgElement.dom.src = src;
                }

                if (!commonHelper.isNullObject(audioObject)) {
                    audioObject.stop();
                    audioObject.release();
                }
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    bindMediaData: function () {
        var me = this;
        var methodName = me.name + '.bindMediaData';

        try {
            var itemList = new Array();
            var audioSource;

            for (var i = 0; i < me.mediaSources.length; i++) {
                itemList.push(
                    me.createMediaSlidePanel(me.mediaSources[i])
                );

                if (me.mediaSources[i].name.indexOf('.mp3') > 0) {
                    audioSource = me.mediaSources[i].name;
                }
                else {
                    audioSource = me.mediaSources[i].name + '.mp3';
                }

                if (commonHelper.isTouchDevice()) {
                    if (commonHelper.isAndroid()) {
                        me.mediaSources[i].audioObject = new Media(cordova.file.applicationDirectory + 'www/sounds/' + audioSource);
                    }

                    if (commonHelper.isIOS()) {
                        me.mediaSources[i].audioObject = new Media('sounds/' + audioSource);
                    }
                }
            }

            Ext.getCmp('car_' + me.name + '_Media').setItems(itemList);
        }
        catch (e) {
            Base.errorHandler(methodName, e);
        }
    },

    createMediaSlidePanel: function (mediaData) {
        var me = this;
        var methodName = me.name + '.createMediaSlidePanel';

        try {
            var src = 'media/blank.png';
            var index8Height = userData.getValue(enumLocalStorageItem.imageZoom) == 2 ? 150 : 100;
            var buttonHeight = 45 * userData.getValue(enumLocalStorageItem.imageZoom);

            var templateHtml = '<div class="media" XXX id="div_' + me.name + '_SlideContainer_' + mediaData.index + '">';
            if (mediaData.index == 8) {

                templateHtml = templateHtml.replace('XXX', 'style="height: ' + index8Height + 'px; padding-top: 55px;"');
            }

            if (mediaData.index == 9) {
                templateHtml = templateHtml.replace('XXX', 'style="text-align: left; padding: 10px"');
            }

            if (mediaData.name.indexOf('.mp3') > 0) {
                templateHtml += mediaData.desc + '</div>';
                if (mediaData.index == 9) {
                    templateHtml += '<div class="popup_message_1" id="div_' + me.name + '_Popup">'
                                                    + '<a id="link_' + me.name + '_RepeatYes">'
                                                        + '<img src="img/btn_alert_yes.png" height="' + buttonHeight + '" isZoomed=true alt=""/>'
                                                    + '</a>'
                                                    + '<a id="link_' + me.name + '_RepeatNo">'
                                                        + '<img src="img/btn_alert_no.png" height="' + buttonHeight + '" isZoomed=true alt=""/>'
                                                    + '</a>'
                                                + '</div>';
                }
            }
            else {
                templateHtml += '<img style="height: ' + Base.getImageNewHeight(mediaData.style.height) + 'px;"  id="img_' + me.name + '_Slide_' + mediaData.index + '" src="' + src + '" />'
                                        + '</div>'
                                        + '<div class="instructions" id="div_' + me.name + '_Desc_' + mediaData.index + '">'
								            + mediaData.desc
							            + '</div>';
            }

            var createSlidePanel = Ext.create('Ext.Panel', {
                html: templateHtml,
                id: 'slide_' + me.name + '_' + mediaData.index
            });

            return createSlidePanel;
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});