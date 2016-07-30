import {UInt64} from '../node_modules/ass-js/util';
import {CONF, LOCK} from './conf';


function link(curr, next) {
    var [lo, hi] = next.getAddress();
    curr.writeInt32LE(lo, CONF.BLOCK_SIZE - CONF.INT);
    curr.writeInt32LE(hi, CONF.BLOCK_SIZE - CONF.INT + 4);
}


export class Asyscall {

    code: StaticBuffer = null;  // Thread pool code.
    curr: StaticBuffer = null;  // Current block.
    next: StaticBuffer = null;  // Next block.

    // TODO: Keep old used blocks for reuse.
    recycled: StaticBuffer = null;

    build() {
        var bin = require('./bin');
        this.code = StaticBuffer.alloc(bin, 'rwe');

        this.curr = this.code.slice(this.code.length - CONF.BLOCK_SIZE);
        this.curr[0] = LOCK.UNINITIALIZED;
        this.next = new StaticBuffer(CONF.BLOCK_SIZE);
        this.next[0] = LOCK.UNINITIALIZED;
        link(this.curr, this.next);

        this.code.call();

        // We don't need to keep the reference to the machine code.
        // So delete it and that writable and executable memory is no more available.
        // this.code = null;
    }

    protected recycleBlock(block) {
        var first = this.recycled;
        if(first) block._next = first;
        this.recycled = block;
    }

    protected newBlock() {
        var block: StaticBuffer;
        if(block = this.recycled) {
            this.recycled = block._next;
            block._next = null;
        } else {
            block = new StaticBuffer(CONF.BLOCK_SIZE);
        }

        block[0] = LOCK.UNINITIALIZED;
        return block;
    }

    protected writeArg(arg, slot: number) {
        var curr = this.curr;

        if(typeof arg === 'string') {
            var str = arg + '\0';
            arg = new StaticBuffer(str.length);
            for(var l = 0; l < str.length; l++)
                arg[l] = str.charCodeAt(l);
        }

        // TODO: Should be StaticBuffer
        if(arg instanceof Buffer) {
            arg = arg.getAddress();
            // console.log('addr', arg);
        }

        if(typeof arg === 'number') {
            // This converts `number` to `[number, number]` because JavaScript numbers
            // can be up to 53-bits, but we need to write it in chunks of 4-bytes.
            // Do we need this?
            // var [lo, hi] = UInt64.toNumber64(arg);
            // curr.writeInt32LE(lo, slot * CONF.INT);
            // curr.writeInt32LE(hi, slot * CONF.INT + 4);
            curr.writeInt32LE(arg,      slot * CONF.INT);
            curr.writeInt32LE(0,        slot * CONF.INT + 4);
        } else if(arg instanceof Array) {
            curr.writeInt32LE(arg[0],   slot * CONF.INT);
            curr.writeInt32LE(arg[1],   slot * CONF.INT + 4);
        }
    }

    // Fill the current block with syscall data.
    protected fillBlock() {
        var {curr, next} = this;

        // Write arguments to block and find callback function.
        var callback;

        for(var j = 0; j < arguments.length; j++) {
            var arg = arguments[j];
            if(typeof arg === 'function') {
                callback = arg;
                break;
            } else {
                this.writeArg(arg, j + 1);
            }
        }

        // Fill the rest of the block with 0x00, except for the pointer to the next block,
        // which is already filled.
        for(var j = arguments.length; j < 7; j++) {
            curr.writeInt32LE(0, (j + 1) * CONF.INT);
            curr.writeInt32LE(0, (j + 1) * CONF.INT + 4);
        }

        // The last thing we do, is mark this block as available for threads.
        // curr.writeInt32LE(LOCK.FREE, 0);
        curr[0] = LOCK.FREE;
        // curr.print();
        return callback;
    }

    // Start polling the current block for results.
    protected pollBlock(callback, is64) {
        var curr = this.curr;
        var poll = () => {
            // This relies on little-endiannes of Linux, use block.readInt32LE(0) instead?
            // Or then refactor thread pool to use 8-bit value.
            var lock = curr[0];
            if(lock === LOCK.DONE) {
                if(is64) {
                    callback([
                        curr.readInt32LE(CONF.INT * 7),
                        curr.readInt32LE(CONF.INT * 7 + 4)]);
                } else {
                    callback(curr.readInt32LE(CONF.INT * 7));
                }
                this.recycleBlock(curr);
            } else
                setIOPoll(poll);
        };
        setIOPoll(poll);
    }

    exec(num, arg1?, arg2?, arg3?, arg4?, arg5?, arg6?, callback?);
    exec() {
        // Allocate the third block before we fill in the current block,
        // so that threads that go to the next block can see a correct
        // pointer written in it to the third block.
        var block = this.newBlock();
        link(this.next, block);

        var callback = this.fillBlock.apply(this, arguments);

        // Start polling block for results.
        this.pollBlock(callback, false);

        this.curr = this.next;
        this.next = block;
    }

    // Same as `exec()` basically.
    exec64(num, arg1?, arg2?, arg3?, arg4?, arg5?, arg6?, callback?);
    exec64() {
        var block = this.newBlock();
        link(this.next, block);
        var callback = this.fillBlock.apply(this, arguments);
        this.pollBlock(callback, true);
        this.curr = this.next;
        this.next = block;
    }

    // Stop the thread pool. Threads automatically stop when they see `LOCK.EXIT` in
    // lock field.
    stop() {
        this.curr.writeInt32LE(LOCK.EXIT, 0);
        this.next.writeInt32LE(LOCK.EXIT, 0);
        this.code.free();
    }
}
