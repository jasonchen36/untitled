const //packages
    promise = require('bluebird'),
    fs = require('fs'),
//services
    util = require('./util');

var uploads = {};

uploads.deleteFile = function(fileName){
    return promise.resolve()
        .then(function(){
            fs.exists(util.globals.uploadsFolderDirectory+fileName, function(fileExists) {
                if(fileExists) {
                    fs.unlink(util.globals.uploadsFolderDirectory+fileName,function(){
                        return promise.resolve();
                    });
                } else {
                    return promise.resolve();
                }
            });
        });
};

module.exports = uploads;