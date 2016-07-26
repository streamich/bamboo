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

// Export `StaticArrayBuffer`, required by `StaticBuffer`.
StaticArrayBuffer = global.StaticArrayBuffer = require('./static-arraybuffer').StaticArrayBuffer;

// Export `StaticBuffer`, `libjs` needs `StaticBuffer` so export it early.
StaticBuffer = global.StaticBuffer = require('./static-buffer').StaticBuffer;


// Set-up `process` global.
require('./process');


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


// First task in the event loop.
var task = new Task;
task.callback = function() {

    var Module = require('./module').Module;
    // console.log(Module);
    var main = '/share/full-js/lol';
    Module._load(main, null, true);

    console.log(process.getgid());




    // console.log(process)

    // Export `StaticBuffer` and `StaticArrayBuffer` as globals

};
loop.insert(task);
loop.start();
