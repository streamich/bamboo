"use strict";
var operand_1 = require('../node_modules/ass-js/x86/operand');
var code_1 = require('../node_modules/ass-js/x86/x64/code');
var abi_1 = require('../node_modules/ass-js/abi');
var __DEBUG__ = true;
var AsyscallCompiler = (function () {
    function AsyscallCompiler() {
        this.threads = 0;
        this.queue = 100;
        this.intsize = 8;
        this.stackSize = 5 * this.intsize;
        this.stacksSize = 0;
        this.blockSize = 9 * this.intsize;
    }
    AsyscallCompiler.prototype.compile = function (threads) {
        var _this = this;
        if (threads === void 0) { threads = 2; }
        var INT = this.intsize;
        this.threads = threads;
        this.stacksSize = this.threads * this.stackSize;
        var _ = new code_1.Code;
        var abi = new abi_1.Abi(_);
        var func_create_thread = abi.func('func_create_thread', false, [operand_1.rax, operand_1.rsi, operand_1.rcx, operand_1.rdx]);
        var func_thread = abi.func('func_thread');
        var lbl_stacks = _.lbl('stacks');
        var lbl_first_block = _.lbl('first_block');
        for (var j = 1; j <= this.threads; j++) {
            abi.call(func_create_thread, [j], []);
        }
        _._('ret');
        func_create_thread._(function () {
            _._('mov', [operand_1.rax, operand_1.rdi]);
            _._('mov', [operand_1.rcx, _this.stackSize]);
            _._('mul', operand_1.rcx);
            _._('lea', [operand_1.rsi, operand_1.rip.disp(lbl_stacks.rel(-INT * 2))]);
            _._('add', [operand_1.rsi, operand_1.rax]);
            _._('lea', [operand_1.rdx, operand_1.rip.disp(func_thread.lbl)]);
            _._('mov', [operand_1.rsi.ref(), operand_1.rdx]);
            _._('mov', [operand_1.rsi.disp(INT), operand_1.rdi]);
            abi.syscall([56, -2147381504]);
        });
        func_thread._(function () {
            var curr = operand_1.r13;
            var next = operand_1.r14;
            _._('lea', [curr, operand_1.rip.disp(lbl_first_block)]);
            _._('mov', [next, curr.disp(INT * 8)]);
            var lbl_execute_block = _.lbl('execute_block');
            var lbl_go_to_next_block = _.lbl('go_to_next_block');
            var lbl_thread_stop = _.lbl('thread_stop');
            var lbl_process_block = _.label('process_block');
            _._('mov', [operand_1.eax, curr.ref()]);
            _._('cmp', [operand_1.eax, 4]);
            _._('je', lbl_thread_stop);
            _._('cmp', [operand_1.eax, 0]);
            _._('jne', lbl_execute_block);
            abi.syscall([24]);
            _._('jmp', lbl_process_block);
            _.insert(lbl_execute_block);
            _._('cmp', [operand_1.eax, 1]);
            _._('jne', lbl_go_to_next_block);
            _._('mov', [operand_1.edx, 2]);
            _._('cmpxchg', [curr.ref(), operand_1.edx]).lock();
            _._('cmp', [curr.ref(), 2], 32);
            _._('jne', lbl_go_to_next_block);
            abi.syscall([
                curr.disp(8),
                curr.disp(8 * 2),
                curr.disp(8 * 3),
                curr.disp(8 * 4),
                curr.disp(8 * 5),
                curr.disp(8 * 6),
                curr.disp(8 * 7),
            ]);
            _._('mov', [curr.disp(8 * 7), operand_1.rax]);
            _._('mov', [curr.ref(), 3], 32);
            if (__DEBUG__) {
                _._('mov', [operand_1.rax, operand_1.rsp.ref()]);
                _._('mov', [curr.disp(8 * 6), operand_1.rax]);
            }
            _.insert(lbl_go_to_next_block);
            _._('mov', [curr, next]);
            _._('mov', [next, curr.disp(8 * 8)]);
            _._('jmp', lbl_process_block);
            _.insert(lbl_thread_stop);
            if (__DEBUG__) {
                _._('mov', [operand_1.r13.disp(8), 0xBEBA]);
            }
            abi.syscall([60]);
        });
        _.align(8);
        _.db('stack');
        _.align(8);
        _.insert(lbl_stacks);
        _.db(0, this.stacksSize);
        _.align(8);
        _.db('1 block');
        _.align(8);
        _.insert(lbl_first_block);
        _.db(0, this.blockSize);
        var bin = _.compile();
        console.log(_.toString());
        return bin;
    };
    return AsyscallCompiler;
}());
exports.AsyscallCompiler = AsyscallCompiler;
