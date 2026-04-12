// ===== Tá Lả: 52-card deck, 4 suits x 13 ranks =====

function initTaLaCards() {
    var suits = ['co', 'ro', 'tep', 'bich']; // ♥ ♦ ♣ ♠
    var deck = [];
    var id = 0;
    for (var s = 0; s < suits.length; s++) {
        for (var r = 1; r <= 13; r++) {
            deck.push({ id: id++, rank: r, suit: suits[s] });
        }
    }
    return deck;
}

// Tạo node vẽ mặt bài (không cần ảnh)
function makeTaLaCardNode(rank, suit) {
    var W = 180, H = 250;
    var labels = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    var symbols = { co: '\u2665', ro: '\u2666', tep: '\u2663', bich: '\u2660' };
    var isRed = (suit === 'co' || suit === 'ro');
    var col = isRed ? new cc.Color(210, 30, 30) : new cc.Color(20, 20, 20);

    var node = new cc.Node();
    node.setContentSize(cc.size(W, H));
    node.setAnchorPoint(cc.p(0.5, 0.5));

    // Nền trắng + viền
    var bg = new cc.DrawNode();
    bg.drawRect(
        cc.p(-W / 2, -H / 2), cc.p(W / 2, H / 2),
        new cc.Color(255, 252, 235, 255),
        2, new cc.Color(160, 160, 160, 255)
    );
    node.addChild(bg, 0);

    // Rank góc trên trái
    var topRank = new cc.LabelTTF(labels[rank], "Arial", 44);
    topRank.setColor(col);
    topRank.setAnchorPoint(cc.p(0, 1));
    topRank.setPosition(-W / 2 + 10, H / 2 - 8);
    node.addChild(topRank, 1);

    // Suit góc trên trái (bên dưới rank)
    var topSuit = new cc.LabelTTF(symbols[suit], "Arial", 30);
    topSuit.setColor(col);
    topSuit.setAnchorPoint(cc.p(0, 1));
    topSuit.setPosition(-W / 2 + 12, H / 2 - 54);
    node.addChild(topSuit, 1);

    // Suit lớn ở giữa
    var midSuit = new cc.LabelTTF(symbols[suit], "Arial", 96);
    midSuit.setColor(col);
    midSuit.setPosition(0, 0);
    node.addChild(midSuit, 1);

    return node;
}

// ===================================================

var TaLaLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;
        var thiz = this;

        // ===== Background =====
        var bg = new cc.Sprite("res/table.png");
        bg.scale = 0.7;
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        // ===== Init players =====
        this.me      = new Player("1", cc.sys.localStorage.getItem("inputUsername"), [], true);
        this.playerList = randomPlayers(initPlayers([]));
        this.player1 = this.playerList[0]; this.player1.isEnable = true;
        this.player2 = this.playerList[1]; this.player2.isEnable = true;
        this.player3 = this.playerList[2]; this.player3.isEnable = true;

        // ===== Positions =====
        var posMe = { x: size.width / 2,       y: size.height / 2 - 180 };
        var posP1 = { x: size.width / 2,       y: size.height / 2 + 185 };
        var posP2 = { x: size.width / 2 - 360, y: size.height / 2 + 30  };
        var posP3 = { x: size.width / 2 + 360, y: size.height / 2 + 30  };

        // ===== Avatar & name labels =====
        function addPlayerInfo(player, pos, labelX, labelY) {
            var ava = new cc.Sprite(randomAvatar(true));
            ava.setScale(0.32);
            ava.setPosition(pos.x, pos.y);
            thiz.addChild(ava, 2);

            var lbl = new cc.LabelTTF(player.name, "Arial", 32);
            lbl.setPosition(labelX, labelY);
            thiz.addChild(lbl, 3);
        }
        addPlayerInfo(this.me,      posMe, posMe.x + 70, posMe.y - 50);
        addPlayerInfo(this.player1, posP1, posP1.x + 70, posP1.y + 50);
        addPlayerInfo(this.player2, posP2, posP2.x,      posP2.y + 70);
        addPlayerInfo(this.player3, posP3, posP3.x,      posP3.y + 70);

        // ===== Deck sprites (giữa bàn) =====
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

        // ===== Card holders =====
        // Me: 10 lá trải ngang (dealer), mặt ngửa sau khi chia
        // P1/P2/P3: 9 lá úp chồng lên nhau
        var meCount = 10;
        var meSpacing = 52;
        var meStartX = posMe.x - (meCount - 1) * meSpacing / 2;
        this.meCards  = this._makeCardSlots(meCount, meStartX,      posMe.y - 100, meSpacing, 0, 0,   0,   thiz, 0.16);
        this.p1Cards  = this._makeCardSlots(9, posP1.x - 8,        posP1.y + 95,  2, -1, -4, 0.8, thiz, 0.13);
        this.p2Cards  = this._makeCardSlots(9, posP2.x + 50,       posP2.y - 10,  2,  1, -4, 0.8, thiz, 0.13);
        this.p3Cards  = this._makeCardSlots(9, posP3.x - 58,       posP3.y - 10,  2,  1, -4, 0.8, thiz, 0.13);

        // ===== Start button =====
        var startBtn = new ccui.Button(res.Start_png, '', '');
        startBtn.scale = 1;
        startBtn.setZoomScale(-0.05);
        startBtn.x = size.width / 2 + 50;
        startBtn.y = size.height / 2;
        this.addChild(startBtn, 7);

        startBtn.addClickEventListener(function() {
            startBtn.setVisible(false);

            // Hiện bộ bài
            for (var d = 0; d < thiz.deckSprites.length; d++) {
                thiz.deckSprites[d].setVisible(true);
            }

            // Shuffle 52 lá
            var deck = initTaLaCards();
            deck = shuffle(deck);

            // Thứ tự chia: P1→P2→P3→Me, 9 vòng → Me nhận thêm 1 lá (tổng 10)
            // Me nhận lá tại index: 3,7,11,...,35 (vòng 0-8) và 36 (vòng 9 chỉ Me)
            for (var i = 0; i < 9; i++) {
                (function(idx) {
                    var card = deck[idx * 4 + 3];
                    var old  = thiz.meCards[idx];
                    var pos  = old.getPosition();
                    var sc   = old.getScale();
                    old.removeFromParent();

                    var face = makeTaLaCardNode(card.rank, card.suit);
                    face.setScale(sc);
                    face.setPosition(pos);
                    face.setVisible(false);
                    thiz.addChild(face, 1);
                    thiz.meCards[idx] = face;
                })(i);
            }
            // Lá thứ 10 của dealer (index 36)
            (function() {
                var card = deck[36];
                var old  = thiz.meCards[9];
                var pos  = old.getPosition();
                var sc   = old.getScale();
                old.removeFromParent();

                var face = makeTaLaCardNode(card.rank, card.suit);
                face.setScale(sc);
                face.setPosition(pos);
                face.setVisible(false);
                thiz.addChild(face, 1);
                thiz.meCards[9] = face;
            })();

            // Build deal sequence: P1→P2→P3→Me mỗi vòng
            var slots = [thiz.p1Cards, thiz.p2Cards, thiz.p3Cards, thiz.meCards];
            var dealSteps = [];

            for (var round = 0; round < 9; round++) {
                for (var p = 0; p < 4; p++) {
                    (function(sprite) {
                        dealSteps.push(cc.callFunc(function() {
                            dealCard(thiz, sprite, thiz.deckX, thiz.deckY);
                        }));
                        dealSteps.push(cc.delayTime(0.25));
                    })(slots[p][round]);
                }
            }
            // Lá thứ 10 cho dealer
            (function(sprite) {
                dealSteps.push(cc.callFunc(function() {
                    dealCard(thiz, sprite, thiz.deckX, thiz.deckY);
                }));
                dealSteps.push(cc.delayTime(0.25));
            })(thiz.meCards[9]);

            // Ẩn bộ bài
            dealSteps.push(cc.delayTime(0.4));
            dealSteps.push(cc.callFunc(function() {
                for (var d = 0; d < thiz.deckSprites.length; d++) {
                    (function(dc) {
                        dc.runAction(cc.sequence(
                            cc.fadeOut(0.3),
                            cc.callFunc(function() { dc.setVisible(false); dc.setOpacity(255); })
                        ));
                    })(thiz.deckSprites[d]);
                }
            }));

            thiz.runAction(cc.sequence(dealSteps));
        });

        // ===== Back button =====
        var backBtn = new ccui.Button(res.Back_png, '', '');
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new GameSelectScene());
        });
    },

    _makeCardSlots: function(n, startX, startY, dx, dy, rotStart, rotStep, layer, scale) {
        scale = scale || 0.1;
        var slots = [];
        for (var i = 0; i < n; i++) {
            var card = new cc.Sprite(res.BackCard_png);
            card.setScale(scale);
            card.setPosition(startX + i * dx, startY + i * dy);
            card.setRotation(rotStart + i * rotStep);
            card.setVisible(false);
            layer.addChild(card, 1);
            slots.push(card);
        }
        return slots;
    }
});

var TaLaScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new TaLaLayer();
        this.addChild(layer);
    }
});
