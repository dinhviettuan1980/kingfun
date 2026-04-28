var _I18N = {
    vi: {
        select_game:      'Chọn trò chơi',
        settings:         'Cài đặt',
        sound_on:         'Âm thanh: Bật',
        sound_off:        'Âm thanh: Tắt',
        lang_btn:         'Ngôn ngữ: Việt',
        lang_btn_en:      'Language: Eng',
        close:            'Đóng',
        play_again:       'Chơi lại',
        exit:             'Thoát',
        ai_thinking:      'Máy đang suy nghĩ...',
        you_win:          'Bạn thắng!',
        machine_wins:     'Máy thắng!',
        draw:             'Hoà rồi!',
        caro_title:       'Cờ Caro',
        caro_your_turn:   'Lượt của bạn (Đen)',
        caro_score:       'Bạn: {p}   Máy: {m}',
        caro_timer_cap:   'giây còn lại',
        caro_timeout:     'Hết giờ!',
        caro_mach_first:  'Máy đi trước...',
        caro_you_next:    'Bạn đi trước ván sau',
        caro_mach_next:   'Máy đi trước ván sau',
        tts_warning:      'Sắp hết giờ',
        ttt_status:       'Bạn đi X  -  Máy đi O',
        ttt_your_turn:    'Lượt của bạn (X)',
        go_title:         'Cờ vây 9x9',
        go_status:        'Ban đi Đen  -  Máy đi Trắng',
        go_cap:           'Đen bắt: {b}   Trắng bắt: {w}',
        go_score:         'Đen: {b}   Trắng: {w} (komi 6.5)',
        go_pass:          'Bỏ lượt',
        go_black_wins:    'Bạn (Đen) thắng!',
        go_white_wins:    'Máy (Trắng) thắng!',
        go_mach_pass:     'Máy bỏ lượt. Lượt của bạn (Đen)',
        go_your_turn:     'Lượt của bạn (Den)',
        mini_games_sub:   'Chơi cho vui - không mất tiền',
        exit_game:        'Thoát game',
        sign_out:         'Đăng xuất',
        ba_cay:           'Ba Cây',
        ta_la:            'Tá Lả',
        mini_games:       'Mini Games',
        tictactoe:        'Tic-Tac-Toe',
        co_caro:          'Cờ Caro',
        co_vay:           'Cờ Vay',
        play_now:         'Chơi ngay',
        google_login:     'Đăng nhập Google',
        google_loggedin:  'Đã đăng nhập',
        processing:       'Đang xử lý...',
        xu:               'xu',
        name_empty:       'Mời bạn nhập tên!',
        name_too_long:    'Tên bạn quá dài!',
        popup_close:      'Đóng',
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
        sign_out:         'Sign Out',
        ba_cay:           'Ba Cay',
        ta_la:            'Ta La',
        mini_games:       'Mini Games',
        tictactoe:        'Tic-Tac-Toe',
        co_caro:          'Co Caro',
        co_vay:           'Go',
        play_now:         'Play Now',
        google_login:     'Sign in Google',
        google_loggedin:  'Signed in',
        processing:       'Loading...',
        xu:               'coins',
        name_empty:       'Please enter a name!',
        name_too_long:    'Name is too long!',
        popup_close:      'Close',
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

var _mkSpBtn = function(text) {
    return makeNiceBtn(text, 360, 72, 30);
};

// onReload: function called (deferred) after language change to reload current scene
window.showSettingsPanel = function(onReload) {
    var size = cc.winSize;
    var overlay = new cc.LayerColor(new cc.Color(0, 0, 0, 160));
    overlay.setContentSize(size.width, size.height);

    var pW = 480, pH = 510;
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
    var soundBtn = _mkSpBtn(Settings.soundOn ? L('sound_on') : L('sound_off'));
    soundBtn.setPosition(pW/2, pH - 105);
    panel.addChild(soundBtn);
    soundBtn.addClickEventListener(function() {
        Settings.setSoundOn(!Settings.soundOn);
        soundBtn.setTitleText(Settings.soundOn ? L('sound_on') : L('sound_off'));
    });

    // Language toggle
    var langTxt = Settings.lang === 'vi' ? L('lang_btn') : L('lang_btn_en');
    var langBtn = _mkSpBtn(langTxt);
    langBtn.setPosition(pW/2, pH - 195);
    panel.addChild(langBtn);
    langBtn.addClickEventListener(function() {
        Settings.setLang(Settings.lang === 'vi' ? 'en' : 'vi');
        langBtn.setTitleText(Settings.lang === 'vi' ? L('lang_btn') : L('lang_btn_en'));
        overlay.removeFromParent();
        if (onReload) onReload();
    });

    // Sign out
    var signoutBtn = _mkSpBtn(L('sign_out'));
    signoutBtn.setPosition(pW/2, pH - 285);
    panel.addChild(signoutBtn);
    signoutBtn.addClickEventListener(function() {
        GG.logout();
        cc.sys.localStorage.removeItem('inputUsername');
        overlay.removeFromParent();
        cc.director.runScene(new LoginScene());
    });

    // Exit game
    var exitBtn = _mkSpBtn(L('exit_game'));
    exitBtn.setPosition(pW/2, pH - 375);
    panel.addChild(exitBtn);
    exitBtn.addClickEventListener(function() {
        cc.game.end();
    });

    // Close
    var closeBtn = _mkSpBtn(L('close'));
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
    var btn = new ccui.Button('res/btn_play_bg.png', '', '');
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(38, 1, 154, 75));
    btn.setContentSize(cc.size(70, 58));
    btn.x = x; btn.y = y;
    btn.setZoomScale(-0.05);
    var icon = new cc.DrawNode();
    icon.setPosition(35, 29);
    var lw = 28, lc = new cc.Color(255, 255, 255, 255);
    icon.drawSegment(cc.p(-lw/2,  12), cc.p(lw/2,  12), 3.5, lc);
    icon.drawSegment(cc.p(-lw/2,   0), cc.p(lw/2,   0), 3.5, lc);
    icon.drawSegment(cc.p(-lw/2, -12), cc.p(lw/2, -12), 3.5, lc);
    btn.addChild(icon, 1);
    return btn;
};
