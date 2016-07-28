import {Asyscall} from '../../libasyscall/index';
import {UInt64} from '../../libjs/ctypes';


var asyscall = new Asyscall;
asyscall.build();


process.asyscall64 = asyscall.exec.bind(asyscall);


// Use 64-bit version to create 32-bit version:
process.asyscall = function() {
    var callback = arguments[arguments.length - 1];
    arguments[arguments.length - 1] = function(num64) {
        if(num64[1] === 0) callback(num64[0]);
        else callback(UInt64.joinToNumber(num64[1], num64[0]));
    };
    process.asyscall64.apply(null, arguments)
};
