var GameSelectLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;

        var bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1;
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        var cx = size.width / 2, cy = size.height / 2;

        var title = new cc.LabelTTF("Chọn trò chơi", "Arial", 52);
        title.x = cx;
        title.y = cy + 200;
        title.setColor(new cc.Color(255, 225, 50));
        this.addChild(title, 5);

        // Nút Ba Cây
        var bacayBtn = this._makeBtn("Ba Cây", new cc.Color(30, 100, 180));
        bacayBtn.setPosition(cx - 200, cy);
        this.addChild(bacayBtn, 6);
        bacayBtn.addClickEventListener(function() {
            cc.director.runScene(new LobbyScene());
        });

        // Nút Tá Lả
        var talaBtn = this._makeBtn("Tá Lả", new cc.Color(160, 50, 30));
        talaBtn.setPosition(cx + 200, cy);
        this.addChild(talaBtn, 6);
        talaBtn.addClickEventListener(function() {
            cc.director.runScene(new TaLaScene());
        });

        // Nút thoát về login
        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80;
        backBtn.y = size.height - 60;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 6);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new LoginScene());
        });
    },

    _makeBtn: function(title, color) {
        var btn = new ccui.Button("res/btn_register_normal.png", "", "");
        btn.setScale9Enabled(true);
        btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
        btn.setContentSize(cc.size(260, 100));
        btn.setTitleText(title);
        btn.setTitleFontSize(42);
        btn.setTitleColor(new cc.Color(255, 255, 255));
        btn.setColor(color);
        btn.setZoomScale(-0.05);
        btn.scale = 1.3;
        return btn;
    }
});

var GameSelectScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new GameSelectLayer();
        this.addChild(layer);
    }
});
