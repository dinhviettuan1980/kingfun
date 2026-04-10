var ForgotLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        cc.Layer.prototype.ctor.call(this);

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var statusLabel = new cc.LabelTTF("", "Arial", 38);
        // position the label on the center of the screen
        statusLabel.x = size.width / 2 - 100;
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
        
        var inputUsername = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputUsername.x = size.width / 2 + 100;
        inputUsername.y = size.height / 2 + 100;
        inputUsername.color = new cc.Color(100,200,0,0);
        inputUsername.placeholder = "Tên đăng nhập";
        this.addChild(inputUsername, 6);  

        var backBtn = new ccui.Button();
        backBtn.loadTextures(res.Back_png, res.Back_png);
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;

        this.addChild(backBtn, 7);

        backBtn.addClickEventListener( function() {
            cc.director.runScene(new LoginScene());
        })

        var sendmailBtn = new ccui.Button();
        sendmailBtn.loadTextures(res.SendMail_png, res.SendMail_png);
        sendmailBtn.x = size.width / 2 + 100;
        sendmailBtn.y = size.height / 2;
        sendmailBtn.scale = 0.8;

        this.addChild(sendmailBtn, 7);        

        sendmailBtn.addClickEventListener( function() {
            // try to call a post method
            var request = cc.loader.getXMLHttpRequest();
            request.open("POST", "http://103.61.123.106:8002/entity/users/forgot", true);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            request.onload = function () {
                if (request.readyState == 4) {

                    statusLabel.setString(request.responseText);
                    
                    var obj = JSON.parse(request.responseText);
                    if (obj.result != '' && obj.result != 'undefined' && obj.result != null) {
                        // cc.director.runScene(new LoginScene());
                        statusLabel.setVisible(true);
                        statusLabel.setString("Bạn hãy kiểm tra email!");
                    }
                    else {
                        statusLabel.setVisible(true);
                    }
                    
                }
            };
            var params = {"name": inputUsername.getString().trim()};
            request.send(JSON.stringify(params));
        })
    }
})

var ForgotScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new ForgotLayer();
        this.addChild(layer);
    }
});
