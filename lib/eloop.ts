import {sched_yield, nanosleep} from '../libjs/index';


export const enum DELAY {
    IMMEDIATE = -2,     // In Node.js `setImmediate` is executed before I/O polling events.
    IO = -1,
}

const POINTER_NONE = -1;

const DELAYS = [
    DELAY.IMMEDIATE,
    DELAY.IO,
    1,
    // 2,
    // 4,
    8,
    16,
    32,
    64,
    128,
    256,
    // 512,
    1024,
    // 2048,
    4096,
    // 8192,
    16384,
    // 32768,
    65536,
    131072,
    // 262144,
    524288,
    // 1048576,
    2097152,
    // 4194304,
    8388608,
    // 16777216,
    33554432,
    // 67108864,
    // 134217728,
    268435456,
    // 536870912,
    // 1073741824,
    2147483648,
    Infinity,
];
const DELAY_LAST = DELAYS.length - 1;

function findDelayIndex(delay) {
    for(var i = 0; i <= DELAY_LAST; i++)
        if(delay <= DELAYS[i]) return i;
}


export interface IQueue {
    next: IQueue;
    prev: IQueue;
}


// var _task_id = -1125899906842624;
export class MicroTask implements IQueue {
    // id: number = _task_id++;            // Every task has a unique ID in increasing order, used to merge queues with equal IDs.
    next: MicroTask = null;             // Previous task in list
    prev: MicroTask = null;             // Next task in list
    callback = null;                    // Callback to be executed if any
    args = null;                        // Optional arguments to pass to callback.

    exec() {
        var args = this.args, callback = this.callback;
        if(!args) {
            callback();
        } else {
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
    }
}


export class Task extends MicroTask {
    next: Task;
    prev: Task;
    delay: number = DELAY.IMMEDIATE;    // Delay in ms
    timeout: number = 0;                // UNIX time in ms when `delay` happens
    pointer: number = POINTER_NONE;     // >1 if some deep pointer from queue points to this task.
    isRef: boolean = true;              // Whether to keep process running while this task scheduled.
    queue: EventQueue = null;           // `EventQueue` where this `Task` is inserted.

    // constructor() { }

    ref() {
        if(!this.isRef) {
            
        }
    }

    unref() {
        if(this.isRef) {
            
        }
    }

    cancel() {
        this.queue.cancel(this);
    }
}


export class EventQueue {
    start: Task = null;         // Macro-task queue: `setImmediate`, `I/O`, `setTimeout`, `setInterval`.
    active: Task = null;        // Slice of `macroQueue` that is being executed in current event loop cycle.

    // Deep pointers into `macroQueue` by the `delay` of the last task inserted in
    // the queue with that delay or lesser, these give us the guidance where in the
    // queue we should start looking for to insert a new task.
    pointers: Task[] = [
        // 0:   Last `setImmediate` in the queue
        // 1:   Last `setTimeout(..., 1) in the queue
        // 8:   Last `setTimeout(..., 2..8) in the queue
        // 16:  Last `setTimeout(..., 9..16) in the queue
        // .
        // .
        // .
        // Infinity:  Last `setTimeout(..., 2147483649..Infinity) in the queue
    ];

    protected setPointer(pointer_index: number, task: Task) {
        var pointers = this.pointers;
        var timeout = task.timeout;

        pointers[pointer_index] = task;
        task.pointer = pointer_index;

        // Make sure all pointers pointing to greater delay values are
        // pointing at least as deep in the queue as the current pointer.
        for(var i = pointer_index + 1; i <= DELAY_LAST; i++) {
            var p = pointers[i];
            if (!p) {
                pointers[i] = task;
            } else {
                if (p.timeout <= timeout) {
                    pointers[i] = task;
                } else {
                    break;
                }
            }
        }
    }

    protected insertTask(curr: Task, task: Task) {
        var timeout = task.timeout;
        var prev: Task = null;

        if(timeout >= curr.timeout) {
            do {
                prev = curr;
                curr = curr.next;
            } while(curr && (curr.timeout <= timeout));

            prev.next = task;
            task.prev = prev;

            if(curr) {
                curr.prev = task;
                task.next = curr;
            }

        } else {
            do {
                prev = curr;
                curr = curr.prev;
            } while(curr && (curr.timeout > timeout));

            prev.prev = task;
            task.next = prev;

            if(curr) {
                curr.next = task;
                task.prev = curr;
            } else { // First element in queue
                this.start = task;
            }
        }
    }

    // Milliseconds when next task to be executed.
    msNextTask() {
        if(this.start) {
            return this.start.timeout - Date.now();
        }
        return Infinity;
    }

    insert(task: Task) {
        task.queue = this;

        var delay = task.delay;
        var timeout = task.timeout = Date.now() + delay;

        var pointers = this.pointers;
        var pointer_index = findDelayIndex(delay);

        var curr: Task = pointers[pointer_index];

        if(!curr) {
            this.setPointer(pointer_index, task);

            if(pointer_index) {
                for (var i = pointer_index - 1; i >= 0; i--) {
                    if (pointers[i]) {
                        curr = pointers[i];
                        break;
                    }
                }
            }

            if(!curr) curr = this.start;

            if(!curr) { // Means `macroQueue` completely empty.
                this.start = task;
            } else {
                this.insertTask(curr, task);
            }
        } else {
            if(timeout >= curr.timeout) {
                this.setPointer(pointer_index, task);
            }
            this.insertTask(curr, task);
        }
    }

    // debug() {
    //     var curr: Task = this.start;
    //     if(!curr) return;
    //     do {
    //         console.log(curr.delay, curr.timeout);
    //     } while(curr = curr.next);
    // }

    cancel(task: Task) {
        var prev = task.prev;
        var next = task.next;

        task.prev = task.next = null;
        if(prev) prev.next = next;
        if(next) next.prev = prev;

        if(!prev) { // First task in queue
            this.start = next;
        }

        if(task.pointer !== POINTER_NONE) {
            var index = task.pointer;
            if(index) {
                this.pointers[index] = this.pointers[index - 1];
            } else {
                this.pointers[index] = null;
            }
        }
    }

    // 1. Splice `this.activeQueue` for the beginning of the `this.macroQueue` up to the
    //    very last Task that timed out.
    // 2. In the process reset `this.pointers` which were sliced out.
    protected sliceActiveQueue() {
        var curr: Task = this.start;
        if(!curr) return; // No events queued.

        var time = Date.now();
        var pointers = this.pointers;
        for(var i = 0; i <= DELAY_LAST; i++) {
            var pointer = pointers[i];
            if(pointer) {
                if(pointer.timeout <= time) {
                    pointers[i] = null;
                    // pointer.pointer = POINTER_NONE;
                    curr = pointer;
                } else {
                    break;
                }
            }
        }

        if(curr.timeout > time) return;

        var prev: Task;
        do {
            prev = curr;
            curr = curr.next;
        } while (curr && (curr.timeout <= time));

        prev.next = null;
        if(curr) curr.prev = null;

        this.active = this.start;
        this.start = curr;
    }

    cycle() {
        // Crate new active queue
        this.sliceActiveQueue();
    }

    // Pop next task to be executed.
    pop() {
        var task = this.active;
        if(!task) return null;
        this.active = task.next;
        return task;
    }
}


export class EventLoop {
    microQueue: MicroTask = null;           // Micro-task queue: `process.nextTick`.
    microQueueEnd: MicroTask = null;        // The last task in micro-task queue.
    refQueue = new EventQueue;              // Events that keep process running.
    unrefQueue = new EventQueue;            // Optional events.

    protected shouldStop() {
        if(!this.refQueue.start) return true;
        return false;
    }

    insertMicrotask(microtask: MicroTask) {
        var last = this.microQueueEnd;
        this.microQueueEnd = microtask;
        if(!last) { // Empty micro task list
            this.microQueue = microtask;
        } else {
            last.next = microtask; // One-way list
        }
    }

    insert(task: Task) {
        if(task.isRef) this.refQueue.insert(task);
        else this.unrefQueue.insert(task);
    }

    start() {
        function exec_task(task: Task) {
            // TODO: BTW, which one is faster? (1) `if(task.callback)` vs. (2) `noop()`
            if(task.callback) task.callback();
        }

        // THE LOOP
        while(1) {

            // Create new active queues
            this.refQueue.cycle();
            this.unrefQueue.cycle();

            var refTask = this.refQueue.pop();
            var unrefTask = this.unrefQueue.pop();

            // Execute all macro tasks of the current cycle in the event loop.
            var task: Task;
            while(refTask || unrefTask) {

                if(refTask && unrefTask) {
                    if(refTask.timeout < unrefTask.timeout) {
                        refTask.exec();
                        refTask = null;
                    } else if(refTask.timeout > unrefTask.timeout) {
                        unrefTask.exec();
                        unrefTask = null;
                    } else {
                        // if(refTask.id <= unrefTask.id) {
                        if(refTask.timeout <= unrefTask.timeout) {
                            refTask.exec();
                            refTask = null;
                        } else {
                            unrefTask.exec();
                            unrefTask = null;
                        }
                    }
                } else {
                    if(refTask) {
                        refTask.exec();
                        refTask = null;
                    } else {
                        unrefTask.exec();
                        unrefTask = null;
                    }
                }


                // Execute all micro tasks accumulated while executing this macro task.
                var microtask;
                do {
                    microtask = this.microQueue;
                    if(microtask) {
                        if(microtask.callback) microtask.exec();
                        this.microQueue = microtask.next;
                    }
                } while(this.microQueue);
                this.microQueueEnd = null;


                // Pop one more task to execute.
                if(!refTask)    refTask = this.refQueue.pop();
                else            unrefTask = this.unrefQueue.pop();
            }


            // Stop the program?
            if(this.shouldStop()) break;


            // Below we sleep, if the next task to be executed is 10ms+ away in the future,
            // or we yield CPU time, if the next task is within 1-10ms.
            // TODO: what we also could do is if there are no DELAY.IMMEDIATE but there are I/O
            // TODO: requests we could wait on `epoll` syscall for some specified time.
            var ref_ms = this.refQueue.msNextTask();
            var unref_ms = this.unrefQueue.msNextTask();
            var ms = Math.min(ref_ms, unref_ms);
            if(ms > 10) {
                if(ms > 10000) ms = 10000;
                ms -= 5;
                var seconds = Math.floor(ms / 1000);
                var nanoseconds = (ms % 1000) * 1000000;
                nanosleep(seconds, nanoseconds);
            } else {
                if(ms > 1) {
                    sched_yield();
                }
            }

        }
    }
}
