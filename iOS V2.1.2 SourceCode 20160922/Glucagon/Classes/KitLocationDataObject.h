//
//  KitLocationDataObject.h
//  Glucagon
//
//  Created by JamesMac on 12/11/14.
//
//

#import <Foundation/Foundation.h>

@interface KitLocationDataObject : NSObject<NSCoding>
{
    NSString *location;
    NSString *status;
    NSDate *date;
    
    NSNumber *notify_lastWeek;
    NSNumber *notify_2Weeks;
    NSNumber *notify_1Month;
}

@property (nonatomic, retain) NSString *location;
@property (nonatomic, retain) NSString *status;
@property (nonatomic, retain) NSDate *date;

@property (nonatomic, retain) NSNumber *notify_lastWeek;
@property (nonatomic, retain) NSNumber *notify_2Weeks;
@property (nonatomic, retain) NSNumber *notify_1Month;

-(id) initWithLocation:(NSString *)theLocation;
-(id) initWithLocation:(NSString *)theLocation withStatus:(NSString *)theStatus;

@end