/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "FacebookBridge.h"   // plain header — no FB SDK types here
#import "GoogleBridge.h"     // plain header — no Google SDK types here

@implementation AppController

@synthesize window;

static AppDelegate s_sharedApplication;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    @try {
        [FacebookBridge initializeWithApp:application options:launchOptions];
    } @catch (NSException *e) {
        NSLog(@"[KingFun] Facebook init failed: %@", e);
    }
    @try {
        [GoogleBridge initialize];
    } @catch (NSException *e) {
        NSLog(@"[KingFun] Google init failed: %@", e);
    }

    cocos2d::Application *app = cocos2d::Application::getInstance();
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();

    window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    _viewController = [[RootViewController alloc] init];
    _viewController.wantsFullScreenLayout = YES;

    if ([[UIDevice currentDevice].systemVersion floatValue] < 6.0) {
        [window addSubview:_viewController.view];
    } else {
        [window setRootViewController:_viewController];
    }

    [window makeKeyAndVisible];
    [[UIApplication sharedApplication] setStatusBarHidden:true];

    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void *)_viewController.view);
    cocos2d::Director::getInstance()->setOpenGLView(glview);

    app->run();
    return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
    if ([GoogleBridge handleOpenURL:url]) return YES;
    return [FacebookBridge handleOpenURL:url options:options];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    cocos2d::Application::getInstance()->applicationWillEnterForeground();
}

- (void)applicationWillResignActive:(UIApplication *)application {}
- (void)applicationDidBecomeActive:(UIApplication *)application {
    [FacebookBridge applicationDidBecomeActive];
}
- (void)applicationWillTerminate:(UIApplication *)application {}
- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {}

#if !__has_feature(objc_arc)
- (void)dealloc {
    [window release];
    [_viewController release];
    [super dealloc];
}
#endif

@end
