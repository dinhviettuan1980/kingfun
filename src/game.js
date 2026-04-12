if (typeof playSound === 'undefined') {
    window.playSound = function(path, loop) { try { if (cc.audioEngine) cc.audioEngine.playEffect(path, loop || false); } catch(e) {} };
}

// Vẽ xấp xu gồm 3-5 đồng chồng lên nhau
function addCoinStack(layer, cx, cy, zOrder) {
    var count = 3 + Math.floor(Math.random() * 3); // 3-5 đồng
    for (var i = 0; i < count; i++) {
        var coin = new cc.Sprite("res/icon_free_gold.png");
        coin.setScale(0.32);
        coin.setPosition(cx + i * 5 - (count * 5) / 2, cy + i * 4);
        coin.setRotation(-8 + i * 4);
        layer.addChild(coin, (zOrder || 5) + i);
    }
}

// Vẽ border cho button — tọa độ anchor button là (0.5,0.5) nên center là (0,0)
function drawBtnBorder(btn, w, h, color) {
    var node = new cc.DrawNode();
    node.drawRect(cc.p(-w / 2, -h / 2), cc.p(w / 2, h / 2), null, 2, color);
    btn.addChild(node, 1);
}

// Popup kết quả thắng/thua
function showGamePopup(title, subtitle, isWin, onClose) {
    var size = cc.winSize;
    var overlay = new cc.LayerColor(new cc.Color(0, 0, 0, 180));
    overlay.setContentSize(size.width, size.height);

    var panelW = 560, panelH = 320;
    var panel = new cc.LayerColor(new cc.Color(15, 15, 35, 250));
    panel.setContentSize(panelW, panelH);
    panel.x = (size.width - panelW) / 2;
    panel.y = (size.height - panelH) / 2;

    // Viền panel ngoài
    var borderColor = isWin ? new cc.Color(255, 200, 0, 255) : new cc.Color(200, 60, 60, 255);
    var outerBorder = new cc.DrawNode();
    outerBorder.drawRect(cc.p(0, 0), cc.p(panelW, panelH), null, 3, borderColor);
    panel.addChild(outerBorder);

    // Đường kẻ trang trí bên trong (cách viền 5px)
    var innerBorder = new cc.DrawNode();
    innerBorder.drawRect(cc.p(8, 8), cc.p(panelW - 8, panelH - 8), null, 1,
        new cc.Color(borderColor.r, borderColor.g, borderColor.b, 80));
    panel.addChild(innerBorder);

    // Tiêu đề
    var titleLabel = new cc.LabelTTF(title, "Arial", 54);
    titleLabel.x = panelW / 2;
    titleLabel.y = panelH - 70;
    titleLabel.setColor(isWin ? new cc.Color(255, 225, 50) : new cc.Color(255, 100, 100));
    panel.addChild(titleLabel);

    // Đường kẻ ngang dưới tiêu đề
    var divider = new cc.DrawNode();
    divider.drawSegment(cc.p(30, panelH - 105), cc.p(panelW - 30, panelH - 105), 1,
        new cc.Color(borderColor.r, borderColor.g, borderColor.b, 120));
    panel.addChild(divider);

    // Số tiền
    var subLabel = new cc.LabelTTF(subtitle, "Arial", 42);
    subLabel.x = panelW / 2;
    subLabel.y = panelH / 2 + 10;
    subLabel.setColor(isWin ? new cc.Color(80, 255, 140) : new cc.Color(255, 160, 80));
    panel.addChild(subLabel);

    var btnW = 200, btnH = 65, btnGap = 24, btnY = 50;
    // 2 nút đều 2 bên: tổng chiều rộng = btnW*2 + btnGap, căn giữa panel
    var leftBtnX  = (panelW - btnW * 2 - btnGap) / 2 + btnW / 2;   // center nút trái
    var rightBtnX = leftBtnX + btnW + btnGap;                         // center nút phải

    // Nút Ván mới (xanh lá)
    var newBtn = new ccui.Button();
    newBtn.setTitleText("Ván mới");
    newBtn.setTitleFontSize(30);
    newBtn.setTitleColor(new cc.Color(255, 255, 255));
    newBtn.setContentSize(cc.size(btnW, btnH));
    newBtn.setAnchorPoint(cc.p(0.5, 0.5));
    newBtn.setPosition(leftBtnX, btnY);
    newBtn.setColor(new cc.Color(30, 120, 55));
    newBtn.setOpacity(230);
    panel.addChild(newBtn);

    // Nút Thoát (đỏ)
    var exitBtn = new ccui.Button();
    exitBtn.setTitleText("Thoát");
    exitBtn.setTitleFontSize(30);
    exitBtn.setTitleColor(new cc.Color(255, 255, 255));
    exitBtn.setContentSize(cc.size(btnW, btnH));
    exitBtn.setAnchorPoint(cc.p(0.5, 0.5));
    exitBtn.setPosition(rightBtnX, btnY);
    exitBtn.setColor(new cc.Color(150, 35, 35));
    exitBtn.setOpacity(230);
    panel.addChild(exitBtn);

    overlay.addChild(panel);

    var touchListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function() { return true; }
    });
    cc.eventManager.addListener(touchListener, overlay);

    panel.setScale(0.1);
    panel.runAction(cc.scaleTo(0.15, 1.0));

    function dismiss(cb) {
        overlay.runAction(cc.sequence(
            cc.fadeOut(0.1),
            cc.callFunc(function() {
                cc.eventManager.removeListener(touchListener);
                overlay.removeFromParent();
                if (cb) cb();
            })
        ));
    }

    newBtn.addClickEventListener(function() {
        dismiss(onClose);
    });

    exitBtn.addClickEventListener(function() {
        dismiss(function() {
            cc.director.runScene(new LobbyScene());
        });
    });

    cc.director.getRunningScene().addChild(overlay, 100);
}

// Hiệu ứng quân bài bay từ bộ bài đến vị trí người chơi
function dealCard(layer, targetSprite, deckX, deckY) {
    var flying = new cc.Sprite(res.BackCard_png);
    flying.setScale(targetSprite.scale || 0.1);
    flying.setPosition(deckX, deckY);
    layer.addChild(flying, 15);

    var tx = targetSprite.x;
    var ty = targetSprite.y;
    // Bezier cong nhẹ để trông tự nhiên
    var cp1 = cc.p(deckX + (tx - deckX) * 0.3, deckY + (ty - deckY) * 0.3 + 80);
    var cp2 = cc.p(deckX + (tx - deckX) * 0.7, deckY + (ty - deckY) * 0.7 + 40);

    flying.runAction(cc.sequence(
        cc.bezierTo(0.35, [cp1, cp2, cc.p(tx, ty)]),
        cc.callFunc(function() {
            targetSprite.setVisible(true);
            flying.removeFromParent();
        })
    ));
}

// Hiệu ứng đồng tiền bay từ fromPos về toPos, gọi onDone sau khi đồng cuối hạ cánh
function showCoinsFly(layer, fromX, fromY, toX, toY, count, onDone) {
    count = count || 8;
    var done = 0;
    for (var i = 0; i < count; i++) {
        (function(idx) {
            var coin = new cc.Sprite("res/icon_free_gold.png");
            coin.setScale(0.25 + Math.random() * 0.15);
            coin.setPosition(
                fromX + (Math.random() * 60 - 30),
                fromY + (Math.random() * 60 - 30)
            );
            layer.addChild(coin, 20);

            var midX = (fromX + toX) / 2 + (Math.random() * 160 - 80);
            var midY = Math.max(fromY, toY) + 180 + Math.random() * 100;
            var cp1 = cc.p(midX, midY);
            var cp2 = cc.p(midX + (Math.random() * 60 - 30), midY - 60);

            coin.runAction(cc.sequence(
                cc.delayTime(idx * 0.07),
                cc.spawn(
                    cc.bezierTo(0.55, [cp1, cp2, cc.p(toX, toY)]),
                    cc.rotateBy(0.55, 360 + Math.random() * 180)
                ),
                cc.scaleTo(0.12, 0),
                cc.callFunc(function() {
                    coin.removeFromParent();
                    done++;
                    if (done === count && onDone) onDone();
                })
            ));
        })(i);
    }
}

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;

        var statusLabel = new cc.LabelTTF("Bạn đã sẵn sàng?", "Arial", 50);
        statusLabel.x = size.width / 2;
        statusLabel.y = size.height / 2;
        statusLabel.setVisible(false);
        this.addChild(statusLabel, 6);

        var bg = this._bg = new cc.Sprite("res/table.png");
        bg.scale = 0.7;
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        // init game data
        this.cardList = [];
        this.cardList = initCards(this.cardList);

        this.playerList = [];
        this.playerList = initPlayers(this.playerList);
        this.playerList = randomPlayers(this.playerList);

        this.bet_amount = Math.round(cc.sys.localStorage.getItem("bet_amount"));
        var random012 = Math.floor(Math.random() * 3);
        this.player1 = this.playerList[0];
        this.player1.id = 0;
        this.player1.isEnable = true;
        this.player2 = this.playerList[1];
        this.player2.id = 2;
        this.player3 = this.playerList[2];
        this.player3.id = 3;

        if (random012 == 0) {
            this.player2.isEnable = false;
            this.player3.isEnable = false;
        } else if (random012 == 1) {
            this.player2.isEnable = true;
            this.player3.isEnable = false;
        } else {
            this.player2.isEnable = true;
            this.player3.isEnable = true;
        }

        this.me = new Player("1", cc.sys.localStorage.getItem("inputUsername"), [], true);
        this.firstLoad = 1;
        this.dealerKey = 'me'; // người đầu tiên được chia bài

        var tableSprite = new cc.Sprite("res/icon_free_gold.png");
        tableSprite.attr({ x: size.width / 2 - 610, y: size.height / 2 + 280 });
        tableSprite.setScale(1);
        tableSprite.setVisible(true);
        this.addChild(tableSprite, 1);

        var tableLabel = new cc.LabelTTF(this.bet_amount, "Arial", 40);
        tableLabel.x = size.width / 2 - 550;
        tableLabel.y = size.height / 2 + 280;
        this.addChild(tableLabel, 6);

        // Bộ bài ở giữa bàn — hiện khi chia, ẩn sau khi chia xong
        this.deckX = size.width / 2;
        this.deckY = size.height / 2 + 20;
        this.deckSprites = [];
        for (var d = 4; d >= 0; d--) {
            var dc = new cc.Sprite(res.BackCard_png);
            dc.setScale(0.12);
            dc.setPosition(this.deckX - d * 3, this.deckY + d * 3);
            dc.setRotation(-2 + d * 0.8);
            dc.setVisible(false);
            this.addChild(dc, 8 + d);
            this.deckSprites.push(dc);
        }

        // Player 1 cards (top)
        this.PlayerSprite11 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite11.attr({ x: size.width / 2, y: size.height / 2 + 160 });
        this.PlayerSprite11.setScale(0.1);
        this.PlayerSprite11.setVisible(false);
        this.PlayerSprite11.setRotation(-20.0);
        this.addChild(this.PlayerSprite11, 0);

        this.PlayerSprite12 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite12.attr({ x: size.width / 2 + 20, y: size.height / 2 + 160 });
        this.PlayerSprite12.setScale(0.1);
        this.PlayerSprite12.setVisible(false);
        this.addChild(this.PlayerSprite12, 0);

        this.PlayerSprite13 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite13.attr({ x: size.width / 2 + 40, y: size.height / 2 + 160 });
        this.PlayerSprite13.setScale(0.1);
        this.PlayerSprite13.setVisible(false);
        this.PlayerSprite13.setRotation(20.0);
        this.addChild(this.PlayerSprite13, 0);

        this.PlayerAvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.PlayerAvatarWinSprite1.attr({ x: size.width / 2 - 50, y: size.height / 2 + 280 });
        this.PlayerAvatarWinSprite1.setScale(0.3);
        this.PlayerAvatarWinSprite1.setVisible(false);
        this.addChild(this.PlayerAvatarWinSprite1, 1);

        // Player 2 cards (left)
        this.PlayerSprite21 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite21.attr({ x: size.width / 2 - 400, y: size.height / 2 });
        this.PlayerSprite21.setScale(0.1);
        this.PlayerSprite21.setVisible(false);
        this.PlayerSprite21.setRotation(-20.0);
        this.addChild(this.PlayerSprite21, 0);

        this.PlayerSprite22 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite22.attr({ x: size.width / 2 - 380, y: size.height / 2 });
        this.PlayerSprite22.setScale(0.1);
        this.PlayerSprite22.setVisible(false);
        this.addChild(this.PlayerSprite22, 0);

        this.PlayerSprite23 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite23.attr({ x: size.width / 2 - 360, y: size.height / 2 });
        this.PlayerSprite23.setScale(0.1);
        this.PlayerSprite23.setVisible(false);
        this.PlayerSprite23.setRotation(20.0);
        this.addChild(this.PlayerSprite23, 0);

        this.Player2AvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.Player2AvatarWinSprite1.attr({ x: size.width / 2 - 450, y: size.height / 2 + 120 });
        this.Player2AvatarWinSprite1.setScale(0.3);
        this.Player2AvatarWinSprite1.setVisible(false);
        this.addChild(this.Player2AvatarWinSprite1, 1);

        // Player 3 cards (right)
        this.PlayerSprite31 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite31.attr({ x: size.width / 2 + 400, y: size.height / 2 });
        this.PlayerSprite31.setScale(0.1);
        this.PlayerSprite31.setVisible(false);
        this.PlayerSprite31.setRotation(-20.0);
        this.addChild(this.PlayerSprite31, 0);

        this.PlayerSprite32 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite32.attr({ x: size.width / 2 + 420, y: size.height / 2 });
        this.PlayerSprite32.setScale(0.1);
        this.PlayerSprite32.setVisible(false);
        this.addChild(this.PlayerSprite32, 0);

        this.PlayerSprite33 = new cc.Sprite(res.BackCard_png);
        this.PlayerSprite33.attr({ x: size.width / 2 + 440, y: size.height / 2 });
        this.PlayerSprite33.setScale(0.1);
        this.PlayerSprite33.setVisible(false);
        this.PlayerSprite33.setRotation(20.0);
        this.addChild(this.PlayerSprite33, 0);

        this.Player3AvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.Player3AvatarWinSprite1.attr({ x: size.width / 2 + 340, y: size.height / 2 + 120 });
        this.Player3AvatarWinSprite1.setScale(0.3);
        this.Player3AvatarWinSprite1.setVisible(false);
        this.addChild(this.Player3AvatarWinSprite1, 1);

        // Me (bottom)
        var space = 0;
        if (this.me.name.length > 5) {
            space = 10 * (this.me.name.length - 5);
        }
        var meLabel = new cc.LabelTTF(this.me.name, "Arial", 38);
        meLabel.x = size.width / 2 + space + 100;
        meLabel.y = size.height / 2 - 250;
        meLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(meLabel, 6);

        var meAmountLabel = new cc.LabelTTF(this.me.wallet_money, "Arial", 20);
        meAmountLabel.x = size.width / 2 + 120;
        meAmountLabel.y = size.height / 2 - 300;
        this.addChild(meAmountLabel, 5);

        addCoinStack(this, size.width / 2 + 60, size.height / 2 - 300, 5);

        this.MeAvatarSprite1 = new cc.Sprite(randomAvatar(true));
        this.MeAvatarSprite1.attr({ x: size.width / 2, y: size.height / 2 - 280 });
        this.MeAvatarSprite1.setScale(0.38);
        this.addChild(this.MeAvatarSprite1, 0);

        this.MeAvatarWinSprite1 = new cc.Sprite("res/Thang.png");
        this.MeAvatarWinSprite1.attr({ x: size.width / 2 - 50, y: size.height / 2 - 280 });
        this.MeAvatarWinSprite1.setScale(0.3);
        this.MeAvatarWinSprite1.setVisible(false);
        this.addChild(this.MeAvatarWinSprite1, 1);

        this.MeSprite1 = new cc.Sprite(res.BackCard_png);
        this.MeSprite1.attr({ x: size.width / 2, y: size.height / 2 - 150 });
        this.MeSprite1.setScale(0.1);
        this.MeSprite1.setVisible(false);
        this.MeSprite1.setRotation(-20.0);
        this.addChild(this.MeSprite1, 0);

        this.MeSprite2 = new cc.Sprite(res.BackCard_png);
        this.MeSprite2.attr({ x: size.width / 2 + 20, y: size.height / 2 - 150 });
        this.MeSprite2.setScale(0.1);
        this.MeSprite2.setVisible(false);
        this.addChild(this.MeSprite2, 0);

        this.MeSprite3 = new cc.Sprite(res.BackCard_png);
        this.MeSprite3.attr({ x: size.width / 2 + 40, y: size.height / 2 - 150 });
        this.MeSprite3.setScale(0.1);
        this.MeSprite3.setVisible(false);
        this.MeSprite3.setRotation(20.0);
        this.addChild(this.MeSprite3, 0);

        meAmountLabel.setString(this.me.wallet_money);

        // Touch listener để lật bài khi click vào bài của mình
        var thiz = this;
        var flipped = false;
        var cardTouchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch) {
                if (flipped) return false;
                var pos = touch.getLocation();
                var sprites = [thiz.MeSprite1, thiz.MeSprite2, thiz.MeSprite3];
                for (var i = 0; i < sprites.length; i++) {
                    var s = sprites[i];
                    if (!s.isVisible()) return false;
                    var rect = s.getBoundingBox();
                    // mở rộng vùng chạm cho dễ bấm
                    rect.x -= 30; rect.y -= 30;
                    rect.width += 60; rect.height += 60;
                    if (cc.rectContainsPoint(rect, pos)) {
                        flipped = true;
                        thiz.MeSprite1.setTexture("res/" + thiz.me.cards[0]._name + ".png");
                        thiz.MeSprite2.setTexture("res/" + thiz.me.cards[1]._name + ".png");
                        thiz.MeSprite3.setTexture("res/" + thiz.me.cards[2]._name + ".png");
                        return true;
                    }
                }
                return false;
            }
        });
        cc.eventManager.addListener(cardTouchListener, this);

        var startBtn = new ccui.Button(res.Start_png, '', '');
        startBtn.scale = 1;
        startBtn.setZoomScale(-0.05);
        startBtn.x = size.width / 2 + 50;
        startBtn.y = size.height / 2;
        this.addChild(startBtn, 7);

        this.isPlaying = false;

        startBtn.addClickEventListener(function() {
            startBtn.setVisible(false);
            flipped = false;

            if (this.me.wallet_money <= 0) {
                statusLabel.setVisible(true);
                statusLabel.setString("Bạn đã hết tiền!");
                return;
            }

            this.isPlaying = true;

            // Reset card textures
            if (this.player1.isEnable) {
                this.PlayerSprite11.setTexture("res/backcard.png");
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

            // Hide cards
            if (this.player1.isEnable) {
                this.PlayerSprite11.setVisible(false);
                this.PlayerSprite12.setVisible(false);
                this.PlayerSprite13.setVisible(false);
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

            // Hide win sprites
            if (this.player1.isEnable) this.PlayerAvatarWinSprite1.setVisible(false);
            if (this.player2.isEnable) this.Player2AvatarWinSprite1.setVisible(false);
            if (this.player3.isEnable) this.Player3AvatarWinSprite1.setVisible(false);
            this.MeAvatarWinSprite1.setVisible(false);

            // Reset bộ bài
            for (var d = 0; d < this.deckSprites.length; d++) {
                this.deckSprites[d].setVisible(false);
                this.deckSprites[d].setOpacity(255);
            }

            statusLabel.setVisible(true);
            statusLabel.setString("Đợi người chơi...");

            // Shuffle and deal cards
            this.cardList = shuffle(this.cardList);
            this.me.clear();
            this.player1.clear();
            this.player2.clear();
            this.player3.clear();

            for (var i = 0; i < 12; i++) {
                if (i % 4 == 0) this.me.addCard(this.cardList[i]);
                if (i % 4 == 1) this.player2.addCard(this.cardList[i]);
                if (i % 4 == 2) this.player1.addCard(this.cardList[i]);
                if (i % 4 == 3) this.player3.addCard(this.cardList[i]);
            }

            this.runAction(cc.sequence(
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    if (thiz.firstLoad == 1) {
                        statusLabel.setVisible(true);
                    } else {
                        statusLabel.setVisible(false);
                    }
                    statusLabel.setString(10);
                }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() { statusLabel.setString(9); }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    statusLabel.setString(8);
                    if (thiz.player1.isEnable && (thiz.firstLoad == 1)) {
                        var player1Label = new cc.LabelTTF(thiz.player1.name, "Arial", 38);
                        player1Label.x = size.width / 2 + 100;
                        player1Label.y = size.height / 2 + 300;
                        thiz.addChild(player1Label, 5);

                        thiz.player1AmountLabel = new cc.LabelTTF(thiz.player1.wallet_money, "Arial", 20);
                        thiz.player1AmountLabel.x = size.width / 2 + 120;
                        thiz.player1AmountLabel.y = size.height / 2 + 250;
                        thiz.addChild(thiz.player1AmountLabel, 5);

                        addCoinStack(thiz, size.width / 2 + 60, size.height / 2 + 250, 5);

                        thiz.PlayerAvatarSprite1 = new cc.Sprite(randomAvatar(thiz.player1.isEnable));
                        thiz.PlayerAvatarSprite1.attr({ x: size.width / 2, y: size.height / 2 + 280 });
                        thiz.PlayerAvatarSprite1.setScale(0.38);
                        thiz.addChild(thiz.PlayerAvatarSprite1, 0);
                    }
                }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() { statusLabel.setString(7); }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    statusLabel.setString(6);
                }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    statusLabel.setString(5);
                    if (thiz.player2.isEnable && (thiz.firstLoad == 1)) {
                        var player2Label = new cc.LabelTTF(thiz.player2.name, "Arial", 38);
                        player2Label.x = size.width / 2 - 300;
                        player2Label.y = size.height / 2 + 130;
                        thiz.addChild(player2Label, 5);

                        thiz.player2AmountLabel = new cc.LabelTTF(thiz.player2.wallet_money, "Arial", 20);
                        thiz.player2AmountLabel.x = size.width / 2 - 280;
                        thiz.player2AmountLabel.y = size.height / 2 + 90;
                        thiz.addChild(thiz.player2AmountLabel, 5);

                        addCoinStack(thiz, size.width / 2 - 340, size.height / 2 + 90, 5);

                        thiz.Player2AvatarSprite1 = new cc.Sprite(randomAvatar(thiz.player2.isEnable));
                        thiz.Player2AvatarSprite1.attr({ x: size.width / 2 - 400, y: size.height / 2 + 120 });
                        thiz.Player2AvatarSprite1.setScale(0.38);
                        thiz.addChild(thiz.Player2AvatarSprite1, 0);
                    }
                }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() { statusLabel.setString(4); }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() { statusLabel.setString(3); }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    statusLabel.setString(2);
                    if (thiz.player3.isEnable) {
                        var player3Label = new cc.LabelTTF(thiz.player3.name, "Arial", 38);
                        player3Label.x = size.width / 2 + 500;
                        player3Label.y = size.height / 2 + 130;
                        thiz.addChild(player3Label, 5);

                        thiz.player3AmountLabel = new cc.LabelTTF(thiz.player3.wallet_money, "Arial", 20);
                        thiz.player3AmountLabel.x = size.width / 2 + 520;
                        thiz.player3AmountLabel.y = size.height / 2 + 90;
                        thiz.addChild(thiz.player3AmountLabel, 5);

                        addCoinStack(thiz, size.width / 2 + 460, size.height / 2 + 90, 5);

                        thiz.Player3AvatarSprite1 = new cc.Sprite(randomAvatar(thiz.player3.isEnable));
                        thiz.Player3AvatarSprite1.attr({ x: size.width / 2 + 400, y: size.height / 2 + 120 });
                        thiz.Player3AvatarSprite1.setScale(0.38);
                        thiz.addChild(thiz.Player3AvatarSprite1, 0);
                    }
                }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() { statusLabel.setString(1); }),
                cc.delayTime(1 * thiz.firstLoad),
                cc.callFunc(function() {
                    thiz.firstLoad = 0;
                    statusLabel.setVisible(false);
                    // Hiện bộ bài + bắt đầu tiếng chia bài
                    for (var d = 0; d < thiz.deckSprites.length; d++) {
                        thiz.deckSprites[d].setVisible(true);
                    }
                }),
                // Deal cards animation — thứ tự xoay chiều kim đồng hồ bắt đầu từ người thắng ván trước
                cc.delayTime(0.4),
                cc.callFunc(function() {
                    // Thứ tự cố định theo chiều kim đồng hồ: me(dưới)→p3(phải)→p1(trên)→p2(trái)
                    var clockwise = [
                        { key: 'me', sprites: [thiz.MeSprite1, thiz.MeSprite2, thiz.MeSprite3],             isEnable: true },
                        { key: 'p3', sprites: [thiz.PlayerSprite31, thiz.PlayerSprite32, thiz.PlayerSprite33], isEnable: thiz.player3.isEnable },
                        { key: 'p1', sprites: [thiz.PlayerSprite11, thiz.PlayerSprite12, thiz.PlayerSprite13], isEnable: thiz.player1.isEnable },
                        { key: 'p2', sprites: [thiz.PlayerSprite21, thiz.PlayerSprite22, thiz.PlayerSprite23], isEnable: thiz.player2.isEnable },
                    ];
                    var startIdx = 0;
                    for (var i = 0; i < clockwise.length; i++) {
                        if (clockwise[i].key === thiz.dealerKey) { startIdx = i; break; }
                    }
                    var ordered = clockwise.slice(startIdx).concat(clockwise.slice(0, startIdx));

                    // Build sequence: 3 vòng, mỗi vòng chia 1 lá cho từng người enabled
                    var dealSteps = [];
                    for (var round = 0; round < 3; round++) {
                        for (var p = 0; p < ordered.length; p++) {
                            if (ordered[p].isEnable) {
                                (function(sprite) {
                                    dealSteps.push(cc.callFunc(function() {
                                        dealCard(thiz, sprite, thiz.deckX, thiz.deckY);
                                    }));
                                    dealSteps.push(cc.delayTime(0.45));
                                })(ordered[p].sprites[round]);
                            }
                        }
                    }
                    thiz.runAction(cc.sequence(dealSteps));
                }),
                cc.delayTime(0.45 * 12 + 0.4), // chờ deal xong (worst case 4 người x 3 vòng)
                cc.delayTime(0.6),
                cc.callFunc(function() {
                    // Ẩn bộ bài sau khi chia xong
                    for (var d = 0; d < thiz.deckSprites.length; d++) {
                        (function(dc) {
                            dc.runAction(cc.sequence(
                                cc.fadeOut(0.3),
                                cc.callFunc(function() {
                                    dc.setVisible(false);
                                    dc.setOpacity(255);
                                })
                            ));
                        })(thiz.deckSprites[d]);
                    }
                }),
                // Countdown
                cc.delayTime(1),
                cc.callFunc(function() {
                    statusLabel.setVisible(true);
                    statusLabel.setString(10);
                }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(9); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(8); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(7); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(6); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(5); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(4); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(3); }),
                cc.delayTime(1), cc.callFunc(function() { statusLabel.setString(2); }),
                cc.delayTime(1), cc.callFunc(function() {
                    statusLabel.setString(1);
                }),
                cc.delayTime(1), cc.callFunc(function() {
                    statusLabel.setVisible(false);
                }),
                // Reveal all cards
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
                // Determine winner and update wallets
                cc.callFunc(function() {
                    thiz.me.calculate();
                    thiz.player1.calculate();
                    thiz.player2.calculate();
                    thiz.player3.calculate();

                    var win = who_win(thiz.me, thiz.player1);
                    win = who_win(win, thiz.player2);
                    win = who_win(win, thiz.player3);

                    var numPlaying = 0;
                    if (thiz.player1.isEnable) numPlaying++;
                    if (thiz.player2.isEnable) numPlaying++;
                    if (thiz.player3.isEnable) numPlaying++;

                    // Vị trí avatar từng người
                    var posMe    = { x: size.width / 2,       y: size.height / 2 - 280 };
                    var posP1    = { x: size.width / 2,       y: size.height / 2 + 280 };
                    var posP2    = { x: size.width / 2 - 400, y: size.height / 2 + 120 };
                    var posP3    = { x: size.width / 2 + 400, y: size.height / 2 + 120 };

                    var winPos;
                    if (thiz.me == win)      winPos = posMe;
                    else if (thiz.player1 == win) winPos = posP1;
                    else if (thiz.player2 == win) winPos = posP2;
                    else if (thiz.player3 == win) winPos = posP3;

                    // Bắn tiền từ người thua về người thắng
                    // Đếm số nhóm để biết khi nào tất cả xong mới hiện popup
                    var coinGroups = 0;
                    if (thiz.me != win) coinGroups++;
                    if (thiz.player1.isEnable && thiz.player1 != win) coinGroups++;
                    if (thiz.player2.isEnable && thiz.player2 != win) coinGroups++;
                    if (thiz.player3.isEnable && thiz.player3 != win) coinGroups++;

                    // Phát tiếng thắng/thua ngay khi biết kết quả
                    playSound(isWinMe ? res.SFX_Win : res.SFX_Lose);

                    var coinGroupsDone = 0;
                    function onGroupDone() {
                        coinGroupsDone++;
                        if (coinGroupsDone === coinGroups) {
                            showGamePopup(msg1, msg2, isWinMe, function() {
                                startBtn.setVisible(true);
                            });
                        }
                    }

                    if (coinGroups > 0)
                        playSound(res.SFX_CoinFly);

                    if (thiz.me != win)
                        showCoinsFly(thiz, posMe.x, posMe.y, winPos.x, winPos.y, 8, onGroupDone);
                    if (thiz.player1.isEnable && thiz.player1 != win)
                        showCoinsFly(thiz, posP1.x, posP1.y, winPos.x, winPos.y, 8, onGroupDone);
                    if (thiz.player2.isEnable && thiz.player2 != win)
                        showCoinsFly(thiz, posP2.x, posP2.y, winPos.x, winPos.y, 8, onGroupDone);
                    if (thiz.player3.isEnable && thiz.player3 != win)
                        showCoinsFly(thiz, posP3.x, posP3.y, winPos.x, winPos.y, 8, onGroupDone);

                    // Nếu thắng với 10 điểm thì nhân đôi
                    var isDouble = (win.total_points === 10);
                    var multiplier = isDouble ? 2 : 1;
                    var betPerPerson = thiz.bet_amount * multiplier;

                    if (thiz.me == win) {
                        thiz.me.addBudget(betPerPerson * numPlaying);
                        thiz.player1.minusBudget(betPerPerson);
                        thiz.player2.minusBudget(betPerPerson);
                        thiz.player3.minusBudget(betPerPerson);
                        thiz.MeAvatarWinSprite1.setVisible(true);
                    } else if (thiz.player1 == win) {
                        thiz.player1.addBudget(betPerPerson * numPlaying);
                        thiz.me.minusBudget(betPerPerson);
                        thiz.player2.minusBudget(betPerPerson);
                        thiz.player3.minusBudget(betPerPerson);
                        thiz.PlayerAvatarWinSprite1.setVisible(true);
                    } else if (thiz.player2 == win) {
                        thiz.player2.addBudget(betPerPerson * numPlaying);
                        thiz.me.minusBudget(betPerPerson);
                        thiz.player1.minusBudget(betPerPerson);
                        thiz.player3.minusBudget(betPerPerson);
                        thiz.Player2AvatarWinSprite1.setVisible(true);
                    } else if (thiz.player3 == win) {
                        thiz.player3.addBudget(betPerPerson * numPlaying);
                        thiz.me.minusBudget(betPerPerson);
                        thiz.player1.minusBudget(betPerPerson);
                        thiz.player2.minusBudget(betPerPerson);
                        if (thiz.player3.isEnable) thiz.Player3AvatarWinSprite1.setVisible(true);
                    }

                    if (thiz.player1.isEnable) thiz.player1AmountLabel.setString(thiz.player1.wallet_money);
                    meAmountLabel.setString(thiz.me.wallet_money);
                    if (thiz.player2.isEnable) thiz.player2AmountLabel.setString(thiz.player2.wallet_money);
                    if (thiz.player3.isEnable) thiz.player3AmountLabel.setString(thiz.player3.wallet_money);

                    cc.sys.localStorage.setItem(thiz.player1.name + "_wallet", thiz.player1.wallet_money);
                    cc.sys.localStorage.setItem(thiz.me.name + "_wallet", thiz.me.wallet_money);
                    cc.sys.localStorage.setItem(thiz.player2.name + "_wallet", thiz.player2.wallet_money);
                    cc.sys.localStorage.setItem(thiz.player3.name + "_wallet", thiz.player3.wallet_money);

                    thiz.isPlaying = false;

                    // Ván sau dealer là người thắng
                    if      (win === thiz.me)       thiz.dealerKey = 'me';
                    else if (win === thiz.player1)  thiz.dealerKey = 'p1';
                    else if (win === thiz.player2)  thiz.dealerKey = 'p2';
                    else if (win === thiz.player3)  thiz.dealerKey = 'p3';

                    var isWinMe = (thiz.me == win);
                    var prize   = betPerPerson * numPlaying;
                    var doubleTag = isDouble ? " (x2)" : "";
                    var msg1    = isWinMe ? "Bạn thắng!" : (win.name + " thắng!");
                    var msg2    = (isWinMe ? "+" : "-") + (isWinMe ? prize : betPerPerson) + " xu" + doubleTag;
                })
            ));
        }.bind(this));

        var backBtn = new ccui.Button(res.Back_png, '', '');
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);

        backBtn.addClickEventListener(function() {
            if (!startBtn.isVisible()) {
                this.me.minusBudget(this.bet_amount);
                cc.sys.localStorage.setItem(this.me.name + "_wallet", this.me.wallet_money);
            }
            cc.director.runScene(new LobbyScene());
        }.bind(this));

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
