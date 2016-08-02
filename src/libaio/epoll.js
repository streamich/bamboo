"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var libjs = require('../libjs/index');
var buffer_1 = require('../lib/buffer');
var static_buffer_1 = require('../lib/static-buffer');
console.log('here');
function noop() { }
var Socket = (function () {
    function Socket() {
        this.fd = 0;
        this.epfd = 0;
        this.onstart = noop;
        this.onstop = noop;
        this.ondata = noop;
        this.onerror = noop;
        this.created = false;
    }
    Socket.prototype.start = function () {
        this.fd = libjs.socket(2, this.type, 0);
        if (this.fd < 0)
            throw Error("Could not create scoket: errno = " + this.fd);
        var fcntl = libjs.fcntl(this.fd, 4, 2048);
        if (fcntl < 0)
            throw Error("Could not make socket non-blocking: errno = " + fcntl);
        this.epfd = libjs.epoll_create1(0);
        if (this.epfd < 0)
            throw Error("Could create epoll: errno = " + this.epfd);
        var event = {
            events: 1 | 4,
            data: [this.fd, 0]
        };
        var ctl = libjs.epoll_ctl(this.epfd, 1, this.fd, event);
        if (ctl < 0)
            throw Error("Could not add epoll events: errno = " + ctl);
    };
    Socket.prototype.stop = function () {
        if (this.epfd) {
            libjs.close(this.epfd);
            this.fd = 0;
        }
        if (this.fd) {
            libjs.close(this.fd);
            this.fd = 0;
        }
    };
    return Socket;
}());
exports.Socket = Socket;
var SocketDgram = (function (_super) {
    __extends(SocketDgram, _super);
    function SocketDgram() {
        _super.apply(this, arguments);
        this.type = 2;
    }
    SocketDgram.prototype.send = function (buf, ip, port) {
        var addr = {
            sin_family: 2,
            sin_port: libjs.hton16(port),
            sin_addr: {
                s_addr: new libjs.Ipv4(ip)
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0]
        };
        var flags = 64 | 16384;
        var res = libjs.sendto(this.fd, buf, flags, addr, libjs.sockaddr_in);
        if (res < 0) {
            if (-res == 11) {
                return 0;
            }
            else {
                return res;
            }
        }
    };
    SocketDgram.prototype.bind = function (port, ip) {
        if (port === void 0) { port = 0; }
        if (ip === void 0) { ip = '0.0.0.0'; }
        var addr = {
            sin_family: 2,
            sin_port: libjs.hton16(port),
            sin_addr: {
                s_addr: new libjs.Ipv4(ip)
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0]
        };
        return libjs.bind(this.fd, addr, libjs.sockaddr_in);
    };
    SocketDgram.prototype.listen = function () {
    };
    return SocketDgram;
}(Socket));
exports.SocketDgram = SocketDgram;
var SocketTcp = (function (_super) {
    __extends(SocketTcp, _super);
    function SocketTcp() {
        _super.apply(this, arguments);
        this.type = 1;
        this.connected = false;
        this.onconnect = function () { };
        this.ondata = function () { };
        this.onerror = function () { };
        this.pollBound = this.poll.bind(this);
    }
    SocketTcp.prototype.poll = function () {
        var evbuf = new buffer_1.Buffer(libjs.epoll_event.size);
        var waitres = libjs.epoll_wait(this.epfd, evbuf, 1, 0);
        if (waitres > 0) {
            var event = libjs.epoll_event.unpack(evbuf);
            if (!this.connected) {
                if ((event.events & 4) > 0) {
                    this.connected = true;
                    this.onconnect();
                }
            }
            if ((event.events & 1) > 0) {
                var buf = new static_buffer_1.StaticBuffer(1000);
                var bytes = libjs.read(this.fd, buf);
                if (bytes < -1) {
                    this.onerror(Error("Error reading data: " + bytes));
                }
                if (bytes > 0) {
                    var data = buf.toString().substr(0, bytes);
                    this.ondata(data);
                }
            }
            if ((event.events & 8) > 0) {
            }
        }
        if (waitres < 0) {
            this.onerror(Error("Error while waiting for connection: " + waitres));
        }
        process.nextTick(this.pollBound);
    };
    SocketTcp.prototype.connect = function (opts) {
        var addr_in = {
            sin_family: 2,
            sin_port: libjs.hton16(opts.port),
            sin_addr: {
                s_addr: new libjs.Ipv4(opts.host)
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0]
        };
        var res = libjs.connect(this.fd, addr_in);
        if (res == -115) {
            this.poll();
            return;
        }
        if (res < 0)
            throw Error("Could no connect: " + res);
        throw Error('Something went not according to plan.');
    };
    SocketTcp.prototype.onRead = function () {
    };
    SocketTcp.prototype.write = function (data) {
        var sb = static_buffer_1.StaticBuffer.from(data + '\0');
        var res = libjs.write(this.fd, sb);
        return res;
    };
    return SocketTcp;
}(Socket));
exports.SocketTcp = SocketTcp;
var Pool = (function () {
    function Pool() {
        this.epfd = 0;
        this.socks = [];
        this.epfd = libjs.epoll_create1(0);
        if (this.epfd < 0)
            throw Error("Could not create epoll fd: errno = " + this.epfd);
    }
    Pool.prototype.nextTick = function () {
    };
    Pool.prototype.wait = function (timeout) {
    };
    Pool.prototype.createDgramSocket = function () {
        var sock = new SocketDgram;
        sock.start();
        this.addSocket(sock);
        return sock;
    };
    Pool.prototype.addSocket = function (sock) {
        var event = {
            events: 1 | 4,
            data: [sock.fd, 0]
        };
        var ctl = libjs.epoll_ctl(this.epfd, 1, sock.fd, event);
        if (ctl < 0)
            throw Error("Could not add epoll events: errno = " + ctl);
        this.socks[sock.fd] = sock;
    };
    return Pool;
}());
exports.Pool = Pool;
