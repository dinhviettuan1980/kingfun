var GameSelectLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);
        var thiz = this;

        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        this.titleLbl = new cc.LabelTTF(L('select_game'), "Arial", 52);
        this.titleLbl.x = cx + 200; this.titleLbl.y = cy + 200;
        this.titleLbl.setColor(new cc.Color(255, 225, 50));
        this.addChild(this.titleLbl, 5);

        // Ba Cây
        var bacayBtn = this._makeBtn(L('ba_cay'));
        bacayBtn.setPosition(cx - 30, cy);
        this.addChild(bacayBtn, 6);
        bacayBtn.addClickEventListener(function() {
            cc.director.runScene(new LobbyScene());
        });

        // Tá Lả
        var talaBtn = this._makeBtn(L('ta_la'));
        talaBtn.setPosition(cx + 430, cy);
        this.addChild(talaBtn, 6);
        talaBtn.addClickEventListener(function() {
            cc.director.runScene(new TaLaLobbyScene());
        });

        // Mini Games
        var funBtn = this._makeBtn(L('mini_games'));
        funBtn.setPosition(cx + 200, cy - 150);
        this.addChild(funBtn, 6);
        funBtn.addClickEventListener(function() {
            cc.director.runScene(new MiniGamesScene());
        });

        // Back
        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80; backBtn.y = size.height - 60;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 6);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new LoginScene());
        });

        // Hamburger button (top-left)
        var hambBtn = makeHamburgerBtn(52, size.height - 55);
        this.addChild(hambBtn, 6);
        hambBtn.addClickEventListener(function() {
            showSettingsPanel(function() {
                // Update visible labels in-place — no scene reload needed
                thiz.titleLbl.setString(L('select_game'));
            });
        });

        // Start background music
        Settings.startMusic();
    },

    _makeBtn: function(title) {
        var btn = makeNiceBtn(title, 260, 100, 42);
        btn.scale = 1.3;
        return btn;
    },

});


var GameSelectScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new GameSelectLayer());
    }
});

// =====================================================
// MiniGames
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

        var sub = new cc.LabelTTF(L('mini_games_sub'), "Arial", 30);
        sub.x = cx; sub.y = cy + 160;
        sub.setColor(new cc.Color(180, 220, 180));
        this.addChild(sub, 5);

        var tttBtn = this._makeBtn(L('tictactoe'));
        tttBtn.setPosition(cx, cy + 60);
        this.addChild(tttBtn, 6);
        tttBtn.addClickEventListener(function() {
            cc.director.runScene(new TicTacToeScene());
        });

        var caroBtn = this._makeBtn(L('co_caro'));
        caroBtn.setPosition(cx, cy - 60);
        this.addChild(caroBtn, 6);
        caroBtn.addClickEventListener(function() {
            cc.director.runScene(new CaroScene());
        });

        var goBtn = this._makeBtn(L('co_vay'));
        goBtn.setPosition(cx, cy - 185);
        this.addChild(goBtn, 6);
        goBtn.addClickEventListener(function() {
            cc.director.runScene(new GoScene());
        });

        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width - 80; backBtn.y = size.height - 60;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 6);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new GameSelectScene());
        });
    },

    _makeBtn: function(title) {
        var btn = makeNiceBtn(title, 300, 110, 44);
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
