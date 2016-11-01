var accelerometerMonitor = {
    watchID: null,
    lastX: null,
    lastY: null,
    lastZ: null,
    shakeThreshold: 3000,
    options: { frequency: 100 },
    startWatch: function (moveEvent) {
        var me = this;
        me.stopWatch();
        me.lastX = 0;
        me.lastY = 0;
        me.lastZ = 0;

        me.watchID = navigator.accelerometer.watchAcceleration(function (acceleration) {
            var deltaX = acceleration.x - me.lastX;
            var deltaY = acceleration.y - me.lastY;
            var deltaZ = acceleration.z - me.lastZ;
            var delta = Math.abs(deltaX + deltaY + deltaZ) / me.options.frequency * 10000;
            var marginValue;
            if (window.orientation == 0 || window.orientation == 180) {
                marginValue = acceleration.x * 5;
            }
            else {
                marginValue = acceleration.y * 5;
            }
            var isShakeEnough = delta > me.shakeThreshold;
            moveEvent(marginValue, isShakeEnough);

            me.lastX = acceleration.x;
            me.lastY = acceleration.y;
            me.lastZ = acceleration.z;

        }, function () {
            alert('onError!');
        }, me.options);
    },
    stopWatch: function () {
        var me = this;
        if (me.watchID) {
            navigator.accelerometer.clearWatch(me.watchID);
            me.watchID = null;
        }
    }
};