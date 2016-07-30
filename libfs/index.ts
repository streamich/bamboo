import * as libjs from '../libjs/index';
import {Inotify, IInotifyEvent} from '../libaio/inotify';
var extend = require('../lib/util').extend;


if(__DEBUG__) {
    exports.isFullJS = true;
}


// Included only in type space for type declaration:
// import * as path from 'path';
import {EventEmitter} from 'events';
// import {Readable} from "stream";
// import {Writable} from "stream";


//     interface ObjectConstructor {
//         assign(...args: any[]): any;
//     }
//
//      extend = Object.assign;

// function extend(a, b) {
//     for(var i in b) a[i] = b[i];
//     return a;
// }

function noop(...args: any[]);
function noop() {}


export type Tfile = number|string|Buffer|StaticBuffer;
export type Tpath = string|Buffer|StaticBuffer;
export type Tdata = string|Buffer|StaticBuffer;


function formatError(errno, func = '', path = '', path2 = '') {
    switch(-errno) {
        case libjs.ERROR.ENOENT:    return `ENOENT: no such file or directory, ${func} '${path}'`;
        case libjs.ERROR.EBADF:     return `EBADF: bad file descriptor, ${func}`;
        case libjs.ERROR.EINVAL:    return `EINVAL: invalid argument, ${func}`;
        case libjs.ERROR.EPERM:     return `EPERM: operation not permitted, ${func} '${path}' -> '${path2}'`;
        case libjs.ERROR.EPROTO:    return `EPROTO: protocol error, ${func} '${path}' -> '${path2}'`;
        case libjs.ERROR.EEXIST:    return `EEXIST: file already exists, ${func} '${path}' -> '${path2}'`;
        default:                    return `Error occurred in ${func}: errno = ${errno}`;
    }
}

function throwError(errno, func = '', path = '', path2 = '') {
    throw Error(formatError(errno, func, path, path2));
}

function pathOrError(path: Tpath): string|TypeError {
    if(path instanceof Buffer) path = path.toString();
    if(typeof path !== 'string') return TypeError(ERRSTR.PATH_STR);
    return path as string;
}

function validPathOrThrow(path: Tpath): string {
    var p = pathOrError(path);
    if(p instanceof TypeError) throw p;
    else return p;
}

function validateFd(fd: number) {
    if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
}


// List of file `flags` as defined by node.
export enum flags {
    // Open file for reading. An exception occurs if the file does not exist.
    r       = libjs.FLAG.O_RDONLY,
    // Open file for reading and writing. An exception occurs if the file does not exist.
    'r+'    = libjs.FLAG.O_RDWR,
    // Open file for reading in synchronous mode. Instructs the operating system to bypass the local file system cache.
    rs      = libjs.FLAG.O_RDONLY | libjs.FLAG.O_DIRECT | libjs.FLAG.O_SYNC,
    // Open file for reading and writing, telling the OS to open it synchronously. See notes for 'rs' about using this with caution.
    'rs+'   = libjs.FLAG.O_RDWR | libjs.FLAG.O_DIRECT | libjs.FLAG.O_SYNC,
    // Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
    w       = libjs.FLAG.O_WRONLY | libjs.FLAG.O_CREAT | libjs.FLAG.O_TRUNC,
    // Like 'w' but fails if path exists.
    wx      = libjs.FLAG.O_WRONLY | libjs.FLAG.O_CREAT | libjs.FLAG.O_TRUNC | libjs.FLAG.O_EXCL,
    // Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
    'w+'    = libjs.FLAG.O_RDWR | libjs.FLAG.O_CREAT | libjs.FLAG.O_TRUNC,
    // Like 'w+' but fails if path exists.
    'wx+'   = libjs.FLAG.O_RDWR | libjs.FLAG.O_CREAT | libjs.FLAG.O_TRUNC | libjs.FLAG.O_EXCL,
    // Open file for appending. The file is created if it does not exist.
    a       = libjs.FLAG.O_WRONLY | libjs.FLAG.O_APPEND | libjs.FLAG.O_CREAT,
    // Like 'a' but fails if path exists.
    ax      = libjs.FLAG.O_WRONLY | libjs.FLAG.O_APPEND | libjs.FLAG.O_CREAT | libjs.FLAG.O_EXCL,
    // Open file for reading and appending. The file is created if it does not exist.
    'a+'    = libjs.FLAG.O_RDWR | libjs.FLAG.O_APPEND | libjs.FLAG.O_CREAT,
    // Like 'a+' but fails if path exists.
    'ax+'   = libjs.FLAG.O_RDWR | libjs.FLAG.O_APPEND | libjs.FLAG.O_CREAT | libjs.FLAG.O_EXCL,
}

// Default mode for opening files.
const enum MODE {
    FILE = 0o666,
    DIR = 0o777,
}

// Chunk size for reading files.
const CHUNK = 4096;


const F_OK = libjs.AMODE.F_OK;
const R_OK = libjs.AMODE.R_OK;
const W_OK = libjs.AMODE.W_OK;
const X_OK = libjs.AMODE.X_OK;


export interface IFileOptions {
    encoding?: string;
    mode?: number;
    flag?: string;
}

var appendFileDefaults: IFileOptions = {
    encoding: 'utf8',
    mode: MODE.FILE,
    flag: 'a',
};


const ERRSTR = {
    PATH_STR:       'path must be a string',
    FD:             'fd must be a file descriptor',
    MODE_INT:       'mode must be an integer',
    CB:             'callback must be a function',
    UID:            'uid must be an unsigned int',
    GID:            'gid must be an unsigned int',
    LEN:            'len must be an integer',
    ATIME:          'atime must be an integer',
    MTIME:          'mtime must be an integer',
    PREFIX:         'filename prefix is required',
};
const ERRSTR_OPTS = tipeof => `Expected options to be either an object or a string, but got ${tipeof} instead`;


function flagsToFlagsValue(f: string|number) {
    if(typeof f === 'number') return flags;
    if(typeof f !== 'string') throw TypeError(`flags must be string or number`);
    var flagsval = flags[f];
    if(typeof flagsval !== 'number') throw TypeError(`Invalid flags string value '${f}'`);
    return flagsval;
}


export interface IReadStreamOptions {
    flags: string;
    encoding: string;
    fd: number;
    mode: number;
    autoClose: boolean;
    start: number;
    end: number;
}


export interface IOptions {
    encoding?: string;
}

const optionsDefaults: IOptions = {
    encoding: 'utf8',
};


export interface IReadFileOptions extends IOptions {
    flag?: string;
}

export interface IWatchOptions extends IOptions {
    /* Both of these options are actually redundant, as `inotify(7)` on Linux
     * does not support recursive watching and we cannot implement `persistent=false`
     * from JavaScript as we don't know how many callbacks are the in the event loop. */
    persistent?: boolean;
    recursive?: boolean;
}

export interface IWatchFileOptions {

    // TODO: `persistent` option is not supported yet, always `true`, any
    // TODO: idea how to make it work in Node.js in pure JavaScript?
    persistent?: boolean;
    interval?: number;
}

export class Stats {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;

    isFile(): boolean {
        return (this.mode & libjs.S.IFREG) == libjs.S.IFREG;
    }
    isDirectory(): boolean {
        return (this.mode & libjs.S.IFDIR) == libjs.S.IFDIR;
    }
    isBlockDevice(): boolean {
        return (this.mode & libjs.S.IFBLK) == libjs.S.IFBLK;
    }
    isCharacterDevice(): boolean {
        return (this.mode & libjs.S.IFCHR) == libjs.S.IFCHR;
    }
    isSymbolicLink(): boolean {
        return (this.mode & libjs.S.IFLNK) == libjs.S.IFLNK;
    }
    isFIFO(): boolean {
        return (this.mode & libjs.S.IFIFO) == libjs.S.IFIFO;
    }
    isSocket(): boolean {
        return (this.mode & libjs.S.IFSOCK) == libjs.S.IFSOCK;
    }
}


export function build(deps) {
    var {path: pathModule, EventEmitter: _EE, Buffer, StaticBuffer, Readable, Writable} = deps;
    var EE: typeof EventEmitter = _EE as typeof EventEmitter;


    function accessSync(path: Tpath, mode: number = F_OK): void {
        var vpath = validPathOrThrow(path);
        var res = libjs.access(vpath, mode);
        if(res < 0) throwError(res, 'access', vpath);
    }
    function access(path: string|Buffer, callback: TcallbackData <void>);
    function access(path: string|Buffer, mode: number, callback: TcallbackData <void>);
    function access(path: string|Buffer, a: number|TcallbackData <void>, b?: TcallbackData <void>) {
        var mode: number, callback: TcallbackData <void>;

        if(typeof a === 'function') {
            callback = a as TcallbackData <void>;
            mode = F_OK;
        } else {
            mode = a as number;
            callback = b;

            if(typeof callback !== 'function')
                throw TypeError(ERRSTR.CB);
        }

        var vpath = pathOrError(path);
        if(vpath instanceof TypeError)
            return callback(vpath);

        libjs.accessAsync(vpath as string, mode, function(res) {
            if(res < 0) callback(Error(formatError(res, 'access', vpath as string)));
            else callback(null);
        });
    }


    function appendFileSync(file: Tfile, data: Tdata, options?: IFileOptions) {
        if(!options) options = appendFileDefaults;
        else {
            var tipof = typeof options;
            switch(tipof) {
                case 'object':
                    options = extend({}, appendFileDefaults, options);
                    break;
                case 'string':
                    options = extend({encoding: options as string}, appendFileDefaults);
                    break;
                default:
                    throw TypeError(ERRSTR_OPTS(tipof));
            }
        }

        var b: Buffer;
        if(Buffer.isBuffer(data)) b = data as Buffer;
        else b = new Buffer(String(data), options.encoding);
        var sb = StaticBuffer.isStaticBuffer(b) ? b : StaticBuffer.from(b);

        var fd: number;
        var is_fd = typeof file === 'number';
        if(is_fd) {
            // TODO: If user provides file descriptor that is read-only, what do we do?
            fd = file as number;
        } else {
            var filename: string;
            if(Buffer.isBuffer(file)) filename = file.toString();
            else if(typeof file === 'string') filename = file as string;
            else throw TypeError(ERRSTR.PATH_STR);

            var flags = flagsToFlagsValue(options.flag);
            if(typeof options.mode !== 'number')
                throw TypeError(ERRSTR.MODE_INT);

            fd = libjs.open(filename, flags, options.mode);
            if(fd < 0) throwError(fd, 'appendFile', filename);
        }

        var res = libjs.write(fd, sb);
        if(res < 0) throwError(res, 'appendFile', String(file));

        // Close fd only if WE opened it.
        if(!is_fd) libjs.close(fd);
    }
    function appendFile(file: Tfile, data: Tdata, callback: TcallbackData <void>);
    function appendFile(file: Tfile, data: Tdata, options: IFileOptions, callback: TcallbackData <void>);
    function appendFile(file: Tfile, data: Tdata, options: IFileOptions|TcallbackData <void>, callback?: TcallbackData <void>) {
        var opts: IFileOptions;
        if(typeof options === 'function') {
            callback = options as any as TcallbackData <void>;
            opts = appendFileDefaults;
        } else {
            var tipof = typeof options;
            switch(tipof) {
                case 'object':
                    opts = extend({}, appendFileDefaults, options);
                    break;
                case 'string':
                    opts = extend({encoding: options as string}, appendFileDefaults);
                    break;
                default:
                    throw TypeError(ERRSTR_OPTS(tipof));
            }

            if(typeof callback !== 'function')
                throw TypeError(ERRSTR.CB);
        }

        var b: Buffer;
        if(Buffer.isBuffer(data)) b = data as Buffer;
        else b = new Buffer(String(data), opts.encoding);
        var sb = StaticBuffer.isStaticBuffer(b) ? b : StaticBuffer.from(b);

        function on_open(fd, is_fd) {
            var res = libjs.write(fd, sb);
            if(res < 0) throwError(res, 'appendFile', String(file));

            // Close fd only if WE opened it.
            if(!is_fd) libjs.closeAsync(fd, noop);
        }

        var fd: number;
        var is_fd = typeof file === 'number';
        if(is_fd) {
            // TODO: If user provides file descriptor that is read-only, what do we do?
            fd = file as number;
            on_open(fd, is_fd);
        } else {
            var filename: string;
            if(Buffer.isBuffer(file)) filename = file.toString();
            else if(typeof file === 'string') filename = file as string;
            else throw TypeError(ERRSTR.PATH_STR);

            var flags = flagsToFlagsValue(opts.flag);
            if(typeof opts.mode !== 'number')
                throw TypeError(ERRSTR.MODE_INT);

            libjs.openAsync(filename, flags, opts.mode, (fd) => {
                if(fd < 0) return callback(Error(formatError(fd, 'appendFile', filename)));
                on_open(fd, is_fd);
            });
        }
    }


    function chmodSync(path: Tpath, mode: number) {
        var vpath = validPathOrThrow(path);
        if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
        var result = libjs.chmod(vpath, mode);
        if(result < 0) throwError(result, 'chmod', vpath);
    }
    function chmod(path: Tpath, mode: number, callback: TcallbackData <void>) {
        var vpath = validPathOrThrow(path);
        if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
        libjs.chmodAsync(vpath, mode, (result) => {
            if(result < 0) callback(Error(formatError(result, 'chmod', vpath)));
            else callback(null);
        });
    }


    function fchmodSync(fd: number, mode: number) {
        validateFd(fd);
        if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
        var result = libjs.fchmod(fd, mode);
        if(result < 0) throwError(result, 'chmod');
    }
    function fchmod(fd: number, mode: number, callback: TcallbackData <void>) {
        validateFd(fd);
        if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
        libjs.fchmodAsync(fd, mode, (result) => {
            if(result < 0) callback(Error(formatError(result, 'chmod')));
            else callback(null);
        });
    }


    // Mac OS only:
    //     function lchmodSync(path: string|Buffer, mode: number) {}


    function chownSync(path: Tpath, uid: number, gid: number) {
        var vpath = validPathOrThrow(path);
        if(typeof uid !== 'number') throw TypeError(ERRSTR.UID);
        if(typeof gid !== 'number') throw TypeError(ERRSTR.GID);
        var result = libjs.chown(vpath, uid, gid);
        if(result < 0) throwError(result, 'chown', vpath);
    }
    function chown(path: Tpath, uid: number, gid: number, callback: TcallbackData <void>) {
        var vpath = validPathOrThrow(path);
        if(typeof uid !== 'number') throw TypeError(ERRSTR.UID);
        if(typeof gid !== 'number') throw TypeError(ERRSTR.GID);
        libjs.chownAsync(vpath, uid, gid, result => {
            if(result < 0) callback(Error(formatError(result, 'chown', vpath)));
            else callback(null);
        });
    }

    function fchownSync(fd: number, uid: number, gid: number) {
        validateFd(fd);
        if(typeof uid !== 'number') throw TypeError(ERRSTR.UID);
        if(typeof gid !== 'number') throw TypeError(ERRSTR.GID);
        var result = libjs.fchown(fd, uid, gid);
        if(result < 0) throwError(result, 'fchown');
    }
    function fchown(fd: number, uid: number, gid: number, callback: TcallbackData <void>) {
        validateFd(fd);
        if(typeof uid !== 'number') throw TypeError(ERRSTR.UID);
        if(typeof gid !== 'number') throw TypeError(ERRSTR.GID);
        libjs.fchownAsync(fd, uid, gid, result => {
            if(result < 0) callback(Error(formatError(result, 'fchown')));
            else callback(null);
        });
    }

    function lchownSync(path: Tpath, uid: number, gid: number) {
        var vpath = validPathOrThrow(path);
        if(typeof uid !== 'number') throw TypeError(ERRSTR.UID);
        if(typeof gid !== 'number') throw TypeError(ERRSTR.GID);
        var result = libjs.lchown(vpath, uid, gid);
        if(result < 0) throwError(result, 'lchown', vpath);
    }
    function lchown(path: Tpath, uid: number, gid: number, callback: TcallbackData <void>) {
        var vpath = validPathOrThrow(path);
        if(typeof uid !== 'number') throw TypeError(ERRSTR.UID);
        if(typeof gid !== 'number') throw TypeError(ERRSTR.GID);
        libjs.lchownAsync(vpath, uid, gid, result => {
            if(result < 0) callback(Error(formatError(result, 'lchown', vpath)));
            else callback(null);
        });
    }


    function closeSync(fd: number) {
        if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
        var result = libjs.close(fd);
        if(result < 0) throwError(result, 'close');
    }
    function close(fd: number, callback: TcallbackData <void>) {
        if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
        libjs.closeAsync(fd, result => {
            if(result < 0) callback(Error(formatError(result, 'close')));
            else callback(null);
        });
    }


    function existsSync(path: Tpath): boolean {
        // console.log('Deprecated fs.existsSync(): Use fs.statSync() or fs.accessSync() instead.');
        try {
            accessSync(path);
            return true;
        } catch(e) {
            return false;
        }
    }
    function exists(path: Tpath, callback: (exists: boolean) => void) {
        access(path, err => { callback(!err); });
    }


    function fsyncSync(fd: number) {
        if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
        var result = libjs.fsync(fd);
        if(result < 0) throwError(result, 'fsync');
    }
    function fsync(fd: number, callback: TcallbackData <void>) {
        if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
        libjs.fsyncAsync(fd, result => {
            if(result < 0) callback(Error(formatError(result, 'fsync')));
            else callback(null);
        });
    }


    function fdatasyncSync(fd: number) {
        if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
        var result = libjs.fdatasync(fd);
        if(result < 0) throwError(result, 'fdatasync');
    }
    function fdatasync(fd: number, callback: TcallbackData <void>) {
        if(typeof fd !== 'number') throw TypeError(ERRSTR.FD);
        libjs.fdatasyncAsync(fd, result => {
            if(result < 0) callback(Error(formatError(result, 'fdatasync')));
            else callback(null);
        });
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


    function statSync(path: Tpath): Stats {
        var vpath = validPathOrThrow(path);
        try {
            var res = libjs.stat(vpath);
            return createStatsObject(res);
        } catch(errno) {
            throwError(errno, 'stat', vpath);
        }
    }
    function stat(path: string|Buffer, callback: TcallbackData <Stats>) {
        var vpath = validPathOrThrow(path);
        libjs.statAsync(vpath, (err, res) => {
            if(err) callback(Error(formatError(err, 'stat', vpath)));
            else callback(null, createStatsObject(res));
        });
    }

    function fstatSync(fd: number): Stats {
        validateFd(fd);
        try {
            var res = libjs.fstat(fd);
            return createStatsObject(res);
        } catch(errno) {
            throwError(errno, 'fstat');
        }
    }
    function fstat(fd: number, callback: TcallbackData <Stats>) {
        validateFd(fd);
        libjs.fstatAsync(fd, (err, res) => {
            if(err) callback(Error(formatError(err, 'fstat')));
            else callback(null, createStatsObject(res));
        });
    }

    function lstatSync(path: Tpath): Stats {
        var vpath = validPathOrThrow(path);
        try {
            var res = libjs.lstat(vpath);
            return createStatsObject(res);
        } catch(errno) {
            throwError(errno, 'lstat', vpath);
        }
    }
    function lstat(path: Tpath, callback: TcallbackData <Stats>) {
        var vpath = validPathOrThrow(path);
        libjs.lstatAsync(vpath, (err, res) => {
            if(err) callback(Error(formatError(err, 'lstat', vpath)));
            else callback(null, createStatsObject(res));
        });
    }


    function truncateSync(path: Tpath, len: number) {
        var vpath = validPathOrThrow(path);
        if(typeof len !== 'number') throw TypeError(ERRSTR.LEN);
        var res = libjs.truncate(vpath, len);
        if(res < 0) throwError(res, 'truncate', vpath);
    }
    function truncate(path: Tpath, len: number, callback: TcallbackData <void>) {
        var vpath = validPathOrThrow(path);
        if(typeof len !== 'number') throw TypeError(ERRSTR.LEN);
        libjs.truncateAsync(vpath, len, res => {
            if(res < 0) callback(Error(formatError(res, 'truncate', vpath)));
            else callback(null);
        });
    }

    function ftruncateSync(fd: number, len: number) {
        validateFd(fd);
        if(typeof len !== 'number') throw TypeError(ERRSTR.LEN);
        var res = libjs.ftruncate(fd, len);
        if(res < 0) throwError(res, 'ftruncate');
    }
    function ftruncate(fd: number, len: number, callback: TcallbackData <void>) {
        validateFd(fd);
        if(typeof len !== 'number') throw TypeError(ERRSTR.LEN);
        libjs.ftruncateAsync(fd, len, res => {
            if(res < 0) callback(Error(formatError(res, 'ftruncate')));
            else callback(null);
        });
    }


    //     TODO: Make this work with `utimes` instead of `utime`, also figure out a way
    //     TODO: how to set time using file descriptor, possibly use `utimensat` system call.
    function utimesSync(path: Tpath, atime: number, mtime: number) {
        var vpath = validPathOrThrow(path);
        // if(typeof atime === 'string') atime = parseInt(atime as string);
        // if(typeof mtime === 'string') mtime = parseInt(mtime as string);
        if(typeof atime !== 'number') throw TypeError(ERRSTR.ATIME);
        if(typeof mtime !== 'number') throw TypeError(ERRSTR.MTIME);

        var vatime = atime as number;
        var vmtime = mtime as number;

        // if(!Number.isFinite(atime)) atime = Date.now();
        // if(!Number.isFinite(mtime)) mtime = Date.now();
        if(!isFinite(vatime)) vatime = Date.now();
        if(!isFinite(vmtime)) vmtime = Date.now();

        // `libjs.utime` works with 1 sec precision.
        vatime = Math.round(vatime as number / 1000);
        vmtime = Math.round(vmtime as number / 1000);

        var times: libjs.utimbuf = {
            actime:     [libjs.UInt64.lo(vatime), libjs.UInt64.hi(vatime)],
            modtime:    [libjs.UInt64.lo(vmtime), libjs.UInt64.hi(vmtime)],
        };
        var res = libjs.utime(vpath, times);
        if(res < 0) throwError(res, 'utimes', vpath);
    }
    function utimes(path: Tpath, atime: number, mtime: number, callback: TcallbackData <void>) {
        var vpath = validPathOrThrow(path);
        // if(typeof atime === 'string') atime = parseInt(atime as string);
        // if(typeof mtime === 'string') mtime = parseInt(mtime as string);
        if(typeof atime !== 'number') throw TypeError(ERRSTR.ATIME);
        if(typeof mtime !== 'number') throw TypeError(ERRSTR.MTIME);

        var vatime = atime as number;
        var vmtime = mtime as number;

        // if(!Number.isFinite(atime)) atime = Date.now();
        // if(!Number.isFinite(mtime)) mtime = Date.now();
        if(!isFinite(vatime)) vatime = Date.now();
        if(!isFinite(vmtime)) vmtime = Date.now();

        // `libjs.utime` works with 1 sec precision.
        vatime = Math.round(vatime as number / 1000);
        vmtime = Math.round(vmtime as number / 1000);

        var times: libjs.utimbuf = {
            actime:     [libjs.UInt64.lo(vatime), libjs.UInt64.hi(vatime)],
            modtime:    [libjs.UInt64.lo(vmtime), libjs.UInt64.hi(vmtime)],
        };
        libjs.utimeAsync(vpath, times, res => {
            if(res < 0) callback(Error(formatError(res, 'utimes', vpath)));
            else callback(null);
        });
    }

// function futimesSync(fd: number, atime: number|string, mtime: number|string) {}


    function linkSync(srcpath: Tpath, dstpath: Tpath) {
        var vsrcpath = validPathOrThrow(srcpath);
        var vdstpath = validPathOrThrow(dstpath);
        var res = libjs.link(vsrcpath, vdstpath);
        if(res < 0) throwError(res, 'link', vsrcpath, vdstpath);
    }
    function link(srcpath: Tpath, dstpath: Tpath, callback: TcallbackData <void>) {
        var vsrcpath = validPathOrThrow(srcpath);
        var vdstpath = validPathOrThrow(dstpath);
        libjs.linkAsync(vsrcpath, vdstpath, res => {
            if(res < 0) callback(Error(formatError(res, 'link', vsrcpath, vdstpath)));
            else callback(null);
        });
    }


    function mkdirSync(path: Tpath, mode: number = MODE.DIR) {
        var vpath = validPathOrThrow(path);
        if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
        var res = libjs.mkdir(vpath, mode);
        if(res < 0) throwError(res, 'mkdir', vpath);
    }
    function mkdir(path: Tpath, mode: number = MODE.DIR, callback?: TcallbackData <void>) {
        var vpath = validPathOrThrow(path);

        if(typeof mode === 'function') {
            callback = mode as any as TcallbackData <void>;
            mode = MODE.DIR;
        } else {
            if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
            if(typeof callback !== 'function') throw TypeError(ERRSTR.CB);
        }

        libjs.mkdirAsync(vpath, mode, res => {
            if(res < 0) callback(Error(formatError(res, 'mkdir', vpath)));
            else callback(null);
        });
    }


    function rndStr6() {
        return (+new Date).toString(36).slice(-6);
    }

    function mkdtempSync(prefix: string): string {
        if (!prefix || typeof prefix !== 'string')
            throw new TypeError(ERRSTR.PREFIX);

        var retries = 10;
        var fullname: string;
        var found_tmp_name = false;
        for(var i = 0; i < retries; i++) {
            fullname = prefix + rndStr6();
            try {
                accessSync(fullname);
            } catch(e) {
                found_tmp_name = true;
                break;
            }
        }

        if(found_tmp_name) {
            mkdirSync(fullname);
            return fullname;
        } else {
            throw Error(`Could not find a new name, mkdtemp`);
        }
    }
    function mkdtemp(prefix: string, callback: TcallbackData <string>) {
        if (!prefix || typeof prefix !== 'string')
            throw new TypeError(ERRSTR.PREFIX);

        var retries = 10;
        var fullname: string;

        function mk_dir() {
            mkdir(fullname, err => {
                if(err) callback(err);
                else callback(null, fullname);
            });
        }

        function name_loop() {
            if(retries < 1) {
                callback(Error('Could not find a new name, mkdtemp'));
                return;
            }

            retries--;
            fullname = prefix + rndStr6();

            access(fullname, err => {
                if(err) name_loop();
                else mk_dir();
            });
        }
        name_loop();
    }



    function openSync(path: string|Buffer, flags: string|number, mode: number = MODE.FILE): number {
        var vpath = validPathOrThrow(path);
        var flagsval = flagsToFlagsValue(flags);
        if(typeof mode !== 'number') throw TypeError(ERRSTR.MODE_INT);
        var res = libjs.open(vpath, flagsval, mode);
        if(res < 0) throwError(res, 'open', vpath);
        return res;
    }

    function open(path: string|Buffer, flags: string|number, mode: number, callback?: TcallbackData <number>) {
        if(typeof mode === 'function') {
            callback = mode as any as TcallbackData <number>;
            mode = MODE.FILE;
        }

        try {
            var vpath = validPathOrThrow(path);
            var flagsval = flagsToFlagsValue(flags);
        } catch(error) {
            callback(error);
            return;
        }

        if(typeof mode !== 'number')
            return callback(TypeError(ERRSTR.MODE_INT));

        libjs.openAsync(vpath, flagsval, mode, function(res) {
            if(res < 0) callback(Error(formatError(res, 'open', vpath)));
            return callback(null, res);
        });
    }


    function readSync(fd: number, buffer: Buffer|StaticBuffer, offset: number, length: number, position: number) {
        validateFd(fd);
        if(!(buffer instanceof Buffer)) throw TypeError('buffer must be an instance of Buffer');
        if(typeof offset !== 'number') throw TypeError('offset must be an integer');
        if(typeof length !== 'number') throw TypeError('length must be an integer');

        if(position !== null)  {
            if(typeof position !== 'number') throw TypeError('position must be an integer');
            var seekres = libjs.lseek(fd, position, libjs.SEEK.SET);
            if(seekres < 0) throwError(seekres, 'read');
        }

        var buf = buffer.slice(offset, offset + length);
        var res = libjs.read(fd, buf);
        if(res < 0) throwError(res, 'read');
        return res;
    }


    function readdirSync(path: string|Buffer, options: IOptions = {}) {
        var vpath = validPathOrThrow(path);
        options = extend(options, optionsDefaults);
        return libjs.readdirList(vpath, options.encoding);
    }



    var readFileOptionsDefaults: IReadFileOptions = {
        flag: 'r',
    };

    function readFileSync(file: string|Buffer|number, options: IReadFileOptions|string = {}): string|Buffer {
        var opts: IReadFileOptions;
        if(typeof options === 'string') opts = extend({encoding: options}, readFileOptionsDefaults);
        else if(typeof options !== 'object') throw TypeError('Invalid options');
        else opts = extend(options, readFileOptionsDefaults);
        if(opts.encoding && (typeof opts.encoding != 'string')) throw TypeError('Invalid encoding');

        var fd: number;
        if(typeof file === 'number') fd = file as number;
        else {
            var vfile = validPathOrThrow(file as string|Buffer);
            var flag = flags[opts.flag];
            fd = libjs.open(vfile, flag, MODE.FILE);
            if(fd < 0) throwError(fd, 'readFile', vfile);
        }

        var list: Buffer[] = [];

        do {
            var buf = new Buffer(CHUNK);
            var res = libjs.read(fd, buf);
            if (res < 0) throwError(res, 'readFile');

            if(res < CHUNK) buf = buf.slice(0, res);
            list.push(buf);
        } while(res > 0);

        libjs.close(fd);

        var buffer = Buffer.concat(list);
        if(opts.encoding) return buffer.toString(opts.encoding);
        else return buffer;
    }

    function readFile(file: string|Buffer|number, options: IReadFileOptions|string = {}, callback?: TcallbackData <string|Buffer>) {
        var opts: IReadFileOptions;

        if(typeof options === 'function') {
            callback = options as any as TcallbackData <string|Buffer>;
            opts = readFileOptionsDefaults;
        } else {
            if(typeof options === 'string') opts = extend({encoding: options}, readFileOptionsDefaults);
            else if(typeof options !== 'object')
                return callback(TypeError('Invalid options'));
            else opts = extend(options, readFileOptionsDefaults);

            if(opts.encoding && (typeof opts.encoding != 'string'))
                return callback(TypeError('Invalid encoding'));
        }

        function on_open(fd: number) {
            var list: Buffer[] = [];

            function done() {
                libjs.closeAsync(fd,  function() {
                    var buffer = Buffer.concat(list);
                    if(opts.encoding) callback(null, buffer.toString(opts.encoding));
                    else callback(null, buffer);
                });
            }

            function loop() {
                var buf = new StaticBuffer(CHUNK);
                libjs.readAsync(fd, buf, function(res) {
                    if(res < 0) return callback(Error(formatError(res, 'readFile')));

                    if(res < CHUNK) buf = buf.slice(0, res);
                    list.push(buf);

                    if(res > 0) loop();
                    else done();
                });
            }
            loop();
        }

        // Here we open file.
        if(typeof file === 'number') on_open(file as number);
        else {
            var vfile = pathOrError(file as string|Buffer);
            if(vfile instanceof TypeError) return callback(vfile);

            var flag = flags[opts.flag];
            libjs.openAsync(vfile as string, flag, MODE.FILE, function(fd) {
                if(fd < 0) callback(Error(formatError(fd, 'readFile', vfile as string)));
                else on_open(fd);
            });
        }
    }


    function readlinkSync(path: string, options: IOptions|string = null): string|Buffer {
        path = validPathOrThrow(path);
        var buf = new Buffer(64);
        var res = libjs.readlink(path, buf);
        if(res < 0) throwError(res, 'readlink', path);

        var encoding = 'buffer';
        if(options) {
            if(typeof options === 'string') encoding = options;
            else if(typeof options === 'object') {
                if(typeof options.encoding != 'string') throw TypeError('Encoding must be string.');
                else encoding = options.encoding;
            } else throw TypeError('Invalid options.');
        }

        buf = buf.slice(0, res);
        return encoding == 'buffer' ? buf : buf.toString(encoding);
    }


    function renameSync(oldPath: string|Buffer, newPath: string|Buffer) {
        var voldPath = validPathOrThrow(oldPath);
        var vnewPath = validPathOrThrow(newPath);
        var res = libjs.rename(voldPath, vnewPath);
        if(res < 0) throwError(res, 'rename', voldPath, vnewPath);
    }


    function rmdirSync(path: string|Buffer) {
        var vpath = validPathOrThrow(path);
        var res = libjs.rmdir(vpath);
        if(res < 0) throwError(res, 'rmdir', vpath);
    }


    function symlinkSync(target: string|Buffer, path: string|Buffer/*, type?: string*/) {
        var vtarget = validPathOrThrow(target);
        var vpath = validPathOrThrow(path);
        // > The type argument [..] is only available on Windows (ignored on other platforms)
        /* type = typeof type === 'string' ? type : null; */
        var res = libjs.symlink(vtarget, vpath);
        if(res < 0) throwError(res, 'symlink', vtarget, vpath);
    }


    function unlinkSync(path: string|Buffer) {
        var vpath = validPathOrThrow(path);
        var res = libjs.unlink(vpath);
        if(res < 0) throwError(res, 'unlink', vpath);
    }





    // var readStreamOptionsDefaults: IReadStreamOptions = {
    //     flags: 'r',
    //     encoding: null,
    //     fd: null,
    //     mode: MODE.FILE,
    //     autoClose: true,
    // };

    // function createReadStream(path: string|Buffer, options: IReadStreamOptions|string = {}) {
    //     options = extend(options, readStreamOptionsDefaults);
    // }


    function createWriteStream(path, options) {}


    class FSWatcher extends EE {

        inotify = new Inotify;

        start(filename: string, persistent: boolean, recursive: boolean, encoding: string) {
            this.inotify.encoding = encoding;
            this.inotify.onerror = noop;
            this.inotify.onevent = (event: IInotifyEvent) => {
                var is_rename = (event.mask & libjs.IN.MOVE) || (event.mask & libjs.IN.CREATE);
                if(is_rename) {
                    this.emit('change', 'rename', event.name);
                } else {
                    this.emit('change', 'change', event.name);
                }
            };
            this.inotify.start();
            this.inotify.addPath(filename);
        }

        close() {
            this.inotify.stop();
            this.inotify = null;
        }
    }

    type CwatchListener = (event: string, filename: string) => void;

    var watchOptionsDefaults = {
        encoding: 'utf8',
        persistent: true,
        recursive: false,
    };

    // Phew, lucky us:
    //
    // > The recursive option is only supported on OS X and Windows.
    /*    function watch(filename: string|Buffer, options: string|IWatchOptions, listener?: CwatchListener) {
     var vfilename = validPathOrThrow(filename);
     vfilename = pathModule.resolve(vfilename);

     var otps: IWatchOptions;
     if(options) {
     if(typeof options === 'function') {
     listener = options as any as CwatchListener;
     otps = watchOptionsDefaults;
     } else if (typeof options === 'string') {
     otps = extend({encoding: options}, watchOptionsDefaults) as IWatchOptions;
     } else if(typeof options === 'object') {
     otps = extend(options, watchOptionsDefaults) as IWatchOptions;
     } else
     throw TypeError('"options" must be a string or an object');
     } else otps = watchOptionsDefaults;

     const watcher = new FSWatcher;
     watcher.start(vfilename, otps.persistent, otps.recursive, otps.encoding);

     if (listener) {
     if(typeof listener !== 'function')
     throw TypeError('"listener" must be a callback');
     watcher.on('change', listener);
     }

     return watcher;
     }*/


    class StatWatcher extends EE {

        static map = {};

        filename: string;

        interval;

        last: Stats = null;

        protected loop() {
            stat(this.filename, (err, stats) => {
                if(err) return this.emit('error', err);
                if(this.last instanceof Stats) {
                    // > The callback listener will be called each time the file is accessed.
                    if(this.last.atime.getTime() != stats.atime.getTime()) {
                        this.emit('change', stats, this.last);
                    }
                }
                this.last = stats;
            });
        }

        start(filename: string, persistent: boolean, interval: number) {
            this.filename = filename;
            stat(filename, (err, stats) => {
                if(err) return this.emit('error', err);
                this.last = stats;
                this.interval = setInterval(this.loop.bind(this), interval);
            });
        }

        stop() {
            clearInterval(this.interval);
            this.last = null;
        }
    }

    const watchFileOptionDefaults: IWatchFileOptions = {
        persistent: true,
        interval: 5007,
    };

    type TwatchListener = (curr: Stats, prev: Stats) => void;

    function watchFile(filename: string|Buffer, listener: TwatchListener);
    function watchFile(filename: string|Buffer, options: IWatchFileOptions, listener: TwatchListener);
    function watchFile(filename: string|Buffer, a: TwatchListener|IWatchFileOptions = {}, b?: TwatchListener) {
        var vfilename = validPathOrThrow(filename);
        vfilename = pathModule.resolve(vfilename);

        var opts: IWatchFileOptions;
        var listener: TwatchListener;

        if(typeof a !== 'object') {
            opts = watchFileOptionDefaults;
            listener = a as TwatchListener;
        } else {
            opts = extend(a, watchFileOptionDefaults);
            listener = b;
        }

        if(typeof listener !== 'function')
            throw new Error('"watchFile()" requires a listener function');

        var watcher = StatWatcher.map[vfilename];
        if(!watcher) {
            watcher = new StatWatcher;
            watcher.start(vfilename, opts.persistent, opts.interval);
            StatWatcher.map[vfilename] = watcher;
        }

        watcher.on('change', listener);
        return watcher;
    }

    function unwatchFile(filename: string|Buffer, listener?: TwatchListener) {
        var vfilename = validPathOrThrow(filename);
        vfilename = pathModule.resolve(vfilename);

        var watcher = StatWatcher.map[vfilename];
        if(!watcher) return;

        if(typeof listener === 'function') watcher.removeListener('change', listener);
        else watcher.removeAllListeners('change');

        if(watcher.listenerCount('change') === 0) {
            watcher.stop();
            delete StatWatcher.map[vfilename];
        }
    }


    function writeSync(fd: number, buffer: Buffer,       offset: number,     length: number,     position?: number);
    function writeSync(fd: number, data: string|Buffer,  position?: number,  encoding?: string);
    function writeSync(fd: number, data: string|Buffer,  a: number,          b:number|string,    c?: number) {
        validateFd(fd);

        var buf: Buffer;
        var position: number;

        // Check which function definition we are working with.
        if(typeof b === 'number') {
            //     writeSync(fd: number, buffer: Buffer, offset: number, length: number, position?: number);
            if(!(data instanceof Buffer)) throw TypeError('buffer must be instance of Buffer.');

            var offset = a;
            if(typeof offset !== 'number') throw TypeError('offset must be an integer');
            var length = b;
            buf = data.slice(offset, offset + length) as Buffer;

            position = c;
        } else {
            //     writeSync(fd: number, data: string|Buffer, position?: number, encoding: string = 'utf8');
            var encoding: string = 'utf8';
            if(b) {
                if(typeof b !== 'string') throw TypeError('encoding must be a string');
                encoding = b;
            }

            if(data instanceof Buffer) buf = data as Buffer;
            else if(typeof data === 'string') {
                buf = new Buffer(data, encoding);
            } else throw TypeError('data must be a Buffer or a string.');

            position = a;
        }

        if(typeof position === 'number') {
            var sres = libjs.lseek(fd, position, libjs.SEEK.SET);
            if(sres < 0) throwError(sres, 'write:lseek');
        }

        var res = libjs.write(fd, buf);
        if(res < 0) throwError(res, 'write');
    }



    return {
        flags,
        F_OK,
        R_OK,
        W_OK,
        X_OK,


        // Synchronous = blocking
        accessSync,
        appendFileSync,
        chmodSync,
        chownSync,
        closeSync,
        existsSync,
        fchmodSync,
        fchownSync,
        fdatasyncSync,
        fstatSync,
        fsyncSync,
        ftruncateSync,
        utimesSync,
        // futimesSync,
        // lchmodSync,
        lchownSync,
        linkSync,
        lstatSync,
        mkdtempSync,
        mkdirSync,
        openSync,
        // realpathSync,
        readFileSync,
        readlinkSync,
        symlinkSync,
        statSync,
        truncateSync,
        renameSync,
        readSync,
        writeSync,
        // writeFileSync,
        unlinkSync,
        rmdirSync,


        // Asynchronous
        access,
        appendFile,
        chmod,
        fchmod,
        chown,
        fchown,
        lchown,
        close,
        exists,
        fsync,
        fdatasync,
        stat,
        fstat,
        lstat,
        ftruncate,
        truncate,
        utimes,
        link,
        mkdtemp,
        mkdir,

        open,

        readFile,

    };
}
