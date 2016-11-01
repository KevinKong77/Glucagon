Ext.define(enumPageInfo.exCarousel.nameSpace, {
    extend: 'Ext.carousel.Carousel',
    xtype: 'exCarousel',
    ui: 'light',
    name: enumPageInfo.exCarousel.name,
    initialize: function () {
        this.onDragOrig = this.onDrag;
        this.onDrag = function (e) { if (!this.locked) { this.onDragOrig(e); } }
    },
    locked: false,
    lock: function () { this.locked = true; },
    unlock: function () { this.locked = false; }
});