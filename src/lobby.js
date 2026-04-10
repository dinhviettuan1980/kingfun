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

        var statusLabel = new cc.LabelTTF(
            "Xin chào " + cc.sys.localStorage.getItem("inputUsername") + ", mời bạn chọn bàn!",
            "Arial", 48
        );
        statusLabel.x = size.width / 2 + 200;
        statusLabel.y = size.height / 2 + 180;
        this.addChild(statusLabel, 6);

        var btn1 = createBtn("50");
        btn1.setPosition(size.width / 2 + 100, size.height / 2 + 50);
        this.addChild(btn1, 7);
        btn1.addClickEventListener(function() {
            cc.sys.localStorage.setItem("bet_amount", 50);
            cc.director.runScene(new HelloWorldScene());
        });

        var btn2 = createBtn("100");
        btn2.setPosition(size.width / 2 + 400, size.height / 2 + 50);
        this.addChild(btn2, 7);
        btn2.addClickEventListener(function() {
            cc.sys.localStorage.setItem("bet_amount", 100);
            cc.director.runScene(new HelloWorldScene());
        });

        var btn3 = createBtn("200");
        btn3.setPosition(size.width / 2 + 100, size.height / 2 - 150);
        this.addChild(btn3, 7);
        btn3.addClickEventListener(function() {
            cc.sys.localStorage.setItem("bet_amount", 200);
            cc.director.runScene(new HelloWorldScene());
        });

        var btn4 = createBtn("500");
        btn4.setPosition(size.width / 2 + 400, size.height / 2 - 150);
        this.addChild(btn4, 7);
        btn4.addClickEventListener(function() {
            cc.sys.localStorage.setItem("bet_amount", 500);
            cc.director.runScene(new HelloWorldScene());
        });

        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new LoginScene());
        });

        var helpBtn = new ccui.Button(res.Help_png, "", "");
        helpBtn.x = size.width / 2 + 500;
        helpBtn.y = size.height / 2 + 270;
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
