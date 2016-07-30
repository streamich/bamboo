

var b = new Buffer(10);
b[1] = 24;
var sb = new StaticBuffer(10);


console.log(Buffer.isBuffer(b));
console.log(Buffer.isBuffer(sb));
console.log(StaticBuffer.isStaticBuffer(b));
console.log(StaticBuffer.isStaticBuffer(sb));

b.print();
sb.print();


var sb2 = StaticBuffer.from(b);
console.log(Buffer.isBuffer(sb2));
console.log(StaticBuffer.isStaticBuffer(sb2));
sb2.print();
