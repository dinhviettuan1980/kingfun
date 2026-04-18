var LobbyLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;

        var bg = this._bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1;
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        var cx = size.width / 2, cy = size.height / 2;

        var statusLabel = new cc.LabelTTF(
            "Xin chào " + cc.sys.localStorage.getItem("inputUsername") + ", mời bạn chọn bàn!",
            "Arial", 48
        );
        statusLabel.x = cx;
        statusLabel.y = cy + 220;
        this.addChild(statusLabel, 6);

        // 4 nút cược xếp 2×2, canh giữa màn hình
        var gapX = 240, gapY = 150;
        var positions = [
            { x: cx - gapX, y: cy + 60,      amount: 50  },
            { x: cx + gapX, y: cy + 60,      amount: 100 },
            { x: cx - gapX, y: cy - gapY + 60, amount: 200 },
            { x: cx + gapX, y: cy - gapY + 60, amount: 500 }
        ];
        for (var i = 0; i < positions.length; i++) {
            (function(p) {
                var btn = createBtn(String(p.amount));
                btn.setPosition(p.x, p.y);
                btn.addClickEventListener(function() {
                    cc.sys.localStorage.setItem("bet_amount", p.amount);
                    cc.director.runScene(new HelloWorldScene());
                });
                this.addChild(btn, 7);
            }).call(this, positions[i]);
        }

        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80;
        backBtn.y = size.height - 60;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new LoginScene());
        });

        var helpBtn = new ccui.Button(res.Help_png, "", "");
        helpBtn.x = size.width - 180;
        helpBtn.y = size.height - 60;
        helpBtn.scale = 1.5;
        helpBtn.setZoomScale(-0.05);
        this.addChild(helpBtn, 7);
        helpBtn.addClickEventListener(function() {
            cc.director.runScene(new HelpScene());
        });

        function createBtn(title) {
            var btn = new ccui.Button("res/btn_register_normal.png", "", "");
            btn.setScale9Enabled(true);
            btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
            btn.setTitleText(title);
            btn.setTitleFontSize(30);
            btn.scale = 1.5;
            btn.setZoomScale(-0.05);
            return btn;
        }
    }
});

var LobbyScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new LobbyLayer();
        this.addChild(layer);
    }
});
