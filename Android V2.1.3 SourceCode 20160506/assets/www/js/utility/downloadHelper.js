var downloadHelper = {
    downloadFile: function (remoteUrl, localUrl, callBack) {
        var fileTransfer = new FileTransfer();
        fileTransfer.download(
            remoteUrl,
            localUrl,
            function (entry) {
                callBack(entry);
            },
            function (error) {
                callBack(null);
            }
        );
    }
}
