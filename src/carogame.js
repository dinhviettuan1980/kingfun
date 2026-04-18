// =====================================================
// Cờ Caro  15×15 — người chơi ● Đen, máy ○ Trắng
// Thắng khi có 5 quân liên tiếp
// =====================================================

var CaroLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);
        var thiz = this;
        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite('res/LoginBng.png');
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        var title = new cc.LabelTTF('Cờ Caro', 'Arial', 50);
        title.setPosition(cx, cy + 285);
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

        // Board params
        this.N    = 15;   // 15×15 giao điểm
        this.CELL = 32;   // px giữa các giao điểm
        this.bx   = cx - (this.N - 1) * this.CELL / 2;
        this.by   = cy - (this.N - 1) * this.CELL / 2 - 15;

        this._drawBoard();

        // Trạng thái
        this.board    = [];
        for (var r = 0; r < this.N; r++) {
            this.board.push([]);
            for (var c = 0; c < this.N; c++) this.board[r].push(0);
        }
        this.stoneNodes = [];
        this.lastMark   = null;
        this.gameOver   = false;

        this.statusLbl = new cc.LabelTTF('Bạn đánh ● Đen  —  Máy đánh ○ Trắng', 'Arial', 28);
        this.statusLbl.setPosition(cx, this.by - 44);
        this.statusLbl.setColor(new cc.Color(255, 240, 120));
        this.addChild(this.statusLbl, 5);

        // Touch / click
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
                var x = (e.clientX - rect.left) * (cc.winSize.width  / rect.width);
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

    // ===== Vẽ bàn cờ =====
    _drawBoard: function() {
        var N = this.N, C = this.CELL, bx = this.bx, by = this.by;
        var pad = 14;
        var g = new cc.DrawNode();

        // Nền gỗ
        g.drawRect(
            cc.p(bx - pad, by - pad),
            cc.p(bx + (N-1)*C + pad, by + (N-1)*C + pad),
            new cc.Color(195, 155, 85, 255),
            2, new cc.Color(130, 95, 38, 255)
        );

        // Đường kẻ
        var lc = new cc.Color(110, 75, 28, 220);
        for (var i = 0; i < N; i++) {
            g.drawSegment(cc.p(bx + i*C, by),         cc.p(bx + i*C, by + (N-1)*C), 1, lc);
            g.drawSegment(cc.p(bx,       by + i*C),   cc.p(bx + (N-1)*C, by + i*C), 1, lc);
        }

        // Điểm hoa thị (star points)
        var stars = [[3,3],[3,7],[3,11],[7,3],[7,7],[7,11],[11,3],[11,7],[11,11]];
        for (var i = 0; i < stars.length; i++) {
            g.drawDot(
                cc.p(bx + stars[i][1]*C, by + stars[i][0]*C),
                3.5, new cc.Color(110, 75, 28, 255)
            );
        }

        this.addChild(g, 2);
    },

    // ===== Xử lý click =====
    _handleTap: function(x, y) {
        if (this.gameOver) return;
        var C = this.CELL, bx = this.bx, by = this.by, N = this.N;

        var col = Math.round((x - bx) / C);
        var row = Math.round((y - by) / C);
        if (col < 0 || col >= N || row < 0 || row >= N) return;
        if (Math.abs(x - (bx + col*C)) > C*0.65) return;
        if (Math.abs(y - (by + row*C)) > C*0.65) return;
        if (this.board[row][col] !== 0) return;

        this._place(row, col, 1);
        if (this._checkWin(row, col, 1)) { this._endGame('Bạn thắng!', 1);  return; }
        if (this._full())                 { this._endGame('Hoà rồi!', 0);   return; }

        this.statusLbl.setString('Máy đang suy nghĩ...');
        var thiz = this;
        this.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(function() { thiz._aiMove(); })
        ));
    },

    // ===== AI =====
    _aiMove: function() {
        if (this.gameOver) return;
        var m = this._bestMove();
        this._place(m.row, m.col, 2);
        if (this._checkWin(m.row, m.col, 2)) { this._endGame('Máy thắng!', -1); return; }
        if (this._full())                      { this._endGame('Hoà rồi!', 0);   return; }
        this.statusLbl.setString('Lượt của bạn (●)');
    },

    _bestMove: function() {
        var N = this.N, best = -1, br = 7, bc = 7;

        // Bàn trống → đánh giữa
        var empty = true;
        outer: for (var r = 0; r < N; r++)
            for (var c = 0; c < N; c++)
                if (this.board[r][c]) { empty = false; break outer; }
        if (empty) return { row: 7, col: 7 };

        for (var r = 0; r < N; r++) {
            for (var c = 0; c < N; c++) {
                if (this.board[r][c] || !this._near(r, c, 2)) continue;
                var s = this._evalCell(r, c);
                if (s > best) { best = s; br = r; bc = c; }
            }
        }
        return { row: br, col: bc };
    },

    _near: function(row, col, dist) {
        var N = this.N;
        for (var dr = -dist; dr <= dist; dr++)
            for (var dc = -dist; dc <= dist; dc++) {
                if (!dr && !dc) continue;
                var nr = row+dr, nc = col+dc;
                if (nr >= 0 && nr < N && nc >= 0 && nc < N && this.board[nr][nc]) return true;
            }
        return false;
    },

    _evalCell: function(row, col) {
        var dirs = [[0,1],[1,0],[1,1],[1,-1]];
        var atk = 0, def = 0;

        this.board[row][col] = 2;
        for (var d = 0; d < dirs.length; d++)
            atk += this._score(this._count(row, col, dirs[d][0], dirs[d][1], 2));
        this.board[row][col] = 0;

        this.board[row][col] = 1;
        for (var d = 0; d < dirs.length; d++)
            def += this._score(this._count(row, col, dirs[d][0], dirs[d][1], 1));
        this.board[row][col] = 0;

        return atk + def * 1.15;
    },

    _count: function(row, col, dr, dc, p) {
        var N = this.N, b = this.board, cnt = 1, open = 0;
        var r = row+dr, c = col+dc;
        while (r>=0 && r<N && c>=0 && c<N && b[r][c]===p) { cnt++; r+=dr; c+=dc; }
        if (r>=0 && r<N && c>=0 && c<N && b[r][c]===0) open++;
        r = row-dr; c = col-dc;
        while (r>=0 && r<N && c>=0 && c<N && b[r][c]===p) { cnt++; r-=dr; c-=dc; }
        if (r>=0 && r<N && c>=0 && c<N && b[r][c]===0) open++;
        return { cnt: cnt, open: open };
    },

    _score: function(v) {
        var n = v.cnt, o = v.open;
        if (n >= 5) return 500000;
        if (n === 4) return o >= 2 ? 200000 : (o ? 20000 : 500);
        if (n === 3) return o >= 2 ? 10000  : (o ? 800   : 0);
        if (n === 2) return o >= 2 ? 600    : (o ? 60    : 0);
        return o ? 8 : 0;
    },

    // ===== Đặt quân =====
    _place: function(row, col, player) {
        this.board[row][col] = player;
        var C = this.CELL;
        var px = this.bx + col * C;
        var py = this.by + row * C;
        var r  = C * 0.43;

        var node = new cc.DrawNode();
        if (player === 1) {
            // Đen: nền tối + highlight nhỏ
            node.drawDot(cc.p(0, 0), r, new cc.Color(28, 28, 28, 255));
            node.drawDot(cc.p(-r*0.25, r*0.25), r*0.3, new cc.Color(80, 80, 80, 180));
        } else {
            // Trắng: viền tối + nền sáng + highlight
            node.drawDot(cc.p(0, 0), r, new cc.Color(55, 55, 55, 255));
            node.drawDot(cc.p(0, 0), r - 2, new cc.Color(235, 235, 235, 255));
            node.drawDot(cc.p(-r*0.25, r*0.25), r*0.28, new cc.Color(255, 255, 255, 200));
        }

        node.setPosition(px, py);
        this.addChild(node, 3);
        this.stoneNodes.push(node);

        // Đánh dấu nước đi cuối
        if (this.lastMark) this.lastMark.removeFromParent();
        var mark = new cc.DrawNode();
        var mc = player === 1 ? new cc.Color(255,80,80,220) : new cc.Color(80,80,255,220);
        mark.drawDot(cc.p(px, py), 4, mc);
        this.addChild(mark, 4);
        this.lastMark = mark;

        node.setScale(0);
        node.runAction(cc.sequence(cc.scaleTo(0.08, 1.18), cc.scaleTo(0.05, 1.0)));
    },

    // ===== Kiểm tra thắng =====
    _checkWin: function(row, col, p) {
        var dirs = [[0,1],[1,0],[1,1],[1,-1]];
        for (var d = 0; d < dirs.length; d++)
            if (this._count(row, col, dirs[d][0], dirs[d][1], p).cnt >= 5) return true;
        return false;
    },

    _full: function() {
        for (var r = 0; r < this.N; r++)
            for (var c = 0; c < this.N; c++)
                if (!this.board[r][c]) return false;
        return true;
    },

    _endGame: function(msg, result) {
        this.gameOver = true;
        var thiz = this;
        this.runAction(cc.sequence(
            cc.delayTime(0.45),
            cc.callFunc(function() { thiz._showPopup(msg, result); })
        ));
    },

    // ===== Popup kết quả =====
    _showPopup: function(msg, result) {
        var thiz = this;
        var size = cc.winSize;

        var overlay = new cc.LayerColor(new cc.Color(0, 0, 0, 160));
        overlay.setContentSize(size.width, size.height);

        var pW = 520, pH = 270;
        var bgCol = result === 1  ? new cc.Color(20, 55, 20, 248)
                  : result === -1 ? new cc.Color(55, 20, 20, 248)
                  :                 new cc.Color(25, 25, 55, 248);
        var panel = new cc.LayerColor(bgCol);
        panel.setContentSize(pW, pH);
        panel.x = (size.width  - pW) / 2;
        panel.y = (size.height - pH) / 2;

        var bCol = result === 1  ? new cc.Color(80, 255, 120, 255)
                 : result === -1 ? new cc.Color(255, 80, 80, 255)
                 :                 new cc.Color(160, 160, 255, 255);
        var border = new cc.DrawNode();
        border.drawRect(cc.p(0, 0), cc.p(pW, pH), null, 3, bCol);
        panel.addChild(border);

        var msgLbl = new cc.LabelTTF(msg, 'Arial', 56);
        msgLbl.setPosition(pW/2, pH - 82);
        msgLbl.setColor(bCol);
        panel.addChild(msgLbl);

        var btnPlay = this._makeBtn('Chơi lại', new cc.Color(30, 120, 50));
        var btnExit = this._makeBtn('Thoát',    new cc.Color(150, 40, 40));
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

    // ===== Reset =====
    _reset: function() {
        for (var i = 0; i < this.stoneNodes.length; i++) this.stoneNodes[i].removeFromParent();
        this.stoneNodes = [];
        if (this.lastMark) { this.lastMark.removeFromParent(); this.lastMark = null; }
        for (var r = 0; r < this.N; r++)
            for (var c = 0; c < this.N; c++) this.board[r][c] = 0;
        this.gameOver = false;
        this.statusLbl.setString('Bạn đánh ● Đen  —  Máy đánh ○ Trắng');
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

var CaroScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new CaroLayer());
    }
});
