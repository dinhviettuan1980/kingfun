// =====================================================
// Cờ Vây (Go) — 9×9  (Đen = người, Trắng = máy)
// =====================================================

var GoLayer = cc.Layer.extend({
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);
        var thiz = this;
        var size = cc.winSize;
        var cx = size.width / 2, cy = size.height / 2;

        var bg = new cc.Sprite('res/LoginBng.png');
        bg.scale = 1.1; bg.x = cx; bg.y = cy;
        this.addChild(bg);

        var title = new cc.LabelTTF('Cờ Vây 9×9', 'Arial', 48);
        title.setPosition(cx, cy + 270);
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
        this.N    = 9;
        this.CELL = 46;
        var span  = this.CELL * (this.N - 1);
        this.bx   = cx - span / 2;
        this.by   = cy - span / 2 - 10;
        this._drawBoard();

        // State
        this.board      = [];
        for (var i = 0; i < this.N * this.N; i++) this.board.push(0);
        this.stoneNodes = {};
        this.captures   = {1: 0, 2: 0};
        this.prevBoard  = null;
        this.gameOver   = false;
        this.passes     = 0;
        this.turn       = 1; // 1=Đen(người) 2=Trắng(máy)

        this.statusLbl = new cc.LabelTTF('Bạn đi Đen  —  Máy đi Trắng', 'Arial', 28);
        this.statusLbl.setPosition(cx, this.by - 42);
        this.statusLbl.setColor(new cc.Color(255, 240, 120));
        this.addChild(this.statusLbl, 5);

        this.capLbl = new cc.LabelTTF('Đen bắt: 0   Trắng bắt: 0', 'Arial', 24);
        this.capLbl.setPosition(cx, this.by - 76);
        this.capLbl.setColor(new cc.Color(200, 220, 200));
        this.addChild(this.capLbl, 5);

        var passBtn = new ccui.Button('res/btn_register_normal.png', '', '');
        passBtn.setScale9Enabled(true);
        passBtn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
        passBtn.setContentSize(cc.size(160, 58));
        passBtn.setTitleText('Bỏ lượt');
        passBtn.setTitleFontSize(26);
        passBtn.setTitleColor(new cc.Color(255, 255, 255));
        passBtn.setColor(new cc.Color(70, 70, 110));
        passBtn.setZoomScale(-0.05);
        passBtn.setPosition(cx, this.by - 118);
        this.addChild(passBtn, 6);
        passBtn.addClickEventListener(function() {
            if (thiz.gameOver || thiz.turn !== 1) return;
            thiz._doPass(1);
        });

        // Input
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

    // ===== Vẽ bàn =====
    _drawBoard: function() {
        var N = this.N, C = this.CELL, bx = this.bx, by = this.by;
        var span = C * (N - 1);

        var g = new cc.DrawNode();
        var pad = Math.round(C * 0.65);
        var lc  = new cc.Color(80, 55, 20, 255);
        // Nền gỗ (dùng drawRect với fill giống carogame)
        g.drawRect(
            cc.p(bx - pad, by - pad),
            cc.p(bx + span + pad, by + span + pad),
            new cc.Color(195, 155, 85, 255),
            2, new cc.Color(130, 95, 38, 255)
        );
        for (var i = 0; i < N; i++) {
            g.drawSegment(cc.p(bx + i*C, by), cc.p(bx + i*C, by + span), 1.5, lc);
            g.drawSegment(cc.p(bx, by + i*C), cc.p(bx + span, by + i*C), 1.5, lc);
        }
        g.drawRect(cc.p(bx, by), cc.p(bx + span, by + span), null, 3, lc);
        this.addChild(g, 2);

        // Hoshi points cho 9x9: 4 góc (2,2) + trung tâm (4,4)
        var stars = [[2,2],[2,6],[4,4],[6,2],[6,6]];
        var sg = new cc.DrawNode();
        for (var s = 0; s < stars.length; s++) {
            sg.drawDot(
                cc.p(bx + stars[s][1]*C, by + stars[s][0]*C),
                4, new cc.Color(80, 55, 20, 255)
            );
        }
        this.addChild(sg, 2);
    },

    // ===== Tap handler =====
    _handleTap: function(x, y) {
        if (this.gameOver || this.turn !== 1) return;
        var C = this.CELL;
        var col = Math.round((x - this.bx) / C);
        var row = Math.round((y - this.by) / C);
        if (col < 0 || col >= this.N || row < 0 || row >= this.N) return;
        if (Math.abs(x - (this.bx + col*C)) > C * 0.48) return;
        if (Math.abs(y - (this.by + row*C)) > C * 0.48) return;
        this._tryPlace(row, col, 1);
    },

    // ===== Đặt quân (trả về true nếu hợp lệ) =====
    _tryPlace: function(row, col, player) {
        var N = this.N;
        var idx = row * N + col;
        if (this.board[idx] !== 0) return false;

        var test = this.board.slice();
        test[idx] = player;
        var opp = player === 1 ? 2 : 1;
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        var captured = [];

        // Bắt quân đối phương
        for (var d = 0; d < 4; d++) {
            var nr = row + dirs[d][0], nc = col + dirs[d][1];
            if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
            var ni = nr * N + nc;
            if (test[ni] === opp) {
                var grp = this._getGroup(test, nr, nc);
                if (this._liberties(test, grp) === 0) {
                    for (var g = 0; g < grp.length; g++) {
                        captured.push(grp[g]);
                        test[grp[g]] = 0;
                    }
                }
            }
        }

        // Kiểm tra tự sát
        var myGrp = this._getGroup(test, row, col);
        if (this._liberties(test, myGrp) === 0) return false;

        // Ko
        var bStr = test.join(',');
        if (this.prevBoard && this.prevBoard === bStr) return false;

        // Áp dụng
        this.prevBoard = this.board.join(',');
        this.board = test;

        for (var c = 0; c < captured.length; c++) {
            if (this.stoneNodes[captured[c]]) {
                this.stoneNodes[captured[c]].removeFromParent();
                delete this.stoneNodes[captured[c]];
            }
        }
        this.captures[player] += captured.length;
        this._drawStone(row, col, player);
        this.passes = 0;
        this._updateCapLbl();

        // Lượt tiếp
        if (player === 1) {
            this.turn = 2;
            this.statusLbl.setString('Máy đang suy nghĩ...');
            var thiz = this;
            this.runAction(cc.sequence(
                cc.delayTime(0.45),
                cc.callFunc(function() { thiz._aiMove(); })
            ));
        } else {
            this.turn = 1;
            this.statusLbl.setString('Lượt của bạn (Đen)');
        }
        return true;
    },

    _doPass: function(player) {
        this.passes++;
        if (this.passes >= 2) { this._endGame(); return; }
        if (player === 1) {
            this.turn = 2;
            this.statusLbl.setString('Máy đang suy nghĩ...');
            var thiz = this;
            this.runAction(cc.sequence(
                cc.delayTime(0.4),
                cc.callFunc(function() { thiz._aiMove(); })
            ));
        } else {
            this.turn = 1;
            this.statusLbl.setString('Máy bỏ lượt. Lượt của bạn (Đen)');
        }
    },

    // ===== AI =====
    _aiMove: function() {
        if (this.gameOver) return;
        var N = this.N;
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];

        // 1. Bắt quân đối thủ trong nguy hiểm (1 khí)
        for (var r = 0; r < N; r++) {
            for (var c = 0; c < N; c++) {
                if (this.board[r*N+c] !== 1) continue;
                var grp = this._getGroup(this.board, r, c);
                if (this._liberties(this.board, grp) === 1) {
                    var found = this._findLiberty(grp);
                    if (found && this._tryPlace(found[0], found[1], 2)) return;
                }
            }
        }

        // 2. Cứu quân mình bị 1 khí
        for (var r = 0; r < N; r++) {
            for (var c = 0; c < N; c++) {
                if (this.board[r*N+c] !== 2) continue;
                var grp = this._getGroup(this.board, r, c);
                if (this._liberties(this.board, grp) === 1) {
                    var found = this._findLiberty(grp);
                    if (found && this._tryPlace(found[0], found[1], 2)) return;
                }
            }
        }

        // 3. Đánh ngẫu nhiên vào ô trống (có ưu tiên trung tâm)
        var moves = [];
        for (var r = 0; r < N; r++)
            for (var c = 0; c < N; c++)
                if (this.board[r*N+c] === 0) {
                    var dist = Math.abs(r - 4) + Math.abs(c - 4);
                    moves.push([r, c, dist]);
                }
        moves.sort(function(a, b) {
            return (a[2] - b[2]) + (Math.random() - 0.5) * 4;
        });

        for (var m = 0; m < moves.length; m++) {
            if (this._tryPlace(moves[m][0], moves[m][1], 2)) return;
        }

        // Bỏ lượt
        this._doPass(2);
        this.turn = 1;
        this.statusLbl.setString('Lượt của bạn (Đen)');
    },

    _findLiberty: function(group) {
        var N = this.N;
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        for (var g = 0; g < group.length; g++) {
            var gr = Math.floor(group[g]/N), gc = group[g]%N;
            for (var d = 0; d < 4; d++) {
                var nr = gr+dirs[d][0], nc = gc+dirs[d][1];
                if (nr>=0&&nr<N&&nc>=0&&nc<N&&this.board[nr*N+nc]===0)
                    return [nr, nc];
            }
        }
        return null;
    },

    // ===== BFS lấy nhóm =====
    _getGroup: function(board, row, col) {
        var N = this.N, color = board[row*N+col];
        var visited = {}, queue = [row*N+col], group = [];
        visited[row*N+col] = true;
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        while (queue.length) {
            var cur = queue.shift(); group.push(cur);
            var cr = Math.floor(cur/N), cc = cur%N;
            for (var d = 0; d < 4; d++) {
                var nr = cr+dirs[d][0], nc = cc+dirs[d][1];
                if (nr<0||nr>=N||nc<0||nc>=N) continue;
                var ni = nr*N+nc;
                if (!visited[ni] && board[ni]===color) { visited[ni]=true; queue.push(ni); }
            }
        }
        return group;
    },

    _liberties: function(board, group) {
        var N = this.N, lib = {};
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        for (var g = 0; g < group.length; g++) {
            var gr = Math.floor(group[g]/N), gc = group[g]%N;
            for (var d = 0; d < 4; d++) {
                var nr = gr+dirs[d][0], nc = gc+dirs[d][1];
                if (nr>=0&&nr<N&&nc>=0&&nc<N&&board[nr*N+nc]===0) lib[nr*N+nc]=1;
            }
        }
        return Object.keys(lib).length;
    },

    // ===== Vẽ quân =====
    _drawStone: function(row, col, player) {
        var C = this.CELL;
        var px = this.bx + col*C, py = this.by + row*C;
        var r  = C/2 - 2;
        var node = new cc.DrawNode();
        if (player === 1) {
            node.drawDot(cc.p(0,0), r, new cc.Color(20,20,20,255));
            node.drawDot(cc.p(-r*0.25, r*0.28), r*0.3, new cc.Color(90,90,90,180));
        } else {
            node.drawDot(cc.p(0,0), r, new cc.Color(30,30,30,255));
            node.drawDot(cc.p(0,0), r-2, new cc.Color(240,240,235,255));
            node.drawDot(cc.p(-r*0.2, r*0.22), r*0.28, new cc.Color(255,255,255,200));
        }
        node.setPosition(px, py);
        this.addChild(node, 3);
        this.stoneNodes[row*this.N+col] = node;
        node.setScale(0);
        node.runAction(cc.sequence(cc.scaleTo(0.07,1.15), cc.scaleTo(0.05,1.0)));
    },

    _updateCapLbl: function() {
        this.capLbl.setString(
            'Đen bắt: ' + this.captures[1] + '   Trắng bắt: ' + this.captures[2]
        );
    },

    // ===== Tính điểm cuối ván =====
    _countTerritory: function() {
        var N = this.N, dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        var visited = [];
        for (var vi = 0; vi < N*N; vi++) visited.push(false);
        var black = 0, white = 0;
        for (var start = 0; start < N*N; start++) {
            if (visited[start] || this.board[start] !== 0) continue;
            var region = [], borders = {}, queue = [start];
            visited[start] = true;
            while (queue.length) {
                var cur = queue.shift(); region.push(cur);
                var cr = Math.floor(cur/N), cc = cur%N;
                for (var d = 0; d < 4; d++) {
                    var nr = cr+dirs[d][0], nc = cc+dirs[d][1];
                    if (nr<0||nr>=N||nc<0||nc>=N) continue;
                    var ni = nr*N+nc;
                    if (!visited[ni] && this.board[ni]===0) { visited[ni]=true; queue.push(ni); }
                    else if (this.board[ni]!==0) borders[this.board[ni]]=true;
                }
            }
            var keys = Object.keys(borders);
            if (keys.length===1) {
                if (+keys[0]===1) black+=region.length;
                else white+=region.length;
            }
        }
        return {black:black, white:white};
    },

    _endGame: function() {
        this.gameOver = true;
        var t = this._countTerritory();
        var bScore = t.black + this.captures[1];
        var wScore = t.white + this.captures[2] + 6.5; // komi
        var result = bScore > wScore ? 1 : -1;
        var thiz = this;
        this.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(function() { thiz._showPopup(result, bScore, wScore); })
        ));
    },

    // ===== Popup =====
    _showPopup: function(result, bScore, wScore) {
        var thiz = this;
        var size = cc.winSize;
        var overlay = new cc.LayerColor(new cc.Color(0,0,0,160));
        overlay.setContentSize(size.width, size.height);

        var pW = 540, pH = 300;
        var bgCol = result===1 ? new cc.Color(20,55,20,248) : new cc.Color(55,20,20,248);
        var panel = new cc.LayerColor(bgCol);
        panel.setContentSize(pW, pH);
        panel.x = (size.width-pW)/2; panel.y = (size.height-pH)/2;

        var bCol = result===1 ? new cc.Color(80,255,120,255) : new cc.Color(255,80,80,255);
        var border = new cc.DrawNode();
        border.drawRect(cc.p(0,0), cc.p(pW,pH), null, 3, bCol);
        panel.addChild(border);

        var winLbl = new cc.LabelTTF(result===1 ? 'Bạn (Đen) thắng!' : 'Máy (Trắng) thắng!', 'Arial', 44);
        winLbl.setPosition(pW/2, pH-72);
        winLbl.setColor(bCol);
        panel.addChild(winLbl);

        var scoreLbl = new cc.LabelTTF(
            'Đen: ' + bScore.toFixed(1) + '   Trắng: ' + wScore.toFixed(1) + ' (komi 6.5)',
            'Arial', 28
        );
        scoreLbl.setPosition(pW/2, pH-130);
        scoreLbl.setColor(new cc.Color(220,220,180));
        panel.addChild(scoreLbl);

        var btnPlay = this._makeBtn('Chơi lại', new cc.Color(30,120,50));
        var btnExit = this._makeBtn('Thoát',    new cc.Color(150,40,40));
        btnPlay.x = pW/2-120; btnPlay.y = 58;
        btnExit.x = pW/2+120; btnExit.y = 58;
        panel.addChild(btnPlay);
        panel.addChild(btnExit);

        btnPlay.addClickEventListener(function() { overlay.removeFromParent(); thiz._reset(); });
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
        panel.runAction(cc.sequence(cc.scaleTo(0.14,1.08), cc.scaleTo(0.06,1.0)));
    },

    // ===== Reset =====
    _reset: function() {
        var keys = Object.keys(this.stoneNodes);
        for (var k = 0; k < keys.length; k++) this.stoneNodes[keys[k]].removeFromParent();
        this.stoneNodes = {};
        this.board = [];
        for (var i = 0; i < this.N*this.N; i++) this.board.push(0);
        this.captures = {1:0, 2:0};
        this.prevBoard = null;
        this.gameOver  = false;
        this.passes    = 0;
        this.turn      = 1;
        this.statusLbl.setString('Bạn đi Đen  —  Máy đi Trắng');
        this._updateCapLbl();
    },

    _makeBtn: function(text, color) {
        var btn = new ccui.Button('res/btn_register_normal.png', '', '');
        btn.setScale9Enabled(true);
        btn.setCapInsets(cc.rect(4.2,4.2,2.1,2.1));
        btn.setContentSize(cc.size(200,70));
        btn.setTitleText(text);
        btn.setTitleFontSize(34);
        btn.setTitleColor(new cc.Color(255,255,255));
        btn.setColor(color);
        btn.setZoomScale(-0.05);
        btn.scale = 1.2;
        return btn;
    }
});

var GoScene = cc.Scene.extend({
    onEnter: function() {
        cc.Scene.prototype.onEnter.call(this);
        this.addChild(new GoLayer());
    }
});
