Ext.define(enumPageInfo.bottomMenu.nameSpace, {
    extend: 'Ext.Container',
    xtype: 'bottombar',
    isPainted: false,
    config: {
        docked: 'bottom',
        listeners: {
            painted: function (sender, eOpts) {
                if (!this.isPainted) {
                    this.init();
                    this.isPainted = true;
                }
            }
        }
    },

    init: function () {
        var me = this;
        var methodName = 'bottomMenu.init';

        try {
            var innerHtml = '<footer id="footer">'
                                        + '<span id="span_footer_desc" style="display: none">Swipe left to advance</span>'
                                        + '<img id="img_footer_logoLilly" style="display: none" src="img/logo_lilly.png" height="19" alt="Lilly"/>'
                                        + '<div class="float_l">'
                                            + '<strong id="span_footer_stepNumber" style="display:none"></strong>'
                                            + '<a id="link_footer_btnNotes"><img style="display:none" id="img_footer_Notes" src="img/' + Base.button_notes_resources.normal + '" height="22" alt=""/></a>'
                                            + '<a id="link_footer_btnSettings"><img style="display:none" id="img_footer_Settings" src="img/' + Base.button_settings_resources.normal + '" height="22" alt=""/></a>'
                                        + '</div>'
                                        + '<div class="float_r">'
                                            + '<a id="link_footer_btnInfo"><img style="display:none" id="img_footer_Info" src="img/' + Base.button_info_resources.normal + '" height="22" alt=""/></a>'
                                        + '</div>'
                                    + '</footer>';

            me.setItems(
                [
                    {
                        xtype: 'container',
                        html: innerHtml,
                        listeners: {
                            painted: function (sender, eOpts) {
                                Ext.get('link_footer_btnNotes').on('tap', me.link_Notes_ClickEvent, me);
                                Ext.get('link_footer_btnSettings').on('tap', me.link_Settings_ClickEvent, me);
                                Ext.get('link_footer_btnInfo').on('tap', me.link_Info_ClickEvent, me);
                            }
                        }
                    }
                ]
            );
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Notes_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = 'bottomMenu.link_Notes_ClickEvent';

        try {
            switch (document.getElementById('img_footer_Notes').getAttribute('src')) {
                case 'img/' + Base.button_notes_resources.normal:
                case 'img/' + Base.button_notes_resources.notext:
                    Base.gotoPage(enumPageInfo.notes);
                    break;
                case 'img/' + Base.button_notes_resources.red:
                    Base.backPage();
                    break;
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Settings_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = 'bottomMenu.link_Settings_ClickEvent';

        try {
            switch (document.getElementById('img_footer_Settings').getAttribute('src')) {
                case 'img/' + Base.button_settings_resources.normal:
                    Base.gotoPage(enumPageInfo.settings);
                    break;
                case 'img/' + Base.button_settings_resources.red:
                    Base.backPage();
                    break;
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    link_Info_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = 'bottomMenu.link_Info_ClickEvent';

        try {
            switch (document.getElementById('img_footer_Info').getAttribute('src')) {
                case 'img/' + Base.button_info_resources.normal:
                case 'img/' + Base.button_info_resources.notext:
                    Base.gotoPage(enumPageInfo.generalInformation);
                    break;
                case 'img/' + Base.button_info_resources.red:
                    Base.backPage(true);
                    break;
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});