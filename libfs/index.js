"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var libjs = require('../libjs/index');
var inotify_1 = require('../libaio/inotify');
if (__DEBUG__) {
    exports.isFullJS = true;
}
function extend(a, b) {
    for (var i in b)
        a[i] = b[i];
    return a;
}
function noop() { }
function formatError(errno, func, path, path2) {
    if (func === void 0) { func = ''; }
    if (path === void 0) { path = ''; }
    if (path2 === void 0) { path2 = ''; }
    switch (-errno) {
        case 2: return "ENOENT: no such file or directory, " + func + " '" + path + "'";
        case 9: return "EBADF: bad file descriptor, " + func;
        case 22: return "EINVAL: invalid argument, " + func;
        case 1: return "EPERM: operation not permitted, " + func + " '" + path + "' -> '" + path2 + "'";
        case 71: return "EPROTO: protocol error, " + func + " '" + path + "' -> '" + path2 + "'";
        case 17: return "EEXIST: file already exists, " + func + " '" + path + "' -> '" + path2 + "'";
        default: return "Error occurred in " + func + ": errno = " + errno;
    }
}
function throwError(errno, func, path, path2) {
    if (func === void 0) { func = ''; }
    if (path === void 0) { path = ''; }
    if (path2 === void 0) { path2 = ''; }
    throw Error(formatError(errno, func, path, path2));
}
function pathOrError(path) {
    if (path instanceof Buffer)
        path = path.toString();
    if (typeof path !== 'string')
        return TypeError('path must be a string');
    return path;
}
function validPathOrThrow(path) {
    var p = pathOrError(path);
    if (p instanceof TypeError)
        throw p;
    else
        return p;
}
function validateFd(fd) {
    if (typeof fd !== 'number')
        throw TypeError('fd must be a file descriptor');
}
(function (flags) {
    flags[flags["r"] = 0] = "r";
    flags[flags['r+'] = 2] = 'r+';
    flags[flags["rs"] = 1069056] = "rs";
    flags[flags['rs+'] = 1069058] = 'rs+';
    flags[flags["w"] = 577] = "w";
    flags[flags["wx"] = 705] = "wx";
    flags[flags['w+'] = 578] = 'w+';
    flags[flags['wx+'] = 706] = 'wx+';
    flags[flags["a"] = 1089] = "a";
    flags[flags["ax"] = 1217] = "ax";
    flags[flags['a+'] = 1090] = 'a+';
    flags[flags['ax+'] = 1218] = 'ax+';
})(exports.flags || (exports.flags = {}));
var flags = exports.flags;
var MODE_DEFAULT = 438;
var CHUNK = 4096;
var F_OK = 0;
var R_OK = 4;
var W_OK = 2;
var X_OK = 1;
var appendFileDefaults = {
    encoding: 'utf8',
    mode: MODE_DEFAULT,
    flag: 'a'
};
var Stats = (function () {
    function Stats() {
    }
    Stats.prototype.isFile = function () {
        return (this.mode & 32768) == 32768;
    };
    Stats.prototype.isDirectory = function () {
        return (this.mode & 16384) == 16384;
    };
    Stats.prototype.isBlockDevice = function () {
        return (this.mode & 24576) == 24576;
    };
    Stats.prototype.isCharacterDevice = function () {
        return (this.mode & 8192) == 8192;
    };
    Stats.prototype.isSymbolicLink = function () {
        return (this.mode & 40960) == 40960;
    };
    Stats.prototype.isFIFO = function () {
        return (this.mode & 4096) == 4096;
    };
    Stats.prototype.isSocket = function () {
        return (this.mode & 49152) == 49152;
    };
    return Stats;
}());
exports.Stats = Stats;
function build(deps) {
    var pathModule = deps.path, _EE = deps.EventEmitter, Buffer = deps.Buffer, StaticBuffer = deps.StaticBuffer, Readable = deps.Readable, Writable = deps.Writable;
    var EE = _EE;
    function accessSync(path, mode) {
        if (mode === void 0) { mode = F_OK; }
        var vpath = validPathOrThrow(path);
        var res = libjs.access(vpath, mode);
        if (res < 0)
            throwError(res, 'access', vpath);
    }
    function appendFile(file, data, options, callback) {
    }
    function appendFileSync(file, data, options) {
        if (options === void 0) { options = {}; }
        options = extend(options, appendFileDefaults);
    }
    function chmod(path, mode, callback) {
    }
    function chmodSync(path, mode) {
        var vpath = validPathOrThrow(path);
        if (typeof mode !== 'number')
            throw TypeError('mode must be an integer');
        var result = libjs.chmod(vpath, mode);
        if (result < 0)
            throwError(result, 'chmod', vpath);
    }
    function fchmod(fd, mode, callback) { }
    function fchmodSync(fd, mode) {
        validateFd(fd);
        if (typeof mode !== 'number')
            throw TypeError('mode must be an integer');
        var result = libjs.fchmod(fd, mode);
        if (result < 0)
            throwError(result, 'chmod');
    }
    function chown(path, uid, gid, callback) { }
    function chownSync(path, uid, gid) {
        var vpath = validPathOrThrow(path);
        if (typeof uid !== 'number')
            throw TypeError('uid must be an unsigned int');
        if (typeof gid !== 'number')
            throw TypeError('gid must be an unsigned int');
        var result = libjs.chown(vpath, uid, gid);
        if (result < 0)
            throwError(result, 'chown', vpath);
    }
    function fchown(fd, uid, gid, callback) { }
    function fchownSync(fd, uid, gid) {
        validateFd(fd);
        if (typeof uid !== 'number')
            throw TypeError('uid must be an unsigned int');
        if (typeof gid !== 'number')
            throw TypeError('gid must be an unsigned int');
        var result = libjs.fchown(fd, uid, gid);
        if (result < 0)
            throwError(result, 'fchown');
    }
    function lchown(path, uid, gid, callback) { }
    function lchownSync(path, uid, gid) {
        var vpath = validPathOrThrow(path);
        if (typeof uid !== 'number')
            throw TypeError('uid must be an unsigned int');
        if (typeof gid !== 'number')
            throw TypeError('gid must be an unsigned int');
        var result = libjs.lchown(vpath, uid, gid);
        if (result < 0)
            throwError(result, 'lchown', vpath);
    }
    function closeSync(fd) {
        if (typeof fd !== 'number')
            throw TypeError('fd must be a file descriptor');
        var result = libjs.close(fd);
        if (result < 0)
            throwError(result, 'close');
    }
    function createWriteStream(path, options) { }
    function existsSync(path) {
        console.log('Deprecated fs.existsSync(): Use fs.statSync() or fs.accessSync() instead.');
        try {
            accessSync(path);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function fsyncSync(fd) {
        if (typeof fd !== 'number')
            throw TypeError('fd must be a file descriptor');
        var result = libjs.fsync(fd);
        if (result < 0)
            throwError(result, 'fsync');
    }
    function fdatasyncSync(fd) {
        if (typeof fd !== 'number')
            throw TypeError('fd must be a file descriptor');
        var result = libjs.fdatasync(fd);
        if (result < 0)
            throwError(result, 'fdatasync');
    }
    function createStatsObject(res) {
        var stats = new Stats;
        stats.dev = res.dev;
        stats.mode = res.mode;
        stats.nlink = res.nlink;
        stats.uid = res.uid;
        stats.gid = res.gid;
        stats.rdev = res.rdev;
        stats.blksize = res.blksize;
        stats.ino = res.ino;
        stats.size = res.size;
        stats.blocks = res.blocks;
        stats.atime = new Date((res.atime * 1000) + Math.floor(res.atime_nsec / 1000000));
        stats.mtime = new Date((res.mtime * 1000) + Math.floor(res.mtime_nsec / 1000000));
        stats.ctime = new Date((res.ctime * 1000) + Math.floor(res.ctime_nsec / 1000000));
        stats.birthtime = stats.ctime;
        return stats;
    }
    function statSync(path) {
        var vpath = validPathOrThrow(path);
        try {
            var res = libjs.stat(vpath);
            return createStatsObject(res);
        }
        catch (errno) {
            throwError(errno, 'stat', vpath);
        }
    }
    function stat(path, callback) {
        var vpath = pathOrError(path);
        if (vpath instanceof TypeError)
            return callback(vpath);
        libjs.statAsync(vpath, function (err, res) {
            if (err)
                return callback(Error(formatError(err, 'stat', vpath)));
            callback(null, createStatsObject(res));
        });
    }
    function fstatSync(fd) {
        validateFd(fd);
        try {
            var res = libjs.fstat(fd);
            return createStatsObject(res);
        }
        catch (errno) {
            throwError(errno, 'fstat');
        }
    }
    function lstatSync(path) {
        var vpath = validPathOrThrow(path);
        try {
            var res = libjs.lstat(vpath);
            return createStatsObject(res);
        }
        catch (errno) {
            throwError(errno, 'lstat', vpath);
        }
    }
    function truncateSync(path, len) {
        var vpath = validPathOrThrow(path);
        if (typeof len !== 'number')
            throw TypeError('len must be an integer');
        var res = libjs.truncate(vpath, len);
        if (res < 0)
            throwError(res, 'truncate', vpath);
    }
    function ftruncateSync(fd, len) {
        validateFd(fd);
        if (typeof len !== 'number')
            throw TypeError('len must be an integer');
        var res = libjs.ftruncate(fd, len);
        if (res < 0)
            throwError(res, 'ftruncate');
    }
    function utimesSync(path, atime, mtime) {
        path = validPathOrThrow(path);
        if (typeof atime === 'string')
            atime = parseInt(atime);
        if (typeof mtime === 'string')
            mtime = parseInt(mtime);
        if (typeof atime !== 'number')
            throw TypeError('atime must be an integer');
        if (typeof mtime !== 'number')
            throw TypeError('mtime must be an integer');
        var vatime = atime;
        var vmtime = mtime;
        if (!isFinite(vatime))
            vatime = Date.now();
        if (!isFinite(vmtime))
            vmtime = Date.now();
        vatime = Math.round(vatime / 1000);
        vmtime = Math.round(vmtime / 1000);
        var times = {
            actime: [libjs.UInt64.lo(vatime), libjs.UInt64.hi(vatime)],
            modtime: [libjs.UInt64.lo(vmtime), libjs.UInt64.hi(vmtime)]
        };
        var res = libjs.utime(path, times);
        console.log(res);
        if (res < 0)
            throwError(res, 'utimes', path);
    }
    function linkSync(srcpath, dstpath) {
        var vsrcpath = validPathOrThrow(srcpath);
        var vdstpath = validPathOrThrow(dstpath);
        var res = libjs.link(vsrcpath, vdstpath);
        if (res < 0)
            throwError(res, 'link', vsrcpath, vdstpath);
    }
    function mkdirSync(path, mode) {
        if (mode === void 0) { mode = MODE_DEFAULT; }
        var vpath = validPathOrThrow(path);
        if (typeof mode !== 'number')
            throw TypeError('mode must be an integer');
        var res = libjs.mkdir(vpath, mode);
        if (res < 0)
            throwError(res, 'mkdir', vpath);
    }
    function randomString6() {
        return (+new Date).toString(36).slice(-6);
    }
    function mkdtempSync(prefix, options) {
        if (options === void 0) { options = {}; }
        if (!prefix || typeof prefix !== 'string')
            throw new TypeError('filename prefix is required');
        var retries = 10;
        var fullname;
        var found_tmp_name = false;
        for (var i = 0; i < retries; i++) {
            fullname = prefix + randomString6();
            try {
                accessSync(fullname);
            }
            catch (e) {
                found_tmp_name = true;
                break;
            }
        }
        if (found_tmp_name) {
            mkdirSync(fullname);
            return fullname;
        }
        else {
            throw Error("Could not find a new name, mkdtemp");
        }
    }
    function flagsToFlagsValue(f) {
        if (typeof f === 'number')
            return flags;
        if (typeof f !== 'string')
            throw TypeError("flags must be string or number");
        var flagsval = flags[f];
        if (typeof flagsval !== 'number')
            throw TypeError("Invalid flags string value '" + f + "'");
        return flagsval;
    }
    function openSync(path, flags, mode) {
        if (mode === void 0) { mode = MODE_DEFAULT; }
        var vpath = validPathOrThrow(path);
        var flagsval = flagsToFlagsValue(flags);
        if (typeof mode !== 'number')
            throw TypeError('mode must be an integer');
        var res = libjs.open(vpath, flagsval, mode);
        if (res < 0)
            throwError(res, 'open', vpath);
        return res;
    }
    function open(path, flags, mode, callback) {
        if (typeof mode === 'function') {
            callback = mode;
            mode = MODE_DEFAULT;
        }
        try {
            var vpath = validPathOrThrow(path);
            var flagsval = flagsToFlagsValue(flags);
        }
        catch (error) {
            callback(error);
            return;
        }
        if (typeof mode !== 'number')
            return callback(TypeError('mode must be an integer'));
        libjs.openAsync(vpath, flagsval, mode, function (res) {
            if (res < 0)
                callback(Error(formatError(res, 'open', vpath)));
            return callback(null, res);
        });
    }
    function readSync(fd, buffer, offset, length, position) {
        validateFd(fd);
        if (!(buffer instanceof Buffer))
            throw TypeError('buffer must be an instance of Buffer');
        if (typeof offset !== 'number')
            throw TypeError('offset must be an integer');
        if (typeof length !== 'number')
            throw TypeError('length must be an integer');
        if (position !== null) {
            if (typeof position !== 'number')
                throw TypeError('position must be an integer');
            var seekres = libjs.lseek(fd, position, 0);
            if (seekres < 0)
                throwError(seekres, 'read');
        }
        var buf = buffer.slice(offset, offset + length);
        var res = libjs.read(fd, buf);
        if (res < 0)
            throwError(res, 'read');
        return res;
    }
    var optionsDefaults = {
        encoding: 'utf8'
    };
    function readdirSync(path, options) {
        if (options === void 0) { options = {}; }
        var vpath = validPathOrThrow(path);
        options = extend(options, optionsDefaults);
        return libjs.readdirList(vpath, options.encoding);
    }
    var readFileOptionsDefaults = {
        flag: 'r'
    };
    function readFileSync(file, options) {
        if (options === void 0) { options = {}; }
        var opts;
        if (typeof options === 'string')
            opts = extend({ encoding: options }, readFileOptionsDefaults);
        else if (typeof options !== 'object')
            throw TypeError('Invalid options');
        else
            opts = extend(options, readFileOptionsDefaults);
        if (opts.encoding && (typeof opts.encoding != 'string'))
            throw TypeError('Invalid encoding');
        var fd;
        if (typeof file === 'number')
            fd = file;
        else {
            var vfile = validPathOrThrow(file);
            var flag = flags[opts.flag];
            fd = libjs.open(vfile, flag, MODE_DEFAULT);
            if (fd < 0)
                throwError(fd, 'readFile', vfile);
        }
        var list = [];
        do {
            var buf = new Buffer(CHUNK);
            var res = libjs.read(fd, buf);
            if (res < 0)
                throwError(res, 'readFile');
            if (res < CHUNK)
                buf = buf.slice(0, res);
            list.push(buf);
        } while (res > 0);
        libjs.close(fd);
        var buffer = Buffer.concat(list);
        if (opts.encoding)
            return buffer.toString(opts.encoding);
        else
            return buffer;
    }
    function readFile(file, options, callback) {
        if (options === void 0) { options = {}; }
        var opts;
        if (typeof options === 'function') {
            callback = options;
            opts = readFileOptionsDefaults;
        }
        else {
            if (typeof options === 'string')
                opts = extend({ encoding: options }, readFileOptionsDefaults);
            else if (typeof options !== 'object')
                return callback(TypeError('Invalid options'));
            else
                opts = extend(options, readFileOptionsDefaults);
            if (opts.encoding && (typeof opts.encoding != 'string'))
                return callback(TypeError('Invalid encoding'));
        }
        function on_open(fd) {
            var list = [];
            function done() {
                libjs.closeAsync(fd, function () {
                    var buffer = Buffer.concat(list);
                    if (opts.encoding)
                        callback(null, buffer.toString(opts.encoding));
                    else
                        callback(null, buffer);
                });
            }
            function loop() {
                var buf = new StaticBuffer(CHUNK);
                libjs.readAsync(fd, buf, function (res) {
                    if (res < 0)
                        return callback(Error(formatError(res, 'readFile')));
                    if (res < CHUNK)
                        buf = buf.slice(0, res);
                    list.push(buf);
                    if (res > 0)
                        loop();
                    else
                        done();
                });
            }
            loop();
        }
        if (typeof file === 'number')
            on_open(file);
        else {
            var vfile = pathOrError(file);
            if (vfile instanceof TypeError)
                return callback(vfile);
            var flag = flags[opts.flag];
            libjs.openAsync(vfile, flag, MODE_DEFAULT, function (fd) {
                if (fd < 0)
                    callback(Error(formatError(fd, 'readFile', vfile)));
                else
                    on_open(fd);
            });
        }
    }
    function readlinkSync(path, options) {
        if (options === void 0) { options = null; }
        path = validPathOrThrow(path);
        var buf = new Buffer(64);
        var res = libjs.readlink(path, buf);
        if (res < 0)
            throwError(res, 'readlink', path);
        var encoding = 'buffer';
        if (options) {
            if (typeof options === 'string')
                encoding = options;
            else if (typeof options === 'object') {
                if (typeof options.encoding != 'string')
                    throw TypeError('Encoding must be string.');
                else
                    encoding = options.encoding;
            }
            else
                throw TypeError('Invalid options.');
        }
        buf = buf.slice(0, res);
        return encoding == 'buffer' ? buf : buf.toString(encoding);
    }
    function renameSync(oldPath, newPath) {
        var voldPath = validPathOrThrow(oldPath);
        var vnewPath = validPathOrThrow(newPath);
        var res = libjs.rename(voldPath, vnewPath);
        if (res < 0)
            throwError(res, 'rename', voldPath, vnewPath);
    }
    function rmdirSync(path) {
        var vpath = validPathOrThrow(path);
        var res = libjs.rmdir(vpath);
        if (res < 0)
            throwError(res, 'rmdir', vpath);
    }
    function symlinkSync(target, path) {
        var vtarget = validPathOrThrow(target);
        var vpath = validPathOrThrow(path);
        var res = libjs.symlink(vtarget, vpath);
        if (res < 0)
            throwError(res, 'symlink', vtarget, vpath);
    }
    function unlinkSync(path) {
        var vpath = validPathOrThrow(path);
        var res = libjs.unlink(vpath);
        if (res < 0)
            throwError(res, 'unlink', vpath);
    }
    var FSWatcher = (function (_super) {
        __extends(FSWatcher, _super);
        function FSWatcher() {
            _super.apply(this, arguments);
            this.inotify = new inotify_1.Inotify;
        }
        FSWatcher.prototype.start = function (filename, persistent, recursive, encoding) {
            var _this = this;
            this.inotify.encoding = encoding;
            this.inotify.onerror = noop;
            this.inotify.onevent = function (event) {
                var is_rename = (event.mask & 192) || (event.mask & 256);
                if (is_rename) {
                    _this.emit('change', 'rename', event.name);
                }
                else {
                    _this.emit('change', 'change', event.name);
                }
            };
            this.inotify.start();
            this.inotify.addPath(filename);
        };
        FSWatcher.prototype.close = function () {
            this.inotify.stop();
            this.inotify = null;
        };
        return FSWatcher;
    }(EE));
    var watchOptionsDefaults = {
        encoding: 'utf8',
        persistent: true,
        recursive: false
    };
    var StatWatcher = (function (_super) {
        __extends(StatWatcher, _super);
        function StatWatcher() {
            _super.apply(this, arguments);
            this.last = null;
        }
        StatWatcher.prototype.loop = function () {
            var _this = this;
            stat(this.filename, function (err, stats) {
                if (err)
                    return _this.emit('error', err);
                if (_this.last instanceof Stats) {
                    if (_this.last.atime.getTime() != stats.atime.getTime()) {
                        _this.emit('change', stats, _this.last);
                    }
                }
                _this.last = stats;
            });
        };
        StatWatcher.prototype.start = function (filename, persistent, interval) {
            var _this = this;
            this.filename = filename;
            stat(filename, function (err, stats) {
                if (err)
                    return _this.emit('error', err);
                _this.last = stats;
                _this.interval = setInterval(_this.loop.bind(_this), interval);
            });
        };
        StatWatcher.prototype.stop = function () {
            clearInterval(this.interval);
            this.last = null;
        };
        StatWatcher.map = {};
        return StatWatcher;
    }(EE));
    var watchFileOptionDefaults = {
        persistent: true,
        interval: 5007
    };
    function watchFile(filename, a, b) {
        if (a === void 0) { a = {}; }
        var vfilename = validPathOrThrow(filename);
        vfilename = pathModule.resolve(vfilename);
        var opts;
        var listener;
        if (typeof a !== 'object') {
            opts = watchFileOptionDefaults;
            listener = a;
        }
        else {
            opts = extend(a, watchFileOptionDefaults);
            listener = b;
        }
        if (typeof listener !== 'function')
            throw new Error('"watchFile()" requires a listener function');
        var watcher = StatWatcher.map[vfilename];
        if (!watcher) {
            watcher = new StatWatcher;
            watcher.start(vfilename, opts.persistent, opts.interval);
            StatWatcher.map[vfilename] = watcher;
        }
        watcher.on('change', listener);
        return watcher;
    }
    function unwatchFile(filename, listener) {
        var vfilename = validPathOrThrow(filename);
        vfilename = pathModule.resolve(vfilename);
        var watcher = StatWatcher.map[vfilename];
        if (!watcher)
            return;
        if (typeof listener === 'function')
            watcher.removeListener('change', listener);
        else
            watcher.removeAllListeners('change');
        if (watcher.listenerCount('change') === 0) {
            watcher.stop();
            delete StatWatcher.map[vfilename];
        }
    }
    function writeSync(fd, data, a, b, c) {
        validateFd(fd);
        var buf;
        var position;
        if (typeof b === 'number') {
            if (!(data instanceof Buffer))
                throw TypeError('buffer must be instance of Buffer.');
            var offset = a;
            if (typeof offset !== 'number')
                throw TypeError('offset must be an integer');
            var length = b;
            buf = data.slice(offset, offset + length);
            position = c;
        }
        else {
            var encoding = 'utf8';
            if (b) {
                if (typeof b !== 'string')
                    throw TypeError('encoding must be a string');
                encoding = b;
            }
            if (data instanceof Buffer)
                buf = data;
            else if (typeof data === 'string') {
                buf = new Buffer(data, encoding);
            }
            else
                throw TypeError('data must be a Buffer or a string.');
            position = a;
        }
        if (typeof position === 'number') {
            var sres = libjs.lseek(fd, position, 0);
            if (sres < 0)
                throwError(sres, 'write:lseek');
        }
        var res = libjs.write(fd, buf);
        if (res < 0)
            throwError(res, 'write');
    }
    return {
        flags: flags,
        F_OK: F_OK,
        R_OK: R_OK,
        W_OK: W_OK,
        X_OK: X_OK,
        accessSync: accessSync,
        appendFileSync: appendFileSync,
        chmodSync: chmodSync,
        chownSync: chownSync,
        closeSync: closeSync,
        existsSync: existsSync,
        fchmodSync: fchmodSync,
        fchownSync: fchownSync,
        fdatasyncSync: fdatasyncSync,
        fstatSync: fstatSync,
        fsyncSync: fsyncSync,
        ftruncateSync: ftruncateSync,
        lchownSync: lchownSync,
        linkSync: linkSync,
        lstatSync: lstatSync,
        mkdtempSync: mkdtempSync,
        mkdirSync: mkdirSync,
        openSync: openSync,
        readFileSync: readFileSync,
        readlinkSync: readlinkSync,
        symlinkSync: symlinkSync,
        statSync: statSync,
        truncateSync: truncateSync,
        renameSync: renameSync,
        readSync: readSync,
        writeSync: writeSync,
        unlinkSync: unlinkSync,
        rmdirSync: rmdirSync,
        open: open,
        stat: stat,
        readFile: readFile
    };
}
exports.build = build;
