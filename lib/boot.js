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

var haveBinaryTools = process.call && process.frame;

if(haveBinaryTools) {
    // Export `StaticArrayBuffer`, required by `StaticBuffer`.
    StaticArrayBuffer = global.StaticArrayBuffer = require('./static-arraybuffer').StaticArrayBuffer;

    // Export `StaticBuffer`, `libjs` needs `StaticBuffer` so export it early.
    StaticBuffer = global.StaticBuffer = require('./static-buffer').StaticBuffer;
}


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

    // !IMPORTANT: everything that uses `process.nextTick()` must
    // bet executed in this callback so all the micro-tasks get correctly
    // executed after this first task is processed.


    // Create `process.asyscall` and `process.asyscall64`
    if(haveBinaryTools && __SHIM_ASYNC_SYSCALL__)
        require('./internal/asyscall');


    try {

        // Eval the file specified in first argument `full app.js`
        if(process.argv[1]) {
            var path = require('./path');
            var Module = require('./module').Module;
            process.argv = process.argv.splice(1);
            process.argv[1] = path.resolve(process.argv[1]);
            setImmediate(function() {
                Module.runMain();
            });
        }

    } catch(e) {
        console.log(e);
        console.log(e.line);
        console.log(e.stack);
    }

};
loop.insert(task);
loop.start();
