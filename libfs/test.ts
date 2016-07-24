import {build} from './index';


var fs = require('fs');

var libfs = build({
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

setInterval(() => {
    // console.log(fs.readFileSync(file).toString());
    // console.log(libfs.readFileSync(file).toString());
    // console.log(fs.statSync(file));
    console.log(libfs.statSync(file));
    console.log(fs.statSync(file));
    console.log(libfs.statSync(file1));
    console.log(fs.statSync(file1));
    console.log(libfs.statSync(file2));
    console.log(fs.statSync(file2));
    console.log(libfs.statSync(file3));
    console.log(fs.statSync(file3));
}, 1000);



