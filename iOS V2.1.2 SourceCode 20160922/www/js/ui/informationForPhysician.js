Ext.define(enumPageInfo.informationForPhysician.nameSpace, {
    alias: [enumPageInfo.informationForPhysician.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.informationForPhysician.name,
    isPainted: false,

    topBarHeight: null,
    marginTop: null,
    newHeight: null,
    timer: null,
    iframeTimer: null,

    constructor: function (config) {
        this.initConfig(config);
    },

    createPanel: function () {
        var me = this;
        var methodName = me.name + '.createPanel';

        try {
            var scrollStyle = '';
            //if (commonHelper.isIOS() || !commonHelper.isNexus()) {
            scrollStyle = 'style="-webkit-overflow-scrolling: touch; overflow-y: auto;"';
            //}

            var innerHtml = '<div class="pdf_main"><div class="pdf_wrap fixed_height_pdf" id="div_' + me.name + '_ChildMain" ' + scrollStyle + '>';

            //if (commonHelper.isIOS() || !commonHelper.isNexus()) {
            innerHtml += '<div id="dpl_' + me.name + '_Container" style="width:100%">';
            //}
            innerHtml += '<iframe src="" id="frm_' + me.name + '" name="frm_' + me.name + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" frameborder="0" height="100%" width="100%"></iframe>';
            //if (commonHelper.isIOS() || !commonHelper.isNexus()) {
            innerHtml += '</div>';
            //}

            innerHtml += '</div></div>';

            mainPanel = Ext.create('Ext.Container', {
                id: 'container_' + me.name,
                showAnimation: 'slide',
                hidden: true,
                html: innerHtml,
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.marginTop = parseInt($('#div_' + me.name + '_ChildMain').css('margin-top').replace('px', ''));
                            Base.zoomViewport();
                            me.newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight;
                            document.getElementById('div_' + me.name + '_ChildMain').style.height = me.newHeight + 'px';
                            me.isPainted = true;
                        }

                        if (!Base.isBack) {
                            dplPDFManager.getPDFFiles(appConfig.downloadConfig.dplPDFData.piFolderName, function (htmlFilePath) {
                                document.getElementById('frm_' + me.name).src = htmlFilePath + '#pi';

                                //if (commonHelper.isIOS() || !commonHelper.isNexus()) {
                                me.iframeTimer = window.setInterval(function () {
                                    var iframeObject = document.getElementById('frm_' + me.name);
                                    if (!commonHelper.isNullObject(iframeObject)) {
                                        var iframeObjectContent = iframeObject.contentDocument;
                                        if (!commonHelper.isNullObject(iframeObjectContent)) {
                                            var iframeObjectContentBody = iframeObjectContent.body;
                                            if (!commonHelper.isNullObject(iframeObjectContentBody)) {
                                                var iframeObjectContentBodyOffsetHeight = iframeObjectContentBody.offsetHeight;
                                                if (!commonHelper.isNullOrEmpty(iframeObjectContentBodyOffsetHeight)) {
                                                    var iframeHeight = formatHelper.toInteger(iframeObjectContentBodyOffsetHeight / userData.getValue(enumLocalStorageItem.bodyZoom));
                                                    var containerHeight = parseInt(document.getElementById('dpl_' + me.name + '_Container').style.height.replace('px', ''));
                                                    if (containerHeight != iframeHeight + 20) {
                                                        document.getElementById('dpl_' + me.name + '_Container').style.height = (iframeHeight + 20) + 'px';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }, 200);
                                //}

                                me.timer = window.setTimeout(function () {
                                    maskHelper.closeMask();
                                }, 1000);
                            });
                        }
                    },
                    hide: function (sender, eOpts) {
                        if (!commonHelper.isNullOrEmpty(me.timer)) {
                            window.clearTimeout(me.timer);
                            me.timer = null;
                        }

                        if (!commonHelper.isNullOrEmpty(me.iframeTimer)) {
                            window.clearInterval(me.iframeTimer);
                            me.iframeTimer = null;
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
    }
});