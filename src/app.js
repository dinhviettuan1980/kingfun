/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


 var HelloWorldLayer = cc.Layer.extend({
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

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var statusLabel = new cc.LabelTTF("Bạn đã sẵn sàng?", "Arial", 50);
        // position the label on the center of the screen
        statusLabel.x = size.width / 2;
        statusLabel.y = size.height / 2;
        statusLabel.setVisible(false);
        // add the label as a child to this layer
        this.addChild(statusLabel, 6);   

        var bg = this._bg = new cc.Sprite("res/table.png")
        bg.scale = 0.7; //ratioAssetScale(this.getContentSize());
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

//===================================================================        
        // init param for game 
        this.cardList = new Array();
        this.cardList = initCards(this.cardList);

        this.playerList = new Array();
        this.playerList = initPlayers(this.playerList);
        this.playerList = randomPlayers(this.playerList);
        cc.log("playerList ====" + this.playerList[0].name + "  " + this.playerList[1].name + "  " + this.playerList[2].name + "  " );

        this.bet_amount = Math.round(cc.sys.localStorage.getItem("bet_amount"));
        var random012 = Math.floor(Math.random() * 3);
        this.player1 = this.playerList[0]; //new Player("0", "King", []);
        this.player1.id = 0;
        this.player1.isEnable = true;
        this.player2 = this.playerList[1]; // new Player("2", "Queen", []);
        this.player2.id = 2;
        this.player3 = this.playerList[2]; // new Player("3", "Baby", []);
        this.player3.id = 3;

        // random012 = 2;
        if (random012 == 0) {
            this.player2.isEnable = false;
            this.player3.isEnable = false;
        }
        else if (random012 == 1) {
            this.player2.isEnable = true;
            this.player3.isEnable = false;
        }
        else {
            this.player2.isEnable = true;
            this.player3.isEnable = true;
        }

        this.me = new Player("1", cc.sys.localStorage.getItem("inputUsername"), [], true);

        this.firstLoad = 1;

        var tableSprite = new cc.Sprite("res/icon_free_gold.png");
        tableSprite.attr({
            x: size.width / 2 - 610,
            y: size.height / 2 + 280
        });
        tableSprite.setScale(1);
        tableSprite.setVisible(true);
        this.addChild(tableSprite, 1);

        var tableLabel = new cc.LabelTTF(this.bet_amount, "Arial", 40);
        // position the label on the center of the screen
        tableLabel.x = size.width / 2 - 550;
        tableLabel.y = size.height / 2 + 280;
        tableLabel.setVisible(true);
        // add the label as a child to this layer
        this.addChild(tableLabel, 6);   

//===================================================================
        this.PlayerSprite11 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite11.attr({
            x: size.width / 2,
            y: size.height / 2 + 160
        });
        this.PlayerSprite11.setScale(0.1);
        this.PlayerSprite11.setVisible(false);
        this.PlayerSprite11.setRotation(-20.0);
        this.addChild(this.PlayerSprite11, 0);

        this.PlayerSprite12 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite12.attr({
            x: size.width / 2 + 20,
            y: size.height / 2 + 160
        });
        this.PlayerSprite12.setScale(0.1);
        this.PlayerSprite12.setVisible(false);
        this.addChild(this.PlayerSprite12, 0);

        this.PlayerSprite13 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite13.attr({
            x: size.width / 2 + 40,
            y: size.height / 2 + 160
        });
        this.PlayerSprite13.setScale(0.1);
        this.PlayerSprite13.setVisible(false);
        this.PlayerSprite13.setRotation(20.0);
        this.addChild(this.PlayerSprite13, 0);

        this.PlayerAvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.PlayerAvatarWinSprite1.attr({
            x: size.width / 2 - 50,
            y: size.height / 2 + 280
        });
        this.PlayerAvatarWinSprite1.setScale(0.3);
        this.PlayerAvatarWinSprite1.setVisible(false);
        this.addChild(this.PlayerAvatarWinSprite1, 1);
//===================================================================
        this.PlayerSprite21 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite21.attr({
            x: size.width / 2 - 400,
            y: size.height / 2
        });
        this.PlayerSprite21.setScale(0.1);
        this.PlayerSprite21.setVisible(false);
        this.PlayerSprite21.setRotation(-20.0);
        this.addChild(this.PlayerSprite21, 0);

        this.PlayerSprite22 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite22.attr({
            x: size.width / 2 - 380,
            y: size.height / 2
        });
        this.PlayerSprite22.setScale(0.1);
        this.PlayerSprite22.setVisible(false);
        this.addChild(this.PlayerSprite22, 0);

        this.PlayerSprite23 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite23.attr({
            x: size.width / 2 - 360,
            y: size.height / 2
        });
        this.PlayerSprite23.setScale(0.1);
        this.PlayerSprite23.setVisible(false);
        this.PlayerSprite23.setRotation(20.0);
        this.addChild(this.PlayerSprite23, 0);

        this.Player2AvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.Player2AvatarWinSprite1.attr({
            x: size.width / 2 - 450,
            y: size.height / 2 + 120
        });
        this.Player2AvatarWinSprite1.setScale(0.3);
        this.Player2AvatarWinSprite1.setVisible(false);
        this.addChild(this.Player2AvatarWinSprite1, 1);
//===================================================================
        this.PlayerSprite31 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite31.attr({
            x: size.width / 2 + 400,
            y: size.height / 2
        });
        this.PlayerSprite31.setScale(0.1);
        this.PlayerSprite31.setVisible(false);
        this.PlayerSprite31.setRotation(-20.0);
        this.addChild(this.PlayerSprite31, 0);

        this.PlayerSprite32 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite32.attr({
            x: size.width / 2 + 420,
            y: size.height / 2
        });
        this.PlayerSprite32.setScale(0.1);
        this.PlayerSprite32.setVisible(false);
        this.addChild(this.PlayerSprite32, 0);

        this.PlayerSprite33 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite33.attr({
            x: size.width / 2 + 440,
            y: size.height / 2
        });
        this.PlayerSprite33.setScale(0.1);
        this.PlayerSprite33.setVisible(false);
        this.PlayerSprite33.setRotation(20.0);
        this.addChild(this.PlayerSprite33, 0);

        this.Player3AvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.Player3AvatarWinSprite1.attr({
            x: size.width / 2 + 340,
            y: size.height / 2 + 120
        });
        this.Player3AvatarWinSprite1.setScale(0.3);
        this.Player3AvatarWinSprite1.setVisible(false);
        this.addChild(this.Player3AvatarWinSprite1, 1);
//=========================================================================
        var meLabel = new cc.LabelTTF(this.me.name, "Arial", 38);
        // position the label on the center of the screen
        var space = 0;
        if (this.me.name.length > 5) {
            space = 10 * (this.me.name.length - 5);
        }
        meLabel.x = size.width / 2 + space + 100;
        meLabel.y = size.height / 2 - 250;
        meLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        // add the label as a child to this layer
        this.addChild(meLabel, 6);       
        
        var meAmountLabel = new cc.LabelTTF(this.me.wallet_money, "Arial", 20);
        // position the label on the center of the screen
        meAmountLabel.x = size.width / 2 + 100;
        meAmountLabel.y = size.height / 2 - 300;
        // add the label as a child to this layer
        this.addChild(meAmountLabel, 5);

        this.MeAvatarSprite1 = new cc.Sprite(randomAvatar(true));
        this.MeAvatarSprite1.attr({
            x: size.width / 2,
            y: size.height / 2 - 280
        });
        this.MeAvatarSprite1.setScale(0.38);
        this.addChild(this.MeAvatarSprite1, 0);

        this.MeAvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.MeAvatarWinSprite1.attr({
            x: size.width / 2 - 50,
            y: size.height / 2 - 280
        });
        this.MeAvatarWinSprite1.setScale(0.3);
        this.MeAvatarWinSprite1.setVisible(false);
        this.addChild(this.MeAvatarWinSprite1, 1);
         //=========================================================

        this.MeSprite1 = new cc.Sprite(res.BackCard_png);
        this.MeSprite1.attr({
            x: size.width / 2,
            y: size.height / 2 - 150
        });
        this.MeSprite1.setScale(0.1);
        this.MeSprite1.setVisible(false);
        this.MeSprite1.setRotation(-20.0);
        this.addChild(this.MeSprite1, 0);

        this.MeSprite2 = new cc.Sprite(res.BackCard_png);
        this.MeSprite2.attr({
            x: size.width / 2 + 20,
            y: size.height / 2 - 150
        });
        this.MeSprite2.setScale(0.1);
        this.MeSprite2.setVisible(false);
        this.addChild(this.MeSprite2, 0);

        this.MeSprite3 = new cc.Sprite(res.BackCard_png);
        this.MeSprite3.attr({
            x: size.width / 2 + 40,
            y: size.height / 2 - 150
        });
        this.MeSprite3.setScale(0.1);
        this.MeSprite3.setVisible(false);
        this.MeSprite3.setRotation(20.0);
        this.addChild(this.MeSprite3, 0);

        meAmountLabel.setString(this.me.wallet_money);

        var flipBtn = new ccui.Button("res/btn_register_normal.png","","");
        flipBtn.x = size.width / 2 + 350
        flipBtn.y = size.height / 2 - 280;
        flipBtn.scale = 1;
        flipBtn.setZoomScale(-0.05);
        //flipBtn.setPressedActionEnabled(true);
        flipBtn.setTitleFontSize(30);
        flipBtn.setTitleText("Lật bài");
        flipBtn.setVisible(false);
 
        this.addChild(flipBtn, 7);
 
        flipBtn.addClickEventListener( function() {
            console.log("flip!");
            this.MeSprite1.setTexture("res/" + this.me.cards[0]._name + ".png");
            this.MeSprite2.setTexture("res/" + this.me.cards[1]._name + ".png");
            this.MeSprite3.setTexture("res/" + this.me.cards[2]._name + ".png");
        }.bind(this));

        var startBtn = new ccui.Button(res.Start_png,'','');
        startBtn.scale = 1;
        startBtn.setZoomScale(-0.05);
        //startBtn.setPressedActionEnabled(true);
        startBtn.x = size.width / 2 + 50;
        startBtn.y = size.height / 2;

        this.addChild(startBtn, 7);

        this.isPlaying = false;

        startBtn.addClickEventListener( function() {
            console.log("start!");
            startBtn.setVisible(false);
            flipBtn.setVisible(false);

            if (this.me.wallet_money <= 0) {
                statusLabel.setVisible(true);
                statusLabel.setString("Bạn đã hết tiền!");
                return;
            }

            this.isPlaying = true;

            // init cards
            if (this.player1.isEnable) {
                console.log("tuandv 1");
                this.PlayerSprite11.setTexture("res/backcard.png");
                console.log("tuandv 2");
                this.PlayerSprite12.setTexture("res/backcard.png");
                this.PlayerSprite13.setTexture("res/backcard.png");
            }
            this.MeSprite1.setTexture("res/backcard.png");
            this.MeSprite2.setTexture("res/backcard.png");
            this.MeSprite3.setTexture("res/backcard.png");
            if (this.player2.isEnable) {
                this.PlayerSprite21.setTexture("res/backcard.png");
                this.PlayerSprite22.setTexture("res/backcard.png");
                this.PlayerSprite23.setTexture("res/backcard.png");
            }

            if (this.player3.isEnable) {
                this.PlayerSprite31.setTexture("res/backcard.png");
                this.PlayerSprite32.setTexture("res/backcard.png");
                this.PlayerSprite33.setTexture("res/backcard.png");
            }

            if (this.player1.isEnable) {
                console.log("tuandv 3");
                this.PlayerSprite11.setVisible(false);
                this.PlayerSprite12.setVisible(false);
                this.PlayerSprite13.setVisible(false);
                console.log("tuandv 4");
            }
            this.MeSprite1.setVisible(false);
            this.MeSprite2.setVisible(false);
            this.MeSprite3.setVisible(false);
            if (this.player2.isEnable) {
                this.PlayerSprite21.setVisible(false);
                this.PlayerSprite22.setVisible(false);
                this.PlayerSprite23.setVisible(false);
            }
            if (this.player3.isEnable) {
                this.PlayerSprite31.setVisible(false);
                this.PlayerSprite32.setVisible(false);
                this.PlayerSprite33.setVisible(false);
            }

            if (this.player1.isEnable) {
                console.log("tuandv 5");
                this.PlayerAvatarWinSprite1.setVisible(false);
                console.log("tuandv 6");
            }
            if (this.player2.isEnable) {
                this.Player2AvatarWinSprite1.setVisible(false);
            }
            if (this.player3.isEnable) {
                this.Player3AvatarWinSprite1.setVisible(false);
            }
            this.MeAvatarWinSprite1.setVisible(false);

            statusLabel.setVisible(true);
            statusLabel.setString("Đợi người chơi...");

            // shuffle cards
            console.log("tuandv: shuffle cards");
            this.cardList = shuffle(this.cardList);

            for (var i = 0; i < this.cardList.length; i++) {
                this.cardList[i].toString();
            }

            this.me.clear();
            this.player1.clear();
            this.player2.clear();
            this.player3.clear();

            // deal cards
            for (var i = 0; i < 12; i++) {
                if (i % 4 == 0) {
                    this.me.addCard(this.cardList[i])
                }
                if (i % 4 == 1) {
                    this.player2.addCard(this.cardList[i])
                }
                if (i % 4 == 2) {
                    this.player1.addCard(this.cardList[i])
                }
                if (i % 4 == 3) {
                    this.player3.addCard(this.cardList[i])
                }
            }

            var thiz = this;

            this.runAction(cc.sequence(
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    if (thiz.firstLoad == 1) {
                        statusLabel.setVisible(true);
                    }
                    else {
                        statusLabel.setVisible(false);
                    }
                    
                    statusLabel.setString(10);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(9);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(8);

                    if (thiz.player1.isEnable && (thiz.firstLoad == 1)) {
                        var player1Label = new cc.LabelTTF(thiz.player1.name, "Arial", 38);
                        // position the label on the center of the screen
                        player1Label.x = size.width / 2 + 100;
                        player1Label.y = size.height / 2 + 300;
                        // add the label as a child to this layer
                        thiz.addChild(player1Label, 5);
            
                        thiz.player1AmountLabel = new cc.LabelTTF(thiz.player1.wallet_money, "Arial", 20);
                        // position the label on the center of the screen
                        thiz.player1AmountLabel.x = size.width / 2 + 100;
                        thiz.player1AmountLabel.y = size.height / 2 + 250;
                        // add the label as a child to this layer
                        thiz.addChild(thiz.player1AmountLabel, 5);
            
                        thiz.PlayerAvatarSprite1 = new cc.Sprite(randomAvatar(thiz.player1.isEnable));
                        thiz.PlayerAvatarSprite1.attr({
                            x: size.width / 2,
                            y: size.height / 2 + 280
                        });
                        thiz.PlayerAvatarSprite1.setScale(0.38);
                        thiz.addChild(thiz.PlayerAvatarSprite1, 0);
                    }                    
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(7);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(6);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(5);

                    if (thiz.player2.isEnable && (thiz.firstLoad == 1)) {
                        var player2Label = new cc.LabelTTF(thiz.player2.name, "Arial", 38);
                        // position the label on the center of the screen
                        player2Label.x = size.width / 2 - 300;
                        player2Label.y = size.height / 2 + 130;
                        // add the label as a child to this layer
                        thiz.addChild(player2Label, 5);
            
                        thiz.player2AmountLabel = new cc.LabelTTF(thiz.player2.wallet_money, "Arial", 20);
                        // position the label on the center of the screen
                        thiz.player2AmountLabel.x = size.width / 2 - 300;
                        thiz.player2AmountLabel.y = size.height / 2 + 90;
                        // add the label as a child to this layer
                        thiz.addChild(thiz.player2AmountLabel, 5);      
                        
                        thiz.Player2AvatarSprite1 = new cc.Sprite(randomAvatar(thiz.player2.isEnable));
                        thiz.Player2AvatarSprite1.attr({
                            x: size.width / 2 -400,
                            y: size.height / 2 + 120
                        });
                        thiz.Player2AvatarSprite1.setScale(0.38);
                        thiz.addChild(thiz.Player2AvatarSprite1, 0);
            
                    }
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(4);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(3);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(2);

                    if (thiz.player3.isEnable) {
                        var player3Label = new cc.LabelTTF(thiz.player3.name, "Arial", 38);
                        // position the label on the center of the screen
                        player3Label.x = size.width / 2 + 500;
                        player3Label.y = size.height / 2 + 130;
                        // add the label as a child to this layer
                        thiz.addChild(player3Label, 5);
            
                        thiz.player3AmountLabel = new cc.LabelTTF(thiz.player3.wallet_money, "Arial", 20);
                        // position the label on the center of the screen
                        thiz.player3AmountLabel.x = size.width / 2 + 500;
                        thiz.player3AmountLabel.y = size.height / 2 + 90;
                        // add the label as a child to this layer
                        thiz.addChild(thiz.player3AmountLabel, 5);     
            
                        thiz.Player3AvatarSprite1 = new cc.Sprite(randomAvatar(thiz.player3.isEnable));
                        thiz.Player3AvatarSprite1.attr({
                            x: size.width / 2 + 400,
                            y: size.height / 2 + 120
                        });
                        thiz.Player3AvatarSprite1.setScale(0.38);
                        thiz.addChild(thiz.Player3AvatarSprite1, 0);
                    }
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    statusLabel.setString(1);
                }),
                cc.delayTime(1 * thiz.firstLoad), 
                cc.callFunc(function() {
                    thiz.firstLoad = 0;
                    statusLabel.setVisible(true);
                    statusLabel.setString("Chia bài...");
                }),
                cc.delayTime(1),
                cc.callFunc(function() {
                    thiz.MeSprite1.setVisible(true);
                }),
                cc.delayTime(1),
                cc.callFunc(function() {
                    if (thiz.player3.isEnable) {
                        thiz.PlayerSprite31.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player1.isEnable) {
                        thiz.PlayerSprite11.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player2.isEnable) {
                        thiz.PlayerSprite21.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    thiz.MeSprite2.setVisible(true);
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player3.isEnable) {
                        thiz.PlayerSprite32.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player1.isEnable) {
                        thiz.PlayerSprite12.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player2.isEnable) {
                        thiz.PlayerSprite22.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    thiz.MeSprite3.setVisible(true);
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player3.isEnable) {
                        thiz.PlayerSprite33.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player1.isEnable) {
                        thiz.PlayerSprite13.setVisible(true);
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function() {
                    if (thiz.player2.isEnable) {
                        thiz.PlayerSprite23.setVisible(true);
                    }
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setVisible(true);
                    statusLabel.setString(10);
                    flipBtn.setVisible(true);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(9);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(8);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(7);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(6);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(5);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(4);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(3);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(2);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(1);
                }),
                cc.delayTime(1), 
                cc.callFunc(function() {
                    statusLabel.setString(0);
                }),
                cc.callFunc(function() {
                    if (thiz.player1.isEnable) {
                        thiz.PlayerSprite11.setTexture("res/" + thiz.player1.cards[0]._name + ".png");
                        thiz.PlayerSprite12.setTexture("res/" + thiz.player1.cards[1]._name + ".png");
                        thiz.PlayerSprite13.setTexture("res/" + thiz.player1.cards[2]._name + ".png");
                    }

                    if (thiz.player2.isEnable) {
                        thiz.PlayerSprite21.setTexture("res/" + thiz.player2.cards[0]._name + ".png");
                        thiz.PlayerSprite22.setTexture("res/" + thiz.player2.cards[1]._name + ".png");
                        thiz.PlayerSprite23.setTexture("res/" + thiz.player2.cards[2]._name + ".png");
                    }

                    if (thiz.player3.isEnable) {
                        thiz.PlayerSprite31.setTexture("res/" + thiz.player3.cards[0]._name + ".png");
                        thiz.PlayerSprite32.setTexture("res/" + thiz.player3.cards[1]._name + ".png");
                        thiz.PlayerSprite33.setTexture("res/" + thiz.player3.cards[2]._name + ".png");
                    }
        
                    thiz.MeSprite1.setTexture("res/" + thiz.me.cards[0]._name + ".png");
                    thiz.MeSprite2.setTexture("res/" + thiz.me.cards[1]._name + ".png");
                    thiz.MeSprite3.setTexture("res/" + thiz.me.cards[2]._name + ".png");
                }),
                cc.delayTime(2),
                cc.callFunc(function() {
                    // who win?
                    thiz.me.calculate();
                    thiz.player1.calculate();
                    thiz.player2.calculate();
                    thiz.player3.calculate();

                    var win = who_win(thiz.me, thiz.player1);
                    console.log("tuandv: winner 1 is: " + win.name);
                    win = who_win(win, thiz.player2);
                    console.log("tuandv: winner 2 is: " + win.name);
                    win = who_win(win, thiz.player3);

                    console.log("tuandv: winner 3 is: " + win.name);

                    var numPlaying = 0;
                    if (thiz.player1.isEnable) numPlaying++;
                    if (thiz.player2.isEnable) numPlaying++;
                    if (thiz.player3.isEnable) numPlaying++;
                    console.log("tuandv: numPlaying: " + numPlaying);
                    console.log("tuandv: bet_amount: " + thiz.bet_amount);
                    // update wallet
                    if (thiz.me == win) {
                        thiz.me.addBudget(thiz.bet_amount * numPlaying);
                        thiz.player1.minusBudget(thiz.bet_amount);
                        thiz.player2.minusBudget(thiz.bet_amount);
                        thiz.player3.minusBudget(thiz.bet_amount);
                        thiz.MeAvatarWinSprite1.setVisible(true);
                    } else if (thiz.player1 == win) {
                        thiz.player1.addBudget(thiz.bet_amount * numPlaying);
                        thiz.me.minusBudget(thiz.bet_amount);
                        thiz.player2.minusBudget(thiz.bet_amount);
                        thiz.player3.minusBudget(thiz.bet_amount);
                        thiz.PlayerAvatarWinSprite1.setVisible(true);
                    } else if (thiz.player2 == win) {
                        thiz.player2.addBudget(thiz.bet_amount * numPlaying);
                        thiz.me.minusBudget(thiz.bet_amount);
                        thiz.player1.minusBudget(thiz.bet_amount);
                        thiz.player3.minusBudget(thiz.bet_amount);
                        thiz.Player2AvatarWinSprite1.setVisible(true);
                    } else if (thiz.player3 == win) {
                        thiz.player3.addBudget(thiz.bet_amount * numPlaying);
                        thiz.me.minusBudget(thiz.bet_amount);
                        thiz.player1.minusBudget(thiz.bet_amount);
                        thiz.player2.minusBudget(thiz.bet_amount);
                        if (thiz.player3.isEnable) {
                            thiz.Player3AvatarWinSprite1.setVisible(true);
                        }
                    }

                    console.log("tuandv: show result ");

                    if (thiz.player1.isEnable) {
                        thiz.player1AmountLabel.setString(thiz.player1.wallet_money);
                    }
                    console.log("tuandv: show result 0.1");
                    meAmountLabel.setString(thiz.me.wallet_money);
                    if (thiz.player2.isEnable) {
                        thiz.player2AmountLabel.setString(thiz.player2.wallet_money);
                    }
                    console.log("tuandv: show result 0.2");
                    if (thiz.player3.isEnable) {
                        thiz.player3AmountLabel.setString(thiz.player3.wallet_money);
                    }

                    statusLabel.setVisible(true);
                    console.log("tuandv: show result 0");
                    statusLabel.setString(win.name + " thắng " + (thiz.bet_amount * numPlaying));

                    console.log("tuandv: show result 1");

                    cc.sys.localStorage.setItem(thiz.player1.name + "_wallet", thiz.player1.wallet_money);
                    cc.sys.localStorage.setItem(thiz.me.name + "_wallet", thiz.me.wallet_money);
                    cc.sys.localStorage.setItem(thiz.player2.name + "_wallet", thiz.player2.wallet_money);
                    cc.sys.localStorage.setItem(thiz.player3.name + "_wallet", thiz.player3.wallet_money);

                    console.log("tuandv: show result 2");

                    thiz.isPlaying = false;
                }),
                cc.delayTime(4),
                cc.callFunc(function() {
                    startBtn.setVisible(true);
                    statusLabel.setVisible(false);
                })
            ));
       }.bind(this));


       var backBtn = new ccui.Button(res.Back_png,'','');
       backBtn.x = size.width / 2 + 600
       backBtn.y = size.height / 2 + 270;
       backBtn.scale = 1;
       backBtn.setZoomScale(-0.05);

       this.addChild(backBtn, 7);

       backBtn.addClickEventListener( function() {
           console.log("back!");
           console.log("tuandv: isPlaying " + !startBtn.isVisible());

            if (!startBtn.isVisible()) {
                console.log("tuandv: back when playing");
                this.me.minusBudget(this.bet_amount);
                cc.sys.localStorage.setItem(this.me.name + "_wallet", this.me.wallet_money);
                console.log("tuandv: wallet: " + this.me.wallet_money);
            }

           cc.director.runScene(new LobbyScene());
        }.bind(this));

        console.log("loaded");


        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var Card = cc.Class.extend({
    _id: null,
    _rank: null, // 0,1,2,...,9
    _suit: null, // do, co, tep, bich
    _name: null, // hai_do, ba_bich,....

    ctor: function(id, rank, suit, name) {
        // assignment
        this._id = id;
        this._rank = rank;
        this._suit = suit;
        this._name = name;
    },

    toString: function() {
        console.log(this._id + " " + this._rank + " " + this._suit + " " + this._name);
    },

});

var Player = cc.Class.extend({
    id: null,
    name: null,
    cards: null,
    total_points: null,
    highest_card_value: null,
    wallet_money: null,
    isEnable: true,

    ctor: function(id, name, cards, isEnable) {
        // assignment
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.total_points = 0;
        this.highest_card_value = 100; // too small
        this.wallet_money = 4000 + Math.floor(Math.random() * 3000);

        if (!isEnable) isEnable = false; 
        this.isEnable = isEnable;

        if (cc.sys.localStorage.getItem(name + "_wallet")) {
            this.wallet_money = Math.round(cc.sys.localStorage.getItem(name + "_wallet"));
        }
    },

    addCard: function(c) {
        this.cards.push(c);
    },

    clear: function() {
        this.cards = [];
        this.total_points = 0;
        this.highest_card_value = 100; // too small
    },

    calculate: function() {
        for (var i = 0; i < this.cards.length; i++) {
            this.total_points += this.cards[i]._rank;
            if ( this.cards[i]._id < this.highest_card_value) {
                this.highest_card_value = Math.round(this.cards[i]._id);
            }
        }
        
        this.total_points = this.total_points % 10;
        if (this.total_points == 0) {
         this.total_points = 10;
        }

        if (!this.isEnable) this.total_points = 0;

        console.log(this.toString());
    },

    addBudget: function(amount) {
        this.wallet_money += amount;
    },

    minusBudget: function(amount) {
        if (this.isEnable) 
            this.wallet_money -= amount;
    },

    toString: function() {
        console.log("tuandv: " +  this.id + " " + this.name + " " + this.cards[0]._rank + " " + this.cards[1]._rank + " " + this.cards[2]._rank);
        console.log("tuandv: " +  this.id + " " + this.name + " " + this.total_points + " " + this.highest_card_value);
    },
});

function initCards(cardList) {
    cardList.push(new Card(0, 1, 3, "mot_do"));
    cardList.push(new Card(8, 2, 3, "hai_do"));
    cardList.push(new Card(7, 3, 3, "ba_do"));
    cardList.push(new Card(6, 4, 3, "bon_do"));
    cardList.push(new Card(5, 5, 3, "nam_do"));
    cardList.push(new Card(4, 6, 3, "sau_do"));
    cardList.push(new Card(3, 7, 3, "bay_do"));
    cardList.push(new Card(2, 8, 3, "tam_do"));
    cardList.push(new Card(1, 9, 3, "chin_do"));

    cardList.push(new Card(9, 1, 2, "mot_co"));
    cardList.push(new Card(17, 2, 2, "hai_co"));
    cardList.push(new Card(16, 3, 2, "ba_co"));
    cardList.push(new Card(15, 4, 2, "bon_co"));
    cardList.push(new Card(14, 5, 2, "nam_co"));
    cardList.push(new Card(13, 6, 2, "sau_co"));
    cardList.push(new Card(12, 7, 2, "bay_co"));
    cardList.push(new Card(11, 8, 2, "tam_co"));
    cardList.push(new Card(10, 9, 2, "chin_co"));

    cardList.push(new Card(18, 1, 1, "mot_tep"));
    cardList.push(new Card(26, 2, 1, "hai_tep"));
    cardList.push(new Card(25, 3, 1, "ba_tep"));
    cardList.push(new Card(24, 4, 1, "bon_tep"));
    cardList.push(new Card(23, 5, 1, "nam_tep"));
    cardList.push(new Card(22, 6, 1, "sau_tep"));
    cardList.push(new Card(21, 7, 1, "bay_tep"));
    cardList.push(new Card(20, 8, 1, "tam_tep"));
    cardList.push(new Card(19, 9, 1, "chin_tep"));

    cardList.push(new Card(27, 1, 0, "mot_bich"));
    cardList.push(new Card(35, 2, 0, "hai_bich"));
    cardList.push(new Card(34, 3, 0, "ba_bich"));
    cardList.push(new Card(33, 4, 0, "bon_bich"));
    cardList.push(new Card(32, 5, 0, "nam_bich"));
    cardList.push(new Card(31, 6, 0, "sau_bich"));
    cardList.push(new Card(30, 7, 0, "bay_bich"));
    cardList.push(new Card(29, 8, 0, "tam_bich"));
    cardList.push(new Card(28, 9, 0, "chin_bich"));

    return cardList;
}

function initPlayers(playerList) {
    playerList.push(new Player(0, "King", []));
    playerList.push(new Player(1, "Queen", []));
    playerList.push(new Player(2, "Baby", []));
    playerList.push(new Player(3, "Tuan", []));
    playerList.push(new Player(4, "Toan", []));
    playerList.push(new Player(5, "Tung", []));
    playerList.push(new Player(6, "Nga", []));
    playerList.push(new Player(7, "Muoi", []));
    playerList.push(new Player(8, "Van", []));
    playerList.push(new Player(9, "Huong", []));
    playerList.push(new Player(10, "PhapSu", []));
    playerList.push(new Player(11, "Bin", []));
    playerList.push(new Player(12, "Bong", []));
    playerList.push(new Player(13, "Ben", []));
    playerList.push(new Player(14, "Vau", []));
    playerList.push(new Player(15, "Giau", []));
    playerList.push(new Player(16, "Huy", []));
    playerList.push(new Player(17, "Trung", []));
    playerList.push(new Player(18, "Romeo", []));
    playerList.push(new Player(19, "Juliet", []));
    playerList.push(new Player(20, "Papa", []));
    playerList.push(new Player(21, "Cong", []));
    playerList.push(new Player(22, "David", []));
    playerList.push(new Player(23, "Tony", []));
    playerList.push(new Player(24, "Hien", []));
    playerList.push(new Player(25, "Hang", []));
    playerList.push(new Player(26, "Linh", []));
    playerList.push(new Player(27, "Beer", []));
    playerList.push(new Player(28, "Alcoho", []));
    playerList.push(new Player(29, "Tequila", []));

    return playerList;
}

function randomPlayers(playerList) {

    // var num = Math.floor(Math.random() * 3) + 1;

    // get 3 in the list 30 players
    var shuffled = shuffle(playerList);
    playerList = shuffled.slice(0,3);

    return playerList;
}

function randomAvatar(isEnable) {
    if (!isEnable) return "res/ava_00.png";

    var arr = new Array();
    arr.push("ava_01");
    arr.push("ava_02");
    arr.push("ava_03");
    arr.push("ava_04");
    arr.push("ava_05");
    arr.push("ava_06");
    arr.push("ava_07");
    arr.push("ava_08");
    arr.push("ava_09");
    arr.push("ava_10");
    arr.push("ava_11");
    arr.push("ava_12");
    arr.push("ava_13");
    arr.push("ava_14");

    arr = shuffle(arr);

    return "res/" + arr[0] + ".png";
}

function shuffle (arr) {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
};

function who_win(me, player1) {
    console.log("tuandv: compare " + me.total_points + " and " + player1.total_points);
    if (me.total_points > player1.total_points) {
        return me;
    }
    else if (me.total_points < player1.total_points) {
        return player1;
    }
    else {
        if (me.highest_card_value < player1.highest_card_value) {
            return me;
        }
        else {
            return player1;
        }
    }
}

function getHighestRankCard(c1, c2) {
    if (c1._rank > c2._rank) {
        return c1;
    }
    if (c1._rank < c2._rank) {
        return c2;
    }
    if (c1._rank == c2._rank) {
        if (c1._suit < c2._suit) {
            return c1;
        }
        else {
            return c2;
        }
    }
}

function delay(time) {
}

var LobbyLayer = cc.Layer.extend({
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

        var bg = this._bg = new cc.Sprite("res/LoginBng.png")
        bg.scale = 1.1; //ratioAssetScale(this.getContentSize());
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);


        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var statusLabel = new cc.LabelTTF("Xin chào " +  cc.sys.localStorage.getItem("inputUsername") + ", mời bạn chọn bàn!", "Arial", 48);
        // position the label on the center of the screen
        statusLabel.x = size.width / 2 + 200;
        statusLabel.y = size.height / 2 + 180;
        // add the label as a child to this layer
        this.addChild(statusLabel, 6);   
        
        var btn1= createBtn("50");
        btn1.setPosition(size.width / 2 + 100, size.height / 2 + 50);
        this.addChild(btn1, 7);

        btn1.addClickEventListener( function() {
            console.log("start!");
            cc.sys.localStorage.setItem("bet_amount", 50);
            cc.director.runScene(new HelloWorldScene());
        })        

        var btn2= createBtn("100");
        this.addChild(btn2, 7);
        
        btn2.setPosition(size.width / 2 + 400, size.height / 2 + 50);
        btn2.addClickEventListener( function() {
            console.log("start!");
            cc.sys.localStorage.setItem("bet_amount", 100);
            cc.director.runScene(new HelloWorldScene());
        })   
        
        var btn3= createBtn("200");
        btn3.setPosition(size.width / 2 + 100, size.height / 2 - 150);
        this.addChild(btn3, 7);
        btn3.addClickEventListener( function() {
            console.log("start!");
            cc.sys.localStorage.setItem("bet_amount", 200);
            cc.director.runScene(new HelloWorldScene());
        })        

        var btn4= createBtn("500");
        btn4.setPosition(size.width / 2 + 400, size.height / 2 - 150);
        this.addChild(btn4, 7);

        btn4.addClickEventListener( function() {
            console.log("start!");
            cc.sys.localStorage.setItem("bet_amount", 500);
            cc.director.runScene(new HelloWorldScene());
        })   

        var backBtn = new ccui.Button(res.Back_png,"","");
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        
        this.addChild(backBtn, 7);

        backBtn.addClickEventListener( function() {
            console.log("start!");
            cc.director.runScene(new LoginScene());
        })

        var helpBtn = new ccui.Button(res.Help_png,"","");
        helpBtn.x = size.width / 2 + 500;
        helpBtn.y = size.height / 2 + 270;
        helpBtn.scale = 1.5;
        helpBtn.setZoomScale(-0.05);
        
        this.addChild(helpBtn, 7);

        helpBtn.addClickEventListener( function() {
            console.log("help!");
            cc.director.runScene(new HelpScene());
        })

        function createBtn(title){
            var btn4 = new ccui.Button("res/btn_register_normal.png","","");
            btn4.setScale9Enabled(true);
            btn4.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
            btn4.setTitleText(title);
            btn4.setTitleFontSize(30);
            btn4.scale = 1.5;
            btn4.setZoomScale(-0.05);
            return btn4;
        }
    }
})

var LobbyScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new LobbyLayer();
        this.addChild(layer);
    }
});

var RegisterLayer = cc.Layer.extend({
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
        
        var inputUsername = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputUsername.x = size.width / 2 + 100;
        inputUsername.y = size.height / 2 + 200;
        inputUsername.color = new cc.Color(100,200,0,0);
        inputUsername.placeholder = "Tên đăng nhập";
        this.addChild(inputUsername, 6);  

        var inputPassword = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputPassword.x = size.width / 2 + 100;
        inputPassword.y = size.height / 2 + 100;
        inputPassword.color = new cc.Color(100,200,0,0);
        inputPassword.placeholder = "Mật khẩu";
        this.addChild(inputPassword, 6);  

        var inputPasswordConfirm = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        inputPasswordConfirm.x = size.width / 2 + 100;
        inputPasswordConfirm.y = size.height / 2;
        inputPasswordConfirm.color = new cc.Color(100,200,0,0);
        inputPasswordConfirm.placeholder = "Nhập lại mật khẩu";
        this.addChild(inputPasswordConfirm, 6);  

        var email = new cc.EditBox(cc.size(200, 50), new ccui.Scale9Sprite());
        email.x = size.width / 2 + 100;
        email.y = size.height / 2 - 100;
        email.color = new cc.Color(100,200,0,0);
        email.placeholder = "email";
        this.addChild(email, 6);  

        var backBtn = new ccui.Button();
        backBtn.loadTextures(res.Back_png, res.Back_png);
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;

        this.addChild(backBtn, 7);

        backBtn.addClickEventListener( function() {
            cc.director.runScene(new LoginScene());
        })

        var registerBtn = new ccui.Button();
        registerBtn.loadTextures(res.Register_png, res.Register_png);
        registerBtn.x = size.width / 2 + 100;
        registerBtn.y = size.height / 2 - 200;
        registerBtn.scale = 1.2;

        this.addChild(registerBtn, 7);        

        registerBtn.addClickEventListener( function() {
            // try to call a post method
            var request = cc.loader.getXMLHttpRequest();
            // request.open("POST", "http://103.61.123.106:8002/entity/users/register", true);
            request.open("POST", "http://103.61.123.106:8001/api/register", true);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            request.onload = function () {
                if (request.readyState == 4) {

                    statusLabel.setString(request.responseText);
                    
                    var obj = JSON.parse(request.responseText);
                    if (obj.name != '' && obj.name != 'undefined' && obj.name != null) {
                        cc.director.runScene(new LoginScene());
                    }
                    else {
                        statusLabel.setVisible(true);
                    }
                    
                }
            };
            var params = {"name": inputUsername.getString().trim(), "pass": inputPassword.getString().trim(), "email": inputPassword.getString().trim()};
            request.send(JSON.stringify(params));
        })
    }
})

var RegisterScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new RegisterLayer();
        this.addChild(layer);
    }
});


var HelpLayer = cc.Layer.extend({
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

        var bg = this._bg = new cc.Sprite("res/textbg.png")
        bg.scale = 1.1; //ratioAssetScale(this.getContentSize());
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);


        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var source = "Bài cào hay còn gọi là ba cây là một kiểu chơi bài bằng một bộ bài tây. Có thể nói, đây là một trong những cách chơi đánh bài dân gian đơn giản nhất, nhanh nhất và phụ thuộc hoàn toàn vào yếu tố may rủi. Với 52 lá bài trong một bộ bài (bỏ 10,J,Q,K) và mỗi người được chia 3 lá, một ván bài cào có thể có từ 2 đến 9 người chơi cùng lúc.\n" +
        "\n" +
        "Bài được một người đại diện chia cho từng người, mỗi người có ba lá. Nếu chơi cầm cái thì cái sẽ là người chia. Người chơi có thể xem bài của mình kín đáo hoặc công khai và tính điểm.\n" +
        "\n" +
        "Cách tính điểm như sau:\n" +
        "* Các lá: 2, 3, 4, 5, 6, 7, 8, 9, 1 (A) mỗi lá có số điểm tương ứng con số đó. Theo thứ tự thì cùng 1 chất lá bài sẽ có giá trí tăng dần (ví dụ: 3 Rô nhỏ hơn 4 Rô)\n" +
        "Điểm của người chơi trong mỗi ván là số lẻ của tổng điểm ba lá bài. Ví dụ, tổng ba lá là 27 điểm thì được 7 điểm (hay gọi là nút), 10 điểm thì được 10 điểm.\n"+
        "Nếu người chơi cùng điểm thì mình quan tâm đến chất của lá bài theo thứ tự là Rô - Cơ - Tép - Bích (Rô là to nhất)";

        // Tạo ScrollView và thiết lập các thuộc tính
        var scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setContentSize(cc.size(size.width * 0.8, size.height * 0.9));
        scrollView.setInnerContainerSize(cc.size(size.width * 0.8, size.height * 1.5));

         // Thiết lập hình ảnh của thanh cuộn
         scrollView.setScrollBarEnabled(true);
         scrollView.setScrollBarColor(cc.color(255, 255, 255)); // Màu trắng
         scrollView.setScrollBarWidth(5); 
         scrollView.setScrollBarPositionFromCorner(cc.p(5, 5));

        // Thiết lập vị trí của ScrollView ở trung tâm màn hình
        scrollView.setPosition(cc.p(size.width * 0.1-50, size.height * 0.1-30));

        var statusLabel = new cc.LabelTTF(source, "Arial", 32,cc.size(size.width * 0.8-50, size.height * 1.5),cc.TEXT_ALIGNMENT_LEFT);

        statusLabel.setAnchorPoint(cc.p(0, 1));
        statusLabel.setPosition(cc.p(0, scrollView.getInnerContainerSize().height));

        // Thêm label vào ScrollView
        scrollView.addChild(statusLabel);

        // Thêm ScrollView vào layer
        this.addChild(scrollView,6);

        // // add the label as a child to this layer
        // this.addChild(statusLabel, 6);   

        var backBtn = new ccui.Button(res.Back_png,"","");
        // backBtn.loadTextures(res.Back_png, res.Back_png);
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        
        this.addChild(backBtn, 7);

        backBtn.addClickEventListener( function() {
            console.log("start!");
            cc.director.runScene(new LobbyScene());
        })

    }
})

var HelpScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new HelpLayer();
        this.addChild(layer);
    }
});