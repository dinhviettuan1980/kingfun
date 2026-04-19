var _I18N = {
    vi: {
        select_game:      'Chon tro choi',
        settings:         'Cai dat',
        sound_on:         'Am thanh: BAT',
        sound_off:        'Am thanh: TAT',
        lang_btn:         'Ngon ngu: Viet',
        lang_btn_en:      'Language: Eng',
        close:            'Dong',
        play_again:       'Choi lai',
        exit:             'Thoat',
        ai_thinking:      'May dang suy nghi...',
        you_win:          'Ban thang!',
        machine_wins:     'May thang!',
        draw:             'Hoa roi!',
        caro_title:       'Co Caro',
        caro_your_turn:   'Luot cua ban (Den)',
        caro_score:       'Ban: {p}   May: {m}',
        caro_timer_cap:   'giay con lai',
        caro_timeout:     'Het gio!',
        caro_mach_first:  'May di truoc...',
        caro_you_next:    'Ban di truoc van sau',
        caro_mach_next:   'May di truoc van sau',
        tts_warning:      'vi:sap het gio',
        ttt_status:       'Ban di X  -  May di O',
        ttt_your_turn:    'Luot cua ban (X)',
        go_title:         'Co Vay 9x9',
        go_status:        'Ban di Den  -  May di Trang',
        go_cap:           'Den bat: {b}   Trang bat: {w}',
        go_score:         'Den: {b}   Trang: {w} (komi 6.5)',
        go_pass:          'Bo luot',
        go_black_wins:    'Ban (Den) thang!',
        go_white_wins:    'May (Trang) thang!',
        go_mach_pass:     'May bo luot. Luot cua ban (Den)',
        go_your_turn:     'Luot cua ban (Den)',
        mini_games_sub:   'Choi cho vui - khong mat tien',
        exit_game:        'Thoat game',
    },
    en: {
        select_game:      'Choose Game',
        settings:         'Settings',
        sound_on:         'Sound: ON',
        sound_off:        'Sound: OFF',
        lang_btn:         'Language: Viet',
        lang_btn_en:      'Language: Eng',
        close:            'Close',
        play_again:       'Play Again',
        exit:             'Exit',
        ai_thinking:      'AI thinking...',
        you_win:          'You Win!',
        machine_wins:     'AI Wins!',
        draw:             'Draw!',
        caro_title:       'Gomoku',
        caro_your_turn:   'Your turn (Black)',
        caro_score:       'You: {p}   AI: {m}',
        caro_timer_cap:   'seconds left',
        caro_timeout:     'Time up!',
        caro_mach_first:  'AI goes first...',
        caro_you_next:    'You go first next round',
        caro_mach_next:   'AI goes first next round',
        tts_warning:      'en:time is running out',
        ttt_status:       'You X  -  AI O',
        ttt_your_turn:    'Your turn (X)',
        go_title:         'Go 9x9',
        go_status:        'You Black  -  AI White',
        go_cap:           'Black: {b}   White: {w}',
        go_score:         'Black: {b}   White: {w} (komi 6.5)',
        go_pass:          'Pass',
        go_black_wins:    'You (Black) win!',
        go_white_wins:    'AI (White) wins!',
        go_mach_pass:     'AI passed. Your turn (Black)',
        go_your_turn:     'Your turn (Black)',
        mini_games_sub:   'Play for fun - no money',
        exit_game:        'Exit Game',
    }
};

window.L = function(key) {
    var d = _I18N[Settings.lang];
    return (d && d[key]) || key;
};

var Settings = {
    soundOn: true,
    lang: 'vi',

    init: function() {
        var s = cc.sys.localStorage.getItem('cfg_sound');
        this.soundOn = !(s === 'false');
        var l = cc.sys.localStorage.getItem('cfg_lang');
        this.lang = (l === 'vi' || l === 'en') ? l : 'vi';
    },

    startMusic: function() {
        if (!this.soundOn) return;
        if (cc.audioEngine.isMusicPlaying()) return;
        cc.audioEngine.playMusic('res/audio/nhac_nen1.mp3', true);
    },

    stopMusic: function() {
        if (cc.audioEngine.isMusicPlaying()) cc.audioEngine.stopMusic();
    },

    setSoundOn: function(v) {
        this.soundOn = v;
        cc.sys.localStorage.setItem('cfg_sound', v ? 'true' : 'false');
        if (v) this.startMusic();
        else   this.stopMusic();
    },

    setLang: function(l) {
        this.lang = l;
        cc.sys.localStorage.setItem('cfg_lang', l);
    }
};

Settings.init();

// ---- Shared settings panel ----

var _mkSpBtn = function(text, color) {
    var btn = new ccui.Button('res/btn_register_normal.png', '', '');
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
    btn.setContentSize(cc.size(360, 72));
    btn.setTitleText(text);
    btn.setTitleFontSize(30);
    btn.setTitleColor(new cc.Color(255, 255, 255));
    btn.setColor(color);
    btn.setZoomScale(-0.05);
    return btn;
};

// onReload: function called (deferred) after language change to reload current scene
window.showSettingsPanel = function(onReload) {
    var size = cc.winSize;
    var overlay = new cc.LayerColor(new cc.Color(0, 0, 0, 160));
    overlay.setContentSize(size.width, size.height);

    var pW = 480, pH = 420;
    var panel = new cc.LayerColor(new cc.Color(20, 20, 50, 248));
    panel.setContentSize(pW, pH);
    panel.x = (size.width - pW) / 2;
    panel.y = (size.height - pH) / 2;

    var border = new cc.DrawNode();
    border.drawRect(cc.p(0, 0), cc.p(pW, pH), null, 3, new cc.Color(100, 150, 255, 255));
    panel.addChild(border);

    var titleLbl = new cc.LabelTTF(L('settings'), 'Arial', 44);
    titleLbl.setPosition(pW/2, pH - 52);
    titleLbl.setColor(new cc.Color(255, 240, 100));
    panel.addChild(titleLbl);

    // Sound toggle
    var soundBtn = _mkSpBtn(
        Settings.soundOn ? L('sound_on') : L('sound_off'),
        Settings.soundOn ? new cc.Color(30, 100, 50) : new cc.Color(90, 30, 30)
    );
    soundBtn.setPosition(pW/2, pH - 135);
    panel.addChild(soundBtn);
    soundBtn.addClickEventListener(function() {
        Settings.setSoundOn(!Settings.soundOn);
        soundBtn.setTitleText(Settings.soundOn ? L('sound_on') : L('sound_off'));
        soundBtn.setColor(Settings.soundOn ? new cc.Color(30, 100, 50) : new cc.Color(90, 30, 30));
    });

    // Language toggle
    var langTxt = Settings.lang === 'vi' ? L('lang_btn') : L('lang_btn_en');
    var langBtn = _mkSpBtn(langTxt, new cc.Color(60, 60, 140));
    langBtn.setPosition(pW/2, pH - 225);
    panel.addChild(langBtn);
    langBtn.addClickEventListener(function() {
        Settings.setLang(Settings.lang === 'vi' ? 'en' : 'vi');
        // Update button text immediately to confirm change
        langBtn.setTitleText(Settings.lang === 'vi' ? L('lang_btn') : L('lang_btn_en'));
        overlay.removeFromParent();
        // Update scene labels in-place (no runScene — avoids JSB callback issues)
        if (onReload) onReload();
    });

    // Exit game
    var exitBtn = _mkSpBtn(L('exit_game'), new cc.Color(140, 50, 20));
    exitBtn.setPosition(pW/2, pH - 315);
    panel.addChild(exitBtn);
    exitBtn.addClickEventListener(function() {
        cc.game.end();
    });

    // Close
    var closeBtn = _mkSpBtn(L('close'), new cc.Color(70, 70, 70));
    closeBtn.setPosition(pW/2, 45);
    panel.addChild(closeBtn);
    closeBtn.addClickEventListener(function() {
        overlay.removeFromParent();
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
};

// Returns a pre-built hamburger ccui.Button (add to layer yourself)
window.makeHamburgerBtn = function(x, y) {
    var btn = new ccui.Button('res/btn_register_normal.png', '', '');
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(4.2, 4.2, 2.1, 2.1));
    btn.setContentSize(cc.size(70, 58));
    btn.setColor(new cc.Color(40, 40, 80));
    btn.x = x; btn.y = y;
    btn.setZoomScale(-0.05);
    var icon = new cc.DrawNode();
    var lw = 28, lc = new cc.Color(240, 240, 240, 255);
    icon.drawSegment(cc.p(-lw/2,  12), cc.p(lw/2,  12), 3.5, lc);
    icon.drawSegment(cc.p(-lw/2,   0), cc.p(lw/2,   0), 3.5, lc);
    icon.drawSegment(cc.p(-lw/2, -12), cc.p(lw/2, -12), 3.5, lc);
    btn.addChild(icon, 1);
    return btn;
};
