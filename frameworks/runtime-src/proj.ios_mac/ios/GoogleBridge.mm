// Compiled with -fobjc-arc -fmodules -fcxx-modules
#import "GoogleBridge.h"
@import GoogleSignIn;
@import AVFoundation;

static AVSpeechSynthesizer *_synth = nil;

// REPLACE THIS with your iOS Client ID from console.cloud.google.com
// (Credentials -> OAuth 2.0 Client IDs -> iOS, bundle ID: com.bacay.kingfun)
static NSString * const kGoogleClientID = @"497702857343-7e2itjo7qb7fhn7pp9ahauts5ku25c43.apps.googleusercontent.com";

static NSString *_loginResult = nil;

@implementation GoogleBridge

+ (void)initialize {
    GIDConfiguration *config = [[GIDConfiguration alloc] initWithClientID:kGoogleClientID];
    GIDSignIn.sharedInstance.configuration = config;
}

+ (BOOL)handleOpenURL:(NSURL *)url {
    return [GIDSignIn.sharedInstance handleURL:url];
}

+ (NSString *)login:(NSString *)unused {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *vc = [UIApplication sharedApplication].keyWindow.rootViewController;
        [GIDSignIn.sharedInstance signInWithPresentingViewController:vc
                                                          completion:^(GIDSignInResult *result, NSError *error) {
            if (error || !result || !result.user) {
                NSString *reason = error ? error.localizedDescription : @"cancelled";
                reason = [reason stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
                _loginResult = [NSString stringWithFormat:@"{\"success\":false,\"error\":\"%@\"}", reason];
                return;
            }
            GIDGoogleUser *user = result.user;
            NSString *name   = user.profile.name    ?: @"";
            NSString *uid    = user.userID           ?: @"";
            NSString *email  = user.profile.email   ?: @"";
            NSString *avatar = @"";
            if (user.profile.hasImage) {
                avatar = [user.profile imageURLWithDimension:100].absoluteString ?: @"";
            }
            name   = [name   stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
            avatar = [avatar stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
            email  = [email  stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];

            [[NSUserDefaults standardUserDefaults] setObject:name   forKey:@"gg_name"];
            [[NSUserDefaults standardUserDefaults] setObject:uid    forKey:@"gg_uid"];
            [[NSUserDefaults standardUserDefaults] setObject:email  forKey:@"gg_email"];
            [[NSUserDefaults standardUserDefaults] setObject:avatar forKey:@"gg_avatar"];
            [[NSUserDefaults standardUserDefaults] synchronize];

            _loginResult = [NSString stringWithFormat:
                @"{\"success\":true,\"name\":\"%@\",\"uid\":\"%@\",\"email\":\"%@\",\"avatar\":\"%@\"}",
                name, uid, email, avatar];
        }];
    });
    return @"";
}

+ (NSString *)getLoginResult:(NSString *)unused {
    if (!_loginResult) return @"";
    NSString *r = _loginResult;
    _loginResult = nil;
    return r;
}

+ (NSString *)logout:(NSString *)unused {
    [GIDSignIn.sharedInstance signOut];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"gg_name"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"gg_uid"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"gg_email"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"gg_avatar"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    return @"";
}

+ (NSString *)speak:(NSString *)text {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *lang = @"vi-VN";
        NSString *msg  = text;
        NSRange colon = [text rangeOfString:@":"];
        if (colon.location != NSNotFound && colon.location <= 5) {
            NSString *prefix = [text substringToIndex:colon.location];
            if ([prefix isEqualToString:@"en"]) lang = @"en-US";
            else lang = @"vi-VN";
            msg = [text substringFromIndex:colon.location + 1];
        }
        if (!_synth) _synth = [[AVSpeechSynthesizer alloc] init];
        [_synth stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
        AVSpeechUtterance *u = [[AVSpeechUtterance alloc] initWithString:msg];
        u.voice = [AVSpeechSynthesisVoice voiceWithLanguage:lang];
        u.rate  = 0.45f;
        [_synth speakUtterance:u];
    });
    return @"";
}

+ (NSString *)getProfile:(NSString *)unused {
    NSString *uid = [[NSUserDefaults standardUserDefaults] stringForKey:@"gg_uid"] ?: @"";
    if (uid.length == 0) return @"";
    NSString *name   = [[NSUserDefaults standardUserDefaults] stringForKey:@"gg_name"]   ?: @"";
    NSString *email  = [[NSUserDefaults standardUserDefaults] stringForKey:@"gg_email"]  ?: @"";
    NSString *avatar = [[NSUserDefaults standardUserDefaults] stringForKey:@"gg_avatar"] ?: @"";
    name   = [name   stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
    avatar = [avatar stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
    email  = [email  stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
    return [NSString stringWithFormat:
        @"{\"name\":\"%@\",\"uid\":\"%@\",\"email\":\"%@\",\"avatar\":\"%@\"}",
        name, uid, email, avatar];
}

@end
