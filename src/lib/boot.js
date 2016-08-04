// This file is in `.js` because we set global variables here, but TypeScript
// transpiles with `"use strict"` and in strict mode you cannot set globals.


// Self is set to global `this` by Webpack, see `webpack.config.js`.
// In different environments global variables are called differently,
// for example, in Duktape the global variable is called `Duktape`,
// so here we make sure there is a global variable called `global`.
// global = self;
// global.global = global;


// Export `Buffer` as global. Other things use `Buffer`, so we export Buffer first.
Buffer = global.Buffer = require('./buffer').Buffer;


// Check if we have more tools than just `process.syscall`.
process.hasBinaryUtils = process.call && process.frame;


// Export `StaticArrayBuffer`, required by `StaticBuffer`.
if(typeof StaticArrayBuffer === 'undefined') {
    StaticArrayBuffer = global.StaticArrayBuffer = process.hasBinaryUtils
            ? require('./static-arraybuffer').StaticArrayBuffer
            : ArrayBuffer;
}


// Export `StaticBuffer`, `libjs` needs `StaticBuffer` so export it early.
if(typeof StaticBuffer === 'undefined') {
    StaticBuffer = global.StaticBuffer= process.hasBinaryUtils
            ? require('./static-buffer').StaticBuffer
            : Buffer;
}


// Set-up `process` global.
require('./process');


// Create global `console` object.
console = require('./console');


// The main event loop, attached to `process` as `loop` property.
var eloop = require('./eloop');
var EventLoop = eloop.EventLoop;
var Task = eloop.Task;
var loop = process.loop = new EventLoop;


// Export timers as globals.
var timers = require('./timers');
setTimeout = timers.setTimeout;
clearTimeout = timers.clearTimeout;
setInterval = timers.setInterval;
clearInterval = timers.clearInterval;
setImmediate = timers.setImmediate;
clearImmediate = timers.clearImmediate;
setIOPoll = timers.setIOPoll;
clearIOPoll = timers.clearIOPoll;
setMicroTask = process.nextTick = timers.setMicroTask;


// First task in the event loop.
console.log(1);
var task = new Task;
console.log(2);
task.callback = function() {

    // !IMPORTANT: everything that uses `process.nextTick()` must
    // bet executed in this callback so all the micro-tasks get correctly
    // executed after this first macro-task is processed.


    // Create `process.asyscall` and `process.asyscall64`

    // require('../libasyscall/create');

/*
    try {
        // Eval the file specified in first argument `full app.js`
        if(process.argv[1]) {
            var path = require('./path');
            var Module = require('./module').Module;
            process.argv = process.argv.splice(1);
            process.argv[1] = path.resolve(process.argv[1]);
            setImmediate(function() {
                try {
                    Module.runMain();
                } catch(e) {
                    console.log(e);
                    console.log(e.stack);
                }
            });
        }
    } catch(e) {
        console.log(e);
        console.log(e.stack);
    }*/

};
loop.insert(task);
loop.start();
