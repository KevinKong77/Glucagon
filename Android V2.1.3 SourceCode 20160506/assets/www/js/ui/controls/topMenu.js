Ext.define(enumPageInfo.topMenu.nameSpace, {
    extend: 'Ext.Container',
    xtype: 'topbar',
    isPainted: false,
    config: {
        docked: 'top',
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
        var methodName = 'topMenu.init';

        try {
            var innerHtml = '<header id="header">'
                                        + '<span id="headerTitle"></span>'
                                        + '<div class="float_l">'
                                            + '<input type="button" value="Back" class="btn_1" style="display: none" id="btn_top_Back">'
                                        + '</div>'
                                        + '<div class="float_r">'
                                            + '<input type="button" value="ISI" class="btn_2" style="display: none" id="btn_top_ISI">'
                                        + '</div>'
                                    + '</header>';

            me.setItems(
                [
                    {
                        xtype: 'container',
                        html: innerHtml,
                        listeners: {
                            painted: function (sender, eOpts) {
                                if (!commonHelper.isNullObject(Ext.get('btn_top_Back'))) {
                                    Ext.get('btn_top_Back').on('tap', me.btnBack_ClickEvent, me);
                                }

                                if (!commonHelper.isNullObject(Ext.get('btn_top_ISI'))) {
                                    Ext.get('btn_top_ISI').on('tap', me.btnISI_ClickEvent, me);
                                }
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

    btnBack_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = 'topMenu.btnBack_ClickEvent';

        try {
            Base.backPage();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    btnISI_ClickEvent: function (sender, event) {
        var me = this;
        var methodName = 'topMenu.btnISI_ClickEvent';

        try {
            if (Base.visitHistory[Base.visitHistory.length - 1].originPageInfo.name != enumPageInfo.isi.name) {
                Base.gotoPage(enumPageInfo.isi);
            }
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});