"use strict";
var libjs = require('../libjs/index');
function noop() { }
var Inotify = (function () {
    function Inotify(poll_interval, buffer_size) {
        if (poll_interval === void 0) { poll_interval = 200; }
        if (buffer_size === void 0) { buffer_size = 4096; }
        this.onevent = noop;
        this.onerror = noop;
        this.wdCount = 0;
        this.wd = {};
        this.wdr = {};
        this.pollBound = this.poll.bind(this);
        this.encoding = 'utf8';
        this.pollInterval = poll_interval;
        this.bufSize = buffer_size;
    }
    Inotify.prototype.poll = function () {
        var res = libjs.read(this.fd, this.buf);
        if (res < 0) {
            if (-res == 11) {
            }
            else {
                this.onerror(Error("Could not poll for events: errno = " + res), res);
            }
            this.nextTick();
            return;
        }
        if (res > 0) {
            var offset = 0;
            var struct = libjs.inotify_event;
            while (offset < res) {
                var event = struct.unpack(this.buf, offset);
                var name_off = offset + struct.size;
                var name = this.buf.slice(name_off, name_off + event.len).toString(this.encoding);
                name = name.substr(0, name.indexOf("\0"));
                event.name = name;
                event.path = this.wdr[event.wd];
                this.onevent(event);
                offset += struct.size + event.len;
            }
        }
        this.nextTick();
    };
    Inotify.prototype.nextTick = function () {
        if (this.hasStarted() && this.wdCount)
            this.timeout = setTimeout(this.pollBound, this.pollInterval);
    };
    Inotify.prototype.stopPolling = function () {
        clearTimeout(this.timeout);
        this.timeout = null;
    };
    Inotify.prototype.hasStarted = function () {
        return !!this.fd;
    };
    Inotify.prototype.start = function () {
        this.fd = libjs.inotify_init1(2048);
        if (this.fd < 0)
            throw Error("Could not init: errno = " + this.fd);
        this.buf = new Buffer(this.bufSize);
        return this.fd;
    };
    Inotify.prototype.stop = function () {
        this.stopPolling();
        for (var pathname in this.wd)
            this.removePath(pathname);
        var fd = this.fd;
        this.fd = 0;
        return libjs.close(fd);
    };
    Inotify.prototype.addPath = function (pathname, events) {
        if (events === void 0) { events = 4095; }
        if (!this.fd)
            throw Error("inotify file descriptor not initialized, call .init() first.");
        var wd = libjs.inotify_add_watch(this.fd, pathname, events);
        if (wd < 0)
            throw Error("Could not add watch: errno = " + wd);
        this.wdCount++;
        this.wd[pathname] = wd;
        this.wdr[wd] = pathname;
        if (this.wdCount == 1)
            this.nextTick();
        return wd;
    };
    Inotify.prototype.removePath = function (pathname) {
        var wd = this.wd[pathname];
        if (!wd)
            return -1;
        delete this.wd[pathname];
        delete this.wdr[wd];
        this.wdCount--;
        return libjs.inotify_rm_watch(this.fd, wd);
    };
    return Inotify;
}());
exports.Inotify = Inotify;
