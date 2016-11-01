Ext.define(enumPageInfo.datePicker.nameSpace, {
    alias: [enumPageInfo.datePicker.nameSpace],
    config: {
        mainPanel: null
    },
    name: enumPageInfo.datePicker.name,
    isPainted: false,
    topBarHeight: null,
    bottomBarHeight: null,
    topActionHeight: null,
    topActionMarginBottom: null,
    selectedDateHeight: null,
    selectedDateMarginTop: null,
    selectedDateMarginBottom: null,

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
                html: '<div class="main kit_detail">'
                            + '<div class="top_action" id="div_' + me.name + '_TopAction">'
                                + '<input type="button" id="btn_' + me.name + '_Cancel" value="Cancel" class="float_l">'
                                + '<input type="button" id="btn_' + me.name + '_Done" value="Done" class="float_r">'
                            + '</div>'
                            + '<div class="selectedDate" id="div_' + me.name + '_SelectedDate"></div>'
                            + '<div style="width: 100%" id="div_' + me.name + '_DatePicker"></div>'
                        + '</div>',
                listeners: {
                    painted: function (sender, eOpts) {
                        Base.displayBar();

                        if (!me.isPainted) {
                            me.topBarHeight = document.getElementById('header').offsetHeight;
                            me.bottomBarHeight = document.getElementById('footer').offsetHeight;
                            me.topActionHeight = document.getElementById('div_' + me.name + '_TopAction').offsetHeight;
                            me.topActionMarginBottom = parseInt($('#div_' + me.name + '_TopAction').css('margin-bottom').replace('px', ''));
                            me.selectedDateHeight = document.getElementById('div_' + me.name + '_SelectedDate').offsetHeight;
                            me.selectedDateMarginTop = parseInt($('#div_' + me.name + '_SelectedDate').css('margin-top').replace('px', ''));
                            me.selectedDateMarginBottom = parseInt($('#div_' + me.name + '_SelectedDate').css('margin-bottom').replace('px', ''));
                            Base.zoomViewport();
                            var newHeight = document.body.scrollHeight / userData.getValue(enumLocalStorageItem.bodyZoom) - me.topBarHeight - me.bottomBarHeight - me.topActionHeight - me.selectedDateHeight - me.topActionMarginBottom - me.selectedDateMarginTop - me.selectedDateMarginBottom;
                            document.getElementById('div_' + me.name + '_DatePicker').style.height = newHeight + 'px';
                            me.createDatePickerPanel(newHeight);
                            me.registerEvent();
                            me.isPainted = true;
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
        var methodName = me.name + '.registerEvent';

        try {
            Ext.get('btn_' + me.name + '_Cancel').on('tap', me.btn_Cancel_Event, me);
            Ext.get('btn_' + me.name + '_Done').on('tap', me.btn_Done_Event, me);
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    btn_Cancel_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.btn_Cancel_Event';

        try {
            Base.backPage();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    btn_Done_Event: function (sender, event) {
        var me = this;
        var methodName = me.name + '.btn_Done_Event';

        try {
            commonSession.selectedDate = new Date(document.getElementById('div_' + me.name + '_SelectedDate').getAttribute('selDate'));
            commonSession.selectedDate_EN = commonSession.selectedDate.format('FULLDATE');
            Base.backPage();
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    },

    createDatePickerPanel: function (newHeight) {
        var me = this;
        var methodName = me.name + '.createDatePickerPanel';

        try {
            var createDatePickerPanel = Ext.create('Ext.picker.Date', {
                height: newHeight - 10,
                id: 'date_' + me.name + '_Picker',
                renderTo: 'div_' + me.name + '_DatePicker',
                bottom: 20,
                yearFrom: new Date().getFullYear() - 2,
                yearTo: new Date().getFullYear() + 5,
                listeners: {
                    painted: function (sender, eOpts) {
                        this.setValue(commonSession.selectedDate);
                        document.getElementById('div_' + me.name + '_SelectedDate').setAttribute('selDate', commonSession.selectedDate);
                        document.getElementById('div_' + me.name + '_SelectedDate').innerHTML = commonSession.selectedDate.format('FULLDATE');
                    },
                    pick: function (sender, newValue, slot, eOpts) {
                        if (!newValue.greatThan(new Date())) {
                            this.setValue(commonSession.selectedDate);
                        }
                        else {
                            document.getElementById('div_' + me.name + '_SelectedDate').setAttribute('selDate', newValue);
                            document.getElementById('div_' + me.name + '_SelectedDate').innerHTML = newValue.format('FULLDATE');
                        }
                    }
                }
            });
        }
        catch (e) {
            throw new Error(methodName + ':' + e.message);
        }
    }
});