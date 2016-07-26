#!/usr/bin/env node


// var global = {};
// var process = {};
// global.process = process;


var libsys = require('libsys');
process.syscall = libsys.syscall;
process.syscall64 = libsys.syscall64;
process.frame = libsys.malloc;
process.errno = libsys.errno;


var fs = require('fs');
var fulljs = fs.readFileSync(__dirname + '/dist/full.js', 'utf8');
eval(fulljs);
