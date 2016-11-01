//
//  KitLocationDataObject.m
//  Glucagon
//
//  Created by JamesMac on 12/11/14.
//
//

#import "KitLocationDataObject.h"

@implementation KitLocationDataObject

@synthesize location, status, date;
@synthesize notify_lastWeek, notify_2Weeks, notify_1Month;

-(id)init
{
    return self;
}

-(id)initWithLocation:(NSString *)theLocation
{
    self.location = theLocation;
    
    return self;
}

-(id)initWithLocation:(NSString *)theLocation withStatus:(NSString *)theStatus
{
    self.location = theLocation;
    self.status = theStatus;
    
    return self;
}

-(void)encodeWithCoder:(NSCoder *)aCoder
{
    [aCoder encodeObject:location forKey:@"location"];
    [aCoder encodeObject:status forKey:@"status"];
    [aCoder encodeObject:date forKey:@"date"];
    [aCoder encodeObject:notify_lastWeek forKey:@"notify_lastWeek"];
    [aCoder encodeObject:notify_2Weeks forKey:@"notify_2Weeks"];
    [aCoder encodeObject:notify_1Month forKey:@"notify_1Month"];
}

-(id) initWithCoder:(NSCoder *)aDecoder
{
    self.location = [aDecoder decodeObjectForKey:@"location"];
    self.status = [aDecoder decodeObjectForKey:@"status"];
    self.date = [aDecoder decodeObjectForKey:@"date"];
    self.notify_lastWeek = [aDecoder decodeObjectForKey:@"notify_lastWeek"];
    self.notify_2Weeks = [aDecoder decodeObjectForKey:@"notify_2Weeks"];
    self.notify_1Month = [aDecoder decodeObjectForKey:@"notify_1Month"];
    
    return self;
}

@end