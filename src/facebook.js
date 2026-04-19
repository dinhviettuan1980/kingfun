var FB = {
    _pollHandle: null,

    login: function(onSuccess, onFail) {
        if (!cc.sys.isNative) {
            if (onFail) onFail('not native');
            return;
        }
        jsb.reflection.callStaticMethod("FacebookBridge", "login:", "");

        var count = 0;
        var self = FB;
        self._pollHandle = { ok: onSuccess, fail: onFail, active: true };

        cc.director.getScheduler().scheduleCallbackForTarget(
            self._pollHandle,
            function() {
                count++;
                var raw = jsb.reflection.callStaticMethod("FacebookBridge", "getLoginResult:", "");
                if (raw && raw.length > 0) {
                    cc.director.getScheduler().unscheduleAllCallbacksForTarget(self._pollHandle);
                    var cb = self._pollHandle;
                    self._pollHandle = null;
                    try {
                        var data = JSON.parse(raw);
                        if (data.success) {
                            cc.sys.localStorage.setItem("fb_name", data.name || "");
                            cc.sys.localStorage.setItem("fb_uid",  data.uid  || "");
                            if (cb.ok) cb.ok(data.name, data.uid);
                        } else {
                            if (cb.fail) cb.fail(data.error);
                        }
                    } catch(e) {
                        if (cb.fail) cb.fail("error");
                    }
                    return;
                }
                if (count >= 120) {
                    cc.director.getScheduler().unscheduleAllCallbacksForTarget(self._pollHandle);
                    var cb = self._pollHandle;
                    self._pollHandle = null;
                    if (cb && cb.fail) cb.fail("timeout");
                }
            },
            0.5, cc.REPEAT_FOREVER, 0, false
        );
    },

    logout: function() {
        if (!cc.sys.isNative) return;
        jsb.reflection.callStaticMethod("FacebookBridge", "logout:", "");
        cc.sys.localStorage.setItem("fb_name", "");
        cc.sys.localStorage.setItem("fb_uid",  "");
    },

    getProfile: function() {
        if (!cc.sys.isNative) return null;
        var raw = jsb.reflection.callStaticMethod("FacebookBridge", "getProfile:", "");
        if (!raw || raw.length === 0) return null;
        try { return JSON.parse(raw); } catch(e) { return null; }
    },

    share: function(text) {
        if (!cc.sys.isNative) return;
        jsb.reflection.callStaticMethod("FacebookBridge", "shareWithText:", text);
    }
};
