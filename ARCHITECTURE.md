# KingFun — Tài liệu kiến trúc

## Tổng quan

KingFun là game bài iOS viết bằng **Cocos2d-x JavaScript Bindings (JSB)** — toàn bộ logic game nằm trong JavaScript, giao tiếp với native iOS qua cơ chế `jsb.reflection.callStaticMethod`. Giao diện render bằng Cocos2d-x, âm thanh qua `cc.audioEngine`, lưu trữ cục bộ qua `cc.sys.localStorage`.

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Game engine | Cocos2d-x 3.x (JavaScript) |
| Ngôn ngữ game | JavaScript (SpiderMonkey VM) |
| Native iOS bridge | Objective-C++ (JSB reflection) |
| Google Login | GoogleSignIn SDK v7 (CocoaPods) |
| Facebook Login | Facebook SDK v17 (CocoaPods) |
| Text-to-Speech | AVSpeechSynthesizer (iOS native) |
| Lưu trữ | cc.sys.localStorage (NSUserDefaults) |
| Âm thanh | cc.audioEngine |

---

## Luồng điều hướng (Scene Flow)

```
App Start
  └─→ manager.js (kiểm tra update từ server)
        └─→ LoginScene
              ├─→ RegisterScene
              ├─→ ForgotScene
              └─→ GameSelectScene  ◄── Trang chủ (có hamburger menu)
                    ├─→ LobbyScene (chọn mức cược 50/100/200/500xu)
                    │     └─→ HelloWorldScene  [Ba Cây]
                    │
                    ├─→ TaLaScene              [Tá Lả Miền Bắc]
                    │
                    └─→ MiniGamesScene
                          ├─→ CaroScene        [Cờ Caro 15×15]
                          ├─→ GoScene          [Cờ Vây 9×9]
                          └─→ TicTacToeScene   [Tic-Tac-Toe]
```

---

## Cấu trúc thư mục

```
KingFun/
├── src/                         JavaScript source files
├── res/                         Assets (hình ảnh, âm thanh)
├── frameworks/
│   └── runtime-src/
│       └── proj.ios_mac/
│           ├── ios/             Native iOS Objective-C++ bridge
│           ├── Podfile          CocoaPods dependencies
│           └── KingFun.xcworkspace
└── ARCHITECTURE.md              File này
```

---

## Thứ tự load JavaScript (`src/jsList.js`)

Các file được load tuần tự, file sau có thể dùng biến của file trước:

| # | File | Vai trò |
|---|---|---|
| 1 | `resource.js` | Khai báo `res{}`, `g_resources[]`, `playSound()` |
| 2 | `settings.js` | `Settings` object, `L()` i18n, `showSettingsPanel()`, `makeHamburgerBtn()` |
| 3 | `models.js` | Class `Card`, `Player`; deck và bot name khởi tạo |
| 4 | `facebook.js` | `FB` object — login/logout/getProfile qua JSB |
| 5 | `google.js` | `GG` object — login/logout/getProfile qua JSB |
| 6 | `login.js` | `LoginLayer` / `LoginScene` |
| 7 | `forgot.js` | `ForgotLayer` / `ForgotScene` |
| 8 | `register.js` | `RegisterLayer` / `RegisterScene` |
| 9 | `help.js` | `HelpLayer` / `HelpScene` |
| 10 | `lobby.js` | `LobbyLayer` / `LobbyScene` — chọn mức cược |
| 11 | `game.js` | `HelloWorldLayer` / `HelloWorldScene` — Ba Cây |
| 12 | `gameselect.js` | `GameSelectLayer`, `MiniGamesLayer` và các Scene tương ứng |
| 13 | `tala.js` | `TaLaLayer` / `TaLaScene` — Tá Lả Miền Bắc |
| 14 | `tictactoe.js` | `TicTacToeLayer` / `TicTacToeScene` |
| 15 | `carogame.js` | `CaroLayer` / `CaroScene` — Cờ Caro Gomoku |
| 16 | `govay.js` | `GoLayer` / `GoScene` — Cờ Vây |
| 17 | `base64.js` | Hàm tiện ích mã hóa Base64 |

---

## Mô tả từng file JavaScript

### `resource.js`
Khai báo tập trung toàn bộ đường dẫn asset:
- **Card sprites**: 36 lá bài (9 hạng × 4 chất: tép/bích/rô/cơ), key dạng `mot_tep`, `hai_bich`…
- **Audio**: `SFX_Win`, `SFX_Lose`, `SFX_CoinFly`, background music path
- **UI**: các nút, background, icon xu
- Hàm `playSound(path, loop)` và `stopSound(audioId)` dùng chung toàn app

---

### `settings.js`
Module cài đặt và đa ngôn ngữ:

**`Settings` object**
```
soundOn  : bool   — bật/tắt nhạc nền (lưu 'cfg_sound' vào localStorage)
lang     : string — 'vi' hoặc 'en' (lưu 'cfg_lang' vào localStorage)
startMusic()     — phát nhac_nen1.mp3 (loop) nếu soundOn
stopMusic()
setSoundOn(v)
setLang(l)
```

**`L(key)`** — hàm tra từ điển i18n, trả về chuỗi theo `Settings.lang`

**`showSettingsPanel(onLangChange)`** — hiển thị overlay settings với 4 nút:
1. Âm thanh ON/OFF
2. Đổi ngôn ngữ Vi ↔ En (gọi `onLangChange()` sau khi đổi)
3. Thoát game (`cc.game.end()`)
4. Đóng panel

**`makeHamburgerBtn(x, y)`** — tạo nút hamburger (3 gạch ngang) tái sử dụng ở nhiều màn hình

---

### `models.js`
Data models cốt lõi:
- **`Card`**: hạng (1–9), chất (tép/bích/rô/cơ), sprite path
- **`initCards()`**: tạo bộ 36 lá, shuffle
- **`initPlayers()`**: tạo 30 bot có tên và avatar ngẫu nhiên
- **`who_win(cards)`**: so sánh điểm Ba Cây (tổng mod 10)

---

### `login.js`
Màn hình đăng nhập:
- Input tên người dùng + nút chơi ngay
- Nút **Đăng nhập Facebook** (dùng `FB` object)
- Nút **Đăng nhập Google** (dùng `GG` object, nếu thành công → vào `GameSelectScene`)
- Hamburger menu (góc trên phải) → `showSettingsPanel`
- Lưu `inputUsername` vào localStorage để tự điền lần sau

---

### `gameselect.js`
Hai Layer trong cùng một file:

**`GameSelectLayer`** — màn hình chọn game chính:
- Ba Cây → `LobbyScene`
- Tá Lả → `TaLaScene`
- Mini Games → `MiniGamesScene`
- Hamburger (góc trên trái) → settings panel
- Gọi `Settings.startMusic()` khi khởi động
- Lưu `this.titleLbl` để cập nhật ngôn ngữ in-place

**`MiniGamesLayer`** — chọn trong 3 mini game:
- Tic-Tac-Toe, Cờ Caro, Cờ Vây

---

### `game.js` — Ba Cây
- 3 lá bài / người chơi, tính điểm tổng mod 10
- Nhiều người cùng điểm → so lá cao nhất
- Mức cược truyền từ `LobbyScene`
- Popup kết quả với animation coin bay

---

### `tala.js` — Tá Lả Miền Bắc (1100+ dòng)
Game bài phức tạp nhất trong app:

**Luật chơi:**
- 4 người, mỗi người 10 lá từ bộ 52 lá (rank 10, J, Q, K → giá trị 10)
- Mỗi lượt rút 1 lá (từ bài chung hoặc lá người trước bỏ) rồi đánh 1 lá
- **Phỏm**: bộ 3–4 lá cùng hạng khác chất, hoặc sảnh 3+ lá liên tiếp cùng chất
- Thắng khi "Ù": toàn bộ bài vào phỏm, không còn lá lẻ

**Bot AI:** đánh giá từng lá cần bỏ dựa trên "trash score" — ưu tiên giữ lá có thể hình thành phỏm

**Hệ thống tiền:**
- Mỗi ván đóng 10xu vào "hũ gà"
- Người thua trả xu cho người thắng dựa trên số lá lẻ
- Animation coin bay từ thua → thắng

---

### `carogame.js` — Cờ Caro (Gomoku)
Bàn 15×15, thắng khi 5 quân liên tiếp:

**AI:**
- Đánh giá mỗi ô trống: `atkScore + defScore × 1.15`
- Tính chuỗi theo 4 hướng (ngang/dọc/chéo), trả về điểm theo độ dài + số đầu mở

**Tính năng đặc biệt:**
- Đếm ngược 30 giây mỗi lượt (`scheduleUpdate()` + accumulator)
- TTS "sắp hết giờ" / "time is running out" lúc còn 10 giây
- Ai thua → đi trước ván sau; bảng tỉ số tích lũy qua các ván

---

### `govay.js` — Cờ Vây 9×9
- Quân đen (người) vs quân trắng (máy)
- **Bắt quân**: nhóm quân không còn khí (liberties) bị bắt ra
- **Ko rule**: không được đi lại trạng thái bàn cờ vừa thoát
- **Tính điểm cuối**: vùng lãnh thổ + quân bắt được + komi 6.5 (cho máy)
- **AI**: ưu tiên cứu quân đang nguy, bắt quân đối thủ, rồi đánh trung tâm

---

### `tictactoe.js` — Tic-Tac-Toe
- Bàn 3×3, X = người, O = máy
- Máy dùng **minimax** duyệt toàn bộ cây trò chơi
- Điểm: `10 - depth` (máy thắng nhanh = tốt hơn)

---

## Native iOS Bridge

### `GoogleBridge.mm`
Giao tiếp qua `jsb.reflection.callStaticMethod("GoogleBridge", "methodName:", arg)`

| Method | Chức năng |
|---|---|
| `initialize` | Khởi tạo GIDConfiguration với Client ID |
| `login:` | Mở Google Sign-In, lưu kết quả vào `_loginResult` |
| `getLoginResult:` | Polling kết quả login (trả JSON) |
| `logout:` | Xóa session + NSUserDefaults |
| `getProfile:` | Đọc profile từ NSUserDefaults |
| `speak:` | TTS qua AVSpeechSynthesizer; nhận prefix `vi:` hoặc `en:` để chọn giọng |

**Profile storage keys**: `gg_name`, `gg_uid`, `gg_email`, `gg_avatar`

---

### `FacebookBridge.mm`
Tương tự GoogleBridge nhưng cho FBSDK v17:

| Method | Chức năng |
|---|---|
| `initializeWithApp:options:` | Gọi từ `application:didFinishLaunchingWithOptions:` |
| `applicationDidBecomeActive` | Gọi `FBSDKAppEvents activateApp` |
| `handleOpenURL:options:` | Xử lý URL scheme `fb{app_id}://` |
| `login:` | Mở FB login (quyền `public_profile`) |
| `getLoginResult:` | Polling kết quả |
| `logout:` / `getProfile:` | Session và profile |

**Profile storage keys**: `fb_name`, `fb_uid`, `fb_email`, `fb_avatar`

---

### `AppController.mm`
Điểm khởi đầu iOS native:
- `didFinishLaunching` → gọi `[FacebookBridge initialize...]` + `[GoogleBridge initialize]`
- `applicationDidBecomeActive` → gọi `[FacebookBridge applicationDidBecomeActive]`
- `openURL` → thử `GoogleBridge` trước, rồi `FacebookBridge`

---

## Assets (`res/`)

### Âm thanh
| File | Dùng cho |
|---|---|
| `audio/nhac_nen1.mp3` | Nhạc nền (loop toàn app) |
| `audio/koiroylers-tada-fanfare-356032.mp3` | Thắng (`SFX_Win`) |
| `audio/tuomas_data-game-over-39-199830.mp3` | Thua (`SFX_Lose`) |
| `audio/spinopel-coins-falling-on-the-floor-393251.mp3` | Coin bay (`SFX_CoinFly`) |

### Bài lá
36 sprites theo quy tắc `{rank}_{suit}.png`:
- **Rank**: `mot hai ba bon nam sau bay tam chin` (1–9)
- **Suit**: `tep` (♣) `bich` (♠) `do` (♥) `co` (♦)

### UI
- `LoginBng.png` — background chính dùng ở mọi màn hình
- `btn_back.png` — nút quay lại
- `btn_register_normal.png` — nút generic (scale9 enabled)
- `button_play.png` — nút bắt đầu chơi
- `backcard.png` — mặt sau lá bài
- `ava_00.png` … `ava_14.png` — 15 avatar bot

---

## Hệ thống đa ngôn ngữ (i18n)

Từ điển trong `settings.js`, hàm `L(key)` tra ngôn ngữ hiện tại:

```javascript
L('you_win')      // Vi: "Ban thang!"   En: "You Win!"
L('ai_thinking')  // Vi: "May dang suy nghi..."   En: "AI thinking..."
L('tts_warning')  // Vi: "vi:sap het gio"   En: "en:time is running out"
```

TTS nhận prefix ngôn ngữ: `"vi:text"` → AVSpeechSynthesisVoice `vi-VN`, `"en:text"` → `en-US`.

Ngôn ngữ thay đổi ngay trong session (không cần restart app), lưu vào localStorage qua key `cfg_lang`.

---

## Luồng xác thực (Authentication)

```
Người dùng nhập tên thủ công
  → cc.sys.localStorage.setItem("inputUsername", name)
  → GameSelectScene

Facebook Login (FBSDK v17)
  → jsb.reflection → FacebookBridge.login:
  → polling getLoginResult: mỗi 0.5s
  → Kết quả JSON: {success, name, uid, email, avatar}
  → GameSelectScene

Google Login (GoogleSignIn v7)
  → jsb.reflection → GoogleBridge.login:
  → polling getLoginResult: mỗi 0.5s
  → Kết quả JSON: {success, name, uid, email, avatar}
  → GameSelectScene
```

---

## Cấu hình iOS

**Bundle ID**: `com.bacay.kingfun`

**URL Schemes** (Info.plist):
- `com.googleusercontent.apps.497702857343-7e2itjo7qb7fhn7pp9ahauts5ku25c43` — Google Sign-In
- `fb2441789679578067` — Facebook Login

**CocoaPods** (`Podfile`):
```ruby
pod 'GoogleSignIn'
pod 'FBSDKLoginKit'
pod 'FBSDKCoreKit'
```
