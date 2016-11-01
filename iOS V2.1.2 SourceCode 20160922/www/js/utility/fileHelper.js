var fileHelper = {
    requestFileSystem: function (successCallBack, errorCallBack) {
        var me = this;
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            successCallBack(fs.root);
        }, function (error) {
            errorCallBack(error);
        });
    },

    getDirectory: function (obj, folderName, successCallBack, errorCallBack) {
        var me = this;
        obj.getDirectory(folderName, {
            create: true,
            exclusive: false
        }, function (dirEntry) {
            successCallBack(dirEntry);
        }, function (error) {
            errorCallBack(error);
        });
    },

    clearDirectory: function (dirEntry, clearSubDir, callBack) {
        var me = this;
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function (entries) {
            if (commonHelper.isNullOrEmpty(entries) || entries.length == 0) {
                callBack(true);
            }
            else {
                var startIndex = -1;
                var removeFileFun = function () {
                    startIndex++;
                    if (entries[startIndex].isFile) {
                        entries[startIndex].remove(function (entry) {
                            if (startIndex < entries.length - 1) {
                                removeFileFun();
                            }
                            else {
                                callBack(true);
                            }
                        }, function (error) {
                            callBack(false);
                        });
                    }
                    else {
                        if (clearSubDir) {
                            entries[startIndex].removeRecursively(function (entry) {
                                if (startIndex < entries.length - 1) {
                                    removeFileFun();
                                }
                                else {
                                    callBack(true);
                                }
                            }, function (error) {
                                callBack(false);
                            });
                        }
                        else {
                            if (startIndex < entries.length - 1) {
                                removeFileFun();
                            }
                            else {
                                callBack(true);
                            }
                        }
                    }
                };

                removeFileFun();
            }
        }, function (error) {
            callBack(false);
        });
    },

    moveFiles: function (sourceDirEntry, targetDirEntry, callBack) {
        var me = this;
        me.getFiles(sourceDirEntry, function (entries) {
            if (commonHelper.isNullOrEmpty(entries) || entries.length == 0) {
                callBack(false);
            }
            else {
                var startIndex = -1;
                var moveFun = function () {
                    startIndex++;
                    entries[startIndex].moveTo(targetDirEntry, entries[startIndex].name, function (entry) {
                        if (startIndex < entries.length - 1) {
                            moveFun();
                        }
                        else {
                            callBack(true);
                        }
                    }, function (error) {
                        callBack(false);
                    });
                };

                moveFun();
            }
        }, function (error) {
            callBack(false);
        });
    },

    getFiles: function (dirEntry, successCallBack, errorCallBack) {
        var me = this;
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function (entries) {
            successCallBack(entries);
        }, function (error) {
            errorCallBack(error);
        });
    },

    getFile: function (dirEntry, fileName, successCallBack, errorCallBack) {
        var me = this;
        dirEntry.getFile(fileName, {
            create: false, exclusive: false
        }, function (fileEntry) {
            successCallBack(fileEntry);
        }, function (error) {
            errorCallBack(error);
        });
    },

    writeFile: function (dirEntry, fileName, content, successCallBack, errorCallBack) {
        var me = this;
        dirEntry.getFile(fileName, {
            create: true, exclusive: false
        }, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
                writer.onwriteend = function (evt) {
                    successCallBack();
                };
                writer.write(content);
            }, function (error) {
                errorCallBack(error);
            });
        }, function (error) {
            errorCallBack(error);
        });
    },

    removeFile: function (fileEntry, successCallBack, errorCallBack) {
        var me = this;
        fileEntry.remove(function (entry) {
            successCallBack();
        }, function (error) {
            errorCallBack();
        });
    },

    readTextFile: function (fileEntry, callBack) {
        var me = this;
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                callBack(this.result);
            }

            reader.readAsText(file);
        });
    }
};