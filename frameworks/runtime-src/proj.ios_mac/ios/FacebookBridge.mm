// Compiled with -fobjc-arc -fmodules -fcxx-modules
#import "FacebookBridge.h"
@import FBSDKCoreKit;
@import FBSDKLoginKit;

static NSString *_loginResult = nil;

@implementation FacebookBridge

+ (void)initializeWithApp:(UIApplication *)app options:(NSDictionary *)options {
    [FBSDKSettings.sharedSettings setAppID:@"2441789679578067"];
    [FBSDKSettings.sharedSettings setClientToken:@"3364679aaa729b0beb09ea7bc1ab2148"];
    [[FBSDKApplicationDelegate sharedInstance] application:app
                             didFinishLaunchingWithOptions:options];
}

+ (BOOL)handleOpenURL:(NSURL *)url options:(NSDictionary *)options {
    return [[FBSDKApplicationDelegate sharedInstance]
            application:[UIApplication sharedApplication]
                openURL:url
               options:options];
}

+ (void)applicationDidBecomeActive {
    [FBSDKAppEvents.shared activateApp];
}

+ (NSString *)login:(NSString *)unused {
    FBSDKLoginManager *mgr = [[FBSDKLoginManager alloc] init];
    UIViewController *vc = [UIApplication sharedApplication].keyWindow.rootViewController;
    [mgr logInWithPermissions:@[@"public_profile"]
           fromViewController:vc
                      handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        if (error || result.isCancelled) {
            NSString *reason = error ? error.localizedDescription : @"cancelled";
            reason = [reason stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
            _loginResult = [NSString stringWithFormat:@"{\"success\":false,\"error\":\"%@\"}", reason];
            return;
        }
        [FBSDKProfile loadCurrentProfileWithCompletion:^(FBSDKProfile *profile, NSError *err) {
            NSString *name   = profile.name ?: @"";
            NSString *uid    = profile.userID ?: @"";
            NSString *avatar = [[profile imageURLForPictureMode:FBSDKProfilePictureModeSquare
                                                           size:CGSizeMake(100, 100)] absoluteString] ?: @"";
            name   = [name   stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
            avatar = [avatar stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
            [[NSUserDefaults standardUserDefaults] setObject:name   forKey:@"fb_name"];
            [[NSUserDefaults standardUserDefaults] setObject:uid    forKey:@"fb_uid"];
            [[NSUserDefaults standardUserDefaults] setObject:avatar forKey:@"fb_avatar"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            _loginResult = [NSString stringWithFormat:
                @"{\"success\":true,\"name\":\"%@\",\"uid\":\"%@\",\"avatar\":\"%@\"}",
                name, uid, avatar];
        }];
    }];
    return @"";
}

+ (NSString *)getLoginResult:(NSString *)unused {
    if (!_loginResult) return @"";
    NSString *r = _loginResult;
    _loginResult = nil;
    return r;
}

+ (NSString *)logout:(NSString *)unused {
    [[FBSDKLoginManager alloc] init];
    FBSDKLoginManager *mgr = [[FBSDKLoginManager alloc] init];
    [mgr logOut];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"fb_name"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"fb_uid"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"fb_avatar"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    return @"";
}

+ (NSString *)getProfile:(NSString *)unused {
    NSString *uid = [[NSUserDefaults standardUserDefaults] stringForKey:@"fb_uid"] ?: @"";
    if (uid.length == 0) return @"";
    NSString *name   = [[NSUserDefaults standardUserDefaults] stringForKey:@"fb_name"]   ?: @"";
    NSString *avatar = [[NSUserDefaults standardUserDefaults] stringForKey:@"fb_avatar"] ?: @"";
    name   = [name   stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
    avatar = [avatar stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
    return [NSString stringWithFormat:
        @"{\"name\":\"%@\",\"uid\":\"%@\",\"avatar\":\"%@\"}", name, uid, avatar];
}

+ (NSString *)shareWithText:(NSString *)text {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIActivityViewController *ac = [[UIActivityViewController alloc]
            initWithActivityItems:@[text]
            applicationActivities:nil];
        UIViewController *vc = [UIApplication sharedApplication].keyWindow.rootViewController;
        ac.popoverPresentationController.sourceView = vc.view;
        ac.popoverPresentationController.sourceRect = CGRectMake(
            vc.view.bounds.size.width / 2, vc.view.bounds.size.height, 1, 1);
        [vc presentViewController:ac animated:YES completion:nil];
    });
    return @"";
}

@end
