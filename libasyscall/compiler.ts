import {LOCK} from './index';
import * as o from '../node_modules/ass-js/x86/operand';
import {Code} from '../node_modules/ass-js/x86/x64/code';
import {Abi} from '../node_modules/ass-js/abi';


// Create a queue where syscall parameters written to memory, threads run in the background
// and execute the syscalls and write result back to the blocks. Block format:
//
//      <---------- 32 bits ----------> <---------- 32 bits ----------->
//     +================================================================+
//     | Lock                          | Block ID                       |   Block 0
//     +----------------------------------------------------------------+
//     | Syscall number                                                 |
//     +----------------------------------------------------------------+
//     | Argument 1                                                     |
//     +----------------------------------------------------------------+
//     | Argument 2                                                     |
//     +----------------------------------------------------------------+
//     | Argument 3                                                     |
//     +----------------------------------------------------------------+
//     | Argument 4                                                     |
//     +----------------------------------------------------------------+
//     | Argument 5 / Thread ID                                         |
//     +----------------------------------------------------------------+
//     | Argument 6 / Result                                            |
//     +================================================================+
//     |                            ....                                |   Block 1
//     +----------------------------------------------------------------+
//     +                            ....                                |

const __DEBUG__ = true;

const enum SYS {
    write           = 1,
    mmap            = 9,
    clone           = 56,
    exit            = 60,
    sched_yield     = 24,
    getuid          = 102,
    getpid          = 39,
}

const enum CLONE {
    VM              = 0x00000100,
    FS              = 0x00000200,
    FILES           = 0x00000400,
    SIGHAND         = 0x00000800,
    PARENT          = 0x00008000,
    THREAD          = 0x00010000,
    IO              = 0x80000000,
    THREAD_FLAGS = CLONE.VM | CLONE.FS | CLONE.FILES | CLONE.SIGHAND |
        CLONE.PARENT | CLONE.THREAD | CLONE.IO,
}

export class AsyscallCompiler {

    threads: number     = 0;
    queue: number       = 100;
    intsize             = 8;
    stackSize           = 10 * this.intsize;
    stacksSize          = 0;
    queueBlockSize      = 8 * this.intsize; // control INT + syscall num + 6 args
    queueLength         = 0;
    queueSize           = 0;


    compile(threads = 2, queue = 3): number[] {
        this.threads = threads;
        this.stacksSize = this.threads * this.stackSize;
        this.queue = queue;
        this.queueSize = this.queue * this.queueBlockSize;


        var _ = new Code;
        var abi = new Abi(_);

        var func_create_thread      = abi.func('func_create_thread', false, [o.rax, o.rsi, o.rcx, o.rdx]);
        var func_thread             = abi.func('func_thread');
        var lbl_stacks              = _.lbl('stacks');
        var lbl_queue               = _.lbl('queue');

        // main()
        for(var j = 1; j <= this.threads; j++) {
            abi.call(func_create_thread, [j], []);
        }
        _._('ret');

        func_create_thread._(() => {
            _._('mov', [o.rax, o.rdi]);                                         // Thread index, starting from 1
            _._('mov', [o.rcx, this.stackSize]);                                // Stack size
            _._('mul', o.rcx);                                                  // Stack offset

            _._('lea', [o.rsi, o.rip.disp(lbl_stacks.rel(-this.intsize * 2))]); // Address of stack frame bottom + 1
            _._('add', [o.rsi, o.rax]);                                         // Address of stack top for this thread, RSI second arg to syscall

            _._('lea', [o.rdx, o.rip.disp(func_thread.lbl)]);                   // Address of thread function code in top of stack
            _._('mov', [o.rsi.ref(), o.rdx]);                                   // Top of stack, RET address

            _._('mov', [o.rsi.disp(this.intsize), o.rdi]);                      // Thread ID in bottom of stack

            // In C: long clone(unsigned long flags, void *child_stack);
            abi.syscall([SYS.clone, CLONE.THREAD_FLAGS]); // 2nd arg RSI, stack top address
            // When thread starts the address of its starting function is
            // stored on its stack, the next instruction here is `RET` so it
            // jumps to that address.
        });

        func_thread._(() => {
            var r13 = o.r13;            // Current block address
            var r_first_block = o.r14;
            var r_last_block = o.r15;

            var thread_stop = _.lbl('thread_stop');

            _._('lea', [r_first_block, o.rip.disp(lbl_queue)]);                 // R14 = Queue start address
            _._('mov', [r_last_block, r_first_block]);
            _._('add', [r_last_block, this.queueSize - this.queueBlockSize]);   // R15 = Last block address
            _._('mov', [r13, r_first_block]);                                   // R13 = Current block address

            var loop = _.label('loop');                                         // loop start
            (() => {
                var lbl_process_block = _.lbl('process_block');
                var lbl_execute_block = _.lbl('execute_block');
                var lbl_skip_to_next_block = _.lbl('skip_to_next_block');

                _._('cmp', [r13, r_last_block]);                            // check iterator bounds
                _._('jbe', lbl_process_block);
                _._('mov', [r13, r_first_block]);

                _.insert(lbl_process_block);
                _._('mov', [o.eax, r13.ref()]);                             // Lock in RAX

                _._('cmp', [o.eax, LOCK.EXIT]);                             // if(lock == LOCK.EXIT) -> stop thread
                _._('je', thread_stop);

                _._('cmp', [o.eax, LOCK.UNINITIALIZED]);                    // Wait for this block until something is written to it
                _._('jne', lbl_execute_block);
                abi.syscall([SYS.sched_yield]);                             // yield and ...
                _._('jmp', lbl_process_block);                              // ... try this block again

                _.insert(lbl_execute_block);
                _._('cmp', [o.eax, LOCK.FREE]);                             // Check block is possibly available
                _._('jne', lbl_skip_to_next_block);

                _._('mov', [o.edx, LOCK.LOCKED]);
                _._('cmpxchg', [r13.ref(), o.edx]).lock();                  // Try to acquire lock for this block
                _._('cmp', [r13.ref(), LOCK.LOCKED], 32);                   // Check we actually got the lock
                _._('jne', lbl_skip_to_next_block);

                abi.syscall([                                               // Execute the syscall
                    r13.disp(this.intsize),
                    r13.disp(this.intsize * 2),
                    r13.disp(this.intsize * 3),
                    r13.disp(this.intsize * 4),
                    r13.disp(this.intsize * 5),
                    r13.disp(this.intsize * 6),
                    r13.disp(this.intsize * 7),
                ]);
                _._('mov', [r13.disp(this.intsize * 7), o.rax]);            // Store syscall result in memory, in place of 6th argument
                _._('mov', [r13.ref(), LOCK.DONE], 32);                     // Mark block as DONE

                // Store ID of this thread in place of 5th argument, for DEBUG purposes
                // _._('mov', [o.rax, o.rsp.ref()]);
                // _._('mov', [r13.disp(this.intsize * 6), o.rax]);

                _.insert(lbl_skip_to_next_block);
                _._('add', [r13, this.queueBlockSize]);                     // r13 += block_size
                _._('jmp', loop);
            })();

            _.insert(thread_stop);
            _._('mov', [r13.disp(8), 0xBABE]);
            abi.syscall([SYS.exit]);
        });

        _.align(8);
        _.dq(0xFF);
        _.insert(lbl_stacks);
        _.db(0, this.stacksSize);

        _.align(8);
        _.dq(0xFF);
        _.insert(lbl_queue);
        // _.db(0, this.queueSize);

        var bin = _.compile();
        // console.log(_.toString());
        return bin;
    }
}
