import {UInt64} from '../node_modules/ass-js/util';


export const enum LOCK {
    UNINITIALIZED   = 0,    // Block not used yet.
    FREE            = 1,    // Block ready to be acquired by a thread.
    LOCKED          = 2,    // Block locked by a thread, thread is executing syscall.
    DONE            = 3,    // Thread done executing syscall, result stored at offset 8.
    EXIT            = 4,    // Thread has to perform SYS_exit syscall.
}

export class Asyscall {

    /**
     * @type {StaticBuffer}
     */
    sb: any = null;

    threads: number     = 0;
    queue: number       = 100;
    intsize             = 8;
    stackSize           = 10 * this.intsize;
    stacksSize          = 0;
    queueBlockSize      = 8 * this.intsize; // control INT + syscall num + 6 args
    queueLength         = 0;
    queueSize           = 0;

    id: number = 0;             // ID of syscall incrementing every call.
    offset: number = 0;         // Offset of the next block to be written in
    offsetStart: number = 0;    // Offset of the first block
    offsetEnd: number = 0;      // Offset of the last block

    errorTimeout = UInt64.toNumber64(-1);

    nextId() {
        return (this.id + 1) % 0x7FFFFFFF;
    }

    nextOffset() {
        var offset = this.offset + this.queueBlockSize;
        if(offset > this.offsetEnd) return this.offsetStart;
        else return offset;
    }

    build() {
        const threads = 2;
        const queue = 3;
        this.threads = threads;
        this.stacksSize = this.threads * this.stackSize;
        this.queue = queue;
        this.queueSize = this.queue * this.queueBlockSize;


        // Add queue to the end of the buffer
        var bin = require('./bin');
        this.sb = StaticBuffer.alloc(bin.length + this.queueSize, 'rwe');
        // Load compiled code in buffer.
        for(var i = 0; i < bin.length; i++)                         this.sb[i] = bin[i];
        // Fill queue with zeroes
        for(i = bin.length; i < bin.length + this.queueSize; i++)   this.sb[i] = 0;


        // Calculate where our queue starts.
        this.offsetStart = this.sb.length - this.queueSize;
        this.offset = this.offsetStart;
        this.offsetEnd = this.sb.length - this.queueBlockSize;

        // Start the thread pool.
        this.sb.call();
    }

    exec(num, arg1?, arg2?, arg3?, arg4?, arg5?, arg6?, callback?);
    exec() {
        var id = this.id = this.nextId();
        var offset = this.offset;
        var buf = this.sb;

        // Mark lock of next block as UNINITIALIZED so that threads stop at
        // that and wait until something is written there.
        buf.writeInt32LE(LOCK.UNINITIALIZED, this.nextOffset());

        // Block ID -- each block has a unique ID, in case queue is overfilled, blocks determine that
        // they time-out by their ID.
        buf.writeInt32LE(id, offset + 4);

        // Write arguments to block and find callback function.
        var offset_args = offset + 8;
        var callback;

        for(var j = 0; j < arguments.length; j++) {
            var arg = arguments[j];
            if(typeof arg === 'function') {
                callback = arg;
                break;
            } else {
                // console.log(arg);
                if(typeof arg === 'string') {
                    var str = arg + '\0';
                    arg = StaticBuffer.alloc(arg.length, 'rwe');
                    // arg = new StaticBuffer(arg + '\0');

                    // arg = new StaticBuffer(arg.length + 1);
                    for(var l = 0; l < str.length; l++) arg[l] = str.charCodeAt(l);
                }

                if(arg instanceof Buffer) {
                    arg = arg.getAddress();
                    // console.log('addr', arg);
                }

                if(typeof arg === 'number') {
                    var [lo, hi] = UInt64.toNumber64(arg);
                    buf.writeInt32LE(lo, offset_args + (j * 8));
                    buf.writeInt32LE(hi, offset_args + (j * 8) + 4);
                } else if(arg instanceof Array) {
                    buf.writeInt32LE(arg[0], offset_args + (j * 8));
                    buf.writeInt32LE(arg[1], offset_args + (j * 8) + 4);
                }
            }
        }

        // Fill the rest of the block with 0x00
        for(var j = arguments.length; j < 7; j++) {
            buf.writeInt32LE(0, offset_args + (j * 8));
            buf.writeInt32LE(0, offset_args + (j * 8) + 4);
        }

        // The last thing we do, is mark this block as available for threads.
        buf.writeInt32LE(LOCK.FREE, offset);

        this.offset = this.nextOffset();

        // this.sb.print();
        // return;

        var poll = () => {
            // console.log('polling');
            setIOPoll(() => {

                // Check ID first, if ID does not match, then our queue has overflown
                // and we timeout this call.
                var id_read = buf.readInt32LE(offset + 4);
                if(id_read !== id) {
                    callback(this.errorTimeout);
                    return;
                }

                var lock = buf[offset];
                if(lock === LOCK.DONE) {
                    var result = [buf.readInt32LE(offset + (7 * 8)), buf.readInt32LE(offset + (7 * 8) + 4)];
                    // var thread_id = buf.readInt32LE(offset + (6 * 8));
                    // callback(result, thread_id);
                    callback(result);
                } else
                    poll();
            });
        };
        poll();
    }

    // Stop the thread pool. This code is bad: threads automatically stop when they see `LOCK.EXIT` in
    // lock field, this function writes `LOCK.EXIT` in all queue blocks, but we actually need to write
    // it only in the next block.
    stop() {
        for(var offset = this.offsetStart; offset <= this.offsetEnd; offset += this.queueBlockSize) {
            this.sb.writeInt32LE(LOCK.EXIT, offset);
            this.id = this.nextId();
            this.sb.writeInt32LE(this.id, offset + 4);
        }
        this.sb.free();
    }

}
