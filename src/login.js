var LoginLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        // this._super();
        cc.Layer.prototype.ctor.call(this);

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var statusLabel = new cc.LabelTTF("Bạn đã sẵn sàng?", "Arial", 38);
        // position the label on the center of the screen
        statusLabel.x = size.width / 2 + 100;
        statusLabel.y = size.height / 2 + 300;
        statusLabel.setVisible(false);

        // add the label as a child to this layer
        this.addChild(statusLabel, 6);  


        var bg = this._bg = new cc.Sprite("res/LoginBng.png")
        bg.scale = 1.1; //ratioAssetScale(this.getContentSize());
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);
        // this.color = new cc.Color(0,0,0,0);


        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label 
        
        var inputUsername = new cc.EditBox(cc.size(400, 80), new ccui.Scale9Sprite());
        inputUsername.x = size.width / 2 + 200;
        inputUsername.y = size.height / 2 + 200;
        inputUsername.color = new cc.Color(100,200,0,0);
        inputUsername.placeholder = "Tên đăng nhập";
        if (cc.sys.localStorage.getItem("inputUsername")) {
            inputUsername.setString(cc.sys.localStorage.getItem("inputUsername"));
        }
        this.addChild(inputUsername, 6);  

        var inputPassword = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputPassword.x = size.width / 2 + 200;
        inputPassword.y = size.height / 2 + 100;
        inputPassword.color = new cc.Color(100,200,0,0);
        inputPassword.placeholder = "Mật khẩu";

        inputPassword.setVisible(false);
        this.addChild(inputPassword, 7);  

        var startBtn = new ccui.Button('res/button_play.png', '', '');
        startBtn.x = size.width / 2 + 200;
        startBtn.y = size.height / 2;
        startBtn.scale = 2;
        startBtn.setZoomScale(-0.05);

        this.addChild(startBtn, 7);

        var registerBtn = new ccui.Button(res.Register_png, '','');
        registerBtn.loadTextures(res.Register_png, res.Register_png);
        registerBtn.x = size.width / 2 + 450;
        registerBtn.y = size.height / 2;
        registerBtn.scale = 1.2;
        registerBtn.setZoomScale(-0.05);
        registerBtn.setVisible(false);
        this.addChild(registerBtn, 7);        

        var forgotBtn = new ccui.Button(res.Forgot_png, '','');
        forgotBtn.x = size.width / 2 + 450;
        forgotBtn.y = size.height / 2 - 200;
        forgotBtn.scale = 1.2;
        forgotBtn.setZoomScale(-0.05);
        forgotBtn.setVisible(false);
        this.addChild(forgotBtn, 7);

        startBtn.addClickEventListener( function() {

            if (inputUsername.getString().trim() == '') {
                statusLabel.setVisible(true);
                statusLabel.setString("Mời bạn nhập tên!");

                return;
            }

            if (inputUsername.getString().trim().length > 10) {
                statusLabel.setVisible(true);
                statusLabel.setString("Tên bạn quá dài!");

                return;
            }

            cc.sys.localStorage.setItem("inputUsername", inputUsername.getString().trim());
            cc.sys.localStorage.setItem("inputPassword", inputPassword.getString().trim());

            cc.director.runScene(new LobbyScene());

            // try {
            //     // try to call a post method
            //     var request = cc.loader.getXMLHttpRequest();
            //     // request.open("POST", "http://103.61.123.106:8002/entity/users/login", true);
            //     request.open("POST", "http://www.tuandv.id.vn/api/login", true);
            //     request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            //     request.onload = function () {
            //         console.log("tuandv = " + request.readyState);
            //         if (request.readyState == 4) {

            //             statusLabel.setString(request.responseText);
                        
            //             cc.director.runScene(new LobbyScene());
            //         }
            //     };

            //     request.onerror = function () {
            //         console.log("tuandv = onerror");
            //         statusLabel.setVisible(true);
            //         statusLabel.setString("Hãy kiểm tra kết nối mạng!");
            //     }

            //     request.ontimeout = function () {
            //         console.log("tuandv = timeout");
            //     }

            //     // var params = {"name": inputUsername.getString().trim(), "pass": inputPassword.getString().trim()};
            //     var params = {"name": inputUsername.getString().trim(), "pass": inputPassword.getString().trim()};
            //     request.send(JSON.stringify(params));
            // }
            // catch (ex) {
            //     console.log("tuandv = " + ex);
            // } 
        })

        registerBtn.addClickEventListener( function() {
            cc.director.runScene(new RegisterScene());
        })

        forgotBtn.addClickEventListener( function() {
            cc.director.runScene(new ForgotScene());
        })
    }
})

var LoginScene = cc.Scene.extend({

    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new LoginLayer();
        this.addChild(layer);
    }
});