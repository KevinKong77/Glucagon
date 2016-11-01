var dplPDFManager = {
    callBack: null,
    subFolderName: null,

    customerHtmlFileName: 'index.html',
    customerIphoneHtmlFileName: 'iphoneIndex.html',
    newFontSizeStyle: 'style="font-size: 85%!important"',

    subDirEntry: null,
    tempDirEntry: null,

    piDefaultFilePath: null,
    ppiDefaultFilePath: null,
    currentDefaultFilePath: null,

    currentVersionKey: null,
    remoteVersion: null,
    localVersion: null,

    htmlFileName: null,
    currentHtmlContent: null,

    resetConfig: function () {
        var me = this;

        me.callBack = null;
        me.subFolderName = null;

        me.subDirEntry = null;
        me.tempDirEntry = null;

        me.piDefaultFilePath = (!commonHelper.isIPhone()) ? 'dplPDF/pi/' + me.customerHtmlFileName : 'dplPDF/pi/' + me.customerIphoneHtmlFileName;
        me.ppiDefaultFilePath = (!commonHelper.isIPhone()) ? 'dplPDF/ppi/' + me.customerHtmlFileName : 'dplPDF/ppi/' + me.customerIphoneHtmlFileName;
        me.currentDefaultFilePath = null;

        me.currentVersionKey = null;
        me.remoteVersion = null;
        me.localVersion = null;

        me.htmlFileName = null;
        me.currentHtmlContent = null;
    },

    //Public method, InformationForUser And InformationForPhysician will call this function
    getPDFFiles: function (subFolderName, callBack) {
        var me = this;
        me.resetConfig();

        maskHelper.createMask(1, 'Checking DPL version...');
        maskHelper.openMask();

        me.callBack = callBack;
        me.subFolderName = subFolderName;

        if (subFolderName == appConfig.downloadConfig.dplPDFData.ppiFolderName) {
            me.currentVersionKey = enumLocalStorageItem.dplPDFData.ppi.version;
            me.currentDefaultFilePath = me.ppiDefaultFilePath;
            me.htmlFileName = appConfig.downloadConfig.dplPDFData.ppiHtmlName;
        }
        else {
            me.currentVersionKey = enumLocalStorageItem.dplPDFData.pi.version;
            me.currentDefaultFilePath = me.piDefaultFilePath;
            me.htmlFileName = appConfig.downloadConfig.dplPDFData.piHtmlName;
        }

        me.localVersion = userData.getValue(me.currentVersionKey);

        if (commonHelper.isTouchDevice()) {
            fileHelper.requestFileSystem(function (fsRoot) {
                me.onRequestFileSystemSucFun(fsRoot);
            }, function (error) {
                me.lastStepFun(enumDownloadStatus.Error);
            });
        }
        else {
            me.callBack(me.currentDefaultFilePath);
        }
    },

    //Private method, after the file request is requested
    onRequestFileSystemSucFun: function (fsRoot) {
        var me = this;
        fileHelper.getDirectory(fsRoot, appConfig.downloadConfig.rootFolderName, function (dirEntry) {
            me.rootDirectoryLocationSucFun(dirEntry);
        }, function (error) {
            me.lastStepFun(enumDownloadStatus.Error);
        });
    },

    //Private method, after root directory location successed
    rootDirectoryLocationSucFun: function (currentDirEntry) {
        var me = this;
        fileHelper.getDirectory(currentDirEntry, me.subFolderName, function (dirEntry) {
            me.subDirectoryLocationSucFun(dirEntry);
        }, function (error) {
            me.lastStepFun(enumDownloadStatus.Error);
        });
    },

    //Private method, after sub directory location successed
    subDirectoryLocationSucFun: function (currentDirEntry) {
        var me = this;
        me.subDirEntry = currentDirEntry;

        fileHelper.getDirectory(currentDirEntry, appConfig.downloadConfig.dplPDFData.tempFolderName, function (dirEntry) {
            fileHelper.clearDirectory(dirEntry, true, function (result) {
                if (result) {
                    me.tempDirectoryLocationSucFun(dirEntry);
                }
                else {
                    me.lastStepFun(enumDownloadStatus.Error);
                }
            });
        }, function (error) {
            me.lastStepFun(enumDownloadStatus.Error);
        });
    },

    //Private method, after temp directory location successed
    tempDirectoryLocationSucFun: function (currentDirEntry) {
        var me = this;
        me.tempDirEntry = currentDirEntry;

        //download the remote html file
        me.downloadHtmlFileFun(function () {
            if (commonHelper.isNullOrEmpty(me.currentHtmlContent)) {
                me.lastStepFun(enumDownloadStatus.OfflineMode);
            }
            else {
                me.verifyVersionFun(function (status) {
                    if (status != enumDownloadStatus.NeedUpdate) {
                        me.lastStepFun(status);
                    }
                    else {
                        me.processResourcesFun(function (result) {
                            if (!result) {
                                me.lastStepFun(enumDownloadStatus.Error);
                            }
                            else {
                                me.updateFontSizeForIphone(function () {
                                    me.createIndexFileFun(function (result) {
                                        if (!result) {
                                            me.lastStepFun(enumDownloadStatus.Error);
                                        }
                                        else {
                                            fileHelper.clearDirectory(me.subDirEntry, false, function (result) {
                                                if (!result) {
                                                    me.lastStepFun(enumDownloadStatus.Error);
                                                }
                                                else {
                                                    fileHelper.moveFiles(me.tempDirEntry, me.subDirEntry, function (result) {
                                                        if (!result) {
                                                            me.lastStepFun(enumDownloadStatus.Error);
                                                        }
                                                        else {
                                                            userData.setValue(me.currentVersionKey, me.remoteVersion);
                                                            me.lastStepFun(enumDownloadStatus.Success);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    //Private method, last step for the download helper
    downloadHtmlFileFun: function (callBack) {
        var me = this;
        //var remoteFileUrl = encodeURI(appConfig.downloadConfig.dplPDFData.remoteRootURL + appConfig.downloadConfig.dplPDFData.remoteFolderName + me.subFolderName + '/' + me.htmlFileName);
        var remoteFileUrl = encodeURI(appConfig.downloadConfig.dplPDFData.remoteRootURL + appConfig.downloadConfig.dplPDFData.remoteFolderName + me.htmlFileName);
        var localFileUrl = me.tempDirEntry.toURL() + me.htmlFileName;

        downloadHelper.downloadFile(remoteFileUrl, localFileUrl, function (fileEntry) {
            if (commonHelper.isNullOrEmpty(fileEntry)) {
                me.currentHtmlContent = null;
                callBack();
            }
            else {
                fileHelper.readTextFile(fileEntry, function (content) {
                    if (commonHelper.isNullOrEmpty(content)) {
                        me.currentHtmlContent = null;
                        callBack();
                    }
                    else {
                        me.currentHtmlContent = content;
                        callBack();
                    }
                });
            }
        });
    },

    //Private method, last step for the download helper
    verifyVersionFun: function (callBack) {
        var me = this;
        var tempContent = '';
        var tempTagStartIndex = -1;
        var tempTagEndIndex = -1;

        tempTagStartIndex = me.currentHtmlContent.indexOf(appConfig.downloadConfig.dplPDFData.remoteVersionTag);
        if (tempTagStartIndex < 0) {
            callBack(enumDownloadStatus.NoUpdate);
        }
        else {
            tempContent = me.currentHtmlContent.substring(tempTagStartIndex);
            tempContent = tempContent.substr(appConfig.downloadConfig.dplPDFData.remoteVersionTag.length, 7);

            me.remoteVersion = tempContent;

            if (me.remoteVersion == me.localVersion) {
                fileHelper.getFile(me.subDirEntry, me.customerHtmlFileName, function (fileEntry) {
                    if (commonHelper.isNullOrEmpty(fileEntry)) {
                        callBack(enumDownloadStatus.NeedUpdate);
                    }
                    else {
                        callBack(enumDownloadStatus.NoUpdate);
                    }
                }, function (error) {
                    callBack(enumDownloadStatus.NeedUpdate);
                });
            }
            else {
                callBack(enumDownloadStatus.NeedUpdate);
            }
        }
    },

    //Private method, last step for the download helper
    processResourcesFun: function (callBack) {
        var me = this;

        maskHelper.setNewMessage('Downloading resource files...');

        var styleReg = /<link[^>].*?>/g;
        var scriptReg = /<script[^>].*?>/g;
        var imageReg = /<img[^>].*?>/g;

        var tempContent;
        var tempArray;
        var tempArray1;
        var originSrcValue;
        var srcValue;
        var remoteSrcUrl;
        var localSrcUrl;
        var tempSrcIndex;

        var downloadedCount = 0;
        var downloadQueue = new Array();

        var styleElementList = me.currentHtmlContent.match(styleReg);
        var scriptElementList = me.currentHtmlContent.match(scriptReg);
        var imageElementList = me.currentHtmlContent.match(imageReg);

        var checkMatchedFun = function (propertyArray, propertyName, extNameArray) {
            var isMatched = false;

            if (propertyArray[0] == propertyName) {
                for (var i = 0; i < extNameArray.length; i++) {
                    if (propertyArray[1].indexOf(extNameArray[i]) > 0) {
                        isMatched = true;
                        break;
                    }
                }
            }
            else {
                isMatched = false;
            }

            return isMatched;
        };

        var analysisElementFun = function (elementList, propertyName, extNameArray) {
            if (!commonHelper.isNullOrEmpty(elementList) && elementList.length > 0) {
                for (var i = 0; i < elementList.length; i++) {
                    tempContent = '';
                    tempArray = null;
                    tempArray1 = null;
                    originSrcValue = '';
                    srcValue = '';
                    remoteSrcUrl = '';
                    localSrcUrl = '';
                    tempSrcIndex = -1;

                    tempContent = elementList[i].substr(1, elementList[i].length - 2);
                    tempArray = tempContent.split(' ');
                    for (var j = 0; j < tempArray.length; j++) {
                        if (tempArray[j].toString().indexOf('=') > 0) {
                            tempArray1 = tempArray[j].split('=');

                            if (checkMatchedFun(tempArray1, propertyName, extNameArray)) {
                                originSrcValue = tempArray1[1].substr(1, tempArray1[1].length - 2);
                                srcValue = tempArray1[1].substr(1, tempArray1[1].length - 2);
                                break;
                            }
                        }
                    }

                    if (!commonHelper.isNullOrEmpty(srcValue)) {
                        if (srcValue.substr(0, 7) == 'http://') {
                            remoteSrcUrl = srcValue;
                            tempArray = srcValue.split('/');
                        }
                        else if (srcValue.substr(0, 2) == '//') {
                            remoteSrcUrl = 'http:' + srcValue;
                            tempArray = srcValue.split('/');
                        }
                        else {
                            if (srcValue.substr(0, 1) != '.') {
                                srcValue = './' + srcValue;
                            }

                            tempArray = srcValue.split('/');
                            remoteSrcUrl = appConfig.downloadConfig.dplPDFData.remoteRootURL;

                            while (tempSrcIndex < tempArray.length - 1) {
                                tempSrcIndex++;
                                switch (tempArray[tempSrcIndex]) {
                                    case '..':
                                        remoteSrcUrl += appConfig.downloadConfig.dplPDFData.remoteFolderName;
                                        break;
                                    case '.':
                                        //remoteSrcUrl += appConfig.downloadConfig.dplPDFData.remoteFolderName + me.subFolderName + '/';
                                        remoteSrcUrl += appConfig.downloadConfig.dplPDFData.remoteFolderName + '/';
                                        break;
                                    case '':
                                        remoteSrcUrl += '';
                                        break;
                                    default:
                                        if (tempSrcIndex < tempArray.length - 1) {
                                            remoteSrcUrl += tempArray[tempSrcIndex] + '/';
                                        }
                                        else {
                                            remoteSrcUrl += tempArray[tempSrcIndex];
                                        }
                                        break;
                                }
                            }
                        }

                        remoteSrcUrl = encodeURI(remoteSrcUrl);
                        localSrcUrl = me.tempDirEntry.toURL() + tempArray[tempArray.length - 1];

                        downloadQueue.push([remoteSrcUrl, localSrcUrl, originSrcValue, tempArray[tempArray.length - 1]]);
                    }
                }
            }
        };

        analysisElementFun(styleElementList, 'href', ['.css']);
        analysisElementFun(scriptElementList, 'src', ['.js']);
        analysisElementFun(imageElementList, 'src', ['.jpg', '.png']);

        var downloadResourceFun = function () {
            if (downloadedCount == downloadQueue.length) {
                callBack(true);
            }
            else {
                downloadHelper.downloadFile(downloadQueue[downloadedCount][0], downloadQueue[downloadedCount][1], function (fileEntry) {
                    if (commonHelper.isNullOrEmpty(fileEntry)) {
                        callBack(false);
                    }
                    else {
                        me.currentHtmlContent = me.currentHtmlContent.replace(downloadQueue[downloadedCount][2], downloadQueue[downloadedCount][3]);
                        downloadedCount++;
                        maskHelper.refreshProgressValue(downloadedCount / downloadQueue.length);
                        downloadResourceFun();
                    }
                });
            }
        };

        downloadResourceFun();
    },

    //Private method, last step for the download helper
    updateFontSizeForIphone: function (callBack) {
        var me = this;

        if (commonHelper.isIPhone()) {
            var bodyReg = /<body[^>].*?>/g;
            var bodyElement = me.currentHtmlContent.match(bodyReg)[0];
            var newBodyElement = bodyElement.substr(0, bodyElement.length - 1) + ' ' + me.newFontSizeStyle + '>';
            me.currentHtmlContent = me.currentHtmlContent.replace(bodyElement, newBodyElement);
        }
        callBack();
    },

    //Private method, last step for the download helper
    createIndexFileFun: function (callBack) {
        var me = this;
        maskHelper.setNewMessage('Wait for loading...');

        fileHelper.writeFile(me.tempDirEntry, me.customerHtmlFileName, me.currentHtmlContent, function () {
            callBack(true);
        }, function (error) {
            callBack(false);
        });
    },

    //Private method, last step for the download helper
    lastStepFun: function (status) {
        var me = this;

        fileHelper.getFile(me.subDirEntry, me.customerHtmlFileName, function (fileEntry) {
            if (commonHelper.isNullOrEmpty(fileEntry)) {
                me.callBack(me.currentDefaultFilePath);
            }
            else {
                me.callBack(fileEntry.toURL());
            }
        }, function (error) {
            me.callBack(me.currentDefaultFilePath);
        });
    }
};