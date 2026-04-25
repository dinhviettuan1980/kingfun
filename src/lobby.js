// destScene  : constructor function của scene game sẽ vào (HelloWorldScene / TaLaScene)
// backScene  : constructor function của scene quay lại (GameSelectScene)
var LobbyLayer = cc.Layer.extend({
    ctor: function(destScene, backScene) {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        var statusLabel = new cc.LabelTTF(
            "Xin chao " + (cc.sys.localStorage.getItem("inputUsername") || "") + ", moi ban chon ban!",
            "Arial", 48
        );
        statusLabel.x = cx; statusLabel.y = cy + 220;
        this.addChild(statusLabel, 6);

        var gapX = 240, gapY = 150;
        var positions = [
            { x: cx - gapX, y: cy + 60,          amount: 50  },
            { x: cx + gapX, y: cy + 60,          amount: 100 },
            { x: cx - gapX, y: cy - gapY + 60,   amount: 200 },
            { x: cx + gapX, y: cy - gapY + 60,   amount: 500 }
        ];

        for (var i = 0; i < positions.length; i++) {
            (function(p) {
                var btn = _makeLobbyBtn(String(p.amount) + ' xu');
                btn.setPosition(p.x, p.y);
                btn.addClickEventListener(function() {
                    cc.sys.localStorage.setItem("bet_amount", p.amount);
                    cc.director.runScene(new destScene());
                });
                this.addChild(btn, 7);
            }).call(this, positions[i]);
        }

        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80; backBtn.y = size.height - 60;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new backScene());
        });

        var helpBtn = new ccui.Button(res.Help_png, "", "");
        helpBtn.x = size.width - 180; helpBtn.y = size.height - 60;
        helpBtn.scale = 1.5; helpBtn.setZoomScale(-0.05);
        this.addChild(helpBtn, 7);
        helpBtn.addClickEventListener(function() {
            cc.director.runScene(new HelpScene());
        });
    }
});

function _makeLobbyBtn(title) {
    var btn = new ccui.Button("res/btn_register_normal.png", "", "");
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
    btn.setTitleText(title);
    btn.setTitleFontSize(30);
    btn.scale = 1.5;
    btn.setZoomScale(-0.05);
    return btn;
}

var LobbyScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new LobbyLayer(HelloWorldScene, GameSelectScene));
    }
});

var TaLaLobbyScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new LobbyLayer(TaLaScene, GameSelectScene));
    }
});
