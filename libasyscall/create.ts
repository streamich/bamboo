import {UInt64} from '../libjs/ctypes';


// console.log(!!process.asyscall, !!process.hasBinaryUtils, __BUILD_ASYNC_SYSCALL__);


if(!process.asyscall) {
    if(process.hasBinaryUtils && __BUILD_ASYNC_SYSCALL__) {

        // Here we create on the fly a thread pool to run the
        // asynchronous system call function, we use `process.call`
        // and `process.frame`.

        var Asyscall = require('./index').Asyscall;

        var asyscall = new Asyscall;
        asyscall.build();

        process.asyscall64 = asyscall.exec.bind(asyscall);

        // Use 64-bit version to shim 32-bit version:
        process.asyscall = function() {
            var callback = arguments[arguments.length - 1];
            arguments[arguments.length - 1] = function(num64) {
                if(num64[1] === 0) callback(num64[0]);
                else callback(UInt64.joinToNumber(num64[1], num64[0]));
            };
            process.asyscall64.apply(null, arguments)
        };

    } else {

        // Create fake asynchronous system calls by just wrapping the
        // synchronous version.

        process.asyscall = function() {
            var len = arguments.length - 1;
            var args = new Array(len);
            for(var i = 0; i < len; i++) args[i] = arguments[i];
            var res = process.syscall.apply(null, args);
            arguments[len](res);
        };

        process.asyscall64 = function() {
            var len = arguments.length - 1;
            var args = new Array(len);
            for(var i = 0; i < len; i++) args[i] = arguments[i];
            var res = process.syscall64.apply(null, args);
            arguments[len](res);
        };

    }
}


