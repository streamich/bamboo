"use strict";
var index_1 = require('./index');
var fs = require('fs');
var libfs = index_1.build({
    path: require('path'),
    EventEmitter: require('events').EventEmitter,
    Buffer: require('buffer').Buffer,
    Readable: require('stream').Readable,
    Writable: require('stream').Writable
});
var file = __dirname + '/text.txt';
var file1 = '/share/full-js/lol.js';
var file2 = '/share/full-js';
var file3 = '/share/full-js/lol2.js';
setInterval(function () {
    console.log(libfs.statSync(file));
    console.log(fs.statSync(file));
    console.log(libfs.statSync(file1));
    console.log(fs.statSync(file1));
    console.log(libfs.statSync(file2));
    console.log(fs.statSync(file2));
    console.log(libfs.statSync(file3));
    console.log(fs.statSync(file3));
}, 1000);
