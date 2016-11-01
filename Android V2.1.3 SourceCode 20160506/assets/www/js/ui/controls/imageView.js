Ext.define(enumPageInfo.imageView.nameSpace, {
    extend: 'Ext.Container',
    xtype: 'imageView',
    name: enumPageInfo.imageView.name,
    isPainted: false,
    config: {
        src: null,
        id: null,
        parentId: null,
        originWidth: null,
        originHeight: null,
        lastTop: null,
        lastLeft: null,
        lastZoomValue: null,
        canMove: false,

        listeners: {
            painted: function (sender, eOpts) {
                if (!this.isPainted) {
                    this.isPainted = true;
                }

                var showImageCtl = Ext.getCmp(this.getId() + '_show_image');
                this.setOriginWidth(showImageCtl.element.dom.clientWidth);
                this.setOriginHeight(showImageCtl.element.dom.clientHeight);
            }
        }
    },

    callDestroy: function () {
        var me = this;
        var showImageCtl = Ext.getCmp(me.getId() + '_show_image');
        if (commonHelper.isTouchDevice()) {
            showImageCtl.element.un('pinchstart', me.pinchStartEvent, showImageCtl);
            showImageCtl.element.un('pinch', me.pinchEvent, showImageCtl);
            showImageCtl.element.un('pinchend', me.pinchEndEvent, showImageCtl);
            showImageCtl.element.un('touchstart', me.touchStartEvent, showImageCtl);
            showImageCtl.element.un('touchmove', me.touchMoveEvent, showImageCtl);
            showImageCtl.element.un('touchend', me.touchEndEvent, showImageCtl);
            showImageCtl.element.un('swipe', me.swipeEvent, showImageCtl);
        }

        me.removeAll(true, true);
        me.destroy();
    },

    resetShowImageCtl: function () {
        var me = this;
        var showImageCtl = Ext.getCmp(me.getId() + '_show_image');
        showImageCtl.setWidth('100%');
        showImageCtl.setHeight('100%');
        showImageCtl.setMargin('0 0 0 0');
    },

    resetImageViewSession: function () {
        var me = this;
        imageViewSession.view = me;

        imageViewSession.x0 = -1;
        imageViewSession.y0 = -1;
        imageViewSession.x1 = -1;
        imageViewSession.y1 = -1;
        imageViewSession.x2 = -1;
        imageViewSession.y2 = -1;
        imageViewSession.touch0 = null;
        imageViewSession.touch1 = null;
        imageViewSession.centerX0 = -1;
        imageViewSession.centerY0 = -1;

        imageViewSession.x00 = null;
        imageViewSession.y00 = null;
        imageViewSession.x11 = null;
        imageViewSession.y11 = null;
        imageViewSession.touch00 = null;
        imageViewSession.touch11 = null;
        imageViewSession.centerX1 = null;
        imageViewSession.centerY1 = null;

        imageViewSession.viewWidth = null;
        imageViewSession.viewHeight = null;

        imageViewSession.top = null;
        imageViewSession.left = null;
        imageViewSession.topMin = 0;
        imageViewSession.leftMin = 0;
        imageViewSession.topMax = 0;
        imageViewSession.leftMax = 0;

        imageViewSession.parentObject = null;
        imageViewSession.topBarHeight = document.getElementById('header').offsetHeight;
        imageViewSession.touchTopPos = null;
        imageViewSession.touchLeftPos = null;
    },

    initialize: function () {
        var me = this;
        me.callParent();

        me.setItems([
            {
                xtype: 'image',
                id: me.getId() + '_show_image',
                width: '100%',
                height: '100%',
                margin: '0 0 0 0'
            }
        ]);

        //set the image src
        var showImageCtl = Ext.getCmp(me.getId() + '_show_image');
        showImageCtl.setSrc(me.getSrc());

        if (commonHelper.isTouchDevice()) {
            showImageCtl.element.on('pinchstart', me.pinchStartEvent, showImageCtl);
            showImageCtl.element.on('pinch', me.pinchEvent, showImageCtl);
            showImageCtl.element.on('pinchend', me.pinchEndEvent, showImageCtl);
            showImageCtl.element.on('touchstart', me.touchStartEvent, showImageCtl);
            showImageCtl.element.on('touchmove', me.touchMoveEvent, showImageCtl);
            showImageCtl.element.on('touchend', me.touchEndEvent, showImageCtl);
            showImageCtl.element.on('swipe', me.swipeEvent, showImageCtl);
        }
    },

    pinchStartEvent: function (event, node, options, eOpts) {
        var showImageCtl = this; // me is image control
        var view = imageViewSession.view; // ctl is imageview control
        imageViewSession.parentObject = Ext.getCmp(view.getParentId());
        imageViewSession.parentObject.lock();

        imageViewSession.touch0 = event.touches[0];
        imageViewSession.x0 = imageViewSession.touch0.pageX;
        imageViewSession.y0 = imageViewSession.touch0.pageY;
        imageViewSession.touch1 = event.touches[1];
        imageViewSession.x1 = imageViewSession.touch1.pageX;
        imageViewSession.y1 = imageViewSession.touch1.pageY;

        var centerX0 = (imageViewSession.x0 + imageViewSession.x1) / 2;
        var centerY0 = (imageViewSession.y0 + imageViewSession.y1) / 2;

        var marginArr = showImageCtl.getMargin().split(" ");
        view.setLastTop(parseInt(marginArr[0]));
        view.setLastLeft(parseInt(marginArr[3]));
        view.setLastZoomValue(parseInt(showImageCtl.getWidth().split("%")[0]));
    },

    pinchEvent: function (event, node, options, eOpts) {
        var showImageCtl = this; // me is image control
        var view = imageViewSession.view; // ctl is imageview control

        imageViewSession.touch00 = event.touches[0];
        imageViewSession.x00 = imageViewSession.touch00.pageX;

        imageViewSession.y00 = imageViewSession.touch00.pageY;
        imageViewSession.touch11 = event.touches[1];
        imageViewSession.x11 = imageViewSession.touch11.pageX;
        imageViewSession.y11 = imageViewSession.touch11.pageY;

        if (imageViewSession.x0 == -1 || imageViewSession.y0 == -1) {
            return;
        }

        var minusX = Math.abs(imageViewSession.x11 - imageViewSession.x00) - Math.abs(imageViewSession.x1 - imageViewSession.x0);
        var minusY = Math.abs(imageViewSession.y11 - imageViewSession.y00) - Math.abs(imageViewSession.y1 - imageViewSession.y0);

        imageViewSession.centerX1 = (imageViewSession.x00 + imageViewSession.x11) / 2;
        imageViewSession.centerY1 = (imageViewSession.y00 + imageViewSession.y11) / 2;

        var addWidth = parseInt(showImageCtl.getWidth().split("%")[0]) + minusX;
        var addHeight = parseInt(showImageCtl.getHeight().split("%")[0]) + minusY;

        var zoomScaling = addWidth;
        var minusZoom = minusX;
        if (Math.abs(minusX) < Math.abs(minusY) && addHeight >= 100 && addHeight <= 400) {
            zoomScaling = addHeight;
            minusZoom = minusY;
        }

        if (zoomScaling >= 100 && zoomScaling <= 400) {
            showImageCtl.setWidth(zoomScaling + "%");
            showImageCtl.setHeight(zoomScaling + "%");
            //keep the image at the origin position
            imageViewSession.touchTopPos = imageViewSession.centerY1 / userData.getValue(enumLocalStorageItem.bodyZoom) - imageViewSession.topBarHeight;
            imageViewSession.touchLeftPos = imageViewSession.centerX1 / userData.getValue(enumLocalStorageItem.bodyZoom);
            imageViewSession.top = view.getLastTop() + (view.getLastZoomValue() - zoomScaling) / 100 * imageViewSession.touchTopPos;
            imageViewSession.left = view.getLastLeft() + (view.getLastZoomValue() - zoomScaling) / 100 * imageViewSession.touchLeftPos;

            if (imageViewSession.centerX0 != -1 && imageViewSession.centerY0 != -1) {
                imageViewSession.centerX0 = imageViewSession.centerX1;
                imageViewSession.centerY0 = imageViewSession.centerY1;
            }

            imageViewSession.viewWidth = showImageCtl.element.dom.clientWidth;
            imageViewSession.viewHeight = showImageCtl.element.dom.clientHeight;

            imageViewSession.topMin = view.getOriginHeight() - imageViewSession.viewHeight;
            imageViewSession.leftMin = view.getOriginWidth() - imageViewSession.viewWidth;

            if (imageViewSession.top < imageViewSession.topMin) {
                imageViewSession.top = imageViewSession.topMin;
            }
            else if (imageViewSession.top > imageViewSession.topMax) {
                imageViewSession.top = imageViewSession.topMax;
            }

            if (imageViewSession.left < imageViewSession.leftMin) {
                imageViewSession.left = imageViewSession.leftMin;
            }
            else if (imageViewSession.left > imageViewSession.topMax) {
                imageViewSession.left = imageViewSession.leftMax;
            }

            showImageCtl.setMargin(imageViewSession.top + " 0 0 " + imageViewSession.left);

            imageViewSession.x0 = imageViewSession.x00;
            imageViewSession.y0 = imageViewSession.y00;
            imageViewSession.x1 = imageViewSession.x11;
            imageViewSession.y1 = imageViewSession.y11;
        }
    },

    pinchEndEvent: function (event, node, options, eOpts) {
        imageViewSession.x0 = imageViewSession.y0 = imageViewSession.x1 = imageViewSession.y1 = -1;
    },

    touchStartEvent: function (event, node, options, eOpts) {
        imageViewSession.x2 = event.pageX;
        imageViewSession.y2 = event.pageY;
    },

    touchMoveEvent: function (event, node, options, eOpts) {
        var showImageCtl = this; // me is image control
        var view = imageViewSession.view; // ctl is imageview control

        var touches = event.touches;
        if (touches.length == 1) {
            var marginArr = showImageCtl.getMargin().split(' ');
            imageViewSession.top = event.pageY - imageViewSession.y2 + parseInt(marginArr[0]);
            imageViewSession.left = event.pageX - imageViewSession.x2 + parseInt(marginArr[3]);

            if (imageViewSession.top < imageViewSession.topMin) {
                imageViewSession.top = imageViewSession.topMin;
            }
            else if (imageViewSession.top > imageViewSession.topMax) {
                imageViewSession.top = imageViewSession.topMax;
            }

            if (imageViewSession.left < imageViewSession.leftMin) {
                imageViewSession.left = imageViewSession.leftMin;
            }
            else if (imageViewSession.left > imageViewSession.leftMax) {
                imageViewSession.left = imageViewSession.leftMax;
            }

            showImageCtl.setMargin(imageViewSession.top + " 0 0 " + imageViewSession.left);

            imageViewSession.x2 = event.pageX;
            imageViewSession.y2 = event.pageY;
        }
    },

    touchEndEvent: function (event, node, options, eOpts) {
        imageViewSession.x2 = imageViewSession.y2 = -1;
    },

    swipeEvent: function (event) {
        if (event.direction == 'left' && imageViewSession.left == imageViewSession.leftMin) {
            imageViewSession.parentObject.unlock();
        }

        if (event.direction == 'right' && imageViewSession.left == imageViewSession.leftMax) {
            imageViewSession.parentObject.unlock();
        }
    }
});