

var buf = new Buffer('Hello');
var frame = process.frame(buf, buf.length);

console.log(frame);
var ua = new Uint8Array(frame);

for(var i = 0; i < ua.length; i++) console.log(ua[i]);

console.log(process.getAddress(buf));
console.log(process.getAddress(frame));
console.log(buf.getAddress());
console.log(frame.getAddress());
