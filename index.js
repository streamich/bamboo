

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// var buf = str2ab('Hello there\0');

//var buf = new Buffer([46, 47, 48, 0]);
print(process.argv[0]);
print(process.argv.length);
var buf = new Buffer('This is Sparta!\n');
process.syscall(1,1, buf, buf.length);
var lol = process.readFile('../full-js/lol.js');
print(lol);
//print(process.getAddress(buf));
//process.syscall(1, 1, buf, buf.length);
//process.syscall(39);
//print(process.getAddress(buf));
// Export `Buffer` as global.
//global.Buffer = require('./lib/buffer').Buffer;

// Export `process` as global.
//require('./lib/process');

// Export `StaticBuffer` and `StaticArrayBuffer` as globals


// Load `fs.js`

// Load `module.js`

// Crate `require` function


// console.log(process.nextTick);

// console.log(process);

// console.log(require('./stream'));



