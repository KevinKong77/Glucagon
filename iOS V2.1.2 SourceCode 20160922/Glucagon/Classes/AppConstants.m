//
//  AppConstants.m
//  Glucagon
//
//  Created by JamesMac on 12/11/14.
//
//

#import <Foundation/Foundation.h>
@implementation AppConstants : NSObject 

NSString * const file_appSettings                   = @"pList_appSettings.plist";
NSString * const file_notifications                 = @"pList_notifications.plist";
NSString * const file_notificationsVP               = @"pList_notificationsVP.plist";
NSString * const file_notes                         = @"pList_notes.plist";

NSString * const key_appSettings_audioGuide         = @"key_appSettings_audioGuide";
NSString * const key_appSettings_manual             = @"key_appSettings_manual";
NSString * const key_appSettings_tos_accepted       = @"key_appSettings_tos_accepted";
NSString * const key_appPreviewViewed               = @"key_appPreviewViewed";

+ (NSString*)getRootPath
{
    return [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
}

+ (NSString*)getAppSettingsPath
{
    return [[self getRootPath] stringByAppendingPathComponent:file_appSettings];
}

+ (NSString*)getNotificationsPath
{
    return [[self getRootPath] stringByAppendingPathComponent:file_notifications];
}

+ (NSString*)getNotificationsVPPath
{
    return [[self getRootPath] stringByAppendingPathComponent:file_notificationsVP];
}

+ (NSString*)getNotesPath
{
    return [[self getRootPath] stringByAppendingPathComponent:file_notes];
}
@end
