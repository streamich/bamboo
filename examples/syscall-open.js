var libjs = require('../libjs/index');
var fs = require('fs');



// var buf = StaticBuffer(10);
var file = '/proc/meminfo';
var fd = process.syscall(2, file, 0, 438);
// var fd = libjs.open(file, 0, 438);
console.log('fd', fd);


// --------------------------------------------------------------


// var file = '/proc/keys';
process.asyscall(2, file, 0, 438, function (fd) {
process.asyscall(2, file, 0, 438, function (fd) {
process.asyscall(2, file, 0, 438, function (fd) {
    process.asyscall(2, file, 0, 438, function (fd) {
        console.log('fd', fd);
        // /*console.log('fd', fd);
        // var buf = new StaticBuffer(20);
        // process.asyscall(libjs.SYS.read, fd, buf, buf.length, function(res) {
        //     console.log('res', res);
        //     console.log('data', buf.toString());
        // });
        // libjs.readAsync(fd, buf, function(res) {
        //     console.log('res', res);
        //     console.log('data', buf.toString());
        // });*/
    });
});
});
});
