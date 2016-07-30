"use strict";
var ctypes_1 = require('../libjs/ctypes');
if (!process.asyscall) {
    if (process.hasBinaryUtils && __BUILD_ASYNC_SYSCALL__) {
        var Asyscall = require('./index').Asyscall;
        var asyscall = new Asyscall;
        asyscall.build();
        process.asyscall64 = asyscall.exec.bind(asyscall);
        process.asyscall = function () {
            var callback = arguments[arguments.length - 1];
            arguments[arguments.length - 1] = function (num64) {
                if (num64[1] === 0)
                    callback(num64[0]);
                else
                    callback(ctypes_1.UInt64.joinToNumber(num64[1], num64[0]));
            };
            process.asyscall64.apply(null, arguments);
        };
    }
    else {
        process.asyscall = function () {
            var len = arguments.length - 1;
            var args = new Array(len);
            for (var i = 0; i < len; i++)
                args[i] = arguments[i];
            var res = process.syscall.apply(null, args);
            arguments[len](res);
        };
        process.asyscall64 = function () {
            var len = arguments.length - 1;
            var args = new Array(len);
            for (var i = 0; i < len; i++)
                args[i] = arguments[i];
            var res = process.syscall64.apply(null, args);
            arguments[len](res);
        };
    }
}
