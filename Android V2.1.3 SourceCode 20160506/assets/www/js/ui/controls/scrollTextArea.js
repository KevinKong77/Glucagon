Ext.define(enumPageInfo.scrollTextArea.nameSpace, {
    extend: 'Ext.Container',
    xtype: 'scrollTextArea',
    name: enumPageInfo.scrollTextArea.name,
    scrollerMinHeight: 50,
    lineHeight: null,
    isPainted: false,
    startY: null,
    config: {
        listeners: {
            painted: function (sender, eOpts) {
                if (this.isPainted) {
                    var textArea = Ext.getCmp('txt_' + enumPageInfo.scrollTextArea.name + '_Notes');
                    if (!commonHelper.isNullOrEmpty(textArea)) {
                        textArea.setValue(userData.getValue(enumLocalStorageItem.notes));
                    }
                }
                else {
                    this.init();
                    this.isPainted = true;
                }
            }
        }
    },

    init: function () {
        var me = this;

        me.setLayout(
            {
                type: 'hbox',
                align: 'top'
            }
        );

        me.setItems(
            [
                {
                    xtype: 'textareafield',
                    id: 'txt_' + me.name + '_Notes',
                    width: '100%',
                    value: userData.getValue(enumLocalStorageItem.notes),
                    height: me.getHeight(),
                    placeHolder: 'Tab here to add notes',
                    clearIcon: false,
                    listeners: {
                        initialize: function () {
                            this.element.on('keydown', me.handleKeyDown, me);
                            this.element.on('touchstart', me.handleTouchStart, me);
                            this.element.on('touchmove', me.handleMove, me);
                            this.element.on('touchend', me.handleTouchEnd, me);
                            this.moveListenersAttached = true;
                        }
                    }
                },
                {
                    xtype: 'container',
                    id: 'div_' + me.name + '_ScrollerContainer',
                    width: 2,
                    height: me.getHeight(),
                    hidden: true,
                    html: '<div id="div_' + me.name + '_Scroller" class="note_editor_scroller" style="height:' + me.getHeight() + 'px"></div>'
                }
            ]
        );

    },
    resizeScroller: function (textArea, keyCode) {
        var me = this;

        var scrollerObj = document.getElementById('div_' + me.name + '_Scroller');
        me.lineHeight = parseInt($(textArea).css('line-height').replace('px', ''));

        var diffValue = textArea.scrollHeight - textArea.clientHeight;
        if (!commonHelper.isNullOrEmpty(keyCode) && keyCode == 13 && diffValue > 0) {
            diffValue += me.lineHeight;
        }
        var newHeight = textArea.clientHeight - diffValue;
        if (newHeight < me.scrollerMinHeight) {
            newHeight = me.scrollerMinHeight;
        }
        var newMarginTop = textArea.clientHeight - newHeight;
        var stepValue = diffValue / ((newMarginTop == 0) ? 1 : newMarginTop);
        stepValue = stepValue == 0 ? 1 : stepValue;
        scrollerObj.style['height'] = newHeight + 'px';
        var scrollTop = textArea.scrollTop;
        if (!commonHelper.isNullOrEmpty(keyCode) && keyCode == 13 && scrollTop > 0) {
            scrollTop += me.lineHeight;
        }
        scrollerObj.style['margin-top'] = Math.ceil(scrollTop / stepValue) + 'px';
    },

    handleKeyDown: function (e) {
        var me = this;
        me.resizeScroller(e.target, e.keyCode);

        document.getElementById('headerTitle').innerHTML = e.keyCode;
    },

    handleTouchStart: function (e) {
        var me = this;
        me.startY = e.touches[0].pageY;
        me.resizeScroller(e.target);
        Ext.getCmp('txt_' + me.name + '_Notes').setPlaceHolder('');
        Ext.getCmp('div_' + me.name + '_ScrollerContainer').setHidden(false);
    },

    handleTouchEnd: function (e) {
        var me = this;
        Ext.getCmp('div_' + me.name + '_ScrollerContainer').setHidden(true);
    },

    handleMove: function (e) {
        var me = this;
        var w = $(window).width();

        if (Ext.getCmp('div_' + me.name + '_ScrollerContainer').getHidden() == true) {
            return;
        }

        var textArea = e.target;
        var currentScrollTop = textArea.scrollTop;
        var diffValue = textArea.scrollHeight - textArea.clientHeight;
        var zoomValue;
        if (w == 768) {
            zoomValue = userData.getValue(enumLocalStorageItem.imageZoom);
        }
        else {
            zoomValue = userData.getValue(enumLocalStorageItem.bodyZoom);
        }
        var changedY = (me.startY - e.touches[0].pageY) / zoomValue;
        var scrollTop;
        if (changedY >= 0) {
            scrollTop = (changedY + currentScrollTop >= diffValue ? diffValue : changedY + currentScrollTop);
        }
        else {
            scrollTop = (changedY + currentScrollTop <= 0 ? 0 : changedY + currentScrollTop);
        }

        textArea.scrollTop = scrollTop;
        me.startY = e.touches[0].pageY;
        me.resizeScroller(textArea);

        var top = textArea.scrollTop <= 0;
        var bottom = textArea.scrollTop + textArea.clientHeight >= textArea.scrollHeight;
        var up = e.pageY > textArea.lastY;
        var down = e.pageY < textArea.lastY;
        textArea.lastY = e.pageY;
        if ((top && up) || (bottom && down)) e.preventDefault();
        if (!(top && bottom)) e.stopPropagation();
    }
});