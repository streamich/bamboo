"use strict";
var index_1 = require('../../libasyscall/index');
var ctypes_1 = require('../../libjs/ctypes');
var asyscall = new index_1.Asyscall;
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
