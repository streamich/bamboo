"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require('../libjs/index');
var Poll;
var platform = process.platform;
switch (platform) {
    case 'linux':
        Poll = require('../libaio/epoll').Poll;
        break;
    default:
        throw Error("Platform not supported: " + platform);
}
var POINTER_NONE = -1;
var DELAYS = [
    -2,
    -1,
    1,
    8,
    16,
    32,
    64,
    128,
    256,
    1024,
    4096,
    16384,
    65536,
    131072,
    524288,
    2097152,
    8388608,
    33554432,
    268435456,
    2147483648,
    Infinity,
];
var DELAY_LAST = DELAYS.length - 1;
function findDelayIndex(delay) {
    for (var i = 0; i <= DELAY_LAST; i++)
        if (delay <= DELAYS[i])
            return i;
}
var MicroTask = (function () {
    function MicroTask(callback, args) {
        this.next = null;
        this.prev = null;
        this.callback = callback || null;
        this.args = args || null;
    }
    MicroTask.prototype.exec = function () {
        var args = this.args, callback = this.callback;
        if (!args) {
            callback();
        }
        else {
            switch (args.length) {
                case 1:
                    callback(args[0]);
                    break;
                case 2:
                    callback(args[0], args[1]);
                    break;
                case 3:
                    callback(args[0], args[1], args[2]);
                    break;
                default:
                    callback.apply(null, args);
            }
        }
    };
    return MicroTask;
}());
exports.MicroTask = MicroTask;
var Task = (function (_super) {
    __extends(Task, _super);
    function Task() {
        _super.apply(this, arguments);
        this.delay = -2;
        this.timeout = 0;
        this.pointer = POINTER_NONE;
        this.isRef = true;
        this.queue = null;
    }
    Task.prototype.ref = function () {
        if (!this.isRef) {
        }
    };
    Task.prototype.unref = function () {
        if (this.isRef) {
        }
    };
    Task.prototype.cancel = function () {
        this.queue.cancel(this);
    };
    return Task;
}(MicroTask));
exports.Task = Task;
var EventQueue = (function () {
    function EventQueue() {
        this.start = null;
        this.active = null;
        this.pointers = [];
    }
    EventQueue.prototype.setPointer = function (pointer_index, task) {
        var pointers = this.pointers;
        var timeout = task.timeout;
        pointers[pointer_index] = task;
        task.pointer = pointer_index;
        for (var i = pointer_index + 1; i <= DELAY_LAST; i++) {
            var p = pointers[i];
            if (!p) {
                pointers[i] = task;
            }
            else {
                if (p.timeout <= timeout) {
                    pointers[i] = task;
                }
                else {
                    break;
                }
            }
        }
    };
    EventQueue.prototype.insertTask = function (curr, task) {
        var timeout = task.timeout;
        var prev = null;
        if (timeout >= curr.timeout) {
            do {
                prev = curr;
                curr = curr.next;
            } while (curr && (curr.timeout <= timeout));
            prev.next = task;
            task.prev = prev;
            if (curr) {
                curr.prev = task;
                task.next = curr;
            }
        }
        else {
            do {
                prev = curr;
                curr = curr.prev;
            } while (curr && (curr.timeout > timeout));
            prev.prev = task;
            task.next = prev;
            if (curr) {
                curr.next = task;
                task.prev = curr;
            }
            else {
                this.start = task;
            }
        }
    };
    EventQueue.prototype.msNextTask = function () {
        if (this.start) {
            return this.start.timeout - Date.now();
        }
        return Infinity;
    };
    EventQueue.prototype.insert = function (task) {
        task.queue = this;
        var delay = task.delay;
        var timeout = task.timeout = Date.now() + delay;
        var pointers = this.pointers;
        var pointer_index = findDelayIndex(delay);
        var curr = pointers[pointer_index];
        if (!curr) {
            this.setPointer(pointer_index, task);
            if (pointer_index) {
                for (var i = pointer_index - 1; i >= 0; i--) {
                    if (pointers[i]) {
                        curr = pointers[i];
                        break;
                    }
                }
            }
            if (!curr)
                curr = this.start;
            if (!curr) {
                this.start = task;
            }
            else {
                this.insertTask(curr, task);
            }
        }
        else {
            if (timeout >= curr.timeout) {
                this.setPointer(pointer_index, task);
            }
            this.insertTask(curr, task);
        }
    };
    EventQueue.prototype.cancel = function (task) {
        var prev = task.prev;
        var next = task.next;
        task.prev = task.next = null;
        if (prev)
            prev.next = next;
        if (next)
            next.prev = prev;
        if (!prev) {
            this.start = next;
        }
        if (task.pointer !== POINTER_NONE) {
            var index = task.pointer;
            if (index) {
                this.pointers[index] = this.pointers[index - 1];
            }
            else {
                this.pointers[index] = null;
            }
        }
    };
    EventQueue.prototype.sliceActiveQueue = function () {
        var curr = this.start;
        if (!curr)
            return;
        var time = Date.now();
        var pointers = this.pointers;
        for (var i = 0; i <= DELAY_LAST; i++) {
            var pointer = pointers[i];
            if (pointer) {
                if (pointer.timeout <= time) {
                    pointers[i] = null;
                    curr = pointer;
                }
                else {
                    break;
                }
            }
        }
        if (curr.timeout > time)
            return;
        var prev;
        do {
            prev = curr;
            curr = curr.next;
        } while (curr && (curr.timeout <= time));
        prev.next = null;
        if (curr)
            curr.prev = null;
        this.active = this.start;
        this.start = curr;
    };
    EventQueue.prototype.cycle = function () {
        this.sliceActiveQueue();
    };
    EventQueue.prototype.pop = function () {
        var task = this.active;
        if (!task)
            return null;
        this.active = task.next;
        return task;
    };
    return EventQueue;
}());
exports.EventQueue = EventQueue;
var EventLoop = (function () {
    function EventLoop() {
        this.microQueue = null;
        this.microQueueEnd = null;
        this.refQueue = new EventQueue;
        this.unrefQueue = new EventQueue;
        this.poll = new Poll;
    }
    EventLoop.prototype.shouldStop = function () {
        if (!this.refQueue.start)
            return true;
        return false;
    };
    EventLoop.prototype.insertMicrotask = function (microtask) {
        var last = this.microQueueEnd;
        this.microQueueEnd = microtask;
        if (!last) {
            this.microQueue = microtask;
        }
        else {
            last.next = microtask;
        }
    };
    EventLoop.prototype.insert = function (task) {
        if (task.isRef)
            this.refQueue.insert(task);
        else
            this.unrefQueue.insert(task);
    };
    EventLoop.prototype.start = function () {
        function exec_task(task) {
            if (task.callback)
                task.callback();
        }
        while (1) {
            this.refQueue.cycle();
            this.unrefQueue.cycle();
            var refTask = this.refQueue.pop();
            var unrefTask = this.unrefQueue.pop();
            var task;
            while (refTask || unrefTask) {
                if (refTask && unrefTask) {
                    if (refTask.timeout < unrefTask.timeout) {
                        refTask.exec();
                        refTask = null;
                    }
                    else if (refTask.timeout > unrefTask.timeout) {
                        unrefTask.exec();
                        unrefTask = null;
                    }
                    else {
                        if (refTask.timeout <= unrefTask.timeout) {
                            refTask.exec();
                            refTask = null;
                        }
                        else {
                            unrefTask.exec();
                            unrefTask = null;
                        }
                    }
                }
                else {
                    if (refTask) {
                        refTask.exec();
                        refTask = null;
                    }
                    else {
                        unrefTask.exec();
                        unrefTask = null;
                    }
                }
                var microtask;
                do {
                    microtask = this.microQueue;
                    if (microtask) {
                        if (microtask.callback)
                            microtask.exec();
                        this.microQueue = microtask.next;
                    }
                } while (this.microQueue);
                this.microQueueEnd = null;
                if (!refTask)
                    refTask = this.refQueue.pop();
                else
                    unrefTask = this.unrefQueue.pop();
            }
            var havePollEvents = this.poll.hasRefs();
            if (this.shouldStop() && !havePollEvents)
                break;
            var ref_ms = this.refQueue.msNextTask();
            var unref_ms = this.unrefQueue.msNextTask();
            var CAP = 1000000;
            var ms = Math.min(ref_ms, unref_ms, CAP);
            if (ms > 0) {
                if (havePollEvents) {
                    this.poll.wait(ms);
                }
                else {
                    var seconds = Math.floor(ms / 1000);
                    var nanoseconds = (ms % 1000) * 1000000;
                    index_1.nanosleep(seconds, nanoseconds);
                }
            }
            else {
                if (ms > 1) {
                    index_1.sched_yield();
                }
            }
        }
    };
    return EventLoop;
}());
exports.EventLoop = EventLoop;
