"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('./events');
var buffer_1 = require('./buffer');
var util = require('./util');
var errnoException = util._errnoException;
function lookup4(address, callback) {
    callback();
}
function sliceBuffer(buffer, offset, length) {
    if (typeof buffer === 'string')
        buffer = buffer_1.Buffer.from(buffer);
    else if (!(buffer instanceof buffer_1.Buffer))
        throw new TypeError('First argument must be a buffer or string');
    offset = offset >>> 0;
    length = length >>> 0;
    return buffer.slice(offset, offset + length);
}
function fixBufferList(list) {
    var newlist = new Array(list.length);
    for (var i = 0, l = list.length; i < l; i++) {
        var buf = list[i];
        if (typeof buf === 'string')
            newlist[i] = buffer_1.Buffer.from(buf);
        else if (!(buf instanceof buffer_1.Buffer))
            return null;
        else
            newlist[i] = buf;
    }
    return newlist;
}
var Socket = (function (_super) {
    __extends(Socket, _super);
    function Socket() {
        _super.call(this);
        this.sock = process.loop.poll.createUdpSocket();
        this.lookup = lookup4;
        this.sock.ondata = function () {
        };
        this.sock.onstart = function () {
        };
        this.sock.onstop = function () {
        };
        this.sock.onerror = function () {
        };
    }
    Socket.prototype.send = function (msg, a, b, c, d, e) {
        var _this = this;
        var port;
        var address;
        var callback;
        var typeofb = typeof b;
        if (typeofb[0] === 'n') {
            var offset = a;
            var length = b;
            msg = sliceBuffer(msg, offset, length);
            port = c;
            address = d;
            callback = e;
        }
        else if (typeofb[1] === 't') {
            port = a;
            address = b;
            callback = c;
        }
        else
            throw TypeError('3rd arguments must be length or address');
        var list;
        if (!Array.isArray(msg)) {
            if (typeof msg === 'string') {
                list = [buffer_1.Buffer.from(msg)];
            }
            else if (!(msg instanceof buffer_1.Buffer)) {
                throw new TypeError('First argument must be a buffer or a string');
            }
            else {
                list = [msg];
            }
        }
        else if (!(list = fixBufferList(msg))) {
            throw new TypeError('Buffer list arguments must be buffers or strings');
        }
        port = port >>> 0;
        if (port === 0 || port > 65535)
            throw new RangeError('Port should be > 0 and < 65536');
        if (typeof callback !== 'function')
            callback = undefined;
        if (list.length === 0)
            list.push(new buffer_1.Buffer(0));
        this.lookup(address, function (err, ip) {
            var err = _this.sock.send(list[0], address, port);
            if (callback)
                callback(err);
        });
    };
    Socket.prototype.address = function () {
    };
    Socket.prototype.bind = function (a, b, c) {
    };
    Socket.prototype.close = function (callback) {
        this.sock.stop();
    };
    Socket.prototype.addMembership = function (multicastAddress, multicastInterface) {
    };
    Socket.prototype.dropMembership = function (multicastAddress, multicastInterface) {
    };
    Socket.prototype.setBroadcast = function (flag) {
        var res = this.sock.setBroadcast(flag);
        if (res < 0)
            throw errnoException(res, 'setBroadcast');
    };
    Socket.prototype.setMulticastLoopback = function (flag) {
        var res = this.sock.setMulticastLoop(flag);
        if (res < 0)
            throw errnoException(res, 'setMulticastLoopback');
        return flag;
    };
    Socket.prototype.setTTL = function (ttl) {
        if (typeof ttl !== 'number')
            throw TypeError('Argument must be a number');
        var res = this.sock.setTtl(ttl);
        if (res < 0)
            throw errnoException(res, 'setTTL');
        return ttl;
    };
    Socket.prototype.setMulticastTTL = function (ttl) {
        if (typeof ttl !== 'number')
            throw new TypeError('Argument must be a number');
        var err = this.sock.setMulticastTtl(ttl);
        if (err < 0)
            throw errnoException(err, 'setMulticastTTL');
        return ttl;
    };
    Socket.prototype.ref = function () {
        this.sock.ref();
    };
    Socket.prototype.unref = function () {
        this.sock.unref();
    };
    return Socket;
}(events_1.EventEmitter));
exports.Socket = Socket;
function createSocket(type) {
    var socket = new Socket;
    return socket;
}
exports.createSocket = createSocket;
