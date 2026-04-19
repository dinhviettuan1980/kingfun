// =====================================================
// Tá Lả Miền Bắc  (A=1, 2-9, 10, J=11, Q=12, K=13)
// =====================================================

function initTaLaCards() {
    var suits = ['co', 'ro', 'tep', 'bich'];
    var deck = [], id = 0;
    for (var s = 0; s < suits.length; s++)
        for (var r = 1; r <= 13; r++)
            deck.push({ id: id++, rank: r, suit: suits[s] });
    return deck;
}

function makeTaLaCardNode(rank, suit) {
    var W = 180, H = 250;
    var labels = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    var syms   = { co:'\u2665', ro:'\u2666', tep:'\u2663', bich:'\u2660' };
    var isRed  = suit === 'co' || suit === 'ro';
    var col    = isRed ? new cc.Color(210,30,30) : new cc.Color(20,20,20);

    var node = new cc.Node();
    node.setContentSize(cc.size(W, H));
    node.setAnchorPoint(cc.p(0.5, 0.5));

    var bg = new cc.DrawNode();
    bg.drawRect(cc.p(-W/2,-H/2), cc.p(W/2,H/2),
        new cc.Color(255,252,235,255), 2, new cc.Color(160,160,160,255));
    node.addChild(bg, 0);

    var r1 = new cc.LabelTTF(labels[rank], 'Arial', 44);
    r1.setColor(col); r1.setAnchorPoint(cc.p(0,1));
    r1.setPosition(-W/2+10, H/2-8);
    node.addChild(r1, 1);

    var s1 = new cc.LabelTTF(syms[suit], 'Arial', 30);
    s1.setColor(col); s1.setAnchorPoint(cc.p(0,1));
    s1.setPosition(-W/2+12, H/2-54);
    node.addChild(s1, 1);

    var sM = new cc.LabelTTF(syms[suit], 'Arial', 90);
    sM.setColor(col); sM.setPosition(0, 0);
    node.addChild(sM, 1);

    return node;
}

// ===== Game logic =====

function tlVal(c) { return c.rank >= 10 ? 10 : c.rank; }

function tlIsSanh(cards) {
    if (cards.length < 3) return false;
    var suit = cards[0].suit, rnks = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit !== suit) return false;
        rnks.push(cards[i].rank);
    }
    rnks.sort(function(a,b){return a-b;});
    for (var i = 1; i < rnks.length; i++) if (rnks[i] !== rnks[i-1]+1) return false;
    return true;
}

function tlIsBo(cards) {
    if (cards.length < 3 || cards.length > 4) return false;
    var rank = cards[0].rank, suits = {};
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].rank !== rank) return false;
        if (suits[cards[i].suit]) return false;
        suits[cards[i].suit] = true;
    }
    return true;
}

function tlCombos(arr, k) {
    var res = [];
    function go(s, cur) {
        if (cur.length === k) { res.push(cur.slice()); return; }
        for (var i = s; i < arr.length; i++) { cur.push(arr[i]); go(i+1, cur); cur.pop(); }
    }
    go(0, []);
    return res;
}

function tlFindPhoms(hand) {
    var phoms = [], byRank = {}, bySuit = {};
    for (var i = 0; i < hand.length; i++) {
        var c = hand[i];
        if (!byRank[c.rank]) byRank[c.rank] = [];
        byRank[c.rank].push(c);
        if (!bySuit[c.suit]) bySuit[c.suit] = [];
        bySuit[c.suit].push(c);
    }
    // Bộ: same rank, diff suits
    var rnks = Object.keys(byRank);
    for (var ri = 0; ri < rnks.length; ri++) {
        var g = byRank[rnks[ri]];
        if (g.length >= 3) {
            var c3s = tlCombos(g, 3);
            for (var ci = 0; ci < c3s.length; ci++) if (tlIsBo(c3s[ci])) phoms.push(c3s[ci]);
            if (g.length === 4 && tlIsBo(g)) phoms.push(g.slice());
        }
    }
    // Sảnh: same suit, consecutive
    var sts = Object.keys(bySuit);
    for (var si = 0; si < sts.length; si++) {
        var g = bySuit[sts[si]].slice().sort(function(a,b){return a.rank-b.rank;});
        var i = 0;
        while (i < g.length) {
            var j = i+1;
            while (j < g.length && g[j].rank === g[j-1].rank+1) j++;
            var run = g.slice(i, j);
            if (run.length >= 3)
                for (var a = 0; a <= run.length-3; a++)
                    for (var b = 3; a+b <= run.length; b++)
                        phoms.push(run.slice(a, a+b));
            i = j;
        }
    }
    return phoms;
}

function tlBestArr(hand) {
    var possible = tlFindPhoms(hand);
    possible.sort(function(a,b){return b.length-a.length;});
    var used = [];
    for (var i = 0; i < hand.length; i++) used.push(false);
    var phoms = [];
    for (var i = 0; i < possible.length; i++) {
        var p = possible[i], ok = true, idxs = [];
        for (var j = 0; j < p.length; j++) {
            var k = hand.indexOf(p[j]);
            if (k < 0 || used[k]) { ok = false; break; }
            idxs.push(k);
        }
        if (ok) {
            phoms.push(p);
            for (var j = 0; j < idxs.length; j++) used[idxs[j]] = true;
        }
    }
    return { phoms: phoms, rac: hand.filter(function(_,i){return !used[i];}) };
}

function tlIsUu(hand) { return hand.length === 0 || tlBestArr(hand).rac.length === 0; }

// Returns phom array (including eaten card) or null
function tlCanEat(hand, card) {
    if (!card) return null;
    var test = hand.concat([card]);
    var ps = tlFindPhoms(test);
    for (var i = 0; i < ps.length; i++)
        if (ps[i].indexOf(card) !== -1) return ps[i];
    return null;
}

// Sắp xếp tay bài: phỏm → cạ (2 lá gần phỏm) → rác
function tlSortHand(hand) {
    var arr = tlBestArr(hand);
    var sorted = [];

    // 1. Phỏm hoàn chỉnh
    for (var i = 0; i < arr.phoms.length; i++)
        for (var j = 0; j < arr.phoms[i].length; j++)
            sorted.push(arr.phoms[i][j]);

    var rac = arr.rac.slice();
    var racUsed = [];
    for (var i = 0; i < rac.length; i++) racUsed.push(false);

    // 2. Cạ: cặp 2 lá cùng rank, 2 lá liên tiếp cùng chất, hoặc cách 1 cùng chất
    for (var i = 0; i < rac.length; i++) {
        if (racUsed[i]) continue;
        for (var j = i + 1; j < rac.length; j++) {
            if (racUsed[j]) continue;
            var c1 = rac[i], c2 = rac[j];
            var diff = Math.abs(c1.rank - c2.rank);
            var isCa = (c1.rank === c2.rank) ||
                       (c1.suit === c2.suit && diff <= 2);
            if (isCa) {
                sorted.push(c1);
                sorted.push(c2);
                racUsed[i] = true;
                racUsed[j] = true;
                break;
            }
        }
    }

    // 3. Rác còn lại
    for (var i = 0; i < rac.length; i++)
        if (!racUsed[i]) sorted.push(rac[i]);

    return sorted;
}

function tlBotDiscard(hand) {
    var best = hand[0], bestScore = Infinity;
    for (var i = 0; i < hand.length; i++) {
        var rem = [];
        for (var j = 0; j < hand.length; j++) if (j !== i) rem.push(hand[j]);
        var arr = tlBestArr(rem);
        var score = 0;
        for (var j = 0; j < arr.rac.length; j++) score += tlVal(arr.rac[j]);
        if (score < bestScore) { bestScore = score; best = hand[i]; }
    }
    return best;
}

// =====================================================
// TaLaLayer
// =====================================================

var TaLaLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);
        var size = cc.winSize, thiz = this;

        // Background
        var bg = new cc.Sprite('res/table.png');
        bg.scale = 0.7; bg.x = size.width/2; bg.y = size.height/2;
        this.addChild(bg);

        // Players
        this.me = new Player('1', cc.sys.localStorage.getItem('inputUsername'), [], true);
        this.playerList = randomPlayers(initPlayers([]));
        this.playerList[0].isEnable = true;
        this.playerList[1].isEnable = true;
        this.playerList[2].isEnable = true;
        this.pNames = {
            me: (this.me.name || 'Bạn'),
            p1: this.playerList[0].name,
            p2: this.playerList[1].name,
            p3: this.playerList[2].name
        };
        this.playerObjs = {
            me: this.me,
            p1: this.playerList[0],
            p2: this.playerList[1],
            p3: this.playerList[2]
        };
        this.bet_amount = Math.round(cc.sys.localStorage.getItem('bet_amount')) || 50;

        // Positions
        var posMe = { x: size.width/2,       y: size.height/2 - 180 };
        var posP1 = { x: size.width/2,       y: size.height/2 + 185 };
        var posP2 = { x: size.width/2 - 360, y: size.height/2 + 30  };
        var posP3 = { x: size.width/2 + 360, y: size.height/2 + 30  };
        this.pos = { me: posMe, p1: posP1, p2: posP2, p3: posP3 };

        // Avatars & names & wallet
        this.walletLabels = {};
        function addInfo(key, player, pos, lx, ly) {
            var ava = new cc.Sprite(randomAvatar(true));
            ava.setScale(0.3); ava.setPosition(pos.x, pos.y);
            thiz.addChild(ava, 2);
            var lbl = new cc.LabelTTF(player.name, 'Arial', 28);
            lbl.setPosition(lx, ly); thiz.addChild(lbl, 3);
            var coinSp = new cc.Sprite('res/icon_free_gold.png');
            coinSp.setScale(0.55); coinSp.setPosition(lx - 22, ly - 32);
            thiz.addChild(coinSp, 3);
            var wLbl = new cc.LabelTTF(String(player.wallet_money), 'Arial', 22);
            wLbl.setPosition(lx + 38, ly - 32);
            wLbl.setColor(new cc.Color(255, 220, 50));
            thiz.addChild(wLbl, 3);
            thiz.walletLabels[key] = wLbl;
        }
        addInfo('me', this.playerObjs.me, posMe, posMe.x+70, posMe.y-50);
        addInfo('p1', this.playerObjs.p1, posP1, posP1.x+70, posP1.y+50);
        addInfo('p2', this.playerObjs.p2, posP2, posP2.x,    posP2.y+70);
        addInfo('p3', this.playerObjs.p3, posP3, posP3.x,    posP3.y+70);

        // Deck sprites (center)
        this.deckX = size.width/2; this.deckY = size.height/2 + 20;
        this.deckSprites = [];
        for (var d = 4; d >= 0; d--) {
            var dc = new cc.Sprite(res.BackCard_png);
            dc.setScale(0.12);
            dc.setPosition(this.deckX - d*3, this.deckY + d*3);
            dc.setRotation(-2 + d*0.8);
            dc.setVisible(false);
            this.addChild(dc, 8+d);
            this.deckSprites.push(dc);
        }
        this.deckCountLbl = new cc.LabelTTF('', 'Arial', 26);
        this.deckCountLbl.setPosition(this.deckX + 65, this.deckY);
        this.deckCountLbl.setColor(new cc.Color(255,230,80));
        this.addChild(this.deckCountLbl, 10);

        // Hũ tiền gà — bên trái bộ bài
        this.potAmount = parseInt(cc.sys.localStorage.getItem('tala_pot') || '0');
        var gaX = this.deckX - 185, gaY = this.deckY;

        var gaSprite = new cc.Sprite('res/thoivang.png');
        gaSprite.setScale(0.22);
        gaSprite.setPosition(gaX, gaY - 5);
        this.addChild(gaSprite, 5);

        var gaTitle = new cc.LabelTTF('GÀ', 'Arial', 28);
        gaTitle.setPosition(gaX, gaY + 62);
        gaTitle.setColor(new cc.Color(255, 210, 0));
        this.addChild(gaTitle, 6);

        this.potLbl = new cc.LabelTTF(this.potAmount + ' xu', 'Arial', 24);
        this.potLbl.setPosition(gaX, gaY - 65);
        this.potLbl.setColor(new cc.Color(255, 240, 80));
        this.addChild(this.potLbl, 6);

        var gaHint = new cc.LabelTTF('10xu/ván', 'Arial', 18);
        gaHint.setPosition(gaX, gaY - 90);
        gaHint.setColor(new cc.Color(160, 160, 160));
        this.addChild(gaHint, 6);

        // Card slots (for deal animation — only me, other players have no visible cards)
        var meCount = 10, meSpacing = 60;
        var meStartX = posMe.x - (meCount-1)*meSpacing/2;
        this.meSlots = this._makeSlots(meCount, meStartX, posMe.y-100, meSpacing, 0, 0, 0, thiz, 0.32);

        // Action buttons
        this.btnDanh  = this._makeBtn('Đánh',   new cc.Color(30,120,200));
        this.btnAn    = this._makeBtn('Ăn',     new cc.Color(30,160,60));
        this.btnBoQua = this._makeBtn('Bỏ qua', new cc.Color(140,60,20));
        this.btnXepBai = this._makeBtn('Xếp bài', new cc.Color(80,60,140));
        this.btnDanh.x    = posMe.x + 350; this.btnDanh.y    = posMe.y - 40;
        this.btnAn.x      = posMe.x + 350; this.btnAn.y      = posMe.y - 10;
        this.btnBoQua.x   = posMe.x + 350; this.btnBoQua.y   = posMe.y - 90;
        this.btnXepBai.x  = posMe.x + 350; this.btnXepBai.y  = posMe.y - 155;
        [this.btnDanh, this.btnAn, this.btnBoQua, this.btnXepBai].forEach(function(b) {
            b.setVisible(false); thiz.addChild(b, 10);
        });
        this.btnXepBai.setVisible(true); // luôn hiển thị trong lúc chơi
        this.btnDanh.addClickEventListener(function()   { thiz._meDanh(); });
        this.btnAn.addClickEventListener(function()     { thiz._meAn(); });
        this.btnBoQua.addClickEventListener(function()  { thiz._meBoQua(); });
        this.btnXepBai.addClickEventListener(function() { thiz._xepBai(); });

        // Turn / status label
        this.turnLbl = new cc.LabelTTF('', 'Arial', 34);
        this.turnLbl.x = size.width/2;
        this.turnLbl.y = size.height/2 + 90;
        this.turnLbl.setColor(new cc.Color(255,230,80));
        this.addChild(this.turnLbl, 10);

        // Discard pile
        this.discardNode = null;
        this.discardPileX = size.width/2 + 80;
        this.discardPileY = size.height/2 + 10;

        // Phom display buckets
        this.phomNodes = { me:[], p1:[], p2:[], p3:[] };

        // Me's interactive hand
        this.meHandNodes = [];
        this.selectedIdx = -1;

        // Touch handling: web dùng mousedown (coordinate bug trong Cocos2d-HTML5),
        // native iOS dùng cc.EventListener (touch.getLocation() hoạt động đúng trên JSB)
        if (cc.sys.isNative) {
            var touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch) {
                    if (thiz.gameOver) return false;
                    if (thiz.state !== 'discard' || thiz.turnOrder[thiz.turnIdx] !== 'me') return false;
                    var loc = touch.getLocation();
                    for (var i = thiz.meHandNodes.length - 1; i >= 0; i--) {
                        var nd = thiz.meHandNodes[i];
                        if (!nd) continue;
                        var np = nd.getPosition();
                        var sc = nd.getScale();
                        if (Math.abs(loc.x - np.x) <= 110*sc && Math.abs(loc.y - np.y) <= 140*sc) {
                            thiz._meSelectCard(i);
                            return true;
                        }
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(touchListener, this);
        } else {
            cc.game.canvas.addEventListener('mousedown', function(e) {
                if (thiz.gameOver) return;
                if (thiz.state !== 'discard' || thiz.turnOrder[thiz.turnIdx] !== 'me') return;
                var rect = cc.game.canvas.getBoundingClientRect();
                var dX   = (e.clientX - rect.left) * (cc.winSize.width  / rect.width);
                var dY   = cc.winSize.height - (e.clientY - rect.top) * (cc.winSize.height / rect.height);
                for (var i = thiz.meHandNodes.length - 1; i >= 0; i--) {
                    var nd = thiz.meHandNodes[i];
                    if (!nd) continue;
                    var np = nd.getPosition();
                    var sc = nd.getScale();
                    if (Math.abs(dX - np.x) <= 110*sc && Math.abs(dY - np.y) <= 140*sc) {
                        thiz._meSelectCard(i);
                        return;
                    }
                }
            });
        }

        // Start button
        this.startBtn = new ccui.Button(res.Start_png, '', '');
        this.startBtn.scale = 1; this.startBtn.setZoomScale(-0.05);
        this.startBtn.x = size.width/2 + 50; this.startBtn.y = size.height/2;
        this.addChild(this.startBtn, 7);
        this.startBtn.addClickEventListener(function() {
            thiz.startBtn.setVisible(false);
            thiz._doDeal();
        });

        // Back button
        var backBtn = new ccui.Button(res.Back_png, '', '');
        backBtn.x = size.width/2+600; backBtn.y = size.height/2+270;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() { cc.director.runScene(new GameSelectScene()); });
    },

    // ===== Deal =====
    _doDeal: function() {
        var thiz = this;
        for (var d = 0; d < this.deckSprites.length; d++) this.deckSprites[d].setVisible(true);

        var deck = initTaLaCards();
        deck = shuffle(deck);

        // P1→P2→P3→Me ×9 rounds, then 1 extra for Me (dealer)
        var order  = ['p1','p2','p3','me'];
        var dealt  = { me:[], p1:[], p2:[], p3:[] };
        for (var round = 0; round < 9; round++)
            for (var p = 0; p < 4; p++)
                dealt[order[p]].push(deck[round*4 + p]);
        dealt.me.push(deck[36]);
        this.dealtCards = dealt;

        // Replace Me's placeholder slots with face-up card nodes
        for (var i = 0; i < 10; i++) {
            (function(idx) {
                var card = dealt.me[idx];
                var old  = thiz.meSlots[idx];
                var pos  = old.getPosition(), sc = old.getScale();
                old.removeFromParent();
                var face = makeTaLaCardNode(card.rank, card.suit);
                face.setScale(sc); face.setPosition(pos); face.setVisible(false);
                thiz.addChild(face, 1);
                thiz.meSlots[idx] = face;
            })(i);
        }

        // Deal animation — chỉ animate cho me, bot nhận bài tức thì (không hiển thị)
        var steps = [];
        for (var round = 0; round < 9; round++) {
            // 3 bot nhận bài: chỉ delay nhỏ (không cần sprite)
            steps.push(cc.delayTime(0.10));
            // me nhận bài
            (function(sp) {
                steps.push(cc.callFunc(function() { dealCard(thiz, sp, thiz.deckX, thiz.deckY); }));
                steps.push(cc.delayTime(0.18));
            })(this.meSlots[round]);
        }
        // 1 lá extra cho me (dealer)
        (function(sp) {
            steps.push(cc.callFunc(function() { dealCard(thiz, sp, thiz.deckX, thiz.deckY); }));
            steps.push(cc.delayTime(0.2));
        })(this.meSlots[9]);

        steps.push(cc.delayTime(0.3));
        steps.push(cc.callFunc(function() { thiz.startGame(); }));
        this.runAction(cc.sequence(steps));
    },

    // ===== Initialize game state =====
    startGame: function() {
        this.hands = {
            me: this.dealtCards.me.slice(),
            p1: this.dealtCards.p1.slice(),
            p2: this.dealtCards.p2.slice(),
            p3: this.dealtCards.p3.slice()
        };
        this.phomLists = { me:[], p1:[], p2:[], p3:[] };

        // Remaining 15 cards (52 − 37 dealt)
        var allDealt = this.dealtCards.me.concat(this.dealtCards.p1)
                       .concat(this.dealtCards.p2).concat(this.dealtCards.p3);
        var full = initTaLaCards();
        this._deck = [];
        for (var i = 0; i < full.length; i++) {
            var found = false;
            for (var j = 0; j < allDealt.length; j++)
                if (full[i].id === allDealt[j].id) { found = true; break; }
            if (!found) this._deck.push(full[i]);
        }
        this._deck = shuffle(this._deck);
        this._updateDeckDisplay(); // hiển thị deck còn lại sau khi chia bài

        this.discardCard = null;
        this.selectedIdx = -1;
        this.turnOrder   = ['me','p3','p1','p2']; // ngược chiều kim đồng hồ
        this.turnIdx     = 0;
        this.gameOver    = false;
        this.state       = 'discard';

        // Remove deal-slot nodes, build interactive hand
        for (var i = 0; i < this.meSlots.length; i++) this.meSlots[i].removeFromParent();
        this._rebuildMeHand();

        this.deckCountLbl.setString(this._deck.length + ' lá');
        this.turnLbl.setString(this.pNames.me + ' đánh trước (dealer)');

        // Mỗi người vào 10xu vào hũ gà
        var self = this;
        ['me','p1','p2','p3'].forEach(function(p) {
            self.playerObjs[p].minusBudget(10);
            if (self.walletLabels[p]) self.walletLabels[p].setString(String(self.playerObjs[p].wallet_money));
        });
        this.potAmount += 40;
        cc.sys.localStorage.setItem('tala_pot', this.potAmount);
        cc.sys.localStorage.setItem(this.me.name + '_wallet', this.playerObjs.me.wallet_money);
        this.potLbl.setString(this.potAmount + ' xu');

        this.btnDanh.setVisible(true);
    },

    // ===== Me's interactive hand =====
    _rebuildMeHand: function() {
        var posMe = this.pos.me;

        // Remove old nodes
        for (var i = 0; i < this.meHandNodes.length; i++)
            this.meHandNodes[i].removeFromParent();
        this.meHandNodes = [];
        this.selectedIdx = -1;

        var n = this.hands.me.length;
        if (n === 0) return;
        var spacing = n > 8 ? 60 : (n > 5 ? 70 : 80);
        var startX  = posMe.x - (n-1)*spacing/2;

        for (var i = 0; i < n; i++) {
            var card = this.hands.me[i];
            var node = makeTaLaCardNode(card.rank, card.suit);
            node.setScale(0.32);
            node.setPosition(startX + i*spacing, posMe.y - 100);
            this.addChild(node, 5);
            this.meHandNodes.push(node);
        }
    },

    _meSelectCard: function(idx) {
        var posMe  = this.pos.me;
        var prevIdx = this.selectedIdx;

        // Hạ quân đang chọn xuống (nếu có)
        if (prevIdx >= 0 && this.meHandNodes[prevIdx])
            this.meHandNodes[prevIdx].setPositionY(posMe.y - 100);

        // Toggle: click lại quân đang chọn → bỏ chọn
        if (prevIdx === idx) {
            this.selectedIdx = -1;
            return;
        }

        // Chọn quân mới → nhô lên
        this.selectedIdx = idx;
        if (this.meHandNodes[idx])
            this.meHandNodes[idx].setPositionY(posMe.y - 75);
    },

    // ===== Discard =====
    _meDanh: function() {
        if (this.gameOver || this.state !== 'discard') return;
        if (this.turnOrder[this.turnIdx] !== 'me') return;
        if (this.selectedIdx < 0) return;
        this.btnDanh.setVisible(false);
        this._doDiscard('me', this.hands.me[this.selectedIdx]);
    },

    _doDiscard: function(player, card) {
        var thiz = this;
        var idx = this.hands[player].indexOf(card);
        if (idx !== -1) this.hands[player].splice(idx, 1);

        this.discardCard = card;
        this._showDiscardCard(card);
        if (player === 'me') this._rebuildMeHand();

        if (tlIsUu(this.hands[player])) { this._playerWins(player); return; }

        this.runAction(cc.sequence(
            cc.delayTime(0.4),
            cc.callFunc(function() { thiz._advanceTurn(); })
        ));
    },

    _advanceTurn: function() {
        if (this.gameOver) return;
        this.turnIdx = (this.turnIdx + 1) % 4;
        var next = this.turnOrder[this.turnIdx];
        if (next === 'me') this._meDecide();
        else               this._botTurn(next);
    },

    // ===== Me: eat or draw =====
    _meDecide: function() {
        var phom = tlCanEat(this.hands.me, this.discardCard);
        if (phom) {
            this.turnLbl.setString(this.pNames.me + ' có thể ăn!');
            this.btnAn.setVisible(true);
            this.btnBoQua.setVisible(true);
            this.state = 'eat_decision';
        } else {
            this._meDrawFromDeck();
        }
    },

    _meAn: function() {
        if (this.gameOver || this.state !== 'eat_decision') return;
        var card = this.discardCard;
        var phom = tlCanEat(this.hands.me, card);
        if (!phom) return;

        this.btnAn.setVisible(false);
        this.btnBoQua.setVisible(false);

        // Remove phom members (not the eaten card) from hidden hand
        for (var i = 0; i < phom.length; i++) {
            if (phom[i] === card) continue;
            var idx = this.hands.me.indexOf(phom[i]);
            if (idx !== -1) this.hands.me.splice(idx, 1);
        }
        this.phomLists.me.push(phom);
        this._showPhoms('me');
        this._hideDiscardCard();
        this._showEatBubble('me');

        if (tlIsUu(this.hands.me)) { this._playerWins('me'); return; }

        this.state = 'discard';
        this._rebuildMeHand();
        this.turnLbl.setString(this.pNames.me + ' chọn cây đánh');
        this.btnDanh.setVisible(true);
    },

    _meBoQua: function() {
        this.btnAn.setVisible(false);
        this.btnBoQua.setVisible(false);
        this._meDrawFromDeck();
    },

    _meDrawFromDeck: function() {
        var drawn = this._drawCard();
        if (!drawn) { this._endGame(null); return; }
        this.hands.me.push(drawn);
        this.state = 'discard';
        this._rebuildMeHand();
        var labels = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        var syms   = { co:'\u2665', ro:'\u2666', tep:'\u2663', bich:'\u2660' };
        this.turnLbl.setString('Rút: ' + labels[drawn.rank] + syms[drawn.suit]);
        this.deckCountLbl.setString(this._deck.length + ' lá');
        this.btnDanh.setVisible(true);
    },

    // ===== Bot turn =====
    _botTurn: function(player) {
        var thiz = this;
        if (this.gameOver) return;
        var name = this.pNames[player];

        var eatPhom = tlCanEat(this.hands[player], this.discardCard);
        var shouldEat = false;
        if (eatPhom) {
            // Simulate hand after eating (remove phom members from hidden)
            var simHand = this.hands[player].slice();
            for (var i = 0; i < eatPhom.length; i++) {
                if (eatPhom[i] === this.discardCard) continue;
                var idx = simHand.indexOf(eatPhom[i]);
                if (idx !== -1) simHand.splice(idx, 1);
            }
            var racBefore = tlBestArr(this.hands[player]).rac.length;
            var racAfter  = tlBestArr(simHand).rac.length;
            shouldEat = racAfter < racBefore || racAfter === 0;
        }

        if (shouldEat) {
            this.turnLbl.setString(name + ' ăn!');
            // Capture eatPhom & discardCard in IIFE
            (function(phom, eaten) {
                thiz.runAction(cc.sequence(
                    cc.delayTime(0.9),
                    cc.callFunc(function() {
                        if (thiz.gameOver) return;
                        // Remove phom members from hidden hand
                        for (var i = 0; i < phom.length; i++) {
                            if (phom[i] === eaten) continue;
                            var idx = thiz.hands[player].indexOf(phom[i]);
                            if (idx !== -1) thiz.hands[player].splice(idx, 1);
                        }
                        thiz.phomLists[player].push(phom);
                        thiz._showPhoms(player);
                        thiz._hideDiscardCard();
                        thiz._showEatBubble(player);

                        if (tlIsUu(thiz.hands[player])) { thiz._playerWins(player); return; }

                        var discard = tlBotDiscard(thiz.hands[player]);
                        thiz.turnLbl.setString(name + ' đánh');
                        thiz.runAction(cc.sequence(
                            cc.delayTime(0.7),
                            cc.callFunc(function() { thiz._doDiscard(player, discard); })
                        ));
                    })
                ));
            })(eatPhom, this.discardCard);

        } else {
            var drawn = this._drawCard();
            if (!drawn) { this._endGame(null); return; }
            this.hands[player].push(drawn);
            this.turnLbl.setString(name + ' rút bài...');
            this.deckCountLbl.setString(this._deck.length + ' lá');
            this.runAction(cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(function() {
                    if (thiz.gameOver) return;
                    var discard = tlBotDiscard(thiz.hands[player]);
                    thiz.turnLbl.setString(name + ' đánh');
                    thiz.runAction(cc.sequence(
                        cc.delayTime(0.6),
                        cc.callFunc(function() { thiz._doDiscard(player, discard); })
                    ));
                })
            ));
        }
    },

    _drawCard: function() {
        var card = this._deck.length > 0 ? this._deck.pop() : null;
        if (card) this._updateDeckDisplay();
        return card;
    },

    _updateDeckDisplay: function() {
        var n = this._deck.length;
        // Hiện 1-5 sprite tuỳ số lá còn lại (mỗi sprite ~3 lá)
        var show = n === 0 ? 0 : Math.max(1, Math.min(5, Math.ceil(n / 3)));
        for (var d = 0; d < this.deckSprites.length; d++)
            this.deckSprites[d].setVisible(d < show);
        this.deckCountLbl.setString(n > 0 ? n + ' lá' : '');
    },

    // ===== Win / end =====
    _playerWins: function(player) {
        if (this.gameOver) return;
        this.gameOver = true;
        this.btnDanh.setVisible(false);
        this.btnAn.setVisible(false);
        this.btnBoQua.setVisible(false);

        // Người ù ăn hết hũ gà
        if (this.potAmount > 0) {
            this.playerObjs[player].addBudget(this.potAmount);
            if (this.walletLabels[player])
                this.walletLabels[player].setString(String(this.playerObjs[player].wallet_money));
            if (player === 'me')
                cc.sys.localStorage.setItem(this.me.name + '_wallet', this.playerObjs.me.wallet_money);
            this.potAmount = 0;
            cc.sys.localStorage.setItem('tala_pot', 0);
            this.potLbl.setString('0 xu');
        }

        this.turnLbl.setString(this.pNames[player] + ' Ù!');
        var thiz = this;
        this.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(function() { thiz._endGame(player); })
        ));
    },

    _endGame: function(winner) {
        if (this.gameOver && !winner) return;
        this.gameOver = true;
        this.btnDanh.setVisible(false);
        this.btnAn.setVisible(false);
        this.btnBoQua.setVisible(false);

        var thiz = this;
        var players = ['me','p1','p2','p3'];
        var scores  = {};
        players.forEach(function(p) {
            var arr = tlBestArr(thiz.hands[p]);
            scores[p] = arr.rac.reduce(function(s,c){return s+tlVal(c);}, 0);
        });

        // Xếp hạng: người ù luôn đứng đầu, sau đó ít rác nhất thắng,
        // cùng điểm rác → ai đánh bài trước trong lượt (thứ tự turnOrder) thì xếp cao hơn
        var ranked = players.slice().sort(function(a, b) {
            if (winner) {
                if (a === winner) return -1;
                if (b === winner) return 1;
            }
            if (scores[a] !== scores[b]) return scores[a] - scores[b];
            var ia = thiz.turnOrder.indexOf(a);
            var ib = thiz.turnOrder.indexOf(b);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });
        var winPlayer = ranked[0];

        // Update wallets based on winner
        var bet = thiz.bet_amount;
        players.forEach(function(p) {
            if (p === winPlayer) thiz.playerObjs[p].addBudget(bet * 3);
            else                 thiz.playerObjs[p].minusBudget(bet);
        });
        cc.sys.localStorage.setItem(thiz.me.name + '_wallet', thiz.playerObjs.me.wallet_money);
        players.forEach(function(p) {
            if (thiz.walletLabels[p])
                thiz.walletLabels[p].setString(String(thiz.playerObjs[p].wallet_money));
        });

        var title = thiz.pNames[winPlayer] + (winner ? ' Ù!' : ' thắng!');

        if (winPlayer === 'me') playSound(res.SFX_Win);
        else                    playSound(res.SFX_Lose);

        // Build phom text for each player (eaten phoms + phoms in remaining hand)
        function getPhomText(p) {
            var labels = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
            var syms   = { co:'\u2665', ro:'\u2666', tep:'\u2663', bich:'\u2660' };
            var all    = thiz.phomLists[p].slice();
            var inHand = tlBestArr(thiz.hands[p]).phoms;
            for (var i = 0; i < inHand.length; i++) all.push(inHand[i]);
            if (all.length === 0) return null; // Móm
            return all.map(function(phom) {
                return '[' + phom.map(function(c){ return labels[c.rank] + syms[c.suit]; }).join(' ') + ']';
            }).join('  ');
        }

        // Per-player result rows theo thứ tự xếp hạng
        var resultRows = ranked.map(function(p, idx) {
            var isWin   = (idx === 0);
            var amtStr  = isWin ? ('+' + bet * 3 + 'xu') : ('-' + bet + 'xu');
            var phomTxt = getPhomText(p);
            return { rank: idx + 1, name: thiz.pNames[p], score: scores[p],
                     amount: amtStr, win: isWin, phomText: phomTxt };
        });

        // Coin fly after popup close — từ từng người thua về người thắng
        function flyCoinsToWinner(onAllDone) {
            if (!winPlayer) { if (onAllDone) onAllDone(); return; }
            var winPos  = thiz.pos[winPlayer];
            var losers  = players.filter(function(p){ return p !== winPlayer; });
            var pending = losers.length;
            if (pending === 0) { if (onAllDone) onAllDone(); return; }
            playSound(res.SFX_CoinFly);
            losers.forEach(function(p) {
                var fp = thiz.pos[p];
                showCoinsFly(thiz, fp.x, fp.y, winPos.x, winPos.y, 8, function() {
                    pending--;
                    if (pending === 0 && onAllDone) onAllDone();
                });
            });
        }

        // End popup
        var size = cc.winSize;
        var overlay = new cc.LayerColor(new cc.Color(0,0,0,160));
        overlay.setContentSize(size.width, size.height);

        var pW = 780, pH = 470;
        var panel = new cc.LayerColor(new cc.Color(30,30,30,245));
        panel.setContentSize(pW, pH);
        panel.x = (size.width-pW)/2; panel.y = (size.height-pH)/2;

        var border = new cc.DrawNode();
        border.drawRect(cc.p(0,0), cc.p(pW,pH), null, 3, new cc.Color(212,175,55,255));
        panel.addChild(border);

        var t1 = new cc.LabelTTF(title, 'Arial', 50);
        t1.setPosition(pW/2, pH - 58);
        t1.setColor(new cc.Color(255,230,50));
        panel.addChild(t1);

        var divider = new cc.DrawNode();
        divider.drawSegment(cc.p(30, pH-90), cc.p(pW-30, pH-90), 1, new cc.Color(180,150,40,150));
        panel.addChild(divider);

        // Per-player result rows (theo thứ tự xếp hạng)
        var rowY = pH - 120;
        resultRows.forEach(function(r) {
            var rankLbl = new cc.LabelTTF(r.rank + '.', 'Arial', 24);
            rankLbl.setAnchorPoint(cc.p(0, 0.5));
            rankLbl.setPosition(20, rowY);
            rankLbl.setColor(r.win ? new cc.Color(255,215,0) : new cc.Color(130,130,130));
            panel.addChild(rankLbl);

            var raceLbl = new cc.LabelTTF('Rác:' + r.score, 'Arial', 21);
            raceLbl.setAnchorPoint(cc.p(0, 0.5));
            raceLbl.setPosition(58, rowY);
            raceLbl.setColor(new cc.Color(160,160,160));
            panel.addChild(raceLbl);

            var nameLbl = new cc.LabelTTF(r.name, 'Arial', 26);
            nameLbl.setAnchorPoint(cc.p(0.5, 0.5));
            nameLbl.setPosition(pW/2, rowY);
            nameLbl.setColor(r.win ? new cc.Color(255,240,120) : new cc.Color(210,210,210));
            panel.addChild(nameLbl);

            var amtLbl = new cc.LabelTTF(r.amount, 'Arial', 26);
            amtLbl.setAnchorPoint(cc.p(1, 0.5));
            amtLbl.setPosition(pW - 20, rowY);
            amtLbl.setColor(r.win ? new cc.Color(80,255,140) : new cc.Color(255,130,80));
            panel.addChild(amtLbl);

            // Phom info / Móm (line 2)
            var phomStr = r.phomText ? r.phomText : 'Móm';
            var phomLbl = new cc.LabelTTF(phomStr, 'Arial', 19);
            phomLbl.setAnchorPoint(cc.p(0.5, 0.5));
            phomLbl.setPosition(pW/2, rowY - 22);
            phomLbl.setColor(r.phomText ? new cc.Color(100,210,255) : new cc.Color(255,70,70));
            panel.addChild(phomLbl);

            rowY -= 64;
        });

        var btnNew   = this._makeBtn('Ván mới',  new cc.Color(30,120,50));
        var btnExit  = this._makeBtn('Thoát',    new cc.Color(160,50,30));
        var btnShare = this._makeBtn('Chia sẻ', new cc.Color(24,119,242));
        btnNew.x   = pW/2 - 200; btnNew.y   = 46;
        btnExit.x  = pW/2 + 200; btnExit.y  = 46;
        btnShare.x = pW/2;       btnShare.y  = 46;
        panel.addChild(btnNew);
        panel.addChild(btnExit);
        panel.addChild(btnShare);

        var winnerName = ranked[0].name;
        var shareText  = 'Tôi vừa chơi Tá Lả trên KingFun!\n'
                       + winnerName + ' thang van nay!\n'
                       + ranked.map(function(r){ return r.name + ': ' + r.amount; }).join(' | ');

        btnShare.addClickEventListener(function() { FB.share(shareText); });
        btnNew.addClickEventListener(function() {
            overlay.removeFromParent();
            flyCoinsToWinner(function() {
                thiz._restartInPlace();
            });
        });
        btnExit.addClickEventListener(function() {
            overlay.removeFromParent();
            flyCoinsToWinner(function() {
                cc.director.runScene(new GameSelectScene());
            });
        });

        overlay.addChild(panel);
        cc.director.getRunningScene().addChild(overlay, 100);
    },

    // ===== Visual helpers =====
    _showDiscardCard: function(card) {
        if (this.discardNode) this.discardNode.removeFromParent();
        this.discardNode = makeTaLaCardNode(card.rank, card.suit);
        this.discardNode.setScale(0.16);
        this.discardNode.setPosition(this.discardPileX, this.discardPileY);
        this.addChild(this.discardNode, 6);
    },

    _hideDiscardCard: function() {
        if (this.discardNode) { this.discardNode.removeFromParent(); this.discardNode = null; }
        this.discardCard = null;
    },

    // Show all eaten phoms for a player (small cards near their position)
    _showPhoms: function(player) {
        var thiz = this;
        for (var i = 0; i < this.phomNodes[player].length; i++)
            this.phomNodes[player][i].removeFromParent();
        this.phomNodes[player] = [];

        var p = this.pos[player];
        var bx, by;
        if      (player === 'me') { bx = p.x - 340; by = p.y - 95; }
        else if (player === 'p1') { bx = p.x - 160; by = p.y + 95; }
        else if (player === 'p2') { bx = p.x + 55;  by = p.y - 40; }
        else                      { bx = p.x - 95;  by = p.y - 40; }

        var xOff = 0;
        var list = this.phomLists[player];
        for (var i = 0; i < list.length; i++) {
            var phom = list[i];
            for (var j = 0; j < phom.length; j++) {
                (function(card, x, y) {
                    var n = makeTaLaCardNode(card.rank, card.suit);
                    n.setScale(0.09);
                    n.setPosition(x, y);
                    thiz.addChild(n, 4);
                    thiz.phomNodes[player].push(n);
                })(phom[j], bx + xOff + j*20, by);
            }
            xOff += phom.length*20 + 8;
        }
    },

    _xepBai: function() {
        this.hands.me = tlSortHand(this.hands.me);
        this._rebuildMeHand();
        // Giữ lại trạng thái nút hiện tại
        if (this.state === 'discard' && this.turnOrder[this.turnIdx] === 'me')
            this.btnDanh.setVisible(true);
    },

    _showEatBubble: function(player) {
        var pos  = this.pos[player];
        var off  = { me: {x:130,y:70}, p1: {x:130,y:-65}, p2: {x:150,y:30}, p3: {x:-150,y:30} }[player];
        var bW = 178, bH = 56;

        var bubble = new cc.Node();
        bubble.setAnchorPoint(cc.p(0.5, 0.5));
        bubble.setPosition(pos.x + off.x, pos.y + off.y);
        this.addChild(bubble, 25);

        // Nền chat bubble
        var bg = new cc.DrawNode();
        bg.drawRect(
            cc.p(-bW/2, -bH/2), cc.p(bW/2, bH/2),
            new cc.Color(255, 238, 80, 235), 2, new cc.Color(200, 145, 0, 255)
        );
        bubble.addChild(bg, 0);

        // Tam giác nhỏ chỉ hướng người chơi
        var tri = new cc.DrawNode();
        var tx = (player === 'p3') ? bW/2 : -bW/2;
        var dx = (player === 'p3') ? 14 : -14;
        tri.drawPoly(
            [cc.p(tx, 6), cc.p(tx, -6), cc.p(tx + dx, 0)],
            new cc.Color(255, 238, 80, 235), 0, new cc.Color(255,238,80,0)
        );
        bubble.addChild(tri, 0);

        var lbl = new cc.LabelTTF('Hay quá!', 'Arial', 27);
        lbl.setColor(new cc.Color(70, 35, 0));
        lbl.setPosition(0, 0);
        bubble.addChild(lbl, 1);

        // Pop in → chờ 0.85s → fade out
        bubble.setScale(0.15);
        bubble.runAction(cc.sequence(
            cc.scaleTo(0.10, 1.12),
            cc.scaleTo(0.06, 1.0),
            cc.delayTime(0.85),
            cc.fadeOut(0.22),
            cc.callFunc(function() { bubble.removeFromParent(); })
        ));
    },

    _restartInPlace: function() {
        var thiz = this;
        var keys = ['me','p1','p2','p3'];

        // Xoá bài trên tay
        for (var i = 0; i < this.meHandNodes.length; i++) this.meHandNodes[i].removeFromParent();
        this.meHandNodes = [];

        // Xoá phỏm nodes
        keys.forEach(function(p) {
            for (var i = 0; i < thiz.phomNodes[p].length; i++) thiz.phomNodes[p][i].removeFromParent();
            thiz.phomNodes[p]  = [];
            thiz.phomLists[p]  = [];
        });

        // Xoá cây đang bỏ
        if (this.discardNode) { this.discardNode.removeFromParent(); this.discardNode = null; }
        this.discardCard = null;

        // Reset UI
        this.btnDanh.setVisible(false);
        this.btnAn.setVisible(false);
        this.btnBoQua.setVisible(false);
        this.btnXepBai.setVisible(true);
        this.turnLbl.setString('');
        this.deckCountLbl.setString('');
        for (var d = 0; d < this.deckSprites.length; d++) {
            this.deckSprites[d].setVisible(false);
            this.deckSprites[d].setOpacity(255);
        }

        // Reset trạng thái
        this.gameOver    = false;
        this.selectedIdx = -1;

        // Dựng lại deal slots cho me
        var posMe    = this.pos.me;
        var meCount  = 10, meSpacing = 60;
        var meStartX = posMe.x - (meCount - 1) * meSpacing / 2;
        this.meSlots = this._makeSlots(meCount, meStartX, posMe.y - 100, meSpacing, 0, 0, 0, this, 0.32);

        // Bắt đầu ván mới ngay
        this._doDeal();
    },

    _makeBtn: function(text, color) {
        var btn = new ccui.Button('res/btn_register_normal.png','','');
        btn.setScale9Enabled(true);
        btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
        btn.setContentSize(cc.size(160, 65));
        btn.setTitleText(text);
        btn.setTitleFontSize(34);
        btn.setTitleColor(new cc.Color(255,255,255));
        btn.setColor(color);
        btn.setZoomScale(-0.05);
        btn.scale = 1.2;
        return btn;
    },

    _makeSlots: function(n, sx, sy, dx, dy, rS, rStep, layer, scale) {
        scale = scale || 0.1;
        var slots = [];
        for (var i = 0; i < n; i++) {
            var card = new cc.Sprite(res.BackCard_png);
            card.setScale(scale);
            card.setPosition(sx + i*dx, sy + i*dy);
            card.setRotation(rS + i*rStep);
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
