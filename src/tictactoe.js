// =====================================================
// Tic-Tac-Toe  (X = người chơi, O = máy)
// =====================================================

var TicTacToeLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);
        var thiz = this;
        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite('res/LoginBng.png');
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        var title = new cc.LabelTTF('Tic-Tac-Toe', 'Arial', 52);
        title.setPosition(cx, cy + 265);
        title.setColor(new cc.Color(255, 225, 50));
        this.addChild(title, 5);

        var backBtn = new ccui.Button(res.Back_png, '', '');
        backBtn.x = size.width - 80; backBtn.y = size.height - 60;
        backBtn.scale = 1; backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 6);
        backBtn.addClickEventListener(function() {
            thiz._cleanup();
            cc.director.runScene(new MiniGamesScene());
        });

        // Board
        this.CELL = 130;
        this.bx   = cx - this.CELL * 1.5;
        this.by   = cy - this.CELL * 1.5 - 20;
        this._drawGrid();

        // State
        this.board    = [0,0,0, 0,0,0, 0,0,0];
        this.marks    = [];
        this.winLine  = null;
        this.gameOver = false;

        this.statusLbl = new cc.LabelTTF(L('ttt_status'), 'Arial', 34);
        this.statusLbl.setPosition(cx, this.by - 52);
        this.statusLbl.setColor(new cc.Color(255, 240, 120));
        this.addChild(this.statusLbl, 5);

        // Touch / click handling
        if (cc.sys.isNative) {
            this._touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function(touch) {
                    var loc = touch.getLocation();
                    thiz._handleTap(loc.x, loc.y);
                    return true;
                }
            });
            cc.eventManager.addListener(this._touchListener, this);
        } else {
            this._mouseHandler = function(e) {
                var rect = cc.game.canvas.getBoundingClientRect();
                var x = (e.clientX - rect.left)  * (cc.winSize.width  / rect.width);
                var y = cc.winSize.height - (e.clientY - rect.top) * (cc.winSize.height / rect.height);
                thiz._handleTap(x, y);
            };
            cc.game.canvas.addEventListener('mousedown', this._mouseHandler);
        }
    },

    _cleanup: function() {
        if (this._mouseHandler) {
            cc.game.canvas.removeEventListener('mousedown', this._mouseHandler);
            this._mouseHandler = null;
        }
    },

    onExit: function() {
        cc.Layer.prototype.onExit.call(this);
        this._cleanup();
    },

    _drawGrid: function() {
        var C = this.CELL, bx = this.bx, by = this.by;
        var lc = new cc.Color(220, 220, 220, 255);
        var g = new cc.DrawNode();
        g.drawRect(cc.p(bx, by), cc.p(bx + C*3, by + C*3), null, 4, lc);
        g.drawSegment(cc.p(bx+C,   by), cc.p(bx+C,   by+C*3), 4, lc);
        g.drawSegment(cc.p(bx+C*2, by), cc.p(bx+C*2, by+C*3), 4, lc);
        g.drawSegment(cc.p(bx, by+C),   cc.p(bx+C*3, by+C),   4, lc);
        g.drawSegment(cc.p(bx, by+C*2), cc.p(bx+C*3, by+C*2), 4, lc);
        this.addChild(g, 2);
    },

    // ===== Click handler =====
    _handleTap: function(x, y) {
        if (this.gameOver) return;
        var C = this.CELL, bx = this.bx, by = this.by;
        if (x < bx || x > bx+C*3 || y < by || y > by+C*3) return;
        var col = Math.floor((x - bx) / C);
        var row = Math.floor((y - by) / C);
        col = Math.max(0, Math.min(2, col));
        row = Math.max(0, Math.min(2, row));
        var idx = row * 3 + col;
        if (this.board[idx] !== 0) return;

        this._place(idx, 1);
        if (this._checkEnd()) return;

        this.statusLbl.setString(L('ai_thinking'));
        var thiz = this;
        this.runAction(cc.sequence(
            cc.delayTime(0.42),
            cc.callFunc(function() { thiz._botMove(); })
        ));
    },

    // ===== Bot =====
    _botMove: function() {
        if (this.gameOver) return;
        this._place(this._bestMove(), 2);
        this._checkEnd();
    },

    _bestMove: function() {
        var best = -100, bestIdx = -1;
        for (var i = 0; i < 9; i++) {
            if (this.board[i] !== 0) continue;
            this.board[i] = 2;
            var s = this._minimax(0, false);
            this.board[i] = 0;
            if (s > best) { best = s; bestIdx = i; }
        }
        return bestIdx;
    },

    _minimax: function(depth, isMax) {
        var w = this._winner();
        if (w === 2) return 10 - depth;
        if (w === 1) return depth - 10;
        var hasEmpty = false;
        for (var i = 0; i < 9; i++) if (this.board[i] === 0) { hasEmpty = true; break; }
        if (!hasEmpty) return 0;

        if (isMax) {
            var best = -100;
            for (var i = 0; i < 9; i++) {
                if (this.board[i]) continue;
                this.board[i] = 2;
                var s = this._minimax(depth + 1, false);
                this.board[i] = 0;
                if (s > best) best = s;
            }
            return best;
        } else {
            var best = 100;
            for (var i = 0; i < 9; i++) {
                if (this.board[i]) continue;
                this.board[i] = 1;
                var s = this._minimax(depth + 1, true);
                this.board[i] = 0;
                if (s < best) best = s;
            }
            return best;
        }
    },

    _place: function(idx, player) {
        this.board[idx] = player;
        var C = this.CELL;
        var col = idx % 3, row = Math.floor(idx / 3);
        var px = this.bx + col * C + C / 2;
        var py = this.by + row * C + C / 2;
        var half = C / 2 - 18;

        var mark = new cc.DrawNode();
        if (player === 1) {
            mark.drawSegment(cc.p(-half,-half), cc.p(half, half), 8, new cc.Color(80,170,255,255));
            mark.drawSegment(cc.p( half,-half), cc.p(-half,half), 8, new cc.Color(80,170,255,255));
        } else {
            var r = half, steps = 32;
            for (var s = 0; s < steps; s++) {
                var a1 = s     / steps * Math.PI * 2;
                var a2 = (s+1) / steps * Math.PI * 2;
                mark.drawSegment(
                    cc.p(Math.cos(a1)*r, Math.sin(a1)*r),
                    cc.p(Math.cos(a2)*r, Math.sin(a2)*r),
                    8, new cc.Color(255, 90, 90, 255)
                );
            }
        }
        mark.setPosition(px, py);
        this.addChild(mark, 3);
        this.marks.push(mark);

        mark.setScale(0);
        mark.runAction(cc.sequence(cc.scaleTo(0.10, 1.2), cc.scaleTo(0.06, 1.0)));
    },

    _checkEnd: function() {
        var w = this._winner();
        if (w) {
            this.gameOver = true;
            this._drawWinLine(w);
            var msg = w === 1 ? L('you_win') : L('machine_wins');
            var thiz = this;
            this.runAction(cc.sequence(
                cc.delayTime(0.55),
                cc.callFunc(function() { thiz._showPopup(msg, w === 1 ? 1 : -1); })
            ));
            return true;
        }
        var full = true;
        for (var i = 0; i < 9; i++) if (this.board[i] === 0) { full = false; break; }
        if (full) {
            this.gameOver = true;
            var thiz = this;
            this.runAction(cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function() { thiz._showPopup(L('draw'), 0); })
            ));
            return true;
        }
        this.statusLbl.setString(L('ttt_your_turn'));
        return false;
    },

    _winner: function() {
        var b = this.board;
        var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return b[l[0]];
        }
        return 0;
    },

    _drawWinLine: function(player) {
        var b = this.board, C = this.CELL;
        var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (b[l[0]] === player && b[l[1]] === player && b[l[2]] === player) {
                var x1 = this.bx + (l[0]%3)*C + C/2, y1 = this.by + Math.floor(l[0]/3)*C + C/2;
                var x3 = this.bx + (l[2]%3)*C + C/2, y3 = this.by + Math.floor(l[2]/3)*C + C/2;
                var col = player === 1 ? new cc.Color(80,200,255,210) : new cc.Color(255,90,90,210);
                var wl = new cc.DrawNode();
                wl.drawSegment(cc.p(x1,y1), cc.p(x3,y3), 12, col);
                this.addChild(wl, 4);
                this.winLine = wl;
                return;
            }
        }
    },

    _showPopup: function(msg, result) {
        if (result === 1)       playSound(res.SFX_Win);
        else if (result === -1) playSound(res.SFX_Lose);
        var thiz = this;
        var size = cc.winSize;

        var overlay = new cc.LayerColor(new cc.Color(0,0,0,160));
        overlay.setContentSize(size.width, size.height);

        var pW = 520, pH = 270;
        var bgCol = result === 1 ? new cc.Color(20,55,20,248)
                  : result ===-1 ? new cc.Color(55,20,20,248)
                  :                new cc.Color(25,25,55,248);
        var panel = new cc.LayerColor(bgCol);
        panel.setContentSize(pW, pH);
        panel.x = (size.width  - pW) / 2;
        panel.y = (size.height - pH) / 2;

        var bCol = result === 1 ? new cc.Color(80,255,120,255)
                 : result ===-1 ? new cc.Color(255,80,80,255)
                 :                new cc.Color(160,160,255,255);
        var border = new cc.DrawNode();
        border.drawRect(cc.p(0,0), cc.p(pW,pH), null, 3, bCol);
        panel.addChild(border);

        var msgLbl = new cc.LabelTTF(msg, 'Arial', 56);
        msgLbl.setPosition(pW/2, pH - 82);
        msgLbl.setColor(bCol);
        panel.addChild(msgLbl);

        var btnPlay = this._makeBtn(L('play_again'), new cc.Color(30, 120, 50));
        var btnExit = this._makeBtn(L('exit'),       new cc.Color(150, 40, 40));
        btnPlay.x = pW/2 - 110; btnPlay.y = 54;
        btnExit.x = pW/2 + 110; btnExit.y = 54;
        panel.addChild(btnPlay);
        panel.addChild(btnExit);

        btnPlay.addClickEventListener(function() {
            overlay.removeFromParent();
            thiz._reset();
        });
        btnExit.addClickEventListener(function() {
            overlay.removeFromParent();
            thiz._cleanup();
            cc.director.runScene(new MiniGamesScene());
        });

        var blocker = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function() { return true; }
        });
        cc.eventManager.addListener(blocker, overlay);

        overlay.addChild(panel);
        cc.director.getRunningScene().addChild(overlay, 50);

        panel.setScale(0.1);
        panel.runAction(cc.sequence(cc.scaleTo(0.14, 1.08), cc.scaleTo(0.06, 1.0)));
    },

    _reset: function() {
        for (var i = 0; i < this.marks.length; i++) this.marks[i].removeFromParent();
        this.marks = [];
        if (this.winLine) { this.winLine.removeFromParent(); this.winLine = null; }
        this.board    = [0,0,0, 0,0,0, 0,0,0];
        this.gameOver = false;
        this.statusLbl.setString(L('ttt_status'));
    },

    _makeBtn: function(text, color) {
        var btn = new ccui.Button('res/btn_register_normal.png', '', '');
        btn.setScale9Enabled(true);
        btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
        btn.setContentSize(cc.size(200, 70));
        btn.setTitleText(text);
        btn.setTitleFontSize(34);
        btn.setTitleColor(new cc.Color(255, 255, 255));
        btn.setColor(color);
        btn.setZoomScale(-0.05);
        btn.scale = 1.2;
        return btn;
    }
});

var TicTacToeScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new TicTacToeLayer());
    }
});
