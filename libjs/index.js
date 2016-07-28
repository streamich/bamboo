"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var p = process;
var syscall = p.syscall;
var syscall64 = p.syscall64;
var asyscall = p.asyscall || (function asyscall() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var callback = args[args.length - 1];
    var params = args.splice(0, args.length - 1);
    var res = syscall.apply(null, params);
    callback(res);
});
var asyscall64 = p.asyscall64 || (function asyscall64() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var callback = args[args.length - 1];
    var params = args.splice(0, args.length - 1);
    var res = syscall64.apply(null, params);
    callback(res);
});
function malloc(size) {
    return new Buffer(size);
}
var x86_64_linux_1 = require('./platforms/x86_64_linux');
var types = require('./platforms/x86_64_linux');
__export(require('./platforms/x86_64_linux'));
exports.arch = {
    isLE: true,
    kernel: 'linux',
    int: 64,
    SYS: x86_64_linux_1.SYS,
    types: types
};
__export(require('./ctypes'));
__export(require('./socket'));
function noop() { }
function read(fd, buf) {
    return syscall(x86_64_linux_1.SYS.read, fd, buf, buf.length);
}
exports.read = read;
function readAsync(fd, buf, callback) {
    asyscall(x86_64_linux_1.SYS.read, fd, buf, buf.length, callback);
}
exports.readAsync = readAsync;
function write(fd, buf) {
    if (!(buf instanceof Buffer))
        buf = new Buffer(buf + '\0');
    return syscall(x86_64_linux_1.SYS.write, fd, buf, buf.length);
}
exports.write = write;
function writeAsync(fd, buf, callback) {
    if (!(buf instanceof Buffer))
        buf = new Buffer(buf + '\0');
    return syscall(x86_64_linux_1.SYS.write, fd, buf, buf.length, callback);
}
exports.writeAsync = writeAsync;
function open(pathname, flags, mode) {
    var args = [x86_64_linux_1.SYS.open, pathname, flags];
    if (typeof mode === 'number')
        args.push(mode);
    return syscall.apply(null, args);
}
exports.open = open;
function openAsync(pathname, flags, mode, callback) {
    var args = [x86_64_linux_1.SYS.open, pathname, flags];
    if (typeof mode === 'number')
        args.push(mode);
    args.push(callback);
    asyscall.apply(null, args);
}
exports.openAsync = openAsync;
function close(fd) {
    return syscall(x86_64_linux_1.SYS.close, fd);
}
exports.close = close;
function closeAsync(fd, callback) {
    asyscall(x86_64_linux_1.SYS.close, fd, callback);
}
exports.closeAsync = closeAsync;
function access(pathname, mode) {
    return syscall(x86_64_linux_1.SYS.access, pathname, mode);
}
exports.access = access;
function accessAsync(pathname, mode, callback) {
    asyscall(x86_64_linux_1.SYS.access, pathname, mode, callback);
}
exports.accessAsync = accessAsync;
function chmod(pathname, mode) {
    return syscall(x86_64_linux_1.SYS.chmod, pathname, mode);
}
exports.chmod = chmod;
function chmodAsync(pathname, mode, callback) {
    asyscall(x86_64_linux_1.SYS.chmod, pathname, mode, callback);
}
exports.chmodAsync = chmodAsync;
function fchmod(fd, mode) {
    return syscall(x86_64_linux_1.SYS.chmod, fd, mode);
}
exports.fchmod = fchmod;
function fchmodAsync(fd, mode, callback) {
    asyscall(x86_64_linux_1.SYS.chmod, fd, mode, callback);
}
exports.fchmodAsync = fchmodAsync;
function chown(pathname, owner, group) {
    return syscall(x86_64_linux_1.SYS.chown, pathname, owner, group);
}
exports.chown = chown;
function chownAsync(pathname, owner, group, callback) {
    asyscall(x86_64_linux_1.SYS.chown, pathname, owner, group, callback);
}
exports.chownAsync = chownAsync;
function fchown(fd, owner, group) {
    return syscall(x86_64_linux_1.SYS.fchown, fd, owner, group);
}
exports.fchown = fchown;
function fchownAsync(fd, owner, group, callback) {
    asyscall(x86_64_linux_1.SYS.fchown, fd, owner, group, callback);
}
exports.fchownAsync = fchownAsync;
function lchown(pathname, owner, group) {
    return syscall(x86_64_linux_1.SYS.lchown, pathname, owner, group);
}
exports.lchown = lchown;
function lchownAsync(pathname, owner, group, callback) {
    asyscall(x86_64_linux_1.SYS.lchown, pathname, owner, group, callback);
}
exports.lchownAsync = lchownAsync;
function fsync(fd) {
    return syscall(x86_64_linux_1.SYS.fsync, fd);
}
exports.fsync = fsync;
function fsyncAsync(fd, callback) {
    asyscall(x86_64_linux_1.SYS.fsync, fd, callback);
}
exports.fsyncAsync = fsyncAsync;
function fdatasync(fd) {
    return syscall(x86_64_linux_1.SYS.fdatasync, fd);
}
exports.fdatasync = fdatasync;
function fdatasyncAsync(fd, callback) {
    asyscall(x86_64_linux_1.SYS.fdatasync, fd, callback);
}
exports.fdatasyncAsync = fdatasyncAsync;
function stat(filepath) {
    var buf = new Buffer(types.stat.size + 100);
    var result = syscall(x86_64_linux_1.SYS.stat, filepath, buf);
    if (result == 0)
        return types.stat.unpack(buf);
    throw result;
}
exports.stat = stat;
function __unpackStats(buf, result, callback) {
    if (result === 0) {
        try {
            callback(null, types.stat.unpack(buf));
        }
        catch (e) {
            callback(e);
        }
    }
    else
        callback(result);
}
function statAsync(filepath, callback) {
    var buf = new Buffer(types.stat.size + 100);
    asyscall(x86_64_linux_1.SYS.stat, filepath, buf, function (result) { return __unpackStats(buf, result, callback); });
}
exports.statAsync = statAsync;
function lstat(linkpath) {
    var buf = new Buffer(types.stat.size + 100);
    var result = syscall(x86_64_linux_1.SYS.lstat, linkpath, buf);
    if (result == 0)
        return types.stat.unpack(buf);
    throw result;
}
exports.lstat = lstat;
function lstatAsync(linkpath, callback) {
    var buf = new Buffer(types.stat.size + 100);
    asyscall(x86_64_linux_1.SYS.lstat, linkpath, buf, function (result) { return __unpackStats(buf, result, callback); });
}
exports.lstatAsync = lstatAsync;
function fstat(fd) {
    var buf = new Buffer(types.stat.size + 100);
    var result = syscall(x86_64_linux_1.SYS.fstat, fd, buf);
    if (result == 0)
        return types.stat.unpack(buf);
    throw result;
}
exports.fstat = fstat;
function fstatAsync(fd, callback) {
    var buf = new Buffer(types.stat.size + 100);
    asyscall(x86_64_linux_1.SYS.fstat, fd, buf, function (result) { return __unpackStats(buf, result, callback); });
}
exports.fstatAsync = fstatAsync;
function truncate(path, length) {
    return syscall(x86_64_linux_1.SYS.truncate, path, length);
}
exports.truncate = truncate;
function truncateAsync(path, length, callback) {
    asyscall(x86_64_linux_1.SYS.truncate, path, length, callback);
}
exports.truncateAsync = truncateAsync;
function ftruncate(fd, length) {
    return syscall(x86_64_linux_1.SYS.ftruncate, fd, length);
}
exports.ftruncate = ftruncate;
function ftruncateAsync(fd, length, callback) {
    asyscall(x86_64_linux_1.SYS.ftruncate, fd, length, callback);
}
exports.ftruncateAsync = ftruncateAsync;
function lseek(fd, offset, whence) {
    return syscall(x86_64_linux_1.SYS.lseek, fd, offset, whence);
}
exports.lseek = lseek;
function lseekAsync(fd, offset, whence, callback) {
    asyscall(x86_64_linux_1.SYS.lseek, fd, offset, whence, callback);
}
exports.lseekAsync = lseekAsync;
function rename(oldpath, newpath) {
    return syscall(x86_64_linux_1.SYS.rename, oldpath, newpath);
}
exports.rename = rename;
function renameAsync(oldpath, newpath, callback) {
    asyscall(x86_64_linux_1.SYS.rename, oldpath, newpath, callback);
}
exports.renameAsync = renameAsync;
function mkdir(pathname, mode) {
    return syscall(x86_64_linux_1.SYS.mkdir, pathname, mode);
}
exports.mkdir = mkdir;
function mkdirAsync(pathname, mode, callback) {
    asyscall(x86_64_linux_1.SYS.mkdir, pathname, mode, callback);
}
exports.mkdirAsync = mkdirAsync;
function mkdirat(dirfd, pathname, mode) {
    return syscall(x86_64_linux_1.SYS.mkdirat, dirfd, pathname, mode);
}
exports.mkdirat = mkdirat;
function mkdiratAsync(dirfd, pathname, mode, callback) {
    asyscall(x86_64_linux_1.SYS.mkdirat, dirfd, pathname, mode, callback);
}
exports.mkdiratAsync = mkdiratAsync;
function rmdir(pathname) {
    return syscall(x86_64_linux_1.SYS.rmdir, pathname);
}
exports.rmdir = rmdir;
function rmdirAsync(pathname, callback) {
    asyscall(x86_64_linux_1.SYS.rmdir, pathname, callback);
}
exports.rmdirAsync = rmdirAsync;
function getcwd() {
    var buf = new Buffer(264);
    var res = syscall(x86_64_linux_1.SYS.getcwd, buf, buf.length);
    if (res < 0) {
        if (res === -34) {
            buf = new Buffer(4096);
            res = syscall(x86_64_linux_1.SYS.getcwd, buf, buf.length);
            if (res < 0)
                throw res;
        }
        else
            throw res;
    }
    return buf.slice(0, res - 1).toString();
}
exports.getcwd = getcwd;
function getcwdAsync(callback) {
    var buf = new Buffer(264);
    asyscall(x86_64_linux_1.SYS.getcwd, buf, buf.length, function (res) {
        if (res < 0) {
            if (res === -34) {
                buf = new Buffer(4096);
                asyscall(x86_64_linux_1.SYS.getcwd, buf, buf.length, function (res) {
                    if (res < 0)
                        callback(res);
                    else
                        callback(null, buf.slice(0, res).toString());
                });
            }
            else
                callback(res);
        }
        callback(null, buf.slice(0, res).toString());
    });
}
exports.getcwdAsync = getcwdAsync;
function getdents64(fd, dirp) {
    return syscall(x86_64_linux_1.SYS.getdents64, fd, dirp, dirp.length);
}
exports.getdents64 = getdents64;
function getdents64Async(fd, dirp, callback) {
    asyscall(x86_64_linux_1.SYS.getdents64, fd, dirp, dirp.length, callback);
}
exports.getdents64Async = getdents64Async;
function readdir(path, encoding) {
    if (encoding === void 0) { encoding = 'utf8'; }
    var fd = open(path, 0 | 65536);
    if (fd < 0)
        throw fd;
    var buf = new Buffer(4096);
    var struct = types.linux_dirent64;
    var list = [];
    var res = getdents64(fd, buf);
    do {
        var offset = 0;
        while (offset + struct.size < res) {
            var unpacked = struct.unpack(buf, offset);
            var name = buf.slice(offset + struct.size, offset + unpacked.d_reclen).toString(encoding);
            name = name.substr(0, name.indexOf("\0"));
            var entry = {
                ino: unpacked.ino64_t,
                offset: unpacked.off64_t[0],
                type: unpacked.d_type,
                name: name
            };
            list.push(entry);
            offset += unpacked.d_reclen;
        }
        res = getdents64(fd, buf);
    } while (res > 0);
    if (res < 0)
        throw res;
    close(fd);
    return list;
}
exports.readdir = readdir;
function readdirList(path, encoding) {
    if (encoding === void 0) { encoding = 'utf8'; }
    var fd = open(path, 0 | 65536);
    if (fd < 0)
        throw fd;
    var buf = new Buffer(4096);
    var struct = types.linux_dirent64;
    var list = [];
    var res = getdents64(fd, buf);
    do {
        var offset = 0;
        while (offset + struct.size < res) {
            var unpacked = struct.unpack(buf, offset);
            var name = buf.slice(offset + struct.size, offset + unpacked.d_reclen).toString(encoding);
            name = name.substr(0, name.indexOf("\0"));
            if ((name != '.') && (name != '..'))
                list.push(name);
            offset += unpacked.d_reclen;
        }
        res = getdents64(fd, buf);
    } while (res > 0);
    if (res < 0)
        throw res;
    close(fd);
    return list;
}
exports.readdirList = readdirList;
function readdirListAsync(path, encoding, callback) {
    if (encoding === void 0) { encoding = 'utf8'; }
    openAsync(path, 0 | 65536, null, function (fd) {
        if (fd < 0)
            return callback(fd);
        var buf = new Buffer(4096);
        var struct = types.linux_dirent64;
        var list = [];
        function done() {
            closeAsync(fd, noop);
            callback(null, list);
        }
        function loop() {
            getdents64Async(fd, buf, function (res) {
                if (res < 0) {
                    callback(res);
                    return;
                }
                var offset = 0;
                while (offset + struct.size < res) {
                    var unpacked = struct.unpack(buf, offset);
                    var name = buf.slice(offset + struct.size, offset + unpacked.d_reclen).toString(encoding);
                    name = name.substr(0, name.indexOf("\0"));
                    if ((name != '.') && (name != '..'))
                        list.push(name);
                    offset += unpacked.d_reclen;
                }
                if (res > 0)
                    loop();
                else
                    done();
            });
        }
        loop();
    });
}
exports.readdirListAsync = readdirListAsync;
function symlink(target, linkpath) {
    return syscall(x86_64_linux_1.SYS.symlink, target, linkpath);
}
exports.symlink = symlink;
function symlinkAsync(target, linkpath, callback) {
    asyscall(x86_64_linux_1.SYS.symlink, target, linkpath, callback);
}
exports.symlinkAsync = symlinkAsync;
function unlink(pathname) {
    return syscall(x86_64_linux_1.SYS.unlink, pathname);
}
exports.unlink = unlink;
function unlinkAsync(pathname, callback) {
    asyscall(x86_64_linux_1.SYS.unlink, pathname, callback);
}
exports.unlinkAsync = unlinkAsync;
function readlink(pathname, buf) {
    return syscall(x86_64_linux_1.SYS.readlink, pathname, buf, buf.length);
}
exports.readlink = readlink;
function readlinkAsync(pathname, buf, callback) {
    asyscall(x86_64_linux_1.SYS.readlink, pathname, buf, buf.length, callback);
}
exports.readlinkAsync = readlinkAsync;
function link(oldpath, newpath) {
    return syscall(x86_64_linux_1.SYS.link, oldpath, newpath);
}
exports.link = link;
function linkAsync(oldpath, newpath, callback) {
    asyscall(x86_64_linux_1.SYS.link, oldpath, newpath, callback);
}
exports.linkAsync = linkAsync;
function utime(filename, times) {
    var buf = types.utimbuf.pack(times);
    return syscall(x86_64_linux_1.SYS.utime, filename, buf);
}
exports.utime = utime;
function utimeAsync(filename, times, callback) {
    var buf = types.utimbuf.pack(times);
    asyscall(x86_64_linux_1.SYS.utime, filename, buf, callback);
}
exports.utimeAsync = utimeAsync;
function utimes(filename, times) {
    var buf = types.timevalarr.pack(times);
    return syscall(x86_64_linux_1.SYS.utimes, buf);
}
exports.utimes = utimes;
function utimesAsync(filename, times, callback) {
    var buf = types.timevalarr.pack(times);
    asyscall(x86_64_linux_1.SYS.utimes, buf, callback);
}
exports.utimesAsync = utimesAsync;
function socket(domain, type, protocol) {
    return syscall(x86_64_linux_1.SYS.socket, domain, type, protocol);
}
exports.socket = socket;
function socketAsync(domain, type, protocol, callback) {
    asyscall(x86_64_linux_1.SYS.socket, domain, type, protocol, callback);
}
exports.socketAsync = socketAsync;
function connect(fd, sockaddr) {
    var buf = types.sockaddr_in.pack(sockaddr);
    return syscall(x86_64_linux_1.SYS.connect, fd, buf, buf.length);
}
exports.connect = connect;
function connectAsync(fd, sockaddr, callback) {
    var buf = types.sockaddr_in.pack(sockaddr);
    asyscall(x86_64_linux_1.SYS.connect, fd, buf, buf.length, callback);
}
exports.connectAsync = connectAsync;
function bind(fd, sockaddr, addr_type) {
    var buf = addr_type.pack(sockaddr);
    return syscall(x86_64_linux_1.SYS.bind, fd, buf, buf.length);
}
exports.bind = bind;
function bindAsync(fd, sockaddr, addr_type, callback) {
    var buf = addr_type.pack(sockaddr);
    asyscall(x86_64_linux_1.SYS.bind, fd, buf, buf.length, callback);
}
exports.bindAsync = bindAsync;
function listen(fd, backlog) {
    return syscall(x86_64_linux_1.SYS.listen, fd, backlog);
}
exports.listen = listen;
function listenAsync(fd, backlog, callback) {
    asyscall(x86_64_linux_1.SYS.listen, fd, backlog, callback);
}
exports.listenAsync = listenAsync;
function accept(fd, buf) {
    var buflen = types.int32.pack(buf.length);
    return syscall(x86_64_linux_1.SYS.accept, fd, buf, buflen);
}
exports.accept = accept;
function acceptAsync(fd, buf, callback) {
    var buflen = types.int32.pack(buf.length);
    asyscall(x86_64_linux_1.SYS.accept, fd, buf, buflen, callback);
}
exports.acceptAsync = acceptAsync;
function accept4(fd, buf, flags) {
    var buflen = types.int32.pack(buf.length);
    return syscall(x86_64_linux_1.SYS.accept4, fd, buf, buflen, flags);
}
exports.accept4 = accept4;
function accept4Async(fd, buf, flags, callback) {
    var buflen = types.int32.pack(buf.length);
    asyscall(x86_64_linux_1.SYS.accept4, fd, buf, buflen, flags, callback);
}
exports.accept4Async = accept4Async;
function shutdown(fd, how) {
    return syscall(x86_64_linux_1.SYS.shutdown, fd, how);
}
exports.shutdown = shutdown;
function shutdownAsync(fd, how, callback) {
    asyscall(x86_64_linux_1.SYS.shutdown, fd, how, callback);
}
exports.shutdownAsync = shutdownAsync;
function send(fd, buf, flags) {
    if (flags === void 0) { flags = 0; }
    return sendto(fd, buf, flags);
}
exports.send = send;
function sendAsync(fd, buf, flags, callback) {
    if (flags === void 0) { flags = 0; }
    sendtoAsync(fd, buf, flags, null, null, callback);
}
exports.sendAsync = sendAsync;
function sendto(fd, buf, flags, addr, addr_type) {
    if (flags === void 0) { flags = 0; }
    var params = [x86_64_linux_1.SYS.sendto, fd, buf, buf.length, flags, 0, 0];
    if (addr) {
        var addrbuf = addr_type.pack(addr);
        params[5] = addrbuf;
        params[6] = addrbuf.length;
    }
    return syscall.apply(null, params);
}
exports.sendto = sendto;
function sendtoAsync(fd, buf, flags, addr, addr_type, callback) {
    if (flags === void 0) { flags = 0; }
    var params = [x86_64_linux_1.SYS.sendto, fd, buf, buf.length, flags, 0, 0, callback];
    if (addr) {
        var addrbuf = addr_type.pack(addr);
        params[5] = addrbuf;
        params[6] = addrbuf.length;
    }
    syscall.apply(null, params);
}
exports.sendtoAsync = sendtoAsync;
function recv(sockfd, buf, flags) {
    if (flags === void 0) { flags = 0; }
    return recvfrom(sockfd, buf, flags);
}
exports.recv = recv;
function recvAsync(sockfd, buf, flags, callback) {
    if (flags === void 0) { flags = 0; }
    recvfromAsync(sockfd, buf, flags, null, null, callback);
}
exports.recvAsync = recvAsync;
function recvfrom(sockfd, buf, flags, addr, addr_type) {
    var args = [x86_64_linux_1.SYS.recvfrom, sockfd, buf, buf.length, flags, 0, 0];
    if (addr) {
        var addrbuf = addr_type.pack(addr);
        args[5] = addrbuf;
        args[6] = addrbuf.length;
    }
    return syscall.apply(null, args);
}
exports.recvfrom = recvfrom;
function recvfromAsync(sockfd, buf, flags, addr, addr_type, callback) {
    var args = [x86_64_linux_1.SYS.recvfrom, sockfd, buf, buf.length, flags, 0, 0, callback];
    if (addr) {
        var addrbuf = addr_type.pack(addr);
        args[5] = addrbuf;
        args[6] = addrbuf.length;
    }
    asyscall.apply(null, args);
}
exports.recvfromAsync = recvfromAsync;
function setsockopt(sockfd, level, optname, optval) {
    return syscall(x86_64_linux_1.SYS.setsockopt, sockfd, level, optname, optval, optval.length);
}
exports.setsockopt = setsockopt;
function getpid() {
    return syscall(x86_64_linux_1.SYS.getpid);
}
exports.getpid = getpid;
function getppid() {
    return syscall(x86_64_linux_1.SYS.getppid);
}
exports.getppid = getppid;
function getppidAsync(callback) {
    asyscall(x86_64_linux_1.SYS.getppid, callback);
}
exports.getppidAsync = getppidAsync;
function getuid() {
    return syscall(x86_64_linux_1.SYS.getuid);
}
exports.getuid = getuid;
function geteuid() {
    return syscall(x86_64_linux_1.SYS.geteuid);
}
exports.geteuid = geteuid;
function getgid() {
    return syscall(x86_64_linux_1.SYS.getgid);
}
exports.getgid = getgid;
function getegid() {
    return syscall(x86_64_linux_1.SYS.getegid);
}
exports.getegid = getegid;
function sched_yield() {
    syscall(x86_64_linux_1.SYS.sched_yield);
}
exports.sched_yield = sched_yield;
function nanosleep(seconds, nanoseconds) {
    var buf = types.timespec.pack({
        tv_sec: [seconds, 0],
        tv_nsec: [nanoseconds, 0]
    });
    return syscall(x86_64_linux_1.SYS.nanosleep, buf, types.NULL);
}
exports.nanosleep = nanosleep;
function fcntl(fd, cmd, arg) {
    var params = [x86_64_linux_1.SYS.fcntl, fd, cmd];
    if (typeof arg !== 'undefined')
        params.push(arg);
    return syscall.apply(null, params);
}
exports.fcntl = fcntl;
function epoll_create(size) {
    return syscall(x86_64_linux_1.SYS.epoll_create, size);
}
exports.epoll_create = epoll_create;
function epoll_create1(flags) {
    return syscall(x86_64_linux_1.SYS.epoll_create1, flags);
}
exports.epoll_create1 = epoll_create1;
function epoll_wait(epfd, buf, maxevents, timeout) {
    return syscall(x86_64_linux_1.SYS.epoll_wait, epfd, buf, maxevents, timeout);
}
exports.epoll_wait = epoll_wait;
function epoll_ctl(epfd, op, fd, epoll_event) {
    var buf = types.epoll_event.pack(epoll_event);
    return syscall(x86_64_linux_1.SYS.epoll_ctl, epfd, op, fd, buf);
}
exports.epoll_ctl = epoll_ctl;
function inotify_init() {
    return syscall(x86_64_linux_1.SYS.inotify_init);
}
exports.inotify_init = inotify_init;
function inotify_init1(flags) {
    return syscall(x86_64_linux_1.SYS.inotify_init1, flags);
}
exports.inotify_init1 = inotify_init1;
function inotify_add_watch(fd, pathname, mask) {
    return syscall(x86_64_linux_1.SYS.inotify_add_watch, fd, pathname, mask);
}
exports.inotify_add_watch = inotify_add_watch;
function inotify_rm_watch(fd, wd) {
    return syscall(x86_64_linux_1.SYS.inotify_rm_watch, fd, wd);
}
exports.inotify_rm_watch = inotify_rm_watch;
function mmap(addr, length, prot, flags, fd, offset) {
    return syscall64(x86_64_linux_1.SYS.mmap, addr, length, prot, flags, fd, offset);
}
exports.mmap = mmap;
function munmap(addr, length) {
    return syscall(x86_64_linux_1.SYS.munmap, addr, length);
}
exports.munmap = munmap;
function mprotect(addr, len, prot) {
    return syscall(x86_64_linux_1.SYS.mprotect, addr, len, prot);
}
exports.mprotect = mprotect;
function shmget(key, size, shmflg) {
    return syscall(x86_64_linux_1.SYS.shmget, key, size, shmflg);
}
exports.shmget = shmget;
function shmat(shmid, shmaddr, shmflg) {
    if (shmaddr === void 0) { shmaddr = types.NULL; }
    if (shmflg === void 0) { shmflg = 0; }
    return syscall64(x86_64_linux_1.SYS.shmat, shmid, shmaddr, shmflg);
}
exports.shmat = shmat;
function shmdt(shmaddr) {
    return syscall(x86_64_linux_1.SYS.shmdt, shmaddr);
}
exports.shmdt = shmdt;
function shmctl(shmid, cmd, buf) {
    if (buf === void 0) { buf = types.NULL; }
    if (buf instanceof Buffer) {
    }
    else if (typeof buf === 'object') {
        buf = types.shmid_ds.pack(buf);
    }
    else {
    }
    return syscall(x86_64_linux_1.SYS.shmctl, shmid, cmd, buf);
}
exports.shmctl = shmctl;
