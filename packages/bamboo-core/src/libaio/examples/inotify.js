"use strict";
var inotify = require('../inotify');
var watcher = new inotify.Inotify;
watcher.onerror = function (err, errno) {
    console.log('err', err, errno);
};
watcher.onevent = function (event) {
    console.log('event', event);
};
watcher.start();
var path = __dirname + '/watch/test.txt';
watcher.addPath(__dirname + '/watch');
