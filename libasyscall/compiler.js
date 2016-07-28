"use strict";
var o = require('../node_modules/ass-js/x86/operand');
var code_1 = require('../node_modules/ass-js/x86/x64/code');
var abi_1 = require('../node_modules/ass-js/abi');
var __DEBUG__ = true;
var AsyscallCompiler = (function () {
    function AsyscallCompiler() {
        this.threads = 0;
        this.queue = 100;
        this.intsize = 8;
        this.stackSize = 10 * this.intsize;
        this.stacksSize = 0;
        this.queueBlockSize = 8 * this.intsize;
        this.queueLength = 0;
        this.queueSize = 0;
    }
    AsyscallCompiler.prototype.compile = function (threads, queue) {
        var _this = this;
        if (threads === void 0) { threads = 2; }
        if (queue === void 0) { queue = 3; }
        this.threads = threads;
        this.stacksSize = this.threads * this.stackSize;
        this.queue = queue;
        this.queueSize = this.queue * this.queueBlockSize;
        var _ = new code_1.Code;
        var abi = new abi_1.Abi(_);
        var func_create_thread = abi.func('func_create_thread', false, [o.rax, o.rsi, o.rcx, o.rdx]);
        var func_thread = abi.func('func_thread');
        var lbl_stacks = _.lbl('stacks');
        var lbl_queue = _.lbl('queue');
        for (var j = 1; j <= this.threads; j++) {
            abi.call(func_create_thread, [j], []);
        }
        _._('ret');
        func_create_thread._(function () {
            _._('mov', [o.rax, o.rdi]);
            _._('mov', [o.rcx, _this.stackSize]);
            _._('mul', o.rcx);
            _._('lea', [o.rsi, o.rip.disp(lbl_stacks.rel(-_this.intsize * 2))]);
            _._('add', [o.rsi, o.rax]);
            _._('lea', [o.rdx, o.rip.disp(func_thread.lbl)]);
            _._('mov', [o.rsi.ref(), o.rdx]);
            _._('mov', [o.rsi.disp(_this.intsize), o.rdi]);
            abi.syscall([56, -2147381504]);
        });
        func_thread._(function () {
            var r13 = o.r13;
            var r_first_block = o.r14;
            var r_last_block = o.r15;
            var thread_stop = _.lbl('thread_stop');
            _._('lea', [r_first_block, o.rip.disp(lbl_queue)]);
            _._('mov', [r_last_block, r_first_block]);
            _._('add', [r_last_block, _this.queueSize - _this.queueBlockSize]);
            _._('mov', [r13, r_first_block]);
            var loop = _.label('loop');
            (function () {
                var lbl_process_block = _.lbl('process_block');
                var lbl_execute_block = _.lbl('execute_block');
                var lbl_skip_to_next_block = _.lbl('skip_to_next_block');
                _._('cmp', [r13, r_last_block]);
                _._('jbe', lbl_process_block);
                _._('mov', [r13, r_first_block]);
                _.insert(lbl_process_block);
                _._('mov', [o.eax, r13.ref()]);
                _._('cmp', [o.eax, 4]);
                _._('je', thread_stop);
                _._('cmp', [o.eax, 0]);
                _._('jne', lbl_execute_block);
                abi.syscall([24]);
                _._('jmp', lbl_process_block);
                _.insert(lbl_execute_block);
                _._('cmp', [o.eax, 1]);
                _._('jne', lbl_skip_to_next_block);
                _._('mov', [o.edx, 2]);
                _._('cmpxchg', [r13.ref(), o.edx]).lock();
                _._('cmp', [r13.ref(), 2], 32);
                _._('jne', lbl_skip_to_next_block);
                abi.syscall([
                    r13.disp(_this.intsize),
                    r13.disp(_this.intsize * 2),
                    r13.disp(_this.intsize * 3),
                    r13.disp(_this.intsize * 4),
                    r13.disp(_this.intsize * 5),
                    r13.disp(_this.intsize * 6),
                    r13.disp(_this.intsize * 7),
                ]);
                _._('mov', [r13.disp(_this.intsize * 7), o.rax]);
                _._('mov', [r13.ref(), 3], 32);
                _.insert(lbl_skip_to_next_block);
                _._('add', [r13, _this.queueBlockSize]);
                _._('jmp', loop);
            })();
            _.insert(thread_stop);
            _._('mov', [r13.disp(8), 0xBABE]);
            abi.syscall([60]);
        });
        _.align(8);
        _.dq(0xFF);
        _.insert(lbl_stacks);
        _.db(0, this.stacksSize);
        _.align(8);
        _.dq(0xFF);
        _.insert(lbl_queue);
        var bin = _.compile();
        return bin;
    };
    return AsyscallCompiler;
}());
exports.AsyscallCompiler = AsyscallCompiler;
