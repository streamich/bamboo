"use strict";
var util_1 = require('../node_modules/ass-js/util');
var Asyscall = (function () {
    function Asyscall() {
        this.sb = null;
        this.threads = 0;
        this.queue = 100;
        this.intsize = 8;
        this.stackSize = 10 * this.intsize;
        this.stacksSize = 0;
        this.queueBlockSize = 8 * this.intsize;
        this.queueLength = 0;
        this.queueSize = 0;
        this.id = 0;
        this.offset = 0;
        this.offsetStart = 0;
        this.offsetEnd = 0;
        this.errorTimeout = util_1.UInt64.toNumber64(-1);
    }
    Asyscall.prototype.nextId = function () {
        return (this.id + 1) % 0x7FFFFFFF;
    };
    Asyscall.prototype.nextOffset = function () {
        var offset = this.offset + this.queueBlockSize;
        if (offset > this.offsetEnd)
            return this.offsetStart;
        else
            return offset;
    };
    Asyscall.prototype.build = function () {
        var threads = 2;
        var queue = 3;
        this.threads = threads;
        this.stacksSize = this.threads * this.stackSize;
        this.queue = queue;
        this.queueSize = this.queue * this.queueBlockSize;
        var bin = require('./bin');
        this.sb = StaticBuffer.alloc(bin.length + this.queueSize, 'rwe');
        for (var i = 0; i < bin.length; i++)
            this.sb[i] = bin[i];
        for (i = bin.length; i < bin.length + this.queueSize; i++)
            this.sb[i] = 0;
        this.offsetStart = this.sb.length - this.queueSize;
        this.offset = this.offsetStart;
        this.offsetEnd = this.sb.length - this.queueBlockSize;
        this.sb.call();
    };
    Asyscall.prototype.exec = function () {
        var _this = this;
        var id = this.id = this.nextId();
        var offset = this.offset;
        var buf = this.sb;
        buf.writeInt32LE(0, this.nextOffset());
        buf.writeInt32LE(id, offset + 4);
        var offset_args = offset + 8;
        var callback;
        for (var j = 0; j < arguments.length; j++) {
            var arg = arguments[j];
            if (typeof arg === 'function') {
                callback = arg;
                break;
            }
            else {
                if (typeof arg === 'string') {
                    var str = arg + '\0';
                    arg = StaticBuffer.alloc(arg.length, 'rwe');
                    for (var l = 0; l < str.length; l++)
                        arg[l] = str.charCodeAt(l);
                }
                if (arg instanceof Buffer) {
                    arg = arg.getAddress();
                }
                if (typeof arg === 'number') {
                    var _a = util_1.UInt64.toNumber64(arg), lo = _a[0], hi = _a[1];
                    buf.writeInt32LE(lo, offset_args + (j * 8));
                    buf.writeInt32LE(hi, offset_args + (j * 8) + 4);
                }
                else if (arg instanceof Array) {
                    buf.writeInt32LE(arg[0], offset_args + (j * 8));
                    buf.writeInt32LE(arg[1], offset_args + (j * 8) + 4);
                }
            }
        }
        for (var j = arguments.length; j < 7; j++) {
            buf.writeInt32LE(0, offset_args + (j * 8));
            buf.writeInt32LE(0, offset_args + (j * 8) + 4);
        }
        buf.writeInt32LE(1, offset);
        this.offset = this.nextOffset();
        var poll = function () {
            setIOPoll(function () {
                var id_read = buf.readInt32LE(offset + 4);
                if (id_read !== id) {
                    callback(_this.errorTimeout);
                    return;
                }
                var lock = buf[offset];
                if (lock === 3) {
                    var result = [buf.readInt32LE(offset + (7 * 8)), buf.readInt32LE(offset + (7 * 8) + 4)];
                    callback(result);
                }
                else
                    poll();
            });
        };
        poll();
    };
    Asyscall.prototype.stop = function () {
        for (var offset = this.offsetStart; offset <= this.offsetEnd; offset += this.queueBlockSize) {
            this.sb.writeInt32LE(4, offset);
            this.id = this.nextId();
            this.sb.writeInt32LE(this.id, offset + 4);
        }
        this.sb.free();
    };
    return Asyscall;
}());
exports.Asyscall = Asyscall;
