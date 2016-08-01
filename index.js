

if(typeof console === 'undefined') {
  console = {
    log: function () {
      var str = Array.prototype.join.call(arguments, ', ');
      print(str);
    }
  };
}

require('./lib/boot');

// Export `Buffer` as global.
// var Buffer = global.Buffer = require('./lib/buffer').Buffer;

// var buf = new Buffer('Hello');

// Export `process` as global.
// require('./lib/process');

// console.log(process)

// Export `StaticBuffer` and `StaticArrayBuffer` as globals


// Load `fs.js`

// Load `module.js`

// Crate `require` function


// console.log(process.nextTick);

// console.log(process);

// console.log(require('./stream'));



