var HelpLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var size = cc.winSize;

        var bg = this._bg = new cc.Sprite("res/textbg.png");
        bg.scale = 1.1;
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        var source =
            "Bài cào hay còn gọi là ba cây là một kiểu chơi bài bằng một bộ bài tây. Có thể nói, đây là một trong những cách chơi đánh bài dân gian đơn giản nhất, nhanh nhất và phụ thuộc hoàn toàn vào yếu tố may rủi. Với 52 lá bài trong một bộ bài (bỏ 10,J,Q,K) và mỗi người được chia 3 lá, một ván bài cào có thể có từ 2 đến 9 người chơi cùng lúc.\n" +
            "\n" +
            "Bài được một người đại diện chia cho từng người, mỗi người có ba lá. Nếu chơi cầm cái thì cái sẽ là người chia. Người chơi có thể xem bài của mình kín đáo hoặc công khai và tính điểm.\n" +
            "\n" +
            "Cách tính điểm như sau:\n" +
            "* Các lá: 2, 3, 4, 5, 6, 7, 8, 9, 1 (A) mỗi lá có số điểm tương ứng con số đó. Theo thứ tự thì cùng 1 chất lá bài sẽ có giá trí tăng dần (ví dụ: 3 Rô nhỏ hơn 4 Rô)\n" +
            "Điểm của người chơi trong mỗi ván là số lẻ của tổng điểm ba lá bài. Ví dụ, tổng ba lá là 27 điểm thì được 7 điểm (hay gọi là nút), 10 điểm thì được 10 điểm.\n" +
            "Nếu người chơi cùng điểm thì mình quan tâm đến chất của lá bài theo thứ tự là Rô - Cơ - Tép - Bích (Rô là to nhất)";

        var scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setContentSize(cc.size(size.width * 0.8, size.height * 0.9));
        scrollView.setInnerContainerSize(cc.size(size.width * 0.8, size.height * 1.5));
        scrollView.setScrollBarEnabled(true);
        scrollView.setScrollBarColor(cc.color(255, 255, 255));
        scrollView.setScrollBarWidth(5);
        scrollView.setScrollBarPositionFromCorner(cc.p(5, 5));
        scrollView.setPosition(cc.p(size.width * 0.1 - 50, size.height * 0.1 - 30));

        var textLabel = new cc.LabelTTF(
            source, "Arial", 32,
            cc.size(size.width * 0.8 - 50, size.height * 1.5),
            cc.TEXT_ALIGNMENT_LEFT
        );
        textLabel.setAnchorPoint(cc.p(0, 1));
        textLabel.setPosition(cc.p(0, scrollView.getInnerContainerSize().height));
        scrollView.addChild(textLabel);

        this.addChild(scrollView, 6);

        var backBtn = new ccui.Button(res.Back_png, "", "");
        backBtn.x = size.width / 2 + 600;
        backBtn.y = size.height / 2 + 270;
        backBtn.scale = 1;
        backBtn.setZoomScale(-0.05);
        this.addChild(backBtn, 7);
        backBtn.addClickEventListener(function() {
            cc.director.runScene(new LobbyScene());
        });
    }
});

var HelpScene = cc.Scene.extend({
    onEnter:function () {
        cc.Scene.prototype.onEnter.call(this);
        var layer = new HelpLayer();
        this.addChild(layer);
    }
});
