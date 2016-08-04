"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var libjs = require('../libjs/index');
var static_buffer_1 = require('../lib/static-buffer');
var event_1 = require("./event");
var CHUNK = 8192;
var Socket = (function () {
    function Socket() {
        this.poll = null;
        this.fd = 0;
        this.connected = false;
        this.reffed = false;
        this.onstart = event_1.noop;
        this.onstop = event_1.noop;
        this.ondata = event_1.noop;
        this.onerror = event_1.noop;
    }
    Socket.prototype.start = function () {
        this.fd = libjs.socket(2, this.type, 0);
        if (this.fd < 0)
            return Error("Could not create scoket: errno = " + this.fd);
        var fcntl = libjs.fcntl(this.fd, 4, 2048);
        if (fcntl < 0)
            return Error("Could not make socket non-blocking: errno = " + fcntl);
    };
    Socket.prototype.stop = function () {
        if (this.fd) {
            libjs.close(this.fd);
            this.fd = 0;
        }
        this.onstop();
    };
    return Socket;
}());
exports.Socket = Socket;
var SocketUdp4 = (function (_super) {
    __extends(SocketUdp4, _super);
    function SocketUdp4() {
        _super.apply(this, arguments);
        this.type = 2;
        this.isIPv4 = true;
    }
    SocketUdp4.prototype.start = function () {
        var err = _super.prototype.start.call(this);
        if (err)
            return err;
        var fd = this.fd;
        var event = {
            events: 1 | 4,
            data: [fd, 0]
        };
        var ctl = libjs.epoll_ctl(this.poll.epfd, 1, fd, event);
        if (ctl < 0)
            return Error("Could not add epoll events: errno = " + ctl);
    };
    SocketUdp4.prototype.send = function (buf, ip, port) {
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
                return;
            }
            else {
                return Error("sendto error, errno = " + res);
            }
        }
    };
    SocketUdp4.prototype.bind = function (port, ip) {
        if (ip === void 0) { ip = '0.0.0.0'; }
        var addr = {
            sin_family: 2,
            sin_port: libjs.hton16(port),
            sin_addr: {
                s_addr: new libjs.Ipv4(ip)
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0]
        };
        var res = libjs.bind(this.fd, addr, libjs.sockaddr_in);
        if (res < 0)
            return Error("bind error, errno = " + res);
        this.reffed = true;
        this.poll.refs++;
    };
    SocketUdp4.prototype.update = function (events) {
        console.log('events', events);
        if (events & 4) {
            console.log(this.fd, 'EPOLLOUT');
            this.connected = true;
            var event = {
                events: 1,
                data: [this.fd, 0]
            };
            var res = libjs.epoll_ctl(this.poll.epfd, 3, this.fd, event);
            if (res < 0)
                this.onerror(Error("Could not remove write listener: " + res));
            this.onstart();
        }
        if ((events & 1) || (events & 2)) {
            console.log(this.fd, 'EPOLLIN');
            var err = null;
            do {
                var buf = new static_buffer_1.StaticBuffer(CHUNK + libjs.sockaddr_in.size + 4);
                var data = buf.slice(0, CHUNK);
                var addr = buf.slice(CHUNK, libjs.sockaddr_in.size);
                var addrlen = buf.slice(CHUNK + libjs.sockaddr_in.size);
                var bytes = libjs.recvfrom(this.fd, buf, CHUNK, 0, addr, addrlen);
                if (bytes < -1) {
                    this.onerror(Error("Error reading data: " + bytes));
                    break;
                }
                else {
                    var from = [libjs.sockaddr_in.unpack(addr), libjs.int32.unpack(addrlen)];
                    this.ondata(buf.slice(0, bytes), from);
                }
            } while (bytes === CHUNK);
        }
        if (events & 8) {
            console.log(this.fd, 'EPOLLERR');
            this.onerror(Error("Some error on " + this.fd));
        }
        if (events & 8192) {
            console.log(this.fd, 'EPOLLRDHUP');
        }
        if (events & 16) {
            console.log(this.fd, 'EPOLLHUP');
        }
    };
    SocketUdp4.prototype.setTtl = function (ttl) {
        if (ttl < 1 || ttl > 255)
            return -22;
        var buf = libjs.optval_t.pack(ttl);
        return libjs.setsockopt(this.fd, 0, 2, buf);
    };
    SocketUdp4.prototype.setMulticastTtl = function (ttl) {
        var buf = libjs.optval_t.pack(ttl);
        return libjs.setsockopt(this.fd, 0, 33, buf);
    };
    SocketUdp4.prototype.setMulticastLoop = function (on) {
        var buf = libjs.optval_t.pack(on ? 1 : 0);
        return libjs.setsockopt(this.fd, 0, 34, buf);
    };
    SocketUdp4.prototype.setBroadcast = function (on) {
        var buf = libjs.optval_t.pack(on ? 1 : 0);
        return libjs.setsockopt(this.fd, 65535, 32, buf);
    };
    return SocketUdp4;
}(Socket));
exports.SocketUdp4 = SocketUdp4;
var SocketUdp6 = (function (_super) {
    __extends(SocketUdp6, _super);
    function SocketUdp6() {
        _super.apply(this, arguments);
        this.isIPv4 = false;
    }
    SocketUdp6.prototype.setTtl = function (ttl) {
        if (ttl < 1 || ttl > 255)
            return -22;
        var buf = libjs.optval_t.pack(ttl);
        return libjs.setsockopt(this.fd, 41, 16, buf);
    };
    SocketUdp6.prototype.setMulticastTtl = function (ttl) {
        var buf = libjs.optval_t.pack(ttl);
        return libjs.setsockopt(this.fd, 41, 18, buf);
    };
    SocketUdp6.prototype.setMulticastLoop = function (on) {
        var buf = libjs.optval_t.pack(on ? 1 : 0);
        return libjs.setsockopt(this.fd, 41, 19, buf);
    };
    return SocketUdp6;
}(SocketUdp4));
exports.SocketUdp6 = SocketUdp6;
var SocketTcp = (function (_super) {
    __extends(SocketTcp, _super);
    function SocketTcp() {
        _super.apply(this, arguments);
        this.type = 1;
        this.connected = false;
    }
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
var Poll = (function () {
    function Poll() {
        this.socks = {};
        this.refs = 0;
        this.epfd = 0;
        this.onerror = event_1.noop;
        this.maxEvents = 10;
        this.bufSize = libjs.epoll_event.size;
        this.epfd = libjs.epoll_create1(0);
        if (this.epfd < 0)
            throw Error("Could not create epoll fd: errno = " + this.epfd);
    }
    Poll.prototype.wait = function (timeout) {
        var EVENT_SIZE = this.bufSize;
        var evbuf = new static_buffer_1.StaticBuffer(this.maxEvents * EVENT_SIZE);
        var waitres = libjs.epoll_wait(this.epfd, evbuf, this.maxEvents, timeout);
        if (waitres > 0) {
            for (var i = 0; i < waitres; i++) {
                var event = libjs.epoll_event.unpack(evbuf, i * EVENT_SIZE);
                var fd = event.data[0];
                var socket = this.socks[fd];
                if (socket) {
                    socket.update(event.events);
                }
                else {
                    this.onerror(Error("Socket not in pool: " + fd));
                }
            }
        }
        else if (waitres < 0) {
            this.onerror(Error("Error while waiting for connection: " + waitres));
        }
        setTimeout(this.wait.bind(this), 1000);
    };
    Poll.prototype.hasRefs = function () {
        return !!this.refs;
    };
    Poll.prototype.createUdpSocket = function (udp6) {
        var sock = !udp6 ? new SocketUdp4 : new SocketUdp6;
        sock.poll = this;
        var err = sock.start();
        this.socks[sock.fd] = sock;
        if (err)
            return err;
        else
            return sock;
    };
    return Poll;
}());
exports.Poll = Poll;
