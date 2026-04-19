#import <UIKit/UIKit.h>

@interface FacebookBridge : NSObject
+ (void)initializeWithApp:(UIApplication *)app options:(NSDictionary *)options;
+ (BOOL)handleOpenURL:(NSURL *)url options:(NSDictionary *)options;
+ (void)applicationDidBecomeActive;

// jsb.reflection yêu cầu mọi method phải có đúng 1 NSString* arg và trả NSString*
+ (NSString *)login:(NSString *)unused;
+ (NSString *)logout:(NSString *)unused;
+ (NSString *)getProfile:(NSString *)unused;
+ (NSString *)getLoginResult:(NSString *)unused;
+ (NSString *)shareWithText:(NSString *)text;
@end
