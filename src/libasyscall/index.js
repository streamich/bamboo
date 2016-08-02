"use strict";
var static_buffer_1 = require('../lib/static-buffer');
function link(curr, next) {
    var _a = next.getAddress(), lo = _a[0], hi = _a[1];
    curr.writeInt32LE(lo, 72 - 8);
    curr.writeInt32LE(hi, 72 - 8 + 4);
}
var Asyscall = (function () {
    function Asyscall() {
        this.code = null;
        this.curr = null;
        this.next = null;
        this.usedFirst = null;
        this.usedLast = null;
    }
    Asyscall.prototype.build = function () {
        var bin = require('./bin');
        this.code = static_buffer_1.StaticBuffer.alloc(bin, 'rwe');
        this.curr = this.code.slice(this.code.length - 72);
        this.curr.writeInt32LE(0, 0);
        this.curr.writeInt32LE(0, 4);
        this.next = this.newBlock();
        link(this.curr, this.next);
        this.code.call();
    };
    Asyscall.prototype.recycleBlock = function (block) {
        console.log(block.getAddress());
        block._id = Asyscall._id;
        Asyscall._id++;
        if (!this.usedFirst) {
            this.usedFirst = this.usedLast = block;
        }
        else {
            block._next = this.usedLast;
            this.usedLast = block;
        }
    };
    Asyscall.prototype.newBlock = function () {
        var block = this.usedFirst;
        if (block && (block.readInt32LE(4) === 2)) {
            console.log('freeing memory');
            this.usedFirst = block._next;
        }
        block = static_buffer_1.StaticBuffer.alloc(72, 'rw');
        console.log(block.getAddress());
        block.writeInt32LE(0, 0);
        block.writeInt32LE(0, 4);
        return block;
    };
    Asyscall.prototype.writeArg = function (arg, slot) {
        var curr = this.curr;
        if (typeof arg === 'string') {
            var str = arg + '\0';
            arg = new static_buffer_1.StaticBuffer(str.length);
            for (var l = 0; l < str.length; l++)
                arg[l] = str.charCodeAt(l);
        }
        if (arg instanceof Buffer) {
            arg = arg.getAddress();
        }
        if (typeof arg === 'number') {
            curr.writeInt32LE(arg, slot * 8);
            curr.writeInt32LE(0, slot * 8 + 4);
        }
        else if (arg instanceof Array) {
            curr.writeInt32LE(arg[0], slot * 8);
            curr.writeInt32LE(arg[1], slot * 8 + 4);
        }
    };
    Asyscall.prototype.fillBlock = function () {
        var _a = this, curr = _a.curr, next = _a.next;
        var callback;
        for (var j = 0; j < arguments.length; j++) {
            var arg = arguments[j];
            if (typeof arg === 'function') {
                callback = arg;
                break;
            }
            else {
                this.writeArg(arg, j + 1);
            }
        }
        for (var j = arguments.length; j < 7; j++) {
            curr.writeInt32LE(0, (j + 1) * 8);
            curr.writeInt32LE(0, (j + 1) * 8 + 4);
        }
        curr[0] = 1;
        return callback;
    };
    Asyscall.prototype.pollBlock = function (callback, is64) {
        var _this = this;
        var curr = this.curr;
        var poll = function () {
            var lock = curr[0];
            if (lock === 3) {
                if (is64) {
                    callback([
                        curr.readInt32LE(8 * 7),
                        curr.readInt32LE(8 * 7 + 4)]);
                }
                else {
                    callback(curr.readInt32LE(8 * 7));
                }
                _this.recycleBlock(curr);
            }
            else
                setIOPoll(poll);
        };
        setIOPoll(poll);
    };
    Asyscall.prototype.exec = function () {
        var block = this.newBlock();
        link(this.next, block);
        var callback = this.fillBlock.apply(this, arguments);
        this.pollBlock(callback, false);
        this.curr = this.next;
        this.next = block;
    };
    Asyscall.prototype.exec64 = function () {
        var block = this.newBlock();
        link(this.next, block);
        var callback = this.fillBlock.apply(this, arguments);
        this.pollBlock(callback, true);
        this.curr = this.next;
        this.next = block;
    };
    Asyscall.prototype.stop = function () {
        this.curr.writeInt32LE(4, 0);
        this.next.writeInt32LE(4, 0);
        this.code.free();
    };
    Asyscall._id = 0;
    return Asyscall;
}());
exports.Asyscall = Asyscall;
