var appConfig = {
    isTransitional: true,
    appName: 'Glucagon Mobile App',
    appVersion: 'APPCONFIG_APPVERSION',
    publishedDate: 'APPCONFIG_PUBLISHEDDATE',
    panelShowAnimation: 'fadeIn', //fade , fadeOut, flip,pop, popOut, slide, slideOut
    friendlyErrorMessage: 'e.line + \':\' + e.message',
    serviceKey: 'ITLServiceKey',

    appDomain: 'com.lilly.glucagon',
    dbName: 'GlucagonApp',
    dbVersion: '1.0',
    dbDesc: 'GlucagonApp',
    dbSize: 1024 * 1024 * 5,
    myKits: {
        tableName: 'myKits',
        fields: {
            uniqueID: {
                fieldName: 'uniqueID',
                fieldType: 'Integer',
                fieldNullable: 'Not Null'
            },
            location: {
                fieldName: 'location',
                fieldType: 'Text',
                fieldNullable: 'Not Null'
            },
            expiredTime: {
                fieldName: 'expiredTime',
                fieldType: 'DateTime',
                fieldNullable: 'Not Null'
            },
            firstNoticeTime: {
                fieldName: 'firstNoticeTime',
                fieldType: 'DateTime',
                fieldNullable: 'Null'
            },
            reminderEveryDay: {
                fieldName: 'reminderEveryDay',
                fieldType: 'Integer',
                fieldNullable: 'Not Null'
            },
            reminderTwoWeeksAge: {
                fieldName: 'reminderTwoWeeksAge',
                fieldType: 'Integer',
                fieldNullable: 'Not Null'
            },
            reminderOneMonthAge: {
                fieldName: 'reminderOneMonthAge',
                fieldType: 'Integer',
                fieldNullable: 'Not Null'
            }
        }
    },
    myLocalNotifications: {
        tableName: 'myLocalNotifications',
        fields: {
            kitUniqueID: {
                fieldName: 'kitUniqueID',
                fieldType: 'Integer',
                fieldNullable: 'Not Null'
            },
            orderNumber: {
                fieldName: 'orderNumber',
                fieldType: 'Integer',
                fieldNullable: 'Not Null'
            },
            scheduledTime: {
                fieldName: 'scheduledTime',
                fieldType: 'DateTime',
                fieldNullable: 'Not Null'
            }
        }
    },
    downloadConfig: {
        rootFolderName: 'Glucagon',
        dplPDFData: {            
            piFolderName: 'pi',
            piHtmlName: 'glucagon.html',
            ppiFolderName: 'ppi',
            ppiHtmlName: 'glucagon.html',
            tempFolderName: 'temp',
            remoteRootURL: 'http://uspl.lilly.com/',
            remoteFolderName: 'glucagon/',
            remoteVersionTag: '<div class="EffectiveDate">Revised: '
        }
    },    
    historyDataFileName: 'History.txt'
};
