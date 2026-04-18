var GameSelectLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        var title = new cc.LabelTTF("Chọn trò chơi", "Arial", 52);
        title.x = cx; title.y = cy + 200;
        title.setColor(new cc.Color(255, 225, 50));
        this.addChild(title, 5);

        // Ba Cây
        var bacayBtn = this._makeBtn("Ba Cây", new cc.Color(30, 100, 180));
        bacayBtn.setPosition(cx - 230, cy);
        this.addChild(bacayBtn, 6);
        bacayBtn.addClickEventListener(function() {
            cc.director.runScene(new LobbyScene());
        });

        // Tá Lả
        var talaBtn = this._makeBtn("Tá Lả", new cc.Color(160, 50, 30));
        talaBtn.setPosition(cx + 230, cy);
        this.addChild(talaBtn, 6);
        talaBtn.addClickEventListener(function() {
            cc.director.runScene(new TaLaScene());
        });

        // Mini Games
        var funBtn = this._makeBtn("Mini Games", new cc.Color(30, 130, 100));
        funBtn.setPosition(cx, cy - 150);
        this.addChild(funBtn, 6);
        funBtn.addClickEventListener(function() {
            cc.director.runScene(new MiniGamesScene());
        });

        // Back về login
        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80; backBtn.y = size.height - 60;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
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
        this.addChild(new GameSelectLayer());
    }
});

// =====================================================
// MiniGames — trang chứa các game giải trí
// =====================================================
var MiniGamesLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        var title = new cc.LabelTTF("Mini Games", "Arial", 52);
        title.x = cx; title.y = cy + 220;
        title.setColor(new cc.Color(255, 225, 50));
        this.addChild(title, 5);

        var sub = new cc.LabelTTF("Chơi cho vui — không mất tiền", "Arial", 30);
        sub.x = cx; sub.y = cy + 160;
        sub.setColor(new cc.Color(180, 220, 180));
        this.addChild(sub, 5);

        // Tic-Tac-Toe
        var tttBtn = this._makeBtn("Tic-Tac-Toe", new cc.Color(30, 130, 100));
        tttBtn.setPosition(cx, cy + 60);
        this.addChild(tttBtn, 6);
        tttBtn.addClickEventListener(function() {
            cc.director.runScene(new TicTacToeScene());
        });

        // Cờ Caro
        var caroBtn = this._makeBtn("Cờ Caro", new cc.Color(120, 60, 160));
        caroBtn.setPosition(cx, cy - 60);
        this.addChild(caroBtn, 6);
        caroBtn.addClickEventListener(function() {
            cc.director.runScene(new CaroScene());
        });

        // Cờ Vây
        var goBtn = this._makeBtn("Cờ Vây", new cc.Color(160, 100, 20));
        goBtn.setPosition(cx, cy - 185);
        this.addChild(goBtn, 6);
        goBtn.addClickEventListener(function() {
            cc.director.runScene(new GoScene());
        });

        // Back về GameSelect
        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80; backBtn.y = size.height - 60;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 6);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new GameSelectScene());
        });
    },

    _makeBtn: function(title, color) {
        var btn = new ccui.Button("res/btn_register_normal.png", "", "");
        btn.setScale9Enabled(true);
        btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
        btn.setContentSize(cc.size(300, 110));
        btn.setTitleText(title);
        btn.setTitleFontSize(44);
        btn.setTitleColor(new cc.Color(255, 255, 255));
        btn.setColor(color);
        btn.setZoomScale(-0.05);
        btn.scale = 1.3;
        return btn;
    }
});

var MiniGamesScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new MiniGamesLayer());
    }
});
