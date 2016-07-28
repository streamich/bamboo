var StaticArrayBuffer = require('./static-arraybuffer').StaticArrayBuffer;


exports.StaticBuffer = StaticBuffer;


// function bufferNew(size) {
//     return new Buffer(size); // Node < 6.0
// return Buffer.allocUnsafe(size); // Node 6.0
// }

function bufferFrom(arr, a, b) {
    return new Buffer(arr, a, b); // Node < 6.0
    // return Buffer.from(arr, a, b); // Node 6.0
}


// new StaticBuffer(size);
// new StaticBuffer(staticArrayBuffer, byteOffset, length);
function StaticBuffer(a, b, c) {
    var buf;
    if(StaticArrayBuffer.isStaticArrayBuffer(a)) {
        var staticArrayBuffer = a, byteOffset = b, length = c;
        if(!byteOffset) byteOffset = 0;
        if(!length) length = staticArrayBuffer.byteLength;
        buf = bufferFrom(staticArrayBuffer);
        if((byteOffset !== 0) || (length !== staticArrayBuffer.byteLength)) {
            buf = buf.slice(byteOffset, byteOffset + length);
        }
    } else if(typeof a === 'number') {
        var size = a;
        var sab = new StaticArrayBuffer(size);
        buf = bufferFrom(sab);
    } else
        throw TypeError('Invalid StaticBuffer constructor arguments.');

    buf.__proto__ = StaticBuffer.prototype;
    return buf;
}


// # Static methods

StaticBuffer.isStaticBuffer = function(sbuf) {
    if((sbuf instanceof StaticBuffer) && (typeof sbuf.getAddress === 'function')) return true;
    else return false;
};

StaticBuffer.alloc = function(size, prot) {
    var arr;
    if(size instanceof Array) {
        arr = size;
        size = size.length;
    }
    var sab = StaticArrayBuffer.alloc(size, prot);
    var sb = new StaticBuffer(sab);

    if(arr) sb.fillWith(arr);
    return sb;
};

StaticBuffer.allocSafe = function(size, fill, encoding, prot) {
    var sb = StaticBuffer.alloc(size, prot);
    sb.fill(fill, 0, sab.length, encoding);
    return sb;
};

StaticBuffer.frame = function(address, size) {
    var sab = StaticArrayBuffer.frame(address, size);
    return new StaticBuffer(sab);
};

// StaticBuffer.from([1, 2, 3]);
// StaticBuffer.from(new StaticArrayBuffer(100));
// StaticBuffer.from(new ArrayBuffer(100));
StaticBuffer.from = function(obj, a, b) {
    if(obj instanceof Array) {
        var array = obj;
        var size = array.length;
        var sb = new StaticBuffer(size);
        for(var i = 0; i < size; i++) sbuf[i] = array[i];
        return sb;
    } else if(StaticArrayBuffer.isStaticArrayBuffer(obj)) {
        var staticArrayBuffer = obj, byteOffset = a, length = b;
        return new StaticBuffer(staticArrayBuffer, byteOffset, length);
    } else if(obj instanceof ArrayBuffer) {
        var arrayBuffer = obj, byteOffset = a, length = b;
        return StaticBuffer.from(new StaticArrayBuffer(arrayBuffer), byteOffset, length);
    } else if(obj instanceof Uint8Array) {
        // This includes `instanceof Buffer` as Buffer extends Uint8Array.
        var sb = new StaticBuffer(obj.length);
        sb.fill(obj);
        return sb;
    } else
        throw TypeError("Do not know how to create StaticBuffer from this type.");
};




StaticBuffer.prototype.__proto__ =
    Buffer.prototype;



// # Member instance methods

// Execute machine code inside the buffer.
StaticBuffer.prototype.call = function(offset, args) {
    offset += this.byteOffset;
    return this.buffer.call(offset, args);
};

StaticBuffer.prototype.getAddress = function(offset) {
    if(!offset) offset = 0;
    offset += this.byteOffset;
    return this.buffer.getAddress(offset);
};

// We don't add `setProtection` and `free` methods to `StaticBuffer`
// because those are really specific to the underlying `StaticArrayBuffer`.

// We extend the `Buffer`. In general, all methods of `Buffer` return
// something that IS NOT a `Buffer` OR they return `this`.
//
// The exception is `.slice()` method that creates a new `Buffer`, but
// we need to return `StaticBuffer`. So we override it here.
StaticBuffer.prototype.slice = function(start, end) {
    if(!start) start = 0;
    if(!end) end = this.length;
    if(typeof start !== 'number')   throw TypeError('start must be number');
    if(typeof end !== 'number')     throw TypeError('end must be number');
    var length = end - start;
    if(length <= 0) throw TypeError('end must be greater than start');
    return new StaticBuffer(this.buffer, start, length);
};


StaticBuffer.prototype.fillWith = function(arr, offset, offsetArr, len) {
    if(!offset) offset = 0;
    if(!offsetArr) offsetArr = 0;
    if(!len) len = arr.length;
    for(var i = 0; i < len; i++)
        this[offset + i] = arr[offsetArr + i];
};
