//
//  AppConstants.h
//  Glucagon
//
//  Created by JamesMac on 12/11/14.
//
//

#import <Foundation/Foundation.h>

@interface AppConstants : NSObject

extern NSString * const key_appSettings_audioGuide;
extern NSString * const key_appSettings_manual;
extern NSString * const key_appSettings_tos_accepted;
extern NSString * const key_appPreviewViewed;

+ (NSString*)getRootPath;
+ (NSString*)getAppSettingsPath;
+ (NSString*)getNotificationsPath;
+ (NSString*)getNotificationsVPPath;
+ (NSString*)getNotesPath;

@end
