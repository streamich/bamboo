"use strict";
var typebase_1 = require('../typebase');
exports.PATH_MAX = 4096;
exports.isLE = true;
exports.NULL = 0;
var buf = Buffer.prototype;
exports.int8 = typebase_1.Type.define(1, buf.readInt8, buf.writeInt8);
exports.uint8 = typebase_1.Type.define(1, buf.readUInt8, buf.readUInt8);
exports.int16 = typebase_1.Type.define(2, buf.readInt16LE, buf.writeInt16LE);
exports.uint16 = typebase_1.Type.define(2, buf.readUInt16LE, buf.writeUInt16LE);
exports.int32 = typebase_1.Type.define(4, buf.readInt32LE, buf.writeInt32LE);
exports.uint32 = typebase_1.Type.define(4, buf.readUInt32LE, buf.writeUInt32LE);
exports.int64 = typebase_1.Arr.define(exports.int32, 2);
exports.uint64 = typebase_1.Arr.define(exports.uint32, 2);
exports.size_t = exports.uint64;
exports.time_t = exports.uint64;
exports.pid_t = exports.uint32;
exports.optval_t = exports.int32;
exports.ipv4 = typebase_1.Type.define(4, function (offset) {
    if (offset === void 0) { offset = 0; }
    var buf = this;
    var socket = require('../socket');
    var octets = socket.Ipv4.type.unpack(buf, offset);
    return new socket.Ipv4(octets);
}, function (data, offset) {
    if (offset === void 0) { offset = 0; }
    var buf = this;
    data.toBuffer().copy(buf, offset);
});
exports.pointer_t = exports.uint64;
exports.stat = typebase_1.Struct.define(32 * 4, [
    [0, exports.uint32, 'dev'],
    [2 * 4, exports.uint32, 'ino'],
    [4 * 4, exports.uint32, 'nlink'],
    [6 * 4, exports.int32, 'mode'],
    [7 * 4, exports.int32, 'uid'],
    [8 * 4, exports.int32, 'gid'],
    [10 * 4, exports.uint32, 'rdev'],
    [12 * 4, exports.uint32, 'size'],
    [14 * 4, exports.uint32, 'blksize'],
    [16 * 4, exports.uint32, 'blocks'],
    [18 * 4, exports.uint32, 'atime'],
    [20 * 4, exports.uint32, 'atime_nsec'],
    [22 * 4, exports.uint32, 'mtime'],
    [24 * 4, exports.uint32, 'mtime_nsec'],
    [26 * 4, exports.uint32, 'ctime'],
    [28 * 4, exports.uint32, 'ctime_nsec'],
]);
exports.in_addr = typebase_1.Struct.define(4, [
    [0, exports.ipv4, 's_addr'],
]);
exports.sockaddr_in = typebase_1.Struct.define(16, [
    [0, exports.int16, 'sin_family'],
    [2, exports.uint16, 'sin_port'],
    [4, exports.in_addr, 'sin_addr'],
    [8, typebase_1.Arr.define(exports.int8, 8), 'sin_zero'],
]);
exports.sockaddr = typebase_1.Struct.define(1, [
    [0, 'sa_family', exports.uint16],
    [2, 'sa_data', typebase_1.Arr.define(exports.int8, 14)],
]);
exports.epoll_event = typebase_1.Struct.define(4 + 8, [
    [0, exports.uint32, 'events'],
    [4, exports.uint64, 'data'],
]);
exports.ipc_perm = typebase_1.Struct.define(48, [
    [0, exports.int32, '__key'],
    [4, exports.uint32, 'uid'],
    [8, exports.uint32, 'gid'],
    [12, exports.uint32, 'cuid'],
    [16, exports.uint32, 'cgid'],
    [20, exports.uint16, 'mode'],
    [24, exports.uint16, '__seq'],
]);
exports.shmid_ds = typebase_1.Struct.define(112, [
    [0, exports.ipc_perm, 'shm_perm'],
    [48, exports.size_t, 'shm_segsz'],
    [56, exports.time_t, 'shm_atime'],
    [64, exports.time_t, 'shm_dtime'],
    [72, exports.time_t, 'shm_ctime'],
    [80, exports.pid_t, 'shm_cpid'],
    [84, exports.pid_t, 'shm_lpid'],
    [88, exports.uint64, 'shm_nattch'],
]);
exports.utimbuf = typebase_1.Struct.define(16, [
    [0, exports.uint64, 'actime'],
    [8, exports.uint64, 'modtime'],
]);
exports.timeval = typebase_1.Struct.define(16, [
    [0, exports.uint64, 'tv_sec'],
    [8, exports.uint64, 'tv_nsec'],
]);
exports.timevalarr = typebase_1.Arr.define(exports.timeval, 2);
exports.timespec = exports.timeval;
exports.timespecarr = exports.timevalarr;
exports.linux_dirent64 = typebase_1.Struct.define(19, [
    [0, exports.uint64, 'ino64_t'],
    [8, exports.uint64, 'off64_t'],
    [16, exports.uint16, 'd_reclen'],
    [18, exports.uint8, 'd_type'],
]);
exports.inotify_event = typebase_1.Struct.define(16, [
    [0, exports.int32, 'wd'],
    [4, exports.uint32, 'mask'],
    [8, exports.uint32, 'cookie'],
    [12, exports.uint32, 'len'],
]);
exports.SYS = {
    read: 0,
    write: 1,
    open: 2,
    close: 3,
    stat: 4,
    fstat: 5,
    lstat: 6,
    lseek: 8,
    mmap: 9,
    mprotect: 10,
    munmap: 11,
    brk: 12,
    rt_sigaction: 13,
    rt_sigprocmask: 14,
    rt_sigreturn: 15,
    ioctl: 16,
    pread64: 17,
    pwrite64: 18,
    readv: 19,
    writev: 20,
    access: 21,
    pipe: 22,
    sched_yield: 24,
    mremap: 25,
    msync: 26,
    mincore: 27,
    madvise: 28,
    shmget: 29,
    shmat: 30,
    shmctl: 31,
    dup: 32,
    dup2: 33,
    pause: 34,
    nanosleep: 35,
    getitimer: 36,
    alarm: 37,
    setitimer: 38,
    getpid: 39,
    sendfile: 40,
    socket: 41,
    connect: 42,
    accept: 43,
    sendto: 44,
    recvfrom: 45,
    sendmsg: 46,
    recvmsg: 47,
    shutdown: 48,
    bind: 49,
    listen: 50,
    getsockname: 51,
    getpeername: 52,
    socketpair: 53,
    setsockopt: 54,
    getsockopt: 55,
    shmdt: 67,
    fcntl: 72,
    fsync: 74,
    fdatasync: 75,
    truncate: 76,
    ftruncate: 77,
    getdents: 78,
    getcwd: 79,
    chdir: 80,
    fchdir: 81,
    rename: 82,
    mkdir: 83,
    rmdir: 84,
    creat: 85,
    link: 86,
    unlink: 87,
    symlink: 88,
    readlink: 89,
    chmod: 90,
    fchmod: 91,
    chown: 92,
    fchown: 93,
    lchown: 94,
    umask: 95,
    gettimeofday: 96,
    getrlimit: 97,
    getrusage: 98,
    getuid: 102,
    getgid: 104,
    geteuid: 107,
    getegid: 108,
    setpgid: 109,
    getppid: 110,
    utime: 132,
    epoll_create: 213,
    getdents64: 217,
    epoll_wait: 232,
    epoll_ctl: 233,
    utimes: 235,
    inotify_init: 253,
    inotify_add_watch: 254,
    inotify_rm_watch: 255,
    mkdirat: 258,
    futimesat: 261,
    utimensat: 280,
    accept4: 288,
    epoll_create1: 291,
    inotify_init1: 294
};
