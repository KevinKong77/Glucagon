/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  Glucagon
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"
#import "AppConstants.h"
#import <Google/Analytics.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    // Configure tracker from GoogleService-Info.plist.
    NSError *configureError;
    [[GGLContext sharedInstance] configureWithError:&configureError];
    NSAssert(!configureError, @"Error configuring Google services: %@", configureError);
    
    // Optional: configure GAI options.
    GAI *gai = [GAI sharedInstance];
    gai.trackUncaughtExceptions = YES;  // report uncaught exceptions
    //gai.logger.logLevel = kGAILogLevelVerbose;  // remove before app release
    
    self.viewController = [[MainViewController alloc] init];
    [self readHistoryData];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    NSString *name = @"Restart App";
    // The UA-XXXXX-Y tracker ID is loaded automatically from the
    // GoogleService-Info.plist by the `GGLContext` in the AppDelegate.
    // If you're copying this to an app just using Analytics, you'll
    // need to configure your tracking ID here.
    // [START screen_view_hit_objc]
    id<GAITracker> tracker = [[GAI sharedInstance] defaultTracker];
    [tracker set:kGAIScreenName value:name];
    [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    // [END screen_view_hit_objc]
}

/**************** James Added Begin ***********************/
/**********************************************************
 *   Read the history data for upgrading                  *
 **********************************************************/
- (void) readHistoryData{
    data_appSettings = [[NSMutableDictionary alloc] initWithCapacity:4];
    data_notes = [[NSMutableDictionary alloc]initWithCapacity:0];
    data_notification = [[NSMutableDictionary alloc] initWithCapacity:0];
    data_notificationVP = [[NSMutableDictionary alloc] initWithCapacity:0];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *documentsDirectory = [AppConstants getRootPath];
    NSString *emptyString = @"(NULL)";
    BOOL needSaveHistoryData = false;
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"MM/dd/yy hh:mm:ss"];
    
    [fileManager changeCurrentDirectoryPath:[documentsDirectory stringByExpandingTildeInPath]];
    NSString *path = [documentsDirectory stringByAppendingPathComponent:@"History.txt"];
    
    if(![[NSFileManager defaultManager] fileExistsAtPath:path]){
        needSaveHistoryData = true;
    }
    
    if(!needSaveHistoryData){
        return;
    }
    
    if([[NSFileManager defaultManager] fileExistsAtPath:[AppConstants getAppSettingsPath]]){
        [data_appSettings addEntriesFromDictionary:[NSKeyedUnarchiver unarchiveObjectWithFile:[AppConstants getAppSettingsPath]]];
        
        NSString *strAppSettings = [NSString stringWithFormat:@"(%@|%@)",
                                    [data_appSettings valueForKey:key_appSettings_audioGuide],
                                    [data_appSettings valueForKey:key_appSettings_manual]];
        
        //        if([self writeFile:strAppSettings saveFilePath:path]){
        //            [[NSFileManager defaultManager] removeItemAtPath:[AppConstants getAppSettingsPath] error:&error];
        //        }
        [self writeFile:strAppSettings saveFilePath:path];
    }else{
        NSLog(@"Didn't find the app settings file.");
        [self writeFile:emptyString saveFilePath:path];
    }
    
    if([[NSFileManager defaultManager] fileExistsAtPath:[AppConstants getNotesPath]]){
        data_notes = [[NSMutableDictionary alloc]
                      initWithDictionary:[NSKeyedUnarchiver unarchiveObjectWithFile:[AppConstants getNotesPath]]];
        
        NSLog(@"The note is %@",[data_notes objectForKey:@"notes"]);
        
        NSString *notes = [[data_notes objectForKey:@"notes"] stringByReplacingOccurrencesOfString:@"|r|n" withString:@"\\n"];
        
        NSString *strNotes = [NSString stringWithFormat:@"(%@)",notes];
        //        if([self writeFile:strNotes saveFilePath:path]){
        //            [[NSFileManager defaultManager] removeItemAtPath:[AppConstants getNotesPath] error:&error];
        //        }
        [self writeFile:strNotes saveFilePath:path];
    }else{
        NSLog(@"Didn't find the note file.");
        [self writeFile:emptyString saveFilePath:path];
    }
    
    if([[NSFileManager defaultManager] fileExistsAtPath:[AppConstants getNotificationsPath]]){
        data_notification = [[NSMutableDictionary alloc]
                             initWithDictionary:[NSKeyedUnarchiver unarchiveObjectWithFile:[AppConstants getNotificationsPath]]];
        
        NSMutableArray *arrayNotification = [[NSMutableArray alloc]init];
        NSMutableString *tempNotification = [[NSMutableString alloc]init];
        
        for(id key in data_notification)
        {
            kitLocationDataObject = [data_notification objectForKey:key];
            
            NSString *temp = [NSString stringWithFormat:@"[%@|%@|%@|%@|%@]",
                              kitLocationDataObject.location,
                              [dateFormatter stringFromDate:kitLocationDataObject.date],
                              kitLocationDataObject.notify_lastWeek,
                              kitLocationDataObject.notify_2Weeks,
                              kitLocationDataObject.notify_1Month];
            
            [arrayNotification addObject:temp];
        }
        
        for(int i=0; i < [arrayNotification count]; i++){
            [tempNotification appendString:[NSString stringWithFormat:@"%@",arrayNotification[i]]];
        }
        
        NSString *strNotifications = [NSString stringWithFormat:@"(%@)",tempNotification];
        
        //        if([self writeFile:strNotifications saveFilePath:path]){
        //            [[NSFileManager defaultManager] removeItemAtPath:[AppConstants getNotificationsPath] error:&error];
        //        }
        [self writeFile:strNotifications saveFilePath:path];
    }else{
        NSLog(@"Didn't find the Notifications file.");
        [self writeFile:emptyString saveFilePath:path];
    }
    
    if([[NSFileManager defaultManager] fileExistsAtPath:[AppConstants getNotificationsVPPath]]){
        data_notificationVP = [[NSMutableDictionary alloc]
                               initWithDictionary:[NSKeyedUnarchiver unarchiveObjectWithFile:[AppConstants getNotificationsVPPath]]];
        
        UILocalNotification *notification = [data_notificationVP objectForKey:@"notification"];
        
        NSString *strNotificationVP = [NSString stringWithFormat:@"(%@)", [dateFormatter stringFromDate:notification.fireDate]];
        
        [self writeFile:strNotificationVP saveFilePath:path];
    }else{
        NSLog(@"Didn't find the Notifications VP file.");
        [self writeFile:emptyString saveFilePath:path];
    }
}

-(BOOL) writeFile:(NSString *)dataString saveFilePath:(NSString *)path
{
    BOOL result = false;
    @try {
        if (![[NSFileManager defaultManager] fileExistsAtPath:path]) {
            result = [dataString writeToFile: path
                                  atomically: YES
                                    encoding: NSUTF8StringEncoding
                                       error: nil];
        }else{
            NSFileHandle *fileHandle = [NSFileHandle fileHandleForWritingAtPath:path];
            [fileHandle seekToEndOfFile];
            [fileHandle writeData:[dataString dataUsingEncoding:NSUTF8StringEncoding]];
            result = true;
        }
    }
    @catch (NSException *exception) {
        result = false;
    }
    
    return result;
}
/**************** James Added End *************************/

@end
