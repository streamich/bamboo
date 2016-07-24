# full.js

**TL;DR**: Node.js clone in pure JavaScript.

Installation:

    npm install -g fulljs

Use it as a *drop-in* replacement for Node.js:

    fulljs script.js
    
See which system calls your app executes:

    DEBUG=libjs:* fulljs script.js
    
`fulljs` is Node.js written in JavaScript. Our goal is to implement
complete Node.js API without any dependencies but just `syscall` function
from [`libsys`](http://www.npmjs.com/package/libsys) package. Meanwhile, until
we have 100% compatibility with Node.js, `fulljs` runs on top of Node.js patching already implemented parts.

Requirements: it runs on Ubuntu 14.04 with Node.js 4.4.4, not tested on other systems.

## API Status

### [`events`](https://nodejs.org/api/events.html)

*Depends on:* Has no dependencies.

Verbatim copy from Node.js

 - [X] `EventEmitter`


### [`process`](https://nodejs.org/api/process.html)

*Depends on:* `process.syscall`, `events`

Extra:

 - [X] `process.syscall(number, ...args): number`
 - [X] `process.syscall64(number, ...args): number`
 - [ ] `process.asyscall(number, ...args, callback)`
 - [ ] `process.asyscall64(number, ...args, callback)`
 - [ ] `process.malloc(address, size): Buffer`

Standard:

 - [ ] `Event: 'beforeExit'`
 - [ ] `Event: 'disconnect'`
 - [ ] `Event: 'exit'`
 - [ ] `Event: 'message'`
 - [ ] `Event: 'rejectionHandled'`
 - [ ] `Event: 'uncaughtException'`
 - [ ] `Event: 'unhandledRejection'`
 - [ ] `Event: 'warning'`
 - [ ] `Signal Events`
 - [ ] `process.abort()`
 - [ ] `process.arch`
 - [X] `process.argv`
 - [ ] `process.chdir(directory)`
 - [X] `process.config`
 - [ ] `process.connected`
 - [ ] `process.cpuUsage([previousValue])`
 - [X] `process.cwd()` -- check it is 100% compatible with Node.js
 - [ ] `process.disconnect()`
 - [X] `process.env`
 - [ ] `process.emitWarning(warning[, name][, ctor])`
 - [X] `process.execArgv`
 - [X] `process.execPath`
 - [ ] `process.exit([code])`
 - [ ] `process.exitCode`
 - [ ] `process.getegid()`
 - [ ] `process.geteuid()`
 - [X] `process.getgid()`
 - [ ] `process.getgroups()`
 - [ ] `process.getuid()`
 - [ ] `process.hrtime([time])`
 - [ ] `process.initgroups(user, extra_group)`
 - [ ] `process.kill(pid[, signal])`
 - [ ] `process.mainModule`
 - [ ] `process.memoryUsage()`
 - [X] `process.nextTick(callback[, arg][, ...])`
 - [X] `process.pid`
 - [ ] `process.platform`
 - [ ] `process.release`
 - [ ] `process.send(message[, sendHandle[, options]][, callback])`
 - [ ] `process.setegid(id)`
 - [ ] `process.seteuid(id)`
 - [ ] `process.setgid(id)`
 - [ ] `process.setgroups(groups)`
 - [ ] `process.setuid(id)`
 - [ ] `process.stderr`
 - [ ] `process.stdin`
 - [ ] `process.stdout`
 - [X] `process.title`
 - [ ] `process.umask([mask])`
 - [ ] `process.uptime()`
 - [X] `process.version`
 - [X] `process.versions`
 - [X] `process.features`
 - [ ] `Exit Codes`


### [`Buffer`](https://nodejs.org/api/buffer.html)

*Depends on:* `ArrayBuffer`

Use `buffer` *npm* package, which was originally written for Browserify. Internally
it uses `ArrayBuffer`, which is what we need. `buffer` has also a fallback
for older browsers to emulate `ArrayBuffer` with plain JavaScript objects, we may
want to remove that option, as it is no-no for us.

TODO: check all methods work correctly, including the `.slice()` method.

 - [X] `Buffer`


### `StaticBuffer`

*Depends on:* `Buffer`, `process.syscall`, `process.malloc`

 - [ ] `StaticBuffer`
 

### [`util`](https://nodejs.org/api/util.html)

*Depends on:* `Buffer`

 - [X] `util.debuglog(section)`
 - [X] `util.deprecate(function, string)`
 - [X] `util.format(format[, ...])`
 - [X] `util.inherits(constructor, superConstructor)`
 - [X] `util.inspect(object[, options])` -- slightly broken
 - [X] `util.inspect.colors`
 
Deprecated APIs:

 - [X] `util.debug(string)`
 - [X] `util.error([...])`
 - [X] `util.isArray(object)`
 - [X] `util.isBoolean(object)`
 - [X] `util.isBuffer(object)`
 - [X] `util.isDate(object)`
 - [X] `util.isError(object)`
 - [X] `util.isFunction(object)`
 - [X] `util.isNull(object)`
 - [X] `util.isNullOrUndefined(object)`
 - [X] `util.isNumber(object)`
 - [X] `util.isObject(object)`
 - [X] `util.isPrimitive(object)`
 - [X] `util.isRegExp(object)`
 - [X] `util.isString(object)`
 - [X] `util.isSymbol(object)`
 - [X] `util.isUndefined(object)`
 - [X] `util.log(string)`
 - [X] `util.print([...])`
 - [X] `util.puts([...])`
 - [X] `util._extend(obj)`
 
Extra:

 - [X] `util.extend(...objects)` 


### [`assert`](https://nodejs.org/api/assert.html)

*Depends on:* `util`, `Buffer`

 - [X] `assert(value[, message])`
 - [X] `assert.deepEqual(actual, expected[, message])`
 - [X] `assert.deepStrictEqual(actual, expected[, message])`
 - [X] `assert.doesNotThrow(block[, error][, message])`
 - [X] `assert.equal(actual, expected[, message])`
 - [X] `assert.fail(actual, expected, message, operator)`
 - [X] `assert.ifError(value)`
 - [X] `assert.notDeepEqual(actual, expected[, message])`
 - [X] `assert.notDeepStrictEqual(actual, expected[, message])`
 - [X] `assert.notEqual(actual, expected[, message])`
 - [X] `assert.notStrictEqual(actual, expected[, message])`
 - [X] `assert.ok(value[, message])`
 - [X] `assert.strictEqual(actual, expected[, message])`
 - [X] `assert.throws(block[, error][, message])`


### [`path`](https://nodejs.org/api/path.html)

*Depends on:* `util`

Verbatim copy from Node.js

 - [X] `path`


### [`stream`](https://nodejs.org/api/stream.html)

*Depends on:* `events`, `util`, `Buffer`

Almost verbatim copy from Node.js

 - [X] `stream`
 
 
### [`libjs`](http://www.npmjs.com/package/libjs)

*Depends on:* `process.syscall`, `process.syscall64`, `process.asyscall`, `process.asyscall64`

Wrapper around system calls.


### [`fs`](https://nodejs.org/api/fs.html)

*Depends on:* `events`, `path`, `Buffer`, `stream`, `libjs`

Below synchronous methods are implements using `process.syscall`:

 - [ ] `fs.accessSync(path[, mode])`
 - [ ] `fs.appendFileSync(file, data[, options])`
 - [ ] `fs.chmodSync(path, mode)`
 - [ ] `fs.chownSync(path, uid, gid)`
 - [ ] `fs.closeSync(fd)`
 - [ ] `fs.existsSync(path)`
 - [ ] `fs.fchmodSync(fd, mode)`
 - [ ] `fs.fchownSync(fd, uid, gid)`
 - [ ] `fs.fdatasyncSync(fd)`
 - [ ] `fs.fstatSync(fd)`
 - [ ] `fs.fsyncSync(fd)`
 - [ ] `fs.ftruncateSync(fd, len)`
 - [ ] `fs.futimesSync(fd, atime, mtime)`
 - [ ] `fs.lchmodSync(path, mode)`
 - [ ] `fs.lchownSync(path, uid, gid)`
 - [ ] `fs.linkSync(srcpath, dstpath)`
 - [ ] `fs.lstatSync(path)`
 - [ ] `fs.mkdtempSync(prefix)`
 - [ ] `fs.mkdirSync(path[, mode])`
 - [ ] `fs.openSync(path, flags[, mode])`
 - [ ] `fs.realpathSync(path[, options])`
 - [ ] `fs.readFileSync(file[, options])`
 - [ ] `fs.readlinkSync(path[, options])`
 - [ ] `fs.symlinkSync(target, path[, type])`
 - [ ] `fs.statSync(path)`
 - [ ] `fs.truncateSync(path, len)`
 - [ ] `fs.renameSync(oldPath, newPath)`
 - [ ] `fs.readSync(fd, buffer, offset, length, position)`
 - [ ] `fs.writeSync(fd, buffer, offset, length[, position])`
 - [ ] `fs.writeSync(fd, data[, position[, encoding]])`
 - [ ] `fs.writeFileSync(file, data[, options])`
 - [ ] `fs.unlinkSync(path)`
 - [ ] `fs.rmdirSync(path)`
 
Below asynchronous methods are implemented using `process.asyscall`:
 
 - [ ] `fs.access(path[, mode], callback)`
 - [ ] `fs.appendFile(file, data[, options], callback)`
 - [ ] `fs.chmod(path, mode, callback)`
 - [ ] `fs.chown(path, uid, gid, callback)`
 - [ ] `fs.close(fd, callback)`
 - [ ] `fs.exists(path, callback)`
 - [ ] `fs.fchmod(fd, mode, callback)`
 - [ ] `fs.fchown(fd, uid, gid, callback)`
 - [ ] `fs.fdatasync(fd, callback)`
 - [ ] `fs.fstat(fd, callback)`
 - [ ] `fs.fsync(fd, callback)`
 - [ ] `fs.ftruncate(fd, len, callback)`
 - [ ] `fs.futimes(fd, atime, mtime, callback)`
 - [ ] `fs.lchmod(path, mode, callback)`
 - [ ] `fs.lchown(path, uid, gid, callback)`
 - [ ] `fs.link(srcpath, dstpath, callback)`
 - [ ] `fs.lstat(path, callback)`
 - [ ] `fs.mkdir(path[, mode], callback)`
 - [ ] `fs.mkdtemp(prefix, callback)`
 - [ ] `fs.open(path, flags[, mode], callback)`
 - [ ] `fs.read(fd, buffer, offset, length, position, callback)`
 - [ ] `fs.readFile(file[, options], callback)`
 - [ ] `fs.readlink(path[, options], callback)`
 - [ ] `fs.realpath(path[, options], callback)`
 - [ ] `fs.rename(oldPath, newPath, callback)`
 - [ ] `fs.rmdir(path, callback)`
 - [ ] `fs.stat(path, callback)`
 - [ ] `fs.symlink(target, path[, type], callback)`
 - [ ] `fs.truncate(path, len, callback)`
 - [ ] `fs.unlink(path, callback)`
 - [ ] `fs.write(fd, buffer, offset, length[, position], callback)`
 - [ ] `fs.write(fd, data[, position[, encoding]], callback)`
 - [ ] `fs.writeFile(file, data[, options], callback)`
 
There is no such `readdir` Linux system call, instead `libc` implements it
itself, here we too implement the `readdir` function in JavaScript, so it
might not be 100% compatible with Node.js:
 
 - [ ] `fs.readdirSync(path[, options])`
 - [ ] `fs.readdir(path[, options], callback)`
 
Times are currently resolved to millisecond accuracy, you can still use
`utimes` but if you specify time with microsecond accuracy it will be rounded
to milliseconds:
  
 - [ ] `fs.utimes(path, atime, mtime, callback)`
 - [ ] `fs.utimesSync(path, atime, mtime)`
 
We use `inotify` syscall interface (just like `libuv` in Node.js) from 
[`libaio`](http://www.npmjs.com/package/libaio) package:   

 - [ ] `fs.watch(filename[, options][, listener])`
 
Below file watching just polls file system (as does Node.js) using `setTimeout()`. There
are some incompatibilities with Node.js, see [`fslib`](http://www.npmjs.com/package/fslib):
 
 - [ ] `fs.unwatchFile(filename[, listener])`
 - [ ] `fs.watchFile(filename[, options], listener)` 
 - [ ] `Class: fs.FSWatcher`
     - [ ] `Event: 'change'`
     - [ ] `Event: 'error'`
     - [ ] `watcher.close()`

Other:
    
 - [ ] `Class: fs.ReadStream`
     - [ ] `Event: 'open'`
     - [ ] `Event: 'close'`
     - [ ] `readStream.path`
     - [ ] `fs.createReadStream(path[, options])`
 - [ ] `Class: fs.Stats`
 - [ ] `Class: fs.WriteStream`
     - [ ] `Event: 'open'`
     - [ ] `Event: 'close'`
     - [ ] `writeStream.bytesWritten`
     - [ ] `writeStream.path`
     - [ ] `fs.createWriteStream(path[, options])`
 - [ ] `fs.constants`
     - [ ] FS Constants
     - [ ] File Access Constants
     - [ ] File Open Constants
     - [ ] File Type Constants
     - [ ] File Mode Constants


### [`Console`](https://nodejs.org/api/console.html)

*Depends on:* `util`, `stream`, `fs`, `assert`

 - [ ] `new Console(stdout[, stderr])`
 - [ ] `console.assert(value[, message][, ...])`
 - [ ] `console.dir(obj[, options])`
 - [ ] `console.error([data][, ...])`
 - [ ] `console.info([data][, ...])`
 - [ ] `console.log([data][, ...])`
 - [ ] `console.time(label)`
 - [ ] `console.timeEnd(label)`
 - [ ] `console.trace(message[, ...])`
 - [ ] `console.warn([data][, ...])`


### [`dgram`](https://nodejs.org/api/dgram.html)

*Depends on:* 

 - [ ] `Class: dgram.Socket
     - [ ] `Event: 'close'`
     - [ ] `Event: 'error'`
     - [ ] `Event: 'listening'`
     - [ ] `Event: 'message'`
     - [ ] `socket.addMembership(multicastAddress[, multicastInterface])`
     - [ ] `socket.address()`
     - [ ] `socket.bind([port][, address][, callback])`
     - [ ] `socket.bind(options[, callback])`
     - [ ] `socket.close([callback])`
     - [ ] `socket.dropMembership(multicastAddress[, multicastInterface])`
     - [ ] `socket.send(msg, [offset, length,] port, address[, callback])`
     - [ ] `socket.setBroadcast(flag)`
     - [ ] `socket.setMulticastLoopback(flag)`
     - [ ] `socket.setMulticastTTL(ttl)`
     - [ ] `socket.setTTL(ttl)`
     - [ ] `socket.ref()`
     - [ ] `socket.unref()`
 - [ ] `dgram.createSocket(options[, callback])`
 - [ ] `dgram.createSocket(type[, callback])`

Below is list of already implemented API and roadmap on how the rest of the API will be implemented.

 - [`dgram.js`](https://nodejs.org/api/dgram.html), [`net.js`](https://nodejs.org/api/net.html) and [`http.js`](https://nodejs.org/api/http.html) networking stack will be implemented using `epoll` system calls.
 - [`fs.js`](https://nodejs.org/api/fs.html) -- *synchronous* functions are implemented in [`libfs`](http://www.npmjs.com/package/libfs)
 using system calls, also `libfs` will implement *asynchronous* `fs` calls in four ways:
    1. fake *async* wrappers around *synchronous/blocking* `fs` calls;
    2. thread pool where *blocking* function will be executed in parallel using `treads-a-go-go`, analogous to what `libuv` does;
    3. `Worker` pool, similar to *2.*, but less efficient;
    4. using *asynchronous* Linux system calls: `io_submit`.
 - [`dns.js`](https://nodejs.org/api/dns.html) will be replaced by [`node-dns`](https://github.com/tjfontaine/node-dns).
 - [`tls.js`](https://nodejs.org/api/tls.html) will be replaced by [`forge`](https://github.com/digitalbazaar/forge). 
 - [`https.js`](https://nodejs.org/api/https.html) will have to be put together using `http.js` and `tls.js`. 
 - [`zlib.js`](https://nodejs.org/api/tls.html) will be replaced by [`pako`](https://github.com/nodeca/pako).
 - For [`crypto.js`](https://nodejs.org/api/crypto.html) there is `browserify-crypto` and some other libraries we can use.
 - Pure JavaScript modules will be adopted *as-is*:
    - `assert.js`
    - `console.js`
    - `events.js`
    - `path.js`
    - `process.js`
    - `punycode.js`
    - `querystring.js`
    - `readline.js`
    - `repl.js`
    - `module.js`
    - `url.js`
    - `util.js`
    - `stream.js`
    - `string_decoder.js`
 - *Misc* V8 and Node.js specific modules:
    - `vm.js`
    - `v8.js`
    - `os.js`
    - `tty.js`
    - `timers.js`
 - These we need to think about:
    - `child_process.js`
    - `cluster.js`

## What is `fulljs`?

> ... #FreeNode or #nodefree?

This is all you need to know to tell your colleagues about `fulljs`:

**Colleague: What is `fulljs`?**

***You:*** *`fulljs` is node.js without node.js (no pun intended). `fulljs` is node's
rewrite in pure unadulterated JavaScript, without any `C/C++` bindings.*

**Colleague: WHOA, what? But node.js is JavaScript?**

***You:*** *Well, Node's [standard library](https://nodejs.org/api/index.html) is partly written in JavaScript, yes, but it also has the other side --
the dark side. Node.js depends on [`libuv`](http://libuv.org/), which uses [`libc`](https://en.wikipedia.org/wiki/C_standard_library) among many other
`C/C++` dependencies, also, part of Node.js itself is written in `C++` and hardcoded
for `V8`. `fulljs` has none of that, `fulljs` is **100%** `C/C++` free.*

**Colleague: Agh, don't tell me fairy tales. How is that possible?**

***You:*** *`libuv` and `libc` are essentially [wrapper libraries](https://en.wikipedia.org/wiki/Wrapper_library) around
[system calls](https://filippo.io/linux-syscall-table/) provided by Linux kernel, aka Linux ABI/API. Instead 
of using wrapper libraries `fulljs` executes system calls directly from JavaScript and implements Node's [standard library](https://nodejs.org/api/index.html)
in pure ~~JavaScript~~ [TypeScript](https://www.typescriptlang.org/) (JavaScript's mature brother).*

**Colleague: This is all Greek to me, WTH is `syscall` function?**

***You:*** *You see, my friend, any time you access any hardware device, like print on screen: `console.log('Hello')`,
your program has to actually ask the Linux kernel to do it for it. This "asking" kernel to do things
for us is called a `syscall`, u know, like calling ur sister, but instead `syscall`.*

**Colleague: So, `fulljs` itself depends on C's [`syscall`](http://man7.org/linux/man-pages/man2/syscall.2.html) function?**

***You:*** *Kinda, but we will remove it in the future (how? u will see), also it is the **single** dependency point
of the whole stack, moreover, it is just a **one-line** dependcy on `C`; and one-line 
dependency is **no-dependency**, see how ez:*

```c
# include <sys/syscall.h>
long syscall(long number, ...);
```

**Colleague: Why do u need pure JavaScript Node.js aka `fulljs`?**

***You:*** *There are a few cases:*

 1. *Coding in pure JavaScript makes development much faster.*
 2. *Because of no dependencies, `fulljs` is highly portable, for example, to move it to another
 JavaScript runtime, all you have to do is to port that `syscall` one-liner, u see? Ever wanted to run Node.js on your
 favorite [${WIKIPEDIA.put.an.ECMAScript.engine.here('please')}](https://en.wikipedia.org/wiki/List_of_ECMAScript_engines).*
 3. *You can "stuff" `fulljs` into places where Node.js has never been before, like into Linux kernel itself. For example, 
 [runtime.js](http://runtimejs.org/) is a JavaScript exo-kernel (JavaScript compiled into the Linux kernel), but so unfortunately
 there is no `libc` nor `libuv` (or Node.js for that matter) inside the kernel, so `runtime.js` is bare-bones `V8` runtime without any of
 node's [standard library](https://nodejs.org/api/index.html) or `npm` (JS devs in panic mode here), so u cannot do much. But, because `fulljs` has no
 dependecies you will be able to use it together with `runtime.js` inside the kernel and `npm` will just work,
 because `fulljs` has 100% compatible API with Node.js, u see?*
 4. *You can trace and intercept `syscalls` to test/debug your app.*
 5. *You could use `fulljs` for simulations and sandboxing, for example, you could implement your own **virtual**
 Linux kernel, which would expose a single `syscall` function and you could run `fulljs` on that. Or you could create 
 a sandboxed Node.js runtime, where you would control which syscalls are available in sandbox.*
 6. *Because everything will be written in JavaScript, one more thing we will do is we will package the whole `fulljs`
 into a single `full.js` file, image a complete Node.js distribution in a single `.js` file.*
