var RegisterLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;

        var statusLabel = new cc.LabelTTF("", "Arial", 38);
        statusLabel.x = size.width / 2 - 100;
        statusLabel.y = size.height / 2 + 300;
        statusLabel.setVisible(false);
        this.addChild(statusLabel, 6);

        var bg = this._bg = new cc.Sprite("res/LoginBng.png");
        bg.scale = 1.1;
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        var inputUsername = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputUsername.x = size.width / 2 + 100;
        inputUsername.y = size.height / 2 + 200;
        inputUsername.color = new cc.Color(100, 200, 0, 0);
        inputUsername.placeholder = "Tên đăng nhập";
        this.addChild(inputUsername, 6);

        var inputPassword = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputPassword.x = size.width / 2 + 100;
        inputPassword.y = size.height / 2 + 100;
        inputPassword.color = new cc.Color(100, 200, 0, 0);
        inputPassword.placeholder = "Mật khẩu";
        this.addChild(inputPassword, 6);

        var inputPasswordConfirm = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputPasswordConfirm.x = size.width / 2 + 100;
        inputPasswordConfirm.y = size.height / 2;
        inputPasswordConfirm.color = new cc.Color(100, 200, 0, 0);
        inputPasswordConfirm.placeholder = "Nhập lại mật khẩu";
        this.addChild(inputPasswordConfirm, 6);

        var email = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        email.x = size.width / 2 + 100;
        email.y = size.height / 2 - 100;
        email.color = new cc.Color(100, 200, 0, 0);
        email.placeholder = "email";
        this.addChild(email, 6);

        var backBtn = new ccui.Button();
        backBtn.loadTextures(res.Back_png, res.Back_png);
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new LoginScene());
        });

        var registerBtn = new ccui.Button();
        registerBtn.loadTextures(res.Register_png, res.Register_png);
        registerBtn.x = size.width / 2 + 100;
        registerBtn.y = size.height / 2 - 200;
        registerBtn.scale = 1.2;
        this.addChild(registerBtn, 7);

        registerBtn.addClickEventListener(function() {
            var request = cc.loader.getXMLHttpRequest();
            request.open("POST", "http://103.61.123.106:8001/api/register", true);
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.onload = function() {
                if (request.readyState == 4) {
                    statusLabel.setString(request.responseText);
                    var obj = JSON.parse(request.responseText);
                    if (obj.name != '' && obj.name != 'undefined' && obj.name != null) {
                        cc.director.runScene(new LoginScene());
                    } else {
                        statusLabel.setVisible(true);
                    }
                }
            };
            var params = {
                "name": inputUsername.getString().trim(),
                "pass": inputPassword.getString().trim(),
                "email": email.getString().trim()
            };
            request.send(JSON.stringify(params));
        });
    }
});

var RegisterScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new RegisterLayer();
        this.addChild(layer);
    }
});
