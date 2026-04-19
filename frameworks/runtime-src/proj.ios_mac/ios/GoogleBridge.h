#import <UIKit/UIKit.h>

@interface GoogleBridge : NSObject
+ (void)initialize;
+ (BOOL)handleOpenURL:(NSURL *)url;

// jsb.reflection requires exactly 1 NSString* arg and NSString* return
+ (NSString *)speak:(NSString *)text;
+ (NSString *)login:(NSString *)unused;
+ (NSString *)getLoginResult:(NSString *)unused;
+ (NSString *)logout:(NSString *)unused;
+ (NSString *)getProfile:(NSString *)unused;
@end
