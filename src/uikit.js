// Shared button factory — uses button_play.png as Scale9 background (pill shape)
// Cap insets preserve the rounded pill corners (source image 230×77)
// makeNiceBtn(text, w, h, fontSize) -> ccui.Button
window.makeNiceBtn = function(text, w, h, fontSize) {
    w        = w       || 280;
    h        = h       || 90;
    fontSize = fontSize || 38;

    var btn = new ccui.Button('res/btn_play_bg.png', '', '');
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(38, 1, 154, 75));  // preserve pill ends, stretch center
    btn.setContentSize(cc.size(w, h));
    btn.setTitleText(text);
    btn.setTitleFontSize(fontSize);
    btn.setTitleColor(new cc.Color(255, 255, 255));
    btn.setZoomScale(-0.05);
    return btn;
};
