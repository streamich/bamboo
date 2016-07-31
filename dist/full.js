var global = this;
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	if(typeof console === 'undefined') {
	  console = {
	    log: function () {
	      var str = Array.prototype.join.call(arguments, ', ');
	      print(str);
	    }
	  };
	}

	__webpack_require__(1);

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





/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// This file is in `.js` because we set global variables here, but TypeScript
	// transpiles with `"use strict"` and in strict mode you cannot set globals.


	// Self is set to global `this` by Webpack, see `webpack.config.js`.
	// In different environments global variables are called differently,
	// for example, in Duktape the global variable is called `Duktape`,
	// so here we make sure there is a global variable called `global`.
	// global = self;
	// global.global = global;


	// Export `Buffer` as global. Other things use `Buffer`, so we export Buffer first.
	Buffer = global.Buffer = __webpack_require__(2).Buffer;


	// Check if we have more tools than just `process.syscall`.
	process.hasBinaryUtils = process.call && process.frame;


	// Export `StaticArrayBuffer`, required by `StaticBuffer`.
	if(typeof StaticArrayBuffer === 'undefined') {
	    StaticArrayBuffer = global.StaticArrayBuffer = process.hasBinaryUtils
	            ? __webpack_require__(5).StaticArrayBuffer
	            : ArrayBuffer;
	}


	// Export `StaticBuffer`, `libjs` needs `StaticBuffer` so export it early.
	if(typeof StaticBuffer === 'undefined') {
	    StaticBuffer = global.StaticBuffer= process.hasBinaryUtils
	            ? __webpack_require__(11).StaticBuffer
	            : Buffer;
	}


	// Set-up `process` global.
	__webpack_require__(12);


	// The main event loop, attached to `process` as `loop` property.
	var eloop = __webpack_require__(15);
	var EventLoop = eloop.EventLoop;
	var Task = eloop.Task;
	var loop = process.loop = new EventLoop;


	// Export timers as globals.
	var timers = __webpack_require__(16);
	setTimeout = timers.setTimeout;
	clearTimeout = timers.clearTimeout;
	setInterval = timers.setInterval;
	clearInterval = timers.clearInterval;
	setImmediate = timers.setImmediate;
	clearImmediate = timers.clearImmediate;
	setIOPoll = timers.setIOPoll;
	clearIOPoll = timers.clearIOPoll;


	// First task in the event loop.
	var task = new Task;
	task.callback = function() {

	    // !IMPORTANT: everything that uses `process.nextTick()` must
	    // bet executed in this callback so all the micro-tasks get correctly
	    // executed after this first task is processed.


	    // Create `process.asyscall` and `process.asyscall64`
	    __webpack_require__(17);

	    
	    try {

	        // Eval the file specified in first argument `full app.js`
	        // console.log(process.argv);
	        if(process.argv[1]) {
	            var path = __webpack_require__(20);
	            var Module = __webpack_require__(23).Module;
	            process.argv = process.argv.splice(1);
	            process.argv[1] = path.resolve(process.argv[1]);
	            setImmediate(function() {
	                try {
	                    Module.runMain();
	                } catch(e) {
	                    console.log(e);
	                    console.log(e.stack);
	                }
	            });
	        }

	    } catch(e) {
	        console.log(e);
	        console.log(e.line);
	        console.log(e.stack);
	    }

	};
	loop.insert(task);
	loop.start();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	


	// DEPRECATED: this should be removed, use `StaticArrayBuffer` instead.
	ArrayBuffer.prototype.getAddress = function(offset) {
	    return process.getAddress(this, offset);
	};



	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */


	// The absence of semicolons breaks my editor ffs,
	// TODO: Let's use the no-ArrayBuffer feature to suuport JS engines that don't have ArrayBuffers.


	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	function init () {
	    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    for (var i = 0, len = code.length; i < len; ++i) {
	        lookup[i] = code[i]
	        revLookup[code.charCodeAt(i)] = i
	    }

	    revLookup['-'.charCodeAt(0)] = 62
	    revLookup['_'.charCodeAt(0)] = 63
	}

	init()

	function toByteArray (b64) {
	    var i, j, l, tmp, placeHolders, arr
	    var len = b64.length

	    if (len % 4 > 0) {
	        throw new Error('Invalid string. Length must be a multiple of 4')
	    }

	    // the number of equal signs (place holders)
	    // if there are two placeholders, than the two characters before it
	    // represent one byte
	    // if there is only one, then the three characters before it represent 2 bytes
	    // this is just a cheap hack to not do indexOf twice
	    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

	    // base64 is 4/3 + up to two characters of the original data
	    arr = new Arr(len * 3 / 4 - placeHolders)

	    // if there are placeholders, only get up to the last complete 4 chars
	    l = placeHolders > 0 ? len - 4 : len

	    var L = 0

	    for (i = 0, j = 0; i < l; i += 4, j += 3) {
	        tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	        arr[L++] = (tmp >> 16) & 0xFF
	        arr[L++] = (tmp >> 8) & 0xFF
	        arr[L++] = tmp & 0xFF
	    }

	    if (placeHolders === 2) {
	        tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	        arr[L++] = tmp & 0xFF
	    } else if (placeHolders === 1) {
	        tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	        arr[L++] = (tmp >> 8) & 0xFF
	        arr[L++] = tmp & 0xFF
	    }

	    return arr
	}

	function tripletToBase64 (num) {
	    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	    var tmp
	    var output = []
	    for (var i = start; i < end; i += 3) {
	        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	        output.push(tripletToBase64(tmp))
	    }
	    return output.join('')
	}

	function fromByteArray (uint8) {
	    var tmp
	    var len = uint8.length
	    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	    var output = ''
	    var parts = []
	    var maxChunkLength = 16383 // must be multiple of 3

	    // go through the array every three bytes, we'll deal with trailing stuff later
	    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	        parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	    }

	    // pad the end with zeros, but make sure to not forget the extra bytes
	    if (extraBytes === 1) {
	        tmp = uint8[len - 1]
	        output += lookup[tmp >> 2]
	        output += lookup[(tmp << 4) & 0x3F]
	        output += '=='
	    } else if (extraBytes === 2) {
	        tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	        output += lookup[tmp >> 10]
	        output += lookup[(tmp >> 4) & 0x3F]
	        output += lookup[(tmp << 2) & 0x3F]
	        output += '='
	    }

	    parts.push(output)

	    return parts.join('')
	}











	var ieee754 = __webpack_require__(3)
	var isArray = __webpack_require__(4)
	Buffer._full = true;
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = true;
	// Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	//     ? global.TYPED_ARRAY_SUPPORT
	//     : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	    try {
	        var arr = new Uint8Array(1)
	        arr.foo = function () { return 42 }
	        return arr.foo() === 42 && // typed array instances can be augmented
	            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	    } catch (e) {
	        return false
	    }
	}

	function kMaxLength () {
	    return Buffer.TYPED_ARRAY_SUPPORT
	        ? 0x7fffffff
	        : 0x3fffffff
	}

	function createBuffer (that, length) {
	    if (kMaxLength() < length) {
	        throw new RangeError('Invalid typed array length')
	    }
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        // Return an augmented `Uint8Array` instance, for best performance
	        that = new Uint8Array(length)
	        that.__proto__ = Buffer.prototype
	    } else {
	        // Fallback: Return an object instance of the Buffer class
	        if (that === null) {
	            that = new Buffer(length)
	        }
	        that.length = length
	    }

	    return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	        return new Buffer(arg, encodingOrOffset, length)
	    }

	    // Common case.
	    if (typeof arg === 'number') {
	        if (typeof encodingOrOffset === 'string') {
	            throw new Error(
	                'If encoding is specified then the first argument must be a string'
	            )
	        }
	        return allocUnsafe(this, arg)
	    }

	    var buf = from(this, arg, encodingOrOffset, length)
	    return buf;
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	    arr.__proto__ = Buffer.prototype
	    return arr
	}

	function from (that, value, encodingOrOffset, length) {
	    if (typeof value === 'number') {
	        throw new TypeError('"value" argument must not be a number')
	    }

	    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	        return fromArrayBuffer(that, value, encodingOrOffset, length)
	    }

	    if (typeof value === 'string') {
	        return fromString(that, value, encodingOrOffset)
	    }

	    return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	    return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	    Buffer.prototype.__proto__ = Uint8Array.prototype
	    Buffer.__proto__ = Uint8Array
	    if (typeof Symbol !== 'undefined' && Symbol.species &&
	        Buffer[Symbol.species] === Buffer) {
	        // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	        Object.defineProperty(Buffer, Symbol.species, {
	            value: null,
	            configurable: true
	        })
	    }
	}

	function assertSize (size) {
	    if (typeof size !== 'number') {
	        throw new TypeError('"size" argument must be a number')
	    }
	}

	function alloc (that, size, fill, encoding) {
	    assertSize(size)
	    if (size <= 0) {
	        return createBuffer(that, size)
	    }
	    if (fill !== undefined) {
	        // Only pay attention to encoding if it's a string. This
	        // prevents accidentally sending in a number that would
	        // be interpretted as a start offset.
	        return typeof encoding === 'string'
	            ? createBuffer(that, size).fill(fill, encoding)
	            : createBuffer(that, size).fill(fill)
	    }
	    return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	    return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	    assertSize(size)
	    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	    if (!Buffer.TYPED_ARRAY_SUPPORT) {
	        for (var i = 0; i < size; i++) {
	            that[i] = 0
	        }
	    }
	    return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	    return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	    return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	    if (typeof encoding !== 'string' || encoding === '') {
	        encoding = 'utf8'
	    }

	    if (!Buffer.isEncoding(encoding)) {
	        throw new TypeError('"encoding" must be a valid string encoding')
	    }

	    var length = byteLength(string, encoding) | 0
	    that = createBuffer(that, length)

	    that.write(string, encoding)
	    return that
	}

	function fromArrayLike (that, array) {
	    var length = checked(array.length) | 0
	    that = createBuffer(that, length)
	    for (var i = 0; i < length; i += 1) {
	        that[i] = array[i] & 255
	    }
	    return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	    array.byteLength // this throws if `array` is not a valid ArrayBuffer

	    if (byteOffset < 0 || array.byteLength < byteOffset) {
	        throw new RangeError('\'offset\' is out of bounds')
	    }

	    if (array.byteLength < byteOffset + (length || 0)) {
	        throw new RangeError('\'length\' is out of bounds')
	    }

	    if (length === undefined) {
	        array = new Uint8Array(array, byteOffset)
	    } else {
	        array = new Uint8Array(array, byteOffset, length)
	    }

	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        // Return an augmented `Uint8Array` instance, for best performance
	        that = array
	        that.__proto__ = Buffer.prototype
	    } else {
	        // Fallback: Return an object instance of the Buffer class
	        that = fromArrayLike(that, array)
	    }

	    return that
	}

	function fromObject (that, obj) {
	    if (Buffer.isBuffer(obj)) {
	        var len = checked(obj.length) | 0
	        that = createBuffer(that, len)

	        if (that.length === 0) {
	            return that
	        }

	        obj.copy(that, 0, 0, len)
	        return that
	    }

	    if (obj) {
	        if ((typeof ArrayBuffer !== 'undefined' &&
	            obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	            if (typeof obj.length !== 'number' || isnan(obj.length)) {
	                return createBuffer(that, 0)
	            }
	            return fromArrayLike(that, obj)
	        }

	        if (obj.type === 'Buffer' && isArray(obj.data)) {
	            return fromArrayLike(that, obj.data)
	        }
	    }

	    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	    // Note: cannot use `length < kMaxLength` here because that fails when
	    // length is NaN (which is otherwise coerced to zero.)
	    if (length >= kMaxLength()) {
	        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	            'size: 0x' + kMaxLength().toString(16) + ' bytes')
	    }
	    return length | 0
	}

	function SlowBuffer (length) {
	    if (+length != length) { // eslint-disable-line eqeqeq
	        length = 0
	    }
	    return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	    return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	        throw new TypeError('Arguments must be Buffers')
	    }

	    if (a === b) return 0

	    var x = a.length
	    var y = b.length

	    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	        if (a[i] !== b[i]) {
	            x = a[i]
	            y = b[i]
	            break
	        }
	    }

	    if (x < y) return -1
	    if (y < x) return 1
	    return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	    switch (String(encoding).toLowerCase()) {
	        case 'hex':
	        case 'utf8':
	        case 'utf-8':
	        case 'ascii':
	        case 'binary':
	        case 'base64':
	        case 'raw':
	        case 'ucs2':
	        case 'ucs-2':
	        case 'utf16le':
	        case 'utf-16le':
	            return true
	        default:
	            return false
	    }
	}

	Buffer.concat = function concat (list, length) {
	    if (!isArray(list)) {
	        throw new TypeError('"list" argument must be an Array of Buffers')
	    }

	    if (list.length === 0) {
	        return Buffer.alloc(0)
	    }

	    var i
	    if (length === undefined) {
	        length = 0
	        for (i = 0; i < list.length; i++) {
	            length += list[i].length
	        }
	    }

	    var buffer = Buffer.allocUnsafe(length)
	    var pos = 0
	    for (i = 0; i < list.length; i++) {
	        var buf = list[i]
	        if (!Buffer.isBuffer(buf)) {
	            throw new TypeError('"list" argument must be an Array of Buffers')
	        }
	        buf.copy(buffer, pos)
	        pos += buf.length
	    }
	    return buffer
	}

	function byteLength (string, encoding) {
	    if (Buffer.isBuffer(string)) {
	        return string.length
	    }
	    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	        (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	        return string.byteLength
	    }
	    if (typeof string !== 'string') {
	        string = '' + string
	    }

	    var len = string.length
	    if (len === 0) return 0

	    // Use a for loop to avoid recursion
	    var loweredCase = false
	    for (;;) {
	        switch (encoding) {
	            case 'ascii':
	            case 'binary':
	            // Deprecated
	            case 'raw':
	            case 'raws':
	                return len
	            case 'utf8':
	            case 'utf-8':
	            case undefined:
	                return utf8ToBytes(string).length
	            case 'ucs2':
	            case 'ucs-2':
	            case 'utf16le':
	            case 'utf-16le':
	                return len * 2
	            case 'hex':
	                return len >>> 1
	            case 'base64':
	                return base64ToBytes(string).length
	            default:
	                if (loweredCase) return utf8ToBytes(string).length // assume utf8
	                encoding = ('' + encoding).toLowerCase()
	                loweredCase = true
	        }
	    }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	    var loweredCase = false

	    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	    // property of a typed array.

	    // This behaves neither like String nor Uint8Array in that we set start/end
	    // to their upper/lower bounds if the value passed is out of range.
	    // undefined is handled specially as per ECMA-262 6th Edition,
	    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	    if (start === undefined || start < 0) {
	        start = 0
	    }
	    // Return early if start > this.length. Done here to prevent potential uint32
	    // coercion fail below.
	    if (start > this.length) {
	        return ''
	    }

	    if (end === undefined || end > this.length) {
	        end = this.length
	    }

	    if (end <= 0) {
	        return ''
	    }

	    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	    end >>>= 0
	    start >>>= 0

	    if (end <= start) {
	        return ''
	    }

	    if (!encoding) encoding = 'utf8'

	    while (true) {
	        switch (encoding) {
	            case 'hex':
	                return hexSlice(this, start, end)

	            case 'utf8':
	            case 'utf-8':
	                return utf8Slice(this, start, end)

	            case 'ascii':
	                return asciiSlice(this, start, end)

	            case 'binary':
	                return binarySlice(this, start, end)

	            case 'base64':
	                return base64Slice(this, start, end)

	            case 'ucs2':
	            case 'ucs-2':
	            case 'utf16le':
	            case 'utf-16le':
	                return utf16leSlice(this, start, end)

	            default:
	                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	                encoding = (encoding + '').toLowerCase()
	                loweredCase = true
	        }
	    }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	    var i = b[n]
	    b[n] = b[m]
	    b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	    var len = this.length
	    if (len % 2 !== 0) {
	        throw new RangeError('Buffer size must be a multiple of 16-bits')
	    }
	    for (var i = 0; i < len; i += 2) {
	        swap(this, i, i + 1)
	    }
	    return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	    var len = this.length
	    if (len % 4 !== 0) {
	        throw new RangeError('Buffer size must be a multiple of 32-bits')
	    }
	    for (var i = 0; i < len; i += 4) {
	        swap(this, i, i + 3)
	        swap(this, i + 1, i + 2)
	    }
	    return this
	}

	Buffer.prototype.toString = function toString () {
	    var length = this.length | 0
	    if (length === 0) return ''
	    if (arguments.length === 0) return utf8Slice(this, 0, length)
	    return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	    if (this === b) return true
	    return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	    var str = ''
	    var max = exports.INSPECT_MAX_BYTES
	    if (this.length > 0) {
	        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	        if (this.length > max) str += ' ... '
	    }
	    return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	    if (!Buffer.isBuffer(target)) {
	        throw new TypeError('Argument must be a Buffer')
	    }

	    if (start === undefined) {
	        start = 0
	    }
	    if (end === undefined) {
	        end = target ? target.length : 0
	    }
	    if (thisStart === undefined) {
	        thisStart = 0
	    }
	    if (thisEnd === undefined) {
	        thisEnd = this.length
	    }

	    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	        throw new RangeError('out of range index')
	    }

	    if (thisStart >= thisEnd && start >= end) {
	        return 0
	    }
	    if (thisStart >= thisEnd) {
	        return -1
	    }
	    if (start >= end) {
	        return 1
	    }

	    start >>>= 0
	    end >>>= 0
	    thisStart >>>= 0
	    thisEnd >>>= 0

	    if (this === target) return 0

	    var x = thisEnd - thisStart
	    var y = end - start
	    var len = Math.min(x, y)

	    var thisCopy = this.slice(thisStart, thisEnd)
	    var targetCopy = target.slice(start, end)

	    for (var i = 0; i < len; ++i) {
	        if (thisCopy[i] !== targetCopy[i]) {
	            x = thisCopy[i]
	            y = targetCopy[i]
	            break
	        }
	    }

	    if (x < y) return -1
	    if (y < x) return 1
	    return 0
	}

	function arrayIndexOf (arr, val, byteOffset, encoding) {
	    var indexSize = 1
	    var arrLength = arr.length
	    var valLength = val.length

	    if (encoding !== undefined) {
	        encoding = String(encoding).toLowerCase()
	        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	            encoding === 'utf16le' || encoding === 'utf-16le') {
	            if (arr.length < 2 || val.length < 2) {
	                return -1
	            }
	            indexSize = 2
	            arrLength /= 2
	            valLength /= 2
	            byteOffset /= 2
	        }
	    }

	    function read (buf, i) {
	        if (indexSize === 1) {
	            return buf[i]
	        } else {
	            return buf.readUInt16BE(i * indexSize)
	        }
	    }

	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arrLength; i++) {
	        if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	            if (foundIndex === -1) foundIndex = i
	            if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
	        } else {
	            if (foundIndex !== -1) i -= i - foundIndex
	            foundIndex = -1
	        }
	    }
	    return -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	    if (typeof byteOffset === 'string') {
	        encoding = byteOffset
	        byteOffset = 0
	    } else if (byteOffset > 0x7fffffff) {
	        byteOffset = 0x7fffffff
	    } else if (byteOffset < -0x80000000) {
	        byteOffset = -0x80000000
	    }
	    byteOffset >>= 0

	    if (this.length === 0) return -1
	    if (byteOffset >= this.length) return -1

	    // Negative offsets start from the end of the buffer
	    if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	    if (typeof val === 'string') {
	        val = Buffer.from(val, encoding)
	    }

	    if (Buffer.isBuffer(val)) {
	        // special case: looking for empty string/buffer always fails
	        if (val.length === 0) {
	            return -1
	        }
	        return arrayIndexOf(this, val, byteOffset, encoding)
	    }
	    if (typeof val === 'number') {
	        if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	            return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	        }
	        return arrayIndexOf(this, [ val ], byteOffset, encoding)
	    }

	    throw new TypeError('val must be string, number or Buffer')
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	    return this.indexOf(val, byteOffset, encoding) !== -1
	}

	function hexWrite (buf, string, offset, length) {
	    offset = Number(offset) || 0
	    var remaining = buf.length - offset
	    if (!length) {
	        length = remaining
	    } else {
	        length = Number(length)
	        if (length > remaining) {
	            length = remaining
	        }
	    }

	    // must be an even number of digits
	    var strLen = string.length
	    if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	    if (length > strLen / 2) {
	        length = strLen / 2
	    }
	    for (var i = 0; i < length; i++) {
	        var parsed = parseInt(string.substr(i * 2, 2), 16)
	        if (isNaN(parsed)) return i
	        buf[offset + i] = parsed
	    }
	    return i
	}

	function utf8Write (buf, string, offset, length) {
	    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	    return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	    return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	    return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	    // Buffer#write(string)
	    if (offset === undefined) {
	        encoding = 'utf8'
	        length = this.length
	        offset = 0
	        // Buffer#write(string, encoding)
	    } else if (length === undefined && typeof offset === 'string') {
	        encoding = offset
	        length = this.length
	        offset = 0
	        // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	        offset = offset | 0
	        if (isFinite(length)) {
	            length = length | 0
	            if (encoding === undefined) encoding = 'utf8'
	        } else {
	            encoding = length
	            length = undefined
	        }
	        // legacy write(string, encoding, offset, length) - remove in v0.13
	    } else {
	        throw new Error(
	            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	        )
	    }

	    var remaining = this.length - offset
	    if (length === undefined || length > remaining) length = remaining

	    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	        throw new RangeError('Attempt to write outside buffer bounds')
	    }

	    if (!encoding) encoding = 'utf8'

	    var loweredCase = false
	    for (;;) {
	        switch (encoding) {
	            case 'hex':
	                return hexWrite(this, string, offset, length)

	            case 'utf8':
	            case 'utf-8':
	                return utf8Write(this, string, offset, length)

	            case 'ascii':
	                return asciiWrite(this, string, offset, length)

	            case 'binary':
	                return binaryWrite(this, string, offset, length)

	            case 'base64':
	                // Warning: maxLength not taken into account in base64Write
	                return base64Write(this, string, offset, length)

	            case 'ucs2':
	            case 'ucs-2':
	            case 'utf16le':
	            case 'utf-16le':
	                return ucs2Write(this, string, offset, length)

	            default:
	                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	                encoding = ('' + encoding).toLowerCase()
	                loweredCase = true
	        }
	    }
	}

	Buffer.prototype.toJSON = function toJSON () {
	    return {
	        type: 'Buffer',
	        data: Array.prototype.slice.call(this._arr || this, 0)
	    }
	}

	function base64Slice (buf, start, end) {
	    if (start === 0 && end === buf.length) {
	        return base64.fromByteArray(buf)
	    } else {
	        return base64.fromByteArray(buf.slice(start, end))
	    }
	}

	function utf8Slice (buf, start, end) {
	    end = Math.min(buf.length, end)
	    var res = []

	    var i = start
	    while (i < end) {
	        var firstByte = buf[i]
	        var codePoint = null
	        var bytesPerSequence = (firstByte > 0xEF) ? 4
	            : (firstByte > 0xDF) ? 3
	            : (firstByte > 0xBF) ? 2
	            : 1

	        if (i + bytesPerSequence <= end) {
	            var secondByte, thirdByte, fourthByte, tempCodePoint

	            switch (bytesPerSequence) {
	                case 1:
	                    if (firstByte < 0x80) {
	                        codePoint = firstByte
	                    }
	                    break
	                case 2:
	                    secondByte = buf[i + 1]
	                    if ((secondByte & 0xC0) === 0x80) {
	                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	                        if (tempCodePoint > 0x7F) {
	                            codePoint = tempCodePoint
	                        }
	                    }
	                    break
	                case 3:
	                    secondByte = buf[i + 1]
	                    thirdByte = buf[i + 2]
	                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	                            codePoint = tempCodePoint
	                        }
	                    }
	                    break
	                case 4:
	                    secondByte = buf[i + 1]
	                    thirdByte = buf[i + 2]
	                    fourthByte = buf[i + 3]
	                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	                            codePoint = tempCodePoint
	                        }
	                    }
	            }
	        }

	        if (codePoint === null) {
	            // we did not generate a valid codePoint so insert a
	            // replacement char (U+FFFD) and advance only 1 byte
	            codePoint = 0xFFFD
	            bytesPerSequence = 1
	        } else if (codePoint > 0xFFFF) {
	            // encode to utf16 (surrogate pair dance)
	            codePoint -= 0x10000
	            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	            codePoint = 0xDC00 | codePoint & 0x3FF
	        }

	        res.push(codePoint)
	        i += bytesPerSequence
	    }

	    return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	    var len = codePoints.length
	    if (len <= MAX_ARGUMENTS_LENGTH) {
	        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	    }

	    // Decode in chunks to avoid "call stack size exceeded".
	    var res = ''
	    var i = 0
	    while (i < len) {
	        res += String.fromCharCode.apply(
	            String,
	            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	        )
	    }
	    return res
	}

	function asciiSlice (buf, start, end) {
	    var ret = ''
	    end = Math.min(buf.length, end)

	    for (var i = start; i < end; i++) {
	        ret += String.fromCharCode(buf[i] & 0x7F)
	    }
	    return ret
	}

	function binarySlice (buf, start, end) {
	    var ret = ''
	    end = Math.min(buf.length, end)

	    for (var i = start; i < end; i++) {
	        ret += String.fromCharCode(buf[i])
	    }
	    return ret
	}

	function hexSlice (buf, start, end) {
	    var len = buf.length

	    if (!start || start < 0) start = 0
	    if (!end || end < 0 || end > len) end = len

	    var out = ''
	    for (var i = start; i < end; i++) {
	        out += toHex(buf[i])
	    }
	    return out
	}

	function utf16leSlice (buf, start, end) {
	    var bytes = buf.slice(start, end)
	    var res = ''
	    for (var i = 0; i < bytes.length; i += 2) {
	        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	    }
	    return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	    var len = this.length
	    start = ~~start
	    end = end === undefined ? len : ~~end

	    if (start < 0) {
	        start += len
	        if (start < 0) start = 0
	    } else if (start > len) {
	        start = len
	    }

	    if (end < 0) {
	        end += len
	        if (end < 0) end = 0
	    } else if (end > len) {
	        end = len
	    }

	    if (end < start) end = start

	    var newBuf
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        newBuf = this.subarray(start, end)
	        newBuf.__proto__ = Buffer.prototype
	    } else {
	        var sliceLen = end - start
	        newBuf = new Buffer(sliceLen, undefined)
	        for (var i = 0; i < sliceLen; i++) {
	            newBuf[i] = this[i + start]
	        }
	    }

	    return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	    offset = offset | 0
	    byteLength = byteLength | 0
	    if (!noAssert) checkOffset(offset, byteLength, this.length)

	    var val = this[offset]
	    var mul = 1
	    var i = 0
	    while (++i < byteLength && (mul *= 0x100)) {
	        val += this[offset + i] * mul
	    }

	    return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	    offset = offset | 0
	    byteLength = byteLength | 0
	    if (!noAssert) {
	        checkOffset(offset, byteLength, this.length)
	    }

	    var val = this[offset + --byteLength]
	    var mul = 1
	    while (byteLength > 0 && (mul *= 0x100)) {
	        val += this[offset + --byteLength] * mul
	    }

	    return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 1, this.length)
	    return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 2, this.length)
	    return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 2, this.length)
	    return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 4, this.length)

	    return ((this[offset]) |
	        (this[offset + 1] << 8) |
	        (this[offset + 2] << 16)) +
	        (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 4, this.length)

	    return (this[offset] * 0x1000000) +
	        ((this[offset + 1] << 16) |
	        (this[offset + 2] << 8) |
	        this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	    offset = offset | 0
	    byteLength = byteLength | 0
	    if (!noAssert) checkOffset(offset, byteLength, this.length)

	    var val = this[offset]
	    var mul = 1
	    var i = 0
	    while (++i < byteLength && (mul *= 0x100)) {
	        val += this[offset + i] * mul
	    }
	    mul *= 0x80

	    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	    return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	    offset = offset | 0
	    byteLength = byteLength | 0
	    if (!noAssert) checkOffset(offset, byteLength, this.length)

	    var i = byteLength
	    var mul = 1
	    var val = this[offset + --i]
	    while (i > 0 && (mul *= 0x100)) {
	        val += this[offset + --i] * mul
	    }
	    mul *= 0x80

	    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	    return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 1, this.length)
	    if (!(this[offset] & 0x80)) return (this[offset])
	    return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 2, this.length)
	    var val = this[offset] | (this[offset + 1] << 8)
	    return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 2, this.length)
	    var val = this[offset + 1] | (this[offset] << 8)
	    return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 4, this.length)

	    return (this[offset]) |
	        (this[offset + 1] << 8) |
	        (this[offset + 2] << 16) |
	        (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 4, this.length)

	    return (this[offset] << 24) |
	        (this[offset + 1] << 16) |
	        (this[offset + 2] << 8) |
	        (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 4, this.length)
	    return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 4, this.length)
	    return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 8, this.length)
	    return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	    if (!noAssert) checkOffset(offset, 8, this.length)
	    return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	    if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	    value = +value
	    offset = offset | 0
	    byteLength = byteLength | 0
	    if (!noAssert) {
	        var maxBytes = Math.pow(2, 8 * byteLength) - 1
	        checkInt(this, value, offset, byteLength, maxBytes, 0)
	    }

	    var mul = 1
	    var i = 0
	    this[offset] = value & 0xFF
	    while (++i < byteLength && (mul *= 0x100)) {
	        this[offset + i] = (value / mul) & 0xFF
	    }

	    return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	    value = +value
	    offset = offset | 0
	    byteLength = byteLength | 0
	    if (!noAssert) {
	        var maxBytes = Math.pow(2, 8 * byteLength) - 1
	        checkInt(this, value, offset, byteLength, maxBytes, 0)
	    }

	    var i = byteLength - 1
	    var mul = 1
	    this[offset + i] = value & 0xFF
	    while (--i >= 0 && (mul *= 0x100)) {
	        this[offset + i] = (value / mul) & 0xFF
	    }

	    return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	    this[offset] = (value & 0xff)
	    return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	    if (value < 0) value = 0xffff + value + 1
	    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	            (littleEndian ? i : 1 - i) * 8
	    }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value & 0xff)
	        this[offset + 1] = (value >>> 8)
	    } else {
	        objectWriteUInt16(this, value, offset, true)
	    }
	    return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value >>> 8)
	        this[offset + 1] = (value & 0xff)
	    } else {
	        objectWriteUInt16(this, value, offset, false)
	    }
	    return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	    if (value < 0) value = 0xffffffff + value + 1
	    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	        buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	    }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset + 3] = (value >>> 24)
	        this[offset + 2] = (value >>> 16)
	        this[offset + 1] = (value >>> 8)
	        this[offset] = (value & 0xff)
	    } else {
	        objectWriteUInt32(this, value, offset, true)
	    }
	    return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value >>> 24)
	        this[offset + 1] = (value >>> 16)
	        this[offset + 2] = (value >>> 8)
	        this[offset + 3] = (value & 0xff)
	    } else {
	        objectWriteUInt32(this, value, offset, false)
	    }
	    return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) {
	        var limit = Math.pow(2, 8 * byteLength - 1)

	        checkInt(this, value, offset, byteLength, limit - 1, -limit)
	    }

	    var i = 0
	    var mul = 1
	    var sub = 0
	    this[offset] = value & 0xFF
	    while (++i < byteLength && (mul *= 0x100)) {
	        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	            sub = 1
	        }
	        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	    }

	    return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) {
	        var limit = Math.pow(2, 8 * byteLength - 1)

	        checkInt(this, value, offset, byteLength, limit - 1, -limit)
	    }

	    var i = byteLength - 1
	    var mul = 1
	    var sub = 0
	    this[offset + i] = value & 0xFF
	    while (--i >= 0 && (mul *= 0x100)) {
	        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	            sub = 1
	        }
	        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	    }

	    return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	    if (value < 0) value = 0xff + value + 1
	    this[offset] = (value & 0xff)
	    return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value & 0xff)
	        this[offset + 1] = (value >>> 8)
	    } else {
	        objectWriteUInt16(this, value, offset, true)
	    }
	    return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value >>> 8)
	        this[offset + 1] = (value & 0xff)
	    } else {
	        objectWriteUInt16(this, value, offset, false)
	    }
	    return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value & 0xff)
	        this[offset + 1] = (value >>> 8)
	        this[offset + 2] = (value >>> 16)
	        this[offset + 3] = (value >>> 24)
	    } else {
	        objectWriteUInt32(this, value, offset, true)
	    }
	    return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	    value = +value
	    offset = offset | 0
	    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	    if (value < 0) value = 0xffffffff + value + 1
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	        this[offset] = (value >>> 24)
	        this[offset + 1] = (value >>> 16)
	        this[offset + 2] = (value >>> 8)
	        this[offset + 3] = (value & 0xff)
	    } else {
	        objectWriteUInt32(this, value, offset, false)
	    }
	    return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	    if (offset + ext > buf.length) throw new RangeError('Index out of range')
	    if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	    if (!noAssert) {
	        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	    }
	    ieee754.write(buf, value, offset, littleEndian, 23, 4)
	    return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	    return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	    return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	    if (!noAssert) {
	        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	    }
	    ieee754.write(buf, value, offset, littleEndian, 52, 8)
	    return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	    return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	    return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	    if (!start) start = 0
	    if (!end && end !== 0) end = this.length
	    if (targetStart >= target.length) targetStart = target.length
	    if (!targetStart) targetStart = 0
	    if (end > 0 && end < start) end = start

	    // Copy 0 bytes; we're done
	    if (end === start) return 0
	    if (target.length === 0 || this.length === 0) return 0

	    // Fatal error conditions
	    if (targetStart < 0) {
	        throw new RangeError('targetStart out of bounds')
	    }
	    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	    if (end < 0) throw new RangeError('sourceEnd out of bounds')

	    // Are we oob?
	    if (end > this.length) end = this.length
	    if (target.length - targetStart < end - start) {
	        end = target.length - targetStart + start
	    }

	    var len = end - start
	    var i

	    if (this === target && start < targetStart && targetStart < end) {
	        // descending copy from end
	        for (i = len - 1; i >= 0; i--) {
	            target[i + targetStart] = this[i + start]
	        }
	    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	        // ascending copy from start
	        for (i = 0; i < len; i++) {
	            target[i + targetStart] = this[i + start]
	        }
	    } else {
	        Uint8Array.prototype.set.call(
	            target,
	            this.subarray(start, start + len),
	            targetStart
	        )
	    }

	    return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	    // Handle string cases:
	    if (typeof val === 'string') {
	        if (typeof start === 'string') {
	            encoding = start
	            start = 0
	            end = this.length
	        } else if (typeof end === 'string') {
	            encoding = end
	            end = this.length
	        }
	        if (val.length === 1) {
	            var code = val.charCodeAt(0)
	            if (code < 256) {
	                val = code
	            }
	        }
	        if (encoding !== undefined && typeof encoding !== 'string') {
	            throw new TypeError('encoding must be a string')
	        }
	        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	            throw new TypeError('Unknown encoding: ' + encoding)
	        }
	    } else if (typeof val === 'number') {
	        val = val & 255
	    }

	    // Invalid ranges are not set to a default, so can range check early.
	    if (start < 0 || this.length < start || this.length < end) {
	        throw new RangeError('Out of range index')
	    }

	    if (end <= start) {
	        return this
	    }

	    start = start >>> 0
	    end = end === undefined ? this.length : end >>> 0

	    if (!val) val = 0

	    var i
	    if (typeof val === 'number') {
	        for (i = start; i < end; i++) {
	            this[i] = val
	        }
	    } else {
	        var bytes = Buffer.isBuffer(val)
	            ? val
	            : utf8ToBytes(new Buffer(val, encoding).toString())
	        var len = bytes.length
	        for (i = 0; i < end - start; i++) {
	            this[i + start] = bytes[i % len]
	        }
	    }

	    return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	    // Node strips out invalid characters like \n and \t from the string, base64-js does not
	    str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	    // Node converts strings with length < 2 to ''
	    if (str.length < 2) return ''
	    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	    while (str.length % 4 !== 0) {
	        str = str + '='
	    }
	    return str
	}

	function stringtrim (str) {
	    if (str.trim) return str.trim()
	    return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	    if (n < 16) return '0' + n.toString(16)
	    return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	    units = units || Infinity
	    var codePoint
	    var length = string.length
	    var leadSurrogate = null
	    var bytes = []

	    for (var i = 0; i < length; i++) {
	        codePoint = string.charCodeAt(i)

	        // is surrogate component
	        if (codePoint > 0xD7FF && codePoint < 0xE000) {
	            // last char was a lead
	            if (!leadSurrogate) {
	                // no lead yet
	                if (codePoint > 0xDBFF) {
	                    // unexpected trail
	                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	                    continue
	                } else if (i + 1 === length) {
	                    // unpaired lead
	                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	                    continue
	                }

	                // valid lead
	                leadSurrogate = codePoint

	                continue
	            }

	            // 2 leads in a row
	            if (codePoint < 0xDC00) {
	                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	                leadSurrogate = codePoint
	                continue
	            }

	            // valid surrogate pair
	            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	        } else if (leadSurrogate) {
	            // valid bmp char, but last char was a lead
	            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        }

	        leadSurrogate = null

	        // encode utf8
	        if (codePoint < 0x80) {
	            if ((units -= 1) < 0) break
	            bytes.push(codePoint)
	        } else if (codePoint < 0x800) {
	            if ((units -= 2) < 0) break
	            bytes.push(
	                codePoint >> 0x6 | 0xC0,
	                codePoint & 0x3F | 0x80
	            )
	        } else if (codePoint < 0x10000) {
	            if ((units -= 3) < 0) break
	            bytes.push(
	                codePoint >> 0xC | 0xE0,
	                codePoint >> 0x6 & 0x3F | 0x80,
	                codePoint & 0x3F | 0x80
	            )
	        } else if (codePoint < 0x110000) {
	            if ((units -= 4) < 0) break
	            bytes.push(
	                codePoint >> 0x12 | 0xF0,
	                codePoint >> 0xC & 0x3F | 0x80,
	                codePoint >> 0x6 & 0x3F | 0x80,
	                codePoint & 0x3F | 0x80
	            )
	        } else {
	            throw new Error('Invalid code point')
	        }
	    }

	    return bytes
	}

	function asciiToBytes (str) {
	    var byteArray = []
	    for (var i = 0; i < str.length; i++) {
	        // Node's code seems to be doing this and not & 0x7F..
	        byteArray.push(str.charCodeAt(i) & 0xFF)
	    }
	    return byteArray
	}

	function utf16leToBytes (str, units) {
	    var c, hi, lo
	    var byteArray = []
	    for (var i = 0; i < str.length; i++) {
	        if ((units -= 2) < 0) break

	        c = str.charCodeAt(i)
	        hi = c >> 8
	        lo = c % 256
	        byteArray.push(lo)
	        byteArray.push(hi)
	    }

	    return byteArray
	}

	function base64ToBytes (str) {
	    return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	    for (var i = 0; i < length; i++) {
	        if ((i + offset >= dst.length) || (i >= src.length)) break
	        dst[i + offset] = src[i]
	    }
	    return i
	}

	function isnan (val) {
	    return val !== val // eslint-disable-line no-self-compare
	}





	// Support to print Buffer in console, maybe wrap it in __DEBUG__


	function toChar(num) {
	    if(num < 30) return '.';
	    else return String.fromCharCode(num);
	}

	function printBuffer(buf) {
	    var int_size = 8;
	    var ints = Math.ceil(buf.length / int_size);
	    var lines = [];

	    for(var j = 0; j < ints; j++) {
	        var parts = [];
	        var chars = [];

	        var addr = '';
	        addr = (j * int_size).toString();
	        if(addr.length < 6)
	            addr = (new Array(7 - addr.length)).join('0') + addr;

	        parts.push(addr + ' ');

	        for(var m = 0; m < int_size; m++) {
	            var index = (j * int_size) + m;
	            if(index >= buf.length) break;
	            var char = buf[index];
	            chars.push(toChar(char));
	            var hex = char.toString(16);
	            if(hex.length === 1) hex = '0' + hex;
	            parts.push(hex);
	        }

	        var len = parts.join(' ').length;
	        if(len < 32) parts.push((new Array(32 - len)).join(' '));
	        else parts.push('  ');
	        parts.push(chars.join(''));
	        lines.push(parts.join(' '));
	    }

	    var str = lines.join('\n');
	    console.log(str);
	}

	Buffer.prototype.print = function() {
	    printBuffer(this);
	};

	// DEPRECATED: this should be removed, use `StaticBuffer` instead.
	Buffer.prototype.getAddress = function(offset) {
	    if(!offset) offset = 0;
	    offset += this.byteOffset;
	    return this.buffer.getAddress(offset);
	};



/***/ },
/* 3 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports.StaticArrayBuffer = StaticArrayBuffer;

	// new StaticArrayBuffer(size);
	// StaticArrayBuffer.frame(address, size);
	// StaticArrayBuffer.alloc(size, protection);


	function prot2num(prot) {
	    if(typeof prot !== 'string')
	        throw TypeError('Protection must be a string.');
	    if(prot.match(/[^rwe]/))
	        throw TypeError('Protection string can contain only "r", "w" and "e" characters, given "' + prot + '".');

	    var val = 0 /* PROT_NONE */;
	    if(prot.indexOf('r') > -1) val |= 1 /* PROT_READ */;
	    if(prot.indexOf('w') > -1) val |= 2 /* PROT_WRITE */;
	    if(prot.indexOf('e') > -1) val |= 4 /* PROT_EXEC */;
	    return val;
	}


	// "frame" because it does not allocate,
	// just frames a slice of memory into ArrayBuffer.
	function frame(addr, size) {
	    var ab = process.frame(addr, size);
	    if(!(ab instanceof ArrayBuffer))
	        throw Error('Could not allocate ArrayBuffer.');
	    return ab;
	}


	function alloc(size, prot) {
	    if (typeof size !== 'number')
	        throw TypeError('size must be a number.');
	    if (size < 0)
	        throw TypeError('Invalid size argument.');

	    if (!prot) prot = 'rw';

	    var flags = 2 /* MAP_PRIVATE */ | 32 /* MAP_ANONYMOUS */;
	    var protnum = prot2num(prot);
	    var libjs = __webpack_require__(6);
	    var addr = libjs.mmap(0, size, protnum, flags, -1, 0);

	    // Address in 64-bit x86 can be negative and errors are from -1 to -124.
	    if ((addr[1] === -1) && ((addr[0] < 0) && (addr[0] > -125)))
	        throw Error('Could not allocate memory.');

	    var ab = frame(addr, size);
	    return ab;
	}


	// Two constructors, one exposed externally to user:
	//
	//  1. new StaticArrayBuffer(size)
	//
	// Another one that we just use internally here:
	//
	//  2. new StaticArrayBuffer(arrayBuffer);
	//
	function StaticArrayBuffer(size) {
	    var ab;
	    if(size instanceof ArrayBuffer) {
	        ab = size;
	    } else {
	        ab = new ArrayBuffer(size); // Let's pray it's actually 'static'.
	    }
	    ab.__proto__ = StaticArrayBuffer.prototype;
	    return ab;
	}


	// # Static methods

	// StaticArrayBuffers allocated with `alloc` have to be (currently) freed using `buffer.free`.
	StaticArrayBuffer.alloc = function(size, prot) {
	    return new StaticArrayBuffer(alloc(size, prot));
	};

	StaticArrayBuffer.frame = function(addr, size) {
	    return new StaticArrayBuffer(frame(addr, size));
	};

	StaticArrayBuffer.isStaticArrayBuffer = function(sab) {
	    if((sab instanceof StaticArrayBuffer) && (typeof sab.getAddress === 'function')) return true;
	    return false;
	};



	StaticArrayBuffer.prototype.__proto__ =
	    ArrayBuffer.prototype;



	// # Member instance methods

	StaticArrayBuffer.prototype.call = function(offset, args) {
	    if(typeof offset !== 'number') offset = 0;
	    if(offset < 0) offset = 0;
	    if(!isFinite(offset)) offset = 0;

	    if(!(args instanceof Array)) args = [];

	    return process.call(this, offset, args);
	};

	StaticArrayBuffer.prototype.setProtection = function(prot) {
	    var protnum = prot2num(prot);
	    // return libjs.mprotect(this, this.length, protnum);
	    var libjs = __webpack_require__(6);
	    var res = libjs.mprotect(this, this.length, protnum);
	    if(res < -1)
	        throw Error('Could not change protection level.');
	};

	StaticArrayBuffer.prototype.free = function() {
	    var libjs = __webpack_require__(6);
	    var res = libjs.munmap(this, this.length);
	    if(res < 0)
	        throw Error('Error on freeing memory.');
	};

	StaticArrayBuffer.prototype.getAddress = function(offset) {
	    return process.getAddress(this, offset);
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var p = process;
	var syscall = p.syscall;
	var syscall64 = p.syscall64;
	function malloc(size) {
	    return new Buffer(size);
	}
	var x86_64_linux_1 = __webpack_require__(7);
	var types = __webpack_require__(7);
	__export(__webpack_require__(7));
	exports.arch = {
	    isLE: true,
	    kernel: 'linux',
	    int: 64,
	    SYS: x86_64_linux_1.SYS,
	    types: types
	};
	__export(__webpack_require__(10));
	__export(__webpack_require__(9));
	function noop() { }
	function read(fd, buf) {
	    return syscall(x86_64_linux_1.SYS.read, fd, buf, buf.length);
	}
	exports.read = read;
	function readAsync(fd, buf, callback) {
	    p.asyscall(x86_64_linux_1.SYS.read, fd, buf, buf.length, callback);
	}
	exports.readAsync = readAsync;
	function write(fd, buf) {
	    if (!(buf instanceof Buffer))
	        buf = new Buffer(buf + '\0');
	    return syscall(x86_64_linux_1.SYS.write, fd, buf, buf.length);
	}
	exports.write = write;
	function writeAsync(fd, buf, callback) {
	    if (!(buf instanceof Buffer))
	        buf = new Buffer(buf + '\0');
	    return syscall(x86_64_linux_1.SYS.write, fd, buf, buf.length, callback);
	}
	exports.writeAsync = writeAsync;
	function open(pathname, flags, mode) {
	    var args = [x86_64_linux_1.SYS.open, pathname, flags];
	    if (typeof mode === 'number')
	        args.push(mode);
	    return syscall.apply(null, args);
	}
	exports.open = open;
	function openAsync(pathname, flags, mode, callback) {
	    p.asyscall(x86_64_linux_1.SYS.open, pathname, flags, mode, callback);
	}
	exports.openAsync = openAsync;
	function close(fd) {
	    return syscall(x86_64_linux_1.SYS.close, fd);
	}
	exports.close = close;
	function closeAsync(fd, callback) {
	    p.asyscall(x86_64_linux_1.SYS.close, fd, callback);
	}
	exports.closeAsync = closeAsync;
	function access(pathname, mode) {
	    return syscall(x86_64_linux_1.SYS.access, pathname, mode);
	}
	exports.access = access;
	function accessAsync(pathname, mode, callback) {
	    p.asyscall(x86_64_linux_1.SYS.access, pathname, mode, callback);
	}
	exports.accessAsync = accessAsync;
	function chmod(pathname, mode) {
	    return syscall(x86_64_linux_1.SYS.chmod, pathname, mode);
	}
	exports.chmod = chmod;
	function chmodAsync(pathname, mode, callback) {
	    p.asyscall(x86_64_linux_1.SYS.chmod, pathname, mode, callback);
	}
	exports.chmodAsync = chmodAsync;
	function fchmod(fd, mode) {
	    return syscall(x86_64_linux_1.SYS.chmod, fd, mode);
	}
	exports.fchmod = fchmod;
	function fchmodAsync(fd, mode, callback) {
	    p.asyscall(x86_64_linux_1.SYS.chmod, fd, mode, callback);
	}
	exports.fchmodAsync = fchmodAsync;
	function chown(pathname, owner, group) {
	    return syscall(x86_64_linux_1.SYS.chown, pathname, owner, group);
	}
	exports.chown = chown;
	function chownAsync(pathname, owner, group, callback) {
	    p.asyscall(x86_64_linux_1.SYS.chown, pathname, owner, group, callback);
	}
	exports.chownAsync = chownAsync;
	function fchown(fd, owner, group) {
	    return syscall(x86_64_linux_1.SYS.fchown, fd, owner, group);
	}
	exports.fchown = fchown;
	function fchownAsync(fd, owner, group, callback) {
	    p.asyscall(x86_64_linux_1.SYS.fchown, fd, owner, group, callback);
	}
	exports.fchownAsync = fchownAsync;
	function lchown(pathname, owner, group) {
	    return syscall(x86_64_linux_1.SYS.lchown, pathname, owner, group);
	}
	exports.lchown = lchown;
	function lchownAsync(pathname, owner, group, callback) {
	    p.asyscall(x86_64_linux_1.SYS.lchown, pathname, owner, group, callback);
	}
	exports.lchownAsync = lchownAsync;
	function fsync(fd) {
	    return syscall(x86_64_linux_1.SYS.fsync, fd);
	}
	exports.fsync = fsync;
	function fsyncAsync(fd, callback) {
	    p.asyscall(x86_64_linux_1.SYS.fsync, fd, callback);
	}
	exports.fsyncAsync = fsyncAsync;
	function fdatasync(fd) {
	    return syscall(x86_64_linux_1.SYS.fdatasync, fd);
	}
	exports.fdatasync = fdatasync;
	function fdatasyncAsync(fd, callback) {
	    p.asyscall(x86_64_linux_1.SYS.fdatasync, fd, callback);
	}
	exports.fdatasyncAsync = fdatasyncAsync;
	function stat(filepath) {
	    var buf = new Buffer(types.stat.size + 200);
	    var result = syscall(x86_64_linux_1.SYS.stat, filepath, buf);
	    if (result == 0)
	        return types.stat.unpack(buf);
	    throw result;
	}
	exports.stat = stat;
	function __unpackStats(buf, result, callback) {
	    if (result === 0) {
	        try {
	            callback(null, types.stat.unpack(buf));
	        }
	        catch (e) {
	            callback(e);
	        }
	    }
	    else
	        callback(result);
	}
	function statAsync(filepath, callback) {
	    var buf = new Buffer(types.stat.size + 100);
	    p.asyscall(x86_64_linux_1.SYS.stat, filepath, buf, function (result) { return __unpackStats(buf, result, callback); });
	}
	exports.statAsync = statAsync;
	function lstat(linkpath) {
	    var buf = new Buffer(types.stat.size + 100);
	    var result = syscall(x86_64_linux_1.SYS.lstat, linkpath, buf);
	    if (result == 0)
	        return types.stat.unpack(buf);
	    throw result;
	}
	exports.lstat = lstat;
	function lstatAsync(linkpath, callback) {
	    var buf = new Buffer(types.stat.size + 100);
	    p.asyscall(x86_64_linux_1.SYS.lstat, linkpath, buf, function (result) { return __unpackStats(buf, result, callback); });
	}
	exports.lstatAsync = lstatAsync;
	function fstat(fd) {
	    var buf = new Buffer(types.stat.size + 100);
	    var result = syscall(x86_64_linux_1.SYS.fstat, fd, buf);
	    if (result == 0)
	        return types.stat.unpack(buf);
	    throw result;
	}
	exports.fstat = fstat;
	function fstatAsync(fd, callback) {
	    var buf = new Buffer(types.stat.size + 100);
	    p.asyscall(x86_64_linux_1.SYS.fstat, fd, buf, function (result) { return __unpackStats(buf, result, callback); });
	}
	exports.fstatAsync = fstatAsync;
	function truncate(path, length) {
	    return syscall(x86_64_linux_1.SYS.truncate, path, length);
	}
	exports.truncate = truncate;
	function truncateAsync(path, length, callback) {
	    p.asyscall(x86_64_linux_1.SYS.truncate, path, length, callback);
	}
	exports.truncateAsync = truncateAsync;
	function ftruncate(fd, length) {
	    return syscall(x86_64_linux_1.SYS.ftruncate, fd, length);
	}
	exports.ftruncate = ftruncate;
	function ftruncateAsync(fd, length, callback) {
	    p.asyscall(x86_64_linux_1.SYS.ftruncate, fd, length, callback);
	}
	exports.ftruncateAsync = ftruncateAsync;
	function lseek(fd, offset, whence) {
	    return syscall(x86_64_linux_1.SYS.lseek, fd, offset, whence);
	}
	exports.lseek = lseek;
	function lseekAsync(fd, offset, whence, callback) {
	    p.asyscall(x86_64_linux_1.SYS.lseek, fd, offset, whence, callback);
	}
	exports.lseekAsync = lseekAsync;
	function rename(oldpath, newpath) {
	    return syscall(x86_64_linux_1.SYS.rename, oldpath, newpath);
	}
	exports.rename = rename;
	function renameAsync(oldpath, newpath, callback) {
	    p.asyscall(x86_64_linux_1.SYS.rename, oldpath, newpath, callback);
	}
	exports.renameAsync = renameAsync;
	function mkdir(pathname, mode) {
	    return syscall(x86_64_linux_1.SYS.mkdir, pathname, mode);
	}
	exports.mkdir = mkdir;
	function mkdirAsync(pathname, mode, callback) {
	    p.asyscall(x86_64_linux_1.SYS.mkdir, pathname, mode, callback);
	}
	exports.mkdirAsync = mkdirAsync;
	function mkdirat(dirfd, pathname, mode) {
	    return syscall(x86_64_linux_1.SYS.mkdirat, dirfd, pathname, mode);
	}
	exports.mkdirat = mkdirat;
	function mkdiratAsync(dirfd, pathname, mode, callback) {
	    p.asyscall(x86_64_linux_1.SYS.mkdirat, dirfd, pathname, mode, callback);
	}
	exports.mkdiratAsync = mkdiratAsync;
	function rmdir(pathname) {
	    return syscall(x86_64_linux_1.SYS.rmdir, pathname);
	}
	exports.rmdir = rmdir;
	function rmdirAsync(pathname, callback) {
	    p.asyscall(x86_64_linux_1.SYS.rmdir, pathname, callback);
	}
	exports.rmdirAsync = rmdirAsync;
	function getcwd() {
	    var buf = new Buffer(264);
	    var res = syscall(x86_64_linux_1.SYS.getcwd, buf, buf.length);
	    if (res < 0) {
	        if (res === -34) {
	            buf = new Buffer(4096);
	            res = syscall(x86_64_linux_1.SYS.getcwd, buf, buf.length);
	            if (res < 0)
	                throw res;
	        }
	        else
	            throw res;
	    }
	    return buf.slice(0, res - 1).toString();
	}
	exports.getcwd = getcwd;
	function getcwdAsync(callback) {
	    var buf = new Buffer(264);
	    p.asyscall(x86_64_linux_1.SYS.getcwd, buf, buf.length, function (res) {
	        if (res < 0) {
	            if (res === -34) {
	                buf = new Buffer(4096);
	                p.asyscall(x86_64_linux_1.SYS.getcwd, buf, buf.length, function (res) {
	                    if (res < 0)
	                        callback(res);
	                    else
	                        callback(null, buf.slice(0, res).toString());
	                });
	            }
	            else
	                callback(res);
	        }
	        callback(null, buf.slice(0, res).toString());
	    });
	}
	exports.getcwdAsync = getcwdAsync;
	function getdents64(fd, dirp) {
	    return syscall(x86_64_linux_1.SYS.getdents64, fd, dirp, dirp.length);
	}
	exports.getdents64 = getdents64;
	function getdents64Async(fd, dirp, callback) {
	    p.asyscall(x86_64_linux_1.SYS.getdents64, fd, dirp, dirp.length, callback);
	}
	exports.getdents64Async = getdents64Async;
	function readdir(path, encoding) {
	    if (encoding === void 0) { encoding = 'utf8'; }
	    var fd = open(path, 0 | 65536);
	    if (fd < 0)
	        throw fd;
	    var buf = new Buffer(4096);
	    var struct = types.linux_dirent64;
	    var list = [];
	    var res = getdents64(fd, buf);
	    do {
	        var offset = 0;
	        while (offset + struct.size < res) {
	            var unpacked = struct.unpack(buf, offset);
	            var name = buf.slice(offset + struct.size, offset + unpacked.d_reclen).toString(encoding);
	            name = name.substr(0, name.indexOf("\0"));
	            var entry = {
	                ino: unpacked.ino64_t,
	                offset: unpacked.off64_t[0],
	                type: unpacked.d_type,
	                name: name
	            };
	            list.push(entry);
	            offset += unpacked.d_reclen;
	        }
	        res = getdents64(fd, buf);
	    } while (res > 0);
	    if (res < 0)
	        throw res;
	    close(fd);
	    return list;
	}
	exports.readdir = readdir;
	function readdirList(path, encoding) {
	    if (encoding === void 0) { encoding = 'utf8'; }
	    var fd = open(path, 65536);
	    if (fd < 0)
	        throw fd;
	    var buf = new Buffer(4096);
	    var struct = types.linux_dirent64;
	    var list = [];
	    var res = getdents64(fd, buf);
	    do {
	        var offset = 0;
	        while (offset + struct.size < res) {
	            var unpacked = struct.unpack(buf, offset);
	            var name = buf.slice(offset + struct.size, offset + unpacked.d_reclen).toString(encoding);
	            name = name.substr(0, name.indexOf("\0"));
	            if ((name != '.') && (name != '..'))
	                list.push(name);
	            offset += unpacked.d_reclen;
	        }
	        res = getdents64(fd, buf);
	    } while (res > 0);
	    if (res < 0)
	        throw res;
	    close(fd);
	    return list;
	}
	exports.readdirList = readdirList;
	function readdirListAsync(path, encoding, callback) {
	    if (encoding === void 0) { encoding = 'utf8'; }
	    openAsync(path, 65536, 0, function (fd) {
	        if (fd < 0)
	            return callback(fd);
	        var buf = new StaticBuffer(4096);
	        var struct = types.linux_dirent64;
	        var list = [];
	        function done() {
	            closeAsync(fd, noop);
	            callback(null, list);
	        }
	        function loop() {
	            getdents64Async(fd, buf, function (res) {
	                if (res < 0) {
	                    callback(res);
	                    return;
	                }
	                var offset = 0;
	                while (offset + struct.size < res) {
	                    var unpacked = struct.unpack(buf, offset);
	                    var name = buf.slice(offset + struct.size, offset + unpacked.d_reclen).toString(encoding);
	                    name = name.substr(0, name.indexOf("\0"));
	                    if ((name != '.') && (name != '..'))
	                        list.push(name);
	                    offset += unpacked.d_reclen;
	                }
	                if (res > 0)
	                    loop();
	                else
	                    done();
	            });
	        }
	        loop();
	    });
	}
	exports.readdirListAsync = readdirListAsync;
	function symlink(target, linkpath) {
	    return syscall(x86_64_linux_1.SYS.symlink, target, linkpath);
	}
	exports.symlink = symlink;
	function symlinkAsync(target, linkpath, callback) {
	    p.asyscall(x86_64_linux_1.SYS.symlink, target, linkpath, callback);
	}
	exports.symlinkAsync = symlinkAsync;
	function unlink(pathname) {
	    return syscall(x86_64_linux_1.SYS.unlink, pathname);
	}
	exports.unlink = unlink;
	function unlinkAsync(pathname, callback) {
	    p.asyscall(x86_64_linux_1.SYS.unlink, pathname, callback);
	}
	exports.unlinkAsync = unlinkAsync;
	function readlink(pathname) {
	    var sb = new StaticBuffer(types.PATH_MAX);
	    var bytes = syscall(x86_64_linux_1.SYS.readlink, pathname, sb, sb.length);
	    if (bytes < 0)
	        throw bytes;
	    else
	        return sb.slice(0, bytes).toString();
	}
	exports.readlink = readlink;
	function readlinkAsync(pathname, callback) {
	    var sb = new StaticBuffer(types.PATH_MAX);
	    p.asyscall(x86_64_linux_1.SYS.readlink, pathname, sb, sb.length, function (bytes) {
	        if (bytes < 0)
	            callback(bytes);
	        else
	            callback(bytes, sb.slice(0, bytes).toString());
	    });
	}
	exports.readlinkAsync = readlinkAsync;
	function link(oldpath, newpath) {
	    return syscall(x86_64_linux_1.SYS.link, oldpath, newpath);
	}
	exports.link = link;
	function linkAsync(oldpath, newpath, callback) {
	    p.asyscall(x86_64_linux_1.SYS.link, oldpath, newpath, callback);
	}
	exports.linkAsync = linkAsync;
	function utime(filename, times) {
	    var buf = types.utimbuf.pack(times);
	    return syscall(x86_64_linux_1.SYS.utime, filename, buf);
	}
	exports.utime = utime;
	function utimeAsync(filename, times, callback) {
	    var buf = types.utimbuf.pack(times);
	    p.asyscall(x86_64_linux_1.SYS.utime, filename, buf, callback);
	}
	exports.utimeAsync = utimeAsync;
	function utimes(filename, times) {
	    var buf = types.timevalarr.pack(times);
	    return syscall(x86_64_linux_1.SYS.utimes, buf);
	}
	exports.utimes = utimes;
	function utimesAsync(filename, times, callback) {
	    var buf = types.timevalarr.pack(times);
	    p.asyscall(x86_64_linux_1.SYS.utimes, buf, callback);
	}
	exports.utimesAsync = utimesAsync;
	function socket(domain, type, protocol) {
	    return syscall(x86_64_linux_1.SYS.socket, domain, type, protocol);
	}
	exports.socket = socket;
	function socketAsync(domain, type, protocol, callback) {
	    p.asyscall(x86_64_linux_1.SYS.socket, domain, type, protocol, callback);
	}
	exports.socketAsync = socketAsync;
	function connect(fd, sockaddr) {
	    var buf = types.sockaddr_in.pack(sockaddr);
	    return syscall(x86_64_linux_1.SYS.connect, fd, buf, buf.length);
	}
	exports.connect = connect;
	function connectAsync(fd, sockaddr, callback) {
	    var buf = types.sockaddr_in.pack(sockaddr);
	    p.asyscall(x86_64_linux_1.SYS.connect, fd, buf, buf.length, callback);
	}
	exports.connectAsync = connectAsync;
	function bind(fd, sockaddr, addr_type) {
	    var buf = addr_type.pack(sockaddr);
	    return syscall(x86_64_linux_1.SYS.bind, fd, buf, buf.length);
	}
	exports.bind = bind;
	function bindAsync(fd, sockaddr, addr_type, callback) {
	    var buf = addr_type.pack(sockaddr);
	    p.asyscall(x86_64_linux_1.SYS.bind, fd, buf, buf.length, callback);
	}
	exports.bindAsync = bindAsync;
	function listen(fd, backlog) {
	    return syscall(x86_64_linux_1.SYS.listen, fd, backlog);
	}
	exports.listen = listen;
	function listenAsync(fd, backlog, callback) {
	    p.asyscall(x86_64_linux_1.SYS.listen, fd, backlog, callback);
	}
	exports.listenAsync = listenAsync;
	function accept(fd, buf) {
	    var buflen = types.int32.pack(buf.length);
	    return syscall(x86_64_linux_1.SYS.accept, fd, buf, buflen);
	}
	exports.accept = accept;
	function acceptAsync(fd, buf, callback) {
	    var buflen = types.int32.pack(buf.length);
	    p.asyscall(x86_64_linux_1.SYS.accept, fd, buf, buflen, callback);
	}
	exports.acceptAsync = acceptAsync;
	function accept4(fd, buf, flags) {
	    var buflen = types.int32.pack(buf.length);
	    return syscall(x86_64_linux_1.SYS.accept4, fd, buf, buflen, flags);
	}
	exports.accept4 = accept4;
	function accept4Async(fd, buf, flags, callback) {
	    var buflen = types.int32.pack(buf.length);
	    p.asyscall(x86_64_linux_1.SYS.accept4, fd, buf, buflen, flags, callback);
	}
	exports.accept4Async = accept4Async;
	function shutdown(fd, how) {
	    return syscall(x86_64_linux_1.SYS.shutdown, fd, how);
	}
	exports.shutdown = shutdown;
	function shutdownAsync(fd, how, callback) {
	    p.asyscall(x86_64_linux_1.SYS.shutdown, fd, how, callback);
	}
	exports.shutdownAsync = shutdownAsync;
	function send(fd, buf, flags) {
	    if (flags === void 0) { flags = 0; }
	    return sendto(fd, buf, flags);
	}
	exports.send = send;
	function sendAsync(fd, buf, flags, callback) {
	    if (flags === void 0) { flags = 0; }
	    sendtoAsync(fd, buf, flags, null, null, callback);
	}
	exports.sendAsync = sendAsync;
	function sendto(fd, buf, flags, addr, addr_type) {
	    if (flags === void 0) { flags = 0; }
	    var params = [x86_64_linux_1.SYS.sendto, fd, buf, buf.length, flags, 0, 0];
	    if (addr) {
	        var addrbuf = addr_type.pack(addr);
	        params[5] = addrbuf;
	        params[6] = addrbuf.length;
	    }
	    return syscall.apply(null, params);
	}
	exports.sendto = sendto;
	function sendtoAsync(fd, buf, flags, addr, addr_type, callback) {
	    if (flags === void 0) { flags = 0; }
	    var params = [x86_64_linux_1.SYS.sendto, fd, buf, buf.length, flags, 0, 0, callback];
	    if (addr) {
	        var addrbuf = addr_type.pack(addr);
	        params[5] = addrbuf;
	        params[6] = addrbuf.length;
	    }
	    syscall.apply(null, params);
	}
	exports.sendtoAsync = sendtoAsync;
	function recv(sockfd, buf, flags) {
	    if (flags === void 0) { flags = 0; }
	    return recvfrom(sockfd, buf, flags);
	}
	exports.recv = recv;
	function recvAsync(sockfd, buf, flags, callback) {
	    if (flags === void 0) { flags = 0; }
	    recvfromAsync(sockfd, buf, flags, null, null, callback);
	}
	exports.recvAsync = recvAsync;
	function recvfrom(sockfd, buf, flags, addr, addr_type) {
	    var args = [x86_64_linux_1.SYS.recvfrom, sockfd, buf, buf.length, flags, 0, 0];
	    if (addr) {
	        var addrbuf = addr_type.pack(addr);
	        args[5] = addrbuf;
	        args[6] = addrbuf.length;
	    }
	    return syscall.apply(null, args);
	}
	exports.recvfrom = recvfrom;
	function recvfromAsync(sockfd, buf, flags, addr, addr_type, callback) {
	    var args = [x86_64_linux_1.SYS.recvfrom, sockfd, buf, buf.length, flags, 0, 0, callback];
	    if (addr) {
	        var addrbuf = addr_type.pack(addr);
	        args[5] = addrbuf;
	        args[6] = addrbuf.length;
	    }
	    p.asyscall.apply(null, args);
	}
	exports.recvfromAsync = recvfromAsync;
	function setsockopt(sockfd, level, optname, optval) {
	    return syscall(x86_64_linux_1.SYS.setsockopt, sockfd, level, optname, optval, optval.length);
	}
	exports.setsockopt = setsockopt;
	function getpid() {
	    return syscall(x86_64_linux_1.SYS.getpid);
	}
	exports.getpid = getpid;
	function getppid() {
	    return syscall(x86_64_linux_1.SYS.getppid);
	}
	exports.getppid = getppid;
	function getppidAsync(callback) {
	    p.asyscall(x86_64_linux_1.SYS.getppid, callback);
	}
	exports.getppidAsync = getppidAsync;
	function getuid() {
	    return syscall(x86_64_linux_1.SYS.getuid);
	}
	exports.getuid = getuid;
	function geteuid() {
	    return syscall(x86_64_linux_1.SYS.geteuid);
	}
	exports.geteuid = geteuid;
	function getgid() {
	    return syscall(x86_64_linux_1.SYS.getgid);
	}
	exports.getgid = getgid;
	function getegid() {
	    return syscall(x86_64_linux_1.SYS.getegid);
	}
	exports.getegid = getegid;
	function sched_yield() {
	    syscall(x86_64_linux_1.SYS.sched_yield);
	}
	exports.sched_yield = sched_yield;
	function nanosleep(seconds, nanoseconds) {
	    var buf = types.timespec.pack({
	        tv_sec: [seconds, 0],
	        tv_nsec: [nanoseconds, 0]
	    });
	    return syscall(x86_64_linux_1.SYS.nanosleep, buf, types.NULL);
	}
	exports.nanosleep = nanosleep;
	function fcntl(fd, cmd, arg) {
	    var params = [x86_64_linux_1.SYS.fcntl, fd, cmd];
	    if (typeof arg !== 'undefined')
	        params.push(arg);
	    return syscall.apply(null, params);
	}
	exports.fcntl = fcntl;
	function epoll_create(size) {
	    return syscall(x86_64_linux_1.SYS.epoll_create, size);
	}
	exports.epoll_create = epoll_create;
	function epoll_create1(flags) {
	    return syscall(x86_64_linux_1.SYS.epoll_create1, flags);
	}
	exports.epoll_create1 = epoll_create1;
	function epoll_wait(epfd, buf, maxevents, timeout) {
	    return syscall(x86_64_linux_1.SYS.epoll_wait, epfd, buf, maxevents, timeout);
	}
	exports.epoll_wait = epoll_wait;
	function epoll_ctl(epfd, op, fd, epoll_event) {
	    var buf = types.epoll_event.pack(epoll_event);
	    return syscall(x86_64_linux_1.SYS.epoll_ctl, epfd, op, fd, buf);
	}
	exports.epoll_ctl = epoll_ctl;
	function inotify_init() {
	    return syscall(x86_64_linux_1.SYS.inotify_init);
	}
	exports.inotify_init = inotify_init;
	function inotify_init1(flags) {
	    return syscall(x86_64_linux_1.SYS.inotify_init1, flags);
	}
	exports.inotify_init1 = inotify_init1;
	function inotify_add_watch(fd, pathname, mask) {
	    return syscall(x86_64_linux_1.SYS.inotify_add_watch, fd, pathname, mask);
	}
	exports.inotify_add_watch = inotify_add_watch;
	function inotify_rm_watch(fd, wd) {
	    return syscall(x86_64_linux_1.SYS.inotify_rm_watch, fd, wd);
	}
	exports.inotify_rm_watch = inotify_rm_watch;
	function mmap(addr, length, prot, flags, fd, offset) {
	    return syscall64(x86_64_linux_1.SYS.mmap, addr, length, prot, flags, fd, offset);
	}
	exports.mmap = mmap;
	function munmap(addr, length) {
	    return syscall(x86_64_linux_1.SYS.munmap, addr, length);
	}
	exports.munmap = munmap;
	function mprotect(addr, len, prot) {
	    return syscall(x86_64_linux_1.SYS.mprotect, addr, len, prot);
	}
	exports.mprotect = mprotect;
	function shmget(key, size, shmflg) {
	    return syscall(x86_64_linux_1.SYS.shmget, key, size, shmflg);
	}
	exports.shmget = shmget;
	function shmat(shmid, shmaddr, shmflg) {
	    if (shmaddr === void 0) { shmaddr = types.NULL; }
	    if (shmflg === void 0) { shmflg = 0; }
	    return syscall64(x86_64_linux_1.SYS.shmat, shmid, shmaddr, shmflg);
	}
	exports.shmat = shmat;
	function shmdt(shmaddr) {
	    return syscall(x86_64_linux_1.SYS.shmdt, shmaddr);
	}
	exports.shmdt = shmdt;
	function shmctl(shmid, cmd, buf) {
	    if (buf === void 0) { buf = types.NULL; }
	    if (buf instanceof Buffer) {
	    }
	    else if (typeof buf === 'object') {
	        buf = types.shmid_ds.pack(buf);
	    }
	    else {
	    }
	    return syscall(x86_64_linux_1.SYS.shmctl, shmid, cmd, buf);
	}
	exports.shmctl = shmctl;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var typebase_1 = __webpack_require__(8);
	exports.PATH_MAX = 4096;
	exports.isLE = true;
	exports.NULL = 0;
	var buf = Buffer.prototype;
	exports.int8 = typebase_1.Type.define(1, buf.readInt8, buf.writeInt8);
	exports.uint8 = typebase_1.Type.define(1, buf.readUInt8, buf.readUInt8);
	exports.int16 = typebase_1.Type.define(2, buf.readInt16LE, buf.writeInt16LE);
	exports.uint16 = typebase_1.Type.define(2, buf.readUInt16LE, buf.writeUInt16LE);
	exports.int32 = typebase_1.Type.define(4, buf.readInt32LE, buf.writeInt32LE);
	exports.uint32 = typebase_1.Type.define(4, buf.readUInt32LE, buf.writeUInt32LE);
	exports.int64 = typebase_1.Arr.define(exports.int32, 2);
	exports.uint64 = typebase_1.Arr.define(exports.uint32, 2);
	exports.size_t = exports.uint64;
	exports.time_t = exports.uint64;
	exports.pid_t = exports.uint32;
	exports.ipv4 = typebase_1.Type.define(4, function (offset) {
	    if (offset === void 0) { offset = 0; }
	    var buf = this;
	    var socket = __webpack_require__(9);
	    var octets = socket.Ipv4.type.unpack(buf, offset);
	    return new socket.Ipv4(octets);
	}, function (data, offset) {
	    if (offset === void 0) { offset = 0; }
	    var buf = this;
	    data.toBuffer().copy(buf, offset);
	});
	exports.pointer_t = exports.uint64;
	exports.stat = typebase_1.Struct.define(31 * 4, [
	    [0, exports.uint32, 'dev'],
	    [2 * 4, exports.uint32, 'ino'],
	    [4 * 4, exports.uint32, 'nlink'],
	    [6 * 4, exports.int32, 'mode'],
	    [7 * 4, exports.int32, 'uid'],
	    [8 * 4, exports.int32, 'gid'],
	    [10 * 4, exports.uint32, 'rdev'],
	    [12 * 4, exports.uint32, 'size'],
	    [14 * 4, exports.uint32, 'blksize'],
	    [16 * 4, exports.uint32, 'blocks'],
	    [18 * 4, exports.uint32, 'atime'],
	    [20 * 4, exports.uint32, 'atime_nsec'],
	    [22 * 4, exports.uint32, 'mtime'],
	    [24 * 4, exports.uint32, 'mtime_nsec'],
	    [26 * 4, exports.uint32, 'ctime'],
	    [28 * 4, exports.uint32, 'ctime_nsec'],
	]);
	exports.in_addr = typebase_1.Struct.define(4, [
	    [0, exports.ipv4, 's_addr'],
	]);
	exports.sockaddr_in = typebase_1.Struct.define(16, [
	    [0, exports.int16, 'sin_family'],
	    [2, exports.uint16, 'sin_port'],
	    [4, exports.in_addr, 'sin_addr'],
	    [8, typebase_1.Arr.define(exports.int8, 8), 'sin_zero'],
	]);
	exports.sockaddr = typebase_1.Struct.define(1, [
	    [0, 'sa_family', exports.uint16],
	    [2, 'sa_data', typebase_1.Arr.define(exports.int8, 14)],
	]);
	exports.epoll_event = typebase_1.Struct.define(4 + 8, [
	    [0, exports.uint32, 'events'],
	    [4, exports.uint64, 'data'],
	]);
	exports.ipc_perm = typebase_1.Struct.define(48, [
	    [0, exports.int32, '__key'],
	    [4, exports.uint32, 'uid'],
	    [8, exports.uint32, 'gid'],
	    [12, exports.uint32, 'cuid'],
	    [16, exports.uint32, 'cgid'],
	    [20, exports.uint16, 'mode'],
	    [24, exports.uint16, '__seq'],
	]);
	exports.shmid_ds = typebase_1.Struct.define(112, [
	    [0, exports.ipc_perm, 'shm_perm'],
	    [48, exports.size_t, 'shm_segsz'],
	    [56, exports.time_t, 'shm_atime'],
	    [64, exports.time_t, 'shm_dtime'],
	    [72, exports.time_t, 'shm_ctime'],
	    [80, exports.pid_t, 'shm_cpid'],
	    [84, exports.pid_t, 'shm_lpid'],
	    [88, exports.uint64, 'shm_nattch'],
	]);
	exports.utimbuf = typebase_1.Struct.define(16, [
	    [0, exports.uint64, 'actime'],
	    [8, exports.uint64, 'modtime'],
	]);
	exports.timeval = typebase_1.Struct.define(16, [
	    [0, exports.uint64, 'tv_sec'],
	    [8, exports.uint64, 'tv_nsec'],
	]);
	exports.timevalarr = typebase_1.Arr.define(exports.timeval, 2);
	exports.timespec = exports.timeval;
	exports.timespecarr = exports.timevalarr;
	exports.linux_dirent64 = typebase_1.Struct.define(19, [
	    [0, exports.uint64, 'ino64_t'],
	    [8, exports.uint64, 'off64_t'],
	    [16, exports.uint16, 'd_reclen'],
	    [18, exports.uint8, 'd_type'],
	]);
	exports.inotify_event = typebase_1.Struct.define(16, [
	    [0, exports.int32, 'wd'],
	    [4, exports.uint32, 'mask'],
	    [8, exports.uint32, 'cookie'],
	    [12, exports.uint32, 'len'],
	]);
	exports.SYS = {
	    read: 0,
	    write: 1,
	    open: 2,
	    close: 3,
	    stat: 4,
	    fstat: 5,
	    lstat: 6,
	    lseek: 8,
	    mmap: 9,
	    mprotect: 10,
	    munmap: 11,
	    brk: 12,
	    rt_sigaction: 13,
	    rt_sigprocmask: 14,
	    rt_sigreturn: 15,
	    ioctl: 16,
	    pread64: 17,
	    pwrite64: 18,
	    readv: 19,
	    writev: 20,
	    access: 21,
	    pipe: 22,
	    sched_yield: 24,
	    mremap: 25,
	    msync: 26,
	    mincore: 27,
	    madvise: 28,
	    shmget: 29,
	    shmat: 30,
	    shmctl: 31,
	    dup: 32,
	    dup2: 33,
	    pause: 34,
	    nanosleep: 35,
	    getitimer: 36,
	    alarm: 37,
	    setitimer: 38,
	    getpid: 39,
	    sendfile: 40,
	    socket: 41,
	    connect: 42,
	    accept: 43,
	    sendto: 44,
	    recvfrom: 45,
	    sendmsg: 46,
	    recvmsg: 47,
	    shutdown: 48,
	    bind: 49,
	    listen: 50,
	    getsockname: 51,
	    getpeername: 52,
	    socketpair: 53,
	    setsockopt: 54,
	    getsockopt: 55,
	    shmdt: 67,
	    fcntl: 72,
	    fsync: 74,
	    fdatasync: 75,
	    truncate: 76,
	    ftruncate: 77,
	    getdents: 78,
	    getcwd: 79,
	    chdir: 80,
	    fchdir: 81,
	    rename: 82,
	    mkdir: 83,
	    rmdir: 84,
	    creat: 85,
	    link: 86,
	    unlink: 87,
	    symlink: 88,
	    readlink: 89,
	    chmod: 90,
	    fchmod: 91,
	    chown: 92,
	    fchown: 93,
	    lchown: 94,
	    umask: 95,
	    gettimeofday: 96,
	    getrlimit: 97,
	    getrusage: 98,
	    getuid: 102,
	    getgid: 104,
	    geteuid: 107,
	    getegid: 108,
	    setpgid: 109,
	    getppid: 110,
	    utime: 132,
	    epoll_create: 213,
	    getdents64: 217,
	    epoll_wait: 232,
	    epoll_ctl: 233,
	    utimes: 235,
	    inotify_init: 253,
	    inotify_add_watch: 254,
	    inotify_rm_watch: 255,
	    mkdirat: 258,
	    futimesat: 261,
	    utimensat: 280,
	    accept4: 288,
	    epoll_create1: 291,
	    inotify_init1: 294
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var Type = (function () {
	    function Type() {
	        this.size = 1;
	    }
	    Type.define = function (size, unpack, pack) {
	        var new_type = new Type;
	        new_type.size = size;
	        new_type.unpackF = unpack;
	        new_type.packF = pack;
	        return new_type;
	    };
	    Type.prototype.unpack = function (buf, offset) {
	        if (offset === void 0) { offset = 0; }
	        return this.unpackF.call(buf, offset);
	    };
	    Type.prototype.pack = function (data, buf, offset) {
	        if (offset === void 0) { offset = 0; }
	        if (!buf)
	            buf = new Buffer(this.size);
	        if (data instanceof Buffer)
	            data.copy(buf, offset);
	        else if (typeof data == 'object')
	            data.toBuffer().copy(buf, offset);
	        else
	            this.packF.call(buf, data, offset);
	        return buf;
	    };
	    return Type;
	}());
	exports.Type = Type;
	var Arr = (function () {
	    function Arr() {
	    }
	    Arr.define = function (type, len) {
	        var new_arr = new Arr;
	        new_arr.len = len;
	        new_arr.type = type;
	        new_arr.size = type.size * len;
	        return new_arr;
	    };
	    Arr.prototype.unpack = function (buf, offset) {
	        if (offset === void 0) { offset = 0; }
	        var arr = [], off;
	        for (var i = 0; i < this.len; i++) {
	            off = offset + (i * this.type.size);
	            arr.push(this.type.unpack(buf, off));
	        }
	        return arr;
	    };
	    Arr.prototype.pack = function (data, buf, offset) {
	        if (offset === void 0) { offset = 0; }
	        if (!buf)
	            buf = new Buffer(this.size);
	        if (data) {
	            var off;
	            for (var i = 0; (i < this.len) && (i < data.length); i++) {
	                off = offset + (i * this.type.size);
	                this.type.pack(data[i], buf, off);
	            }
	        }
	        return buf;
	    };
	    return Arr;
	}());
	exports.Arr = Arr;
	var Struct = (function () {
	    function Struct() {
	        this.defs = [];
	        this.size = 0;
	    }
	    Struct.define = function (size, defs) {
	        var new_struct = new Struct;
	        new_struct.size = size;
	        new_struct.defs = defs;
	        return new_struct;
	    };
	    Struct.prototype.unpack = function (buf, offset) {
	        if (offset === void 0) { offset = 0; }
	        var result = {};
	        for (var _i = 0, _a = this.defs; _i < _a.length; _i++) {
	            var field = _a[_i];
	            var off = field[0], type = field[1], name = field[2];
	            result[name] = type.unpack(buf, offset + off);
	        }
	        return result;
	    };
	    Struct.prototype.pack = function (data, buf, offset) {
	        if (offset === void 0) { offset = 0; }
	        if (!buf)
	            buf = new Buffer(this.size);
	        for (var _i = 0, _a = this.defs; _i < _a.length; _i++) {
	            var field = _a[_i];
	            var off = field[0], type = field[1], name = field[2];
	            type.pack(data[name], buf, offset + off);
	        }
	        return buf;
	    };
	    return Struct;
	}());
	exports.Struct = Struct;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var typebase_1 = __webpack_require__(8);
	var x86_64_linux_1 = __webpack_require__(7);
	function flip(buf, offset, len) {
	    if (offset === void 0) { offset = 0; }
	    if (len === void 0) { len = buf.length; }
	    var mid = len >> 1, tmp, lside, rside;
	    for (var i = 0; i < mid; i++) {
	        lside = i + offset;
	        rside = offset + len - i - 1;
	        tmp = buf.readInt8(lside);
	        buf.writeInt8(buf.readInt8(rside), lside);
	        buf.writeInt8(tmp, rside);
	    }
	    return buf;
	}
	exports.flip = flip;
	function hton16(num) {
	    if (x86_64_linux_1.isLE)
	        return ((num & 0xFF00) >> 8) + ((num & 0xFF) << 8);
	    else
	        return num;
	}
	exports.hton16 = hton16;
	function htons(buf, offset, len) {
	    if (offset === void 0) { offset = 0; }
	    if (len === void 0) { len = buf.length; }
	    if (x86_64_linux_1.isLE)
	        return flip(buf, offset, len);
	    else
	        return buf;
	}
	exports.htons = htons;
	var Ip = (function () {
	    function Ip(ip) {
	        this.sep = '.';
	        if (typeof ip === 'string') {
	            this.buf = new Buffer(ip.split(this.sep));
	        }
	        else if (ip instanceof Array) {
	            this.buf = new Buffer(ip);
	        }
	    }
	    Ip.prototype.toString = function () {
	        return Ipv4.type.unpack(this.buf).join(this.sep);
	    };
	    Ip.prototype.toBuffer = function () {
	        return this.buf;
	    };
	    Ip.prototype.presentationToOctet = function (presentation) {
	        return +presentation;
	    };
	    Ip.prototype.octetToPresentation = function (octet) {
	        return octet;
	    };
	    return Ip;
	}());
	exports.Ip = Ip;
	var Ipv4 = (function (_super) {
	    __extends(Ipv4, _super);
	    function Ipv4(ip) {
	        if (ip === void 0) { ip = '127.0.0.1'; }
	        _super.call(this, ip);
	    }
	    Ipv4.type = typebase_1.Arr.define(x86_64_linux_1.uint8, 4);
	    return Ipv4;
	}(Ip));
	exports.Ipv4 = Ipv4;
	var Ipv6 = (function (_super) {
	    __extends(Ipv6, _super);
	    function Ipv6(ip) {
	        if (ip === void 0) { ip = '0:0:0:0:0:0:0:1'; }
	        _super.call(this, ip);
	        this.sep = ':';
	    }
	    Ipv6.prototype.presentationToOctet = function (presentation) {
	        return parseInt(presentation, 16);
	    };
	    Ipv6.prototype.octetToPresentation = function (octet) {
	        return octet.toString(16);
	    };
	    Ipv6.type = typebase_1.Arr.define(x86_64_linux_1.uint16, 16);
	    return Ipv6;
	}(Ip));
	exports.Ipv6 = Ipv6;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	var UInt64 = (function () {
	    function UInt64() {
	    }
	    UInt64.hi = function (a, lo) {
	        if (lo === void 0) { lo = UInt64.lo(a); }
	        var hi = a - lo;
	        hi /= 4294967296;
	        if ((hi < 0) || (hi >= 1048576))
	            throw Error("Not an int52: " + a);
	        return hi;
	    };
	    UInt64.lo = function (a) {
	        var lo = a | 0;
	        if (lo < 0)
	            lo += 4294967296;
	        return lo;
	    };
	    UInt64.joinToNumber = function (hi, lo) {
	        if (lo < 0)
	            lo += 4294967296;
	        return hi * 4294967296 + lo;
	    };
	    return UInt64;
	}());
	exports.UInt64 = UInt64;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var StaticArrayBuffer = __webpack_require__(5).StaticArrayBuffer;


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
	    this._next = null; // Used in thread pool

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
	    } else if(typeof a === 'string') {
	        var str = a;
	        var size = str.length;
	        var sab = new StaticArrayBuffer(size);
	        buf = bufferFrom(sab);
	        for(var i = 0; i < size; i++) buf[i] = str.charCodeAt(i);
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
	// StaticBuffer.from(new Buffer(100));
	// StaticBuffer.from('Hello world');
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


	    } else if(Buffer.isBuffer(obj) && !StaticBuffer.isStaticBuffer(obj)) {

	        // Create a `StaticBuffer` from simple `Buffer`.
	        // This is very ad-hoc and hacky currently.

	        const MIN_SIZE = 200;
	        const LEN = obj.length;
	        if(LEN < MIN_SIZE) {
	            var sab = new StaticArrayBuffer(MIN_SIZE);
	            var sb = new StaticBuffer(sab, 0, LEN);
	            obj.copy(sb);
	            return sb;
	        } else {
	            // If buffer is already big we just wrap that memory contents into
	            // StaticBuffer, btw could we use `process.frame()` here?
	            var sab = new StaticArrayBuffer(obj.buffer);
	            return new StaticBuffer(sab);
	        }

	    } else if(typeof obj === 'string') {
	        var len = obj.length;
	        var sb = new StaticBuffer(len);
	        for(var i = 0; i < len; i++) sb[i] = obj.charCodeAt(i);
	        return sb;
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter = __webpack_require__(13).EventEmitter;
	var eloop = __webpack_require__(15);


	if(!process)
	    throw Error('`process` global not defined by JS runtime.');


	// The most important method Kappa
	process.noop = function() {};


	process.on = EventEmitter.prototype.on.bind(process);
	process.emit = EventEmitter.prototype.emit.bind(process);


	process.title = 'full.js';

	process.release = {
	    name: 'full.js',
	    lts: '',
	    sourceUrl: '',
	    headersUrl: ''
	};


	// Node.js does not allow to overwrite this property, so
	// in Node.js it will hold the Node.js version.
	process.version = 'v1.0.0';
	process.platform = 'linux';
	process.moduleLoadList = []; // For compatibility with node.
	process.versions = {
	    full: '1.0.0'
	};
	// process.arch = process.arch;
	// process.platform = process.platform;
	// process.release = process.release;
	process.argv = process.argv || [];
	process.execArgv = [];

	process.env = process.env || {
	        NODE_VERSION: '',
	        HOSTNAME: '',
	        TERM: '',
	        NPM_CONFIG_LOGLEVEL: '',
	        PATH: '',
	        PWD: '',
	        SHLVL: '',
	        HOME: '',
	        _: '',
	        OLDPWD: '',
	    };
	process.env.NODE_DEBUG = '*';

	process.features = {
	    debug: false,
	    uv: false,
	    ipv6: false,
	    tls_npn: false,
	    tls_sni: false,
	    tls_ocsp: false,
	    tls: false
	};
	process.execPath = process.execPath || '';
	process.config = {};
	// reallyExit: [Function: reallyExit],



	process.nextTick = function(callback) {
	    var task = new eloop.MicroTask;
	    task.callback = callback;

	    var args;
	    if (arguments.length > 1) {
	        args = new Array(arguments.length - 1);
	        for (var i = 1; i < arguments.length; i++)
	            args[i - 1] = arguments[i];
	        task.args = args;
	    }

	    process.loop.insertMicrotask(task);
	};


	var libjs = __webpack_require__(6);

	process.pid = libjs.getpid();

	process.getgid = function() {
	    return libjs.getgid();
	};

	process.cwd = function() {
	    try {
	        return libjs.getcwd();
	    } catch(e) {
	        console.log(e);
	        console.log(e.stack);
	        return '.';
	    }
	};

	process.yield = function() {
	    libjs.sched_yield();
	};

	process.nanosleep = function(seconds, nanoseconds) {
	    libjs.nanosleep(seconds, nanoseconds);
	};





	// abort: [Function: abort],
	// chdir: [Function: chdir],
	// umask: [Function: umask],
	// getuid: [Function: getuid],
	// geteuid: [Function: geteuid],
	// setuid: [Function: setuid],
	// seteuid: [Function: seteuid],
	// setgid: [Function: setgid],
	// setegid: [Function: setegid],
	// getgid: [Function: getgid],
	// getegid: [Function: getegid],
	// getgroups: [Function: getgroups],
	// setgroups: [Function: setgroups],
	// initgroups: [Function: initgroups],
	// hrtime: [Function: hrtime],
	// dlopen: [Function: dlopen],

	// uptime: [Function: uptime],
	// memoryUsage: [Function: memoryUsage],


	// _linkedBinding: [Function: _linkedBinding],
	// _setupDomainUse: [Function: _setupDomainUse],
	// _events:
	// { newListener: [Function],
	//     removeListener: [Function],
	//     SIGWINCH: [ [Function], [Function] ] },
	// _rawDebug: [Function],
	//     _eventsCount: 3,
	//     domain: null,
	//     _maxListeners: undefined,
	//     EventEmitter:
	// { [Function: EventEmitter]
	//     EventEmitter: [Circular],
	//         usingDomains: false,
	//     defaultMaxListeners: 10,
	//     init: [Function],
	//     listenerCount: [Function] },
	// _fatalException: [Function],
	//     _exiting: false,
	//     assert: [Function],
	//     config:
	// { target_defaults:
	// { cflags: [],
	//     default_configuration: 'Release',
	//     defines: [],
	//     include_dirs: [],
	//     libraries: [] },
	//     variables:
	//     { asan: 0,
	//         gas_version: '2.23',
	//         host_arch: 'x64',
	//         icu_data_file: 'icudt56l.dat',
	//         icu_data_in: '../../deps/icu/source/data/in/icudt56l.dat',
	//         icu_endianness: 'l',
	//         icu_gyp_path: 'tools/icu/icu-generic.gyp',
	//         icu_locales: 'en,root',
	//         icu_path: './deps/icu',
	//         icu_small: true,
	//         icu_ver_major: '56',
	//         node_byteorder: 'little',
	//         node_install_npm: true,
	//         node_prefix: '/',
	//         node_release_urlbase: 'https://nodejs.org/download/release/',
	//         node_shared_http_parser: false,
	//         node_shared_libuv: false,
	//         node_shared_openssl: false,
	//         node_shared_zlib: false,
	//         node_tag: '',
	//         node_use_dtrace: false,
	//         node_use_etw: false,
	//         node_use_lttng: false,
	//         node_use_openssl: true,
	//         node_use_perfctr: false,
	//         openssl_fips: '',
	//         openssl_no_asm: 0,
	//         target_arch: 'x64',
	//         uv_parent_path: '/deps/uv/',
	//         uv_use_dtrace: false,
	//         v8_enable_gdbjit: 0,
	//         v8_enable_i18n_support: 1,
	//         v8_no_strict_aliasing: 1,
	//         v8_optimized_debug: 0,
	//         v8_random_seed: 0,
	//         v8_use_snapshot: true,
	//         want_separate_host_toolset: 0 } },
	// nextTick: [Function: nextTick],
	// _tickCallback: [Function: _tickCallback],
	// _tickDomainCallback: [Function: _tickDomainCallback],
	// stdout: [Getter],
	//     stderr: [Getter],
	//     stdin: [Getter],
	//     openStdin: [Function],
	//     exit: [Function],
	//     kill: [Function],
	//     mainModule:
	// Module {
	//     id: '.',
	//         exports: {},
	//     parent: null,
	//         filename: '/share/full-js/lib/boot.js',
	//         loaded: false,
	//         children: [ [Object], [Object] ],
	//         paths:
	//     [ '/share/full-js/lib/node_modules',
	//         '/share/full-js/node_modules',
	//         '/share/node_modules',
	//         '/node_modules' ] } }



/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var domain;

	// This constructor is used to store event handlers. Instantiating this is
	// faster than explicitly calling `Object.create(null)` to get a "clean" empty
	// object (tested with v8 v4.9).
	function EventHandlers() {}
	EventHandlers.prototype = Object.create(null);

	function EventEmitter() {
	    EventEmitter.init.call(this);
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.usingDomains = false;

	EventEmitter.prototype.domain = undefined;
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	var defaultMaxListeners = 10;

	Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
	    enumerable: true,
	    get: function() {
	        return defaultMaxListeners;
	    },
	    set: function(arg) {
	        // force global console to be compiled.
	        // see https://github.com/nodejs/node/issues/4467
	        console;
	        defaultMaxListeners = arg;
	    }
	});

	EventEmitter.init = function() {
	    this.domain = null;
	    if (EventEmitter.usingDomains) {
	        // if there is an active domain, then attach to it.
	        domain = domain || __webpack_require__(14);
	        if (domain.active && !(this instanceof domain.Domain)) {
	            this.domain = domain.active;
	        }
	    }

	    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
	        this._events = new EventHandlers();
	        this._eventsCount = 0;
	    }

	    this._maxListeners = this._maxListeners || undefined;
	};

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
	    if (typeof n !== 'number' || n < 0 || isNaN(n))
	        throw new TypeError('"n" argument must be a positive number');
	    this._maxListeners = n;
	    return this;
	};

	function $getMaxListeners(that) {
	    if (that._maxListeners === undefined)
	        return EventEmitter.defaultMaxListeners;
	    return that._maxListeners;
	}

	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
	    return $getMaxListeners(this);
	};

	// These standalone emit* functions are used to optimize calling of event
	// handlers for fast cases because emit() itself often has a variable number of
	// arguments and can be deoptimized because of that. These functions always have
	// the same number of arguments and thus do not get deoptimized, so the code
	// inside them can execute faster.
	function emitNone(handler, isFn, self) {
	    if (isFn)
	        handler.call(self);
	    else {
	        var len = handler.length;
	        var listeners = arrayClone(handler, len);
	        for (var i = 0; i < len; ++i)
	            listeners[i].call(self);
	    }
	}
	function emitOne(handler, isFn, self, arg1) {
	    if (isFn)
	        handler.call(self, arg1);
	    else {
	        var len = handler.length;
	        var listeners = arrayClone(handler, len);
	        for (var i = 0; i < len; ++i)
	            listeners[i].call(self, arg1);
	    }
	}
	function emitTwo(handler, isFn, self, arg1, arg2) {
	    if (isFn)
	        handler.call(self, arg1, arg2);
	    else {
	        var len = handler.length;
	        var listeners = arrayClone(handler, len);
	        for (var i = 0; i < len; ++i)
	            listeners[i].call(self, arg1, arg2);
	    }
	}
	function emitThree(handler, isFn, self, arg1, arg2, arg3) {
	    if (isFn)
	        handler.call(self, arg1, arg2, arg3);
	    else {
	        var len = handler.length;
	        var listeners = arrayClone(handler, len);
	        for (var i = 0; i < len; ++i)
	            listeners[i].call(self, arg1, arg2, arg3);
	    }
	}

	function emitMany(handler, isFn, self, args) {
	    if (isFn)
	        handler.apply(self, args);
	    else {
	        var len = handler.length;
	        var listeners = arrayClone(handler, len);
	        for (var i = 0; i < len; ++i)
	            listeners[i].apply(self, args);
	    }
	}

	EventEmitter.prototype.emit = function emit(type) {
	    var er, handler, len, args, i, events, domain;
	    var needDomainExit = false;
	    var doError = (type === 'error');

	    events = this._events;
	    if (events)
	        doError = (doError && events.error == null);
	    else if (!doError)
	        return false;

	    domain = this.domain;

	    // If there is no 'error' event listener then throw.
	    if (doError) {
	        er = arguments[1];
	        if (domain) {
	            if (!er)
	                er = new Error('Uncaught, unspecified "error" event');
	            er.domainEmitter = this;
	            er.domain = domain;
	            er.domainThrown = false;
	            domain.emit('error', er);
	        } else if (er instanceof Error) {
	            throw er; // Unhandled 'error' event
	        } else {
	            // At least give some kind of context to the user
	            var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	            err.context = er;
	            throw err;
	        }
	        return false;
	    }

	    handler = events[type];

	    if (!handler)
	        return false;

	    if (domain && this !== process) {
	        domain.enter();
	        needDomainExit = true;
	    }

	    var isFn = typeof handler === 'function';
	    len = arguments.length;
	    switch (len) {
	        // fast cases
	        case 1:
	            emitNone(handler, isFn, this);
	            break;
	        case 2:
	            emitOne(handler, isFn, this, arguments[1]);
	            break;
	        case 3:
	            emitTwo(handler, isFn, this, arguments[1], arguments[2]);
	            break;
	        case 4:
	            emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
	            break;
	        // slower
	        default:
	            args = new Array(len - 1);
	            for (i = 1; i < len; i++)
	                args[i - 1] = arguments[i];
	            emitMany(handler, isFn, this, args);
	    }

	    if (needDomainExit)
	        domain.exit();

	    return true;
	};

	function _addListener(target, type, listener, prepend) {
	    var m;
	    var events;
	    var existing;

	    if (typeof listener !== 'function')
	        throw new TypeError('"listener" argument must be a function');

	    events = target._events;
	    if (!events) {
	        events = target._events = new EventHandlers();
	        target._eventsCount = 0;
	    } else {
	        // To avoid recursion in the case that type === "newListener"! Before
	        // adding it to the listeners, first emit "newListener".
	        if (events.newListener) {
	            target.emit('newListener', type,
	                listener.listener ? listener.listener : listener);

	            // Re-assign `events` because a newListener handler could have caused the
	            // this._events to be assigned to a new object
	            events = target._events;
	        }
	        existing = events[type];
	    }

	    if (!existing) {
	        // Optimize the case of one listener. Don't need the extra array object.
	        existing = events[type] = listener;
	        ++target._eventsCount;
	    } else {
	        if (typeof existing === 'function') {
	            // Adding the second element, need to change to array.
	            existing = events[type] = prepend ? [listener, existing] :
	                [existing, listener];
	        } else {
	            // If we've already got an array, just append.
	            if (prepend) {
	                existing.unshift(listener);
	            } else {
	                existing.push(listener);
	            }
	        }

	        // Check for listener leak
	        if (!existing.warned) {
	            m = $getMaxListeners(target);
	            if (m && m > 0 && existing.length > m) {
	                existing.warned = true;
	                process.emitWarning('Possible EventEmitter memory leak detected. ' +
	                    existing.length + ' ' + type + ' listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit');
	            }
	        }
	    }

	    return target;
	}

	EventEmitter.prototype.addListener = function addListener(type, listener) {
	    return _addListener(this, type, listener, false);
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.prependListener =
	    function prependListener(type, listener) {
	        return _addListener(this, type, listener, true);
	    };

	function _onceWrap(target, type, listener) {
	    var fired = false;
	    function g() {
	        target.removeListener(type, g);
	        if (!fired) {
	            fired = true;
	            listener.apply(target, arguments);
	        }
	    }
	    g.listener = listener;
	    return g;
	}

	EventEmitter.prototype.once = function once(type, listener) {
	    if (typeof listener !== 'function')
	        throw new TypeError('"listener" argument must be a function');
	    this.on(type, _onceWrap(this, type, listener));
	    return this;
	};

	EventEmitter.prototype.prependOnceListener =
	    function prependOnceListener(type, listener) {
	        if (typeof listener !== 'function')
	            throw new TypeError('"listener" argument must be a function');
	        this.prependListener(type, _onceWrap(this, type, listener));
	        return this;
	    };

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener =
	    function removeListener(type, listener) {
	        var list, events, position, i, originalListener;

	        if (typeof listener !== 'function')
	            throw new TypeError('"listener" argument must be a function');

	        events = this._events;
	        if (!events)
	            return this;

	        list = events[type];
	        if (!list)
	            return this;

	        if (list === listener || (list.listener && list.listener === listener)) {
	            if (--this._eventsCount === 0)
	                this._events = new EventHandlers();
	            else {
	                delete events[type];
	                if (events.removeListener)
	                    this.emit('removeListener', type, list.listener || listener);
	            }
	        } else if (typeof list !== 'function') {
	            position = -1;

	            for (i = list.length; i-- > 0;) {
	                if (list[i] === listener ||
	                    (list[i].listener && list[i].listener === listener)) {
	                    originalListener = list[i].listener;
	                    position = i;
	                    break;
	                }
	            }

	            if (position < 0)
	                return this;

	            if (list.length === 1) {
	                list[0] = undefined;
	                if (--this._eventsCount === 0) {
	                    this._events = new EventHandlers();
	                    return this;
	                } else {
	                    delete events[type];
	                }
	            } else {
	                spliceOne(list, position);
	            }

	            if (events.removeListener)
	                this.emit('removeListener', type, originalListener || listener);
	        }

	        return this;
	    };

	EventEmitter.prototype.removeAllListeners =
	    function removeAllListeners(type) {
	        var listeners, events;

	        events = this._events;
	        if (!events)
	            return this;

	        // not listening for removeListener, no need to emit
	        if (!events.removeListener) {
	            if (arguments.length === 0) {
	                this._events = new EventHandlers();
	                this._eventsCount = 0;
	            } else if (events[type]) {
	                if (--this._eventsCount === 0)
	                    this._events = new EventHandlers();
	                else
	                    delete events[type];
	            }
	            return this;
	        }

	        // emit removeListener for all listeners on all events
	        if (arguments.length === 0) {
	            var keys = Object.keys(events);
	            for (var i = 0, key; i < keys.length; ++i) {
	                key = keys[i];
	                if (key === 'removeListener') continue;
	                this.removeAllListeners(key);
	            }
	            this.removeAllListeners('removeListener');
	            this._events = new EventHandlers();
	            this._eventsCount = 0;
	            return this;
	        }

	        listeners = events[type];

	        if (typeof listeners === 'function') {
	            this.removeListener(type, listeners);
	        } else if (listeners) {
	            // LIFO order
	            do {
	                this.removeListener(type, listeners[listeners.length - 1]);
	            } while (listeners[0]);
	        }

	        return this;
	    };

	EventEmitter.prototype.listeners = function listeners(type) {
	    var evlistener;
	    var ret;
	    var events = this._events;

	    if (!events)
	        ret = [];
	    else {
	        evlistener = events[type];
	        if (!evlistener)
	            ret = [];
	        else if (typeof evlistener === 'function')
	            ret = [evlistener];
	        else
	            ret = arrayClone(evlistener, evlistener.length);
	    }

	    return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	    if (typeof emitter.listenerCount === 'function') {
	        return emitter.listenerCount(type);
	    } else {
	        return listenerCount.call(emitter, type);
	    }
	};

	EventEmitter.prototype.listenerCount = listenerCount;
	function listenerCount(type) {
	    const events = this._events;

	    if (events) {
	        const evlistener = events[type];

	        if (typeof evlistener === 'function') {
	            return 1;
	        } else if (evlistener) {
	            return evlistener.length;
	        }
	    }

	    return 0;
	}

	EventEmitter.prototype.eventNames = function eventNames() {
	    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
	};

	// About 1.5x faster than the two-arg version of Array#splice().
	function spliceOne(list, index) {
	    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
	        list[i] = list[k];
	    list.pop();
	}

	function arrayClone(arr, i) {
	    var copy = new Array(i);
	    while (i--)
	        copy[i] = arr[i];
	    return copy;
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("domain");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var index_1 = __webpack_require__(6);
	var POINTER_NONE = -1;
	var DELAYS = [
	    -2,
	    -1,
	    1,
	    8,
	    16,
	    32,
	    64,
	    128,
	    256,
	    1024,
	    4096,
	    16384,
	    65536,
	    131072,
	    524288,
	    2097152,
	    8388608,
	    33554432,
	    268435456,
	    2147483648,
	    Infinity,
	];
	var DELAY_LAST = DELAYS.length - 1;
	function findDelayIndex(delay) {
	    for (var i = 0; i <= DELAY_LAST; i++)
	        if (delay <= DELAYS[i])
	            return i;
	}
	var MicroTask = (function () {
	    function MicroTask() {
	        this.next = null;
	        this.prev = null;
	        this.callback = null;
	        this.args = null;
	    }
	    MicroTask.prototype.exec = function () {
	        var args = this.args, callback = this.callback;
	        if (!args) {
	            callback();
	        }
	        else {
	            switch (args.length) {
	                case 1:
	                    callback(args[0]);
	                    break;
	                case 2:
	                    callback(args[0], args[1]);
	                    break;
	                case 3:
	                    callback(args[0], args[1], args[2]);
	                    break;
	                default:
	                    callback.apply(null, args);
	            }
	        }
	    };
	    return MicroTask;
	}());
	exports.MicroTask = MicroTask;
	var Task = (function (_super) {
	    __extends(Task, _super);
	    function Task() {
	        _super.apply(this, arguments);
	        this.delay = -2;
	        this.timeout = 0;
	        this.pointer = POINTER_NONE;
	        this.isRef = true;
	        this.queue = null;
	    }
	    Task.prototype.ref = function () {
	        if (!this.isRef) {
	        }
	    };
	    Task.prototype.unref = function () {
	        if (this.isRef) {
	        }
	    };
	    Task.prototype.cancel = function () {
	        this.queue.cancel(this);
	    };
	    return Task;
	}(MicroTask));
	exports.Task = Task;
	var EventQueue = (function () {
	    function EventQueue() {
	        this.start = null;
	        this.active = null;
	        this.pointers = [];
	    }
	    EventQueue.prototype.setPointer = function (pointer_index, task) {
	        var pointers = this.pointers;
	        var timeout = task.timeout;
	        pointers[pointer_index] = task;
	        task.pointer = pointer_index;
	        for (var i = pointer_index + 1; i <= DELAY_LAST; i++) {
	            var p = pointers[i];
	            if (!p) {
	                pointers[i] = task;
	            }
	            else {
	                if (p.timeout <= timeout) {
	                    pointers[i] = task;
	                }
	                else {
	                    break;
	                }
	            }
	        }
	    };
	    EventQueue.prototype.insertTask = function (curr, task) {
	        var timeout = task.timeout;
	        var prev = null;
	        if (timeout >= curr.timeout) {
	            do {
	                prev = curr;
	                curr = curr.next;
	            } while (curr && (curr.timeout <= timeout));
	            prev.next = task;
	            task.prev = prev;
	            if (curr) {
	                curr.prev = task;
	                task.next = curr;
	            }
	        }
	        else {
	            do {
	                prev = curr;
	                curr = curr.prev;
	            } while (curr && (curr.timeout > timeout));
	            prev.prev = task;
	            task.next = prev;
	            if (curr) {
	                curr.next = task;
	                task.prev = curr;
	            }
	            else {
	                this.start = task;
	            }
	        }
	    };
	    EventQueue.prototype.msNextTask = function () {
	        if (this.start) {
	            return this.start.timeout - Date.now();
	        }
	        return Infinity;
	    };
	    EventQueue.prototype.insert = function (task) {
	        task.queue = this;
	        var delay = task.delay;
	        var timeout = task.timeout = Date.now() + delay;
	        var pointers = this.pointers;
	        var pointer_index = findDelayIndex(delay);
	        var curr = pointers[pointer_index];
	        if (!curr) {
	            this.setPointer(pointer_index, task);
	            if (pointer_index) {
	                for (var i = pointer_index - 1; i >= 0; i--) {
	                    if (pointers[i]) {
	                        curr = pointers[i];
	                        break;
	                    }
	                }
	            }
	            if (!curr)
	                curr = this.start;
	            if (!curr) {
	                this.start = task;
	            }
	            else {
	                this.insertTask(curr, task);
	            }
	        }
	        else {
	            if (timeout >= curr.timeout) {
	                this.setPointer(pointer_index, task);
	            }
	            this.insertTask(curr, task);
	        }
	    };
	    EventQueue.prototype.cancel = function (task) {
	        var prev = task.prev;
	        var next = task.next;
	        task.prev = task.next = null;
	        if (prev)
	            prev.next = next;
	        if (next)
	            next.prev = prev;
	        if (!prev) {
	            this.start = next;
	        }
	        if (task.pointer !== POINTER_NONE) {
	            var index = task.pointer;
	            if (index) {
	                this.pointers[index] = this.pointers[index - 1];
	            }
	            else {
	                this.pointers[index] = null;
	            }
	        }
	    };
	    EventQueue.prototype.sliceActiveQueue = function () {
	        var curr = this.start;
	        if (!curr)
	            return;
	        var time = Date.now();
	        var pointers = this.pointers;
	        for (var i = 0; i <= DELAY_LAST; i++) {
	            var pointer = pointers[i];
	            if (pointer) {
	                if (pointer.timeout <= time) {
	                    pointers[i] = null;
	                    curr = pointer;
	                }
	                else {
	                    break;
	                }
	            }
	        }
	        if (curr.timeout > time)
	            return;
	        var prev;
	        do {
	            prev = curr;
	            curr = curr.next;
	        } while (curr && (curr.timeout <= time));
	        prev.next = null;
	        if (curr)
	            curr.prev = null;
	        this.active = this.start;
	        this.start = curr;
	    };
	    EventQueue.prototype.cycle = function () {
	        this.sliceActiveQueue();
	    };
	    EventQueue.prototype.pop = function () {
	        var task = this.active;
	        if (!task)
	            return null;
	        this.active = task.next;
	        return task;
	    };
	    return EventQueue;
	}());
	exports.EventQueue = EventQueue;
	var EventLoop = (function () {
	    function EventLoop() {
	        this.microQueue = null;
	        this.microQueueEnd = null;
	        this.refQueue = new EventQueue;
	        this.unrefQueue = new EventQueue;
	    }
	    EventLoop.prototype.shouldStop = function () {
	        if (!this.refQueue.start)
	            return true;
	        return false;
	    };
	    EventLoop.prototype.insertMicrotask = function (microtask) {
	        var last = this.microQueueEnd;
	        this.microQueueEnd = microtask;
	        if (!last) {
	            this.microQueue = microtask;
	        }
	        else {
	            last.next = microtask;
	        }
	    };
	    EventLoop.prototype.insert = function (task) {
	        if (task.isRef)
	            this.refQueue.insert(task);
	        else
	            this.unrefQueue.insert(task);
	    };
	    EventLoop.prototype.start = function () {
	        function exec_task(task) {
	            if (task.callback)
	                task.callback();
	        }
	        while (1) {
	            this.refQueue.cycle();
	            this.unrefQueue.cycle();
	            var refTask = this.refQueue.pop();
	            var unrefTask = this.unrefQueue.pop();
	            var task;
	            while (refTask || unrefTask) {
	                if (refTask && unrefTask) {
	                    if (refTask.timeout < unrefTask.timeout) {
	                        refTask.exec();
	                        refTask = null;
	                    }
	                    else if (refTask.timeout > unrefTask.timeout) {
	                        unrefTask.exec();
	                        unrefTask = null;
	                    }
	                    else {
	                        if (refTask.timeout <= unrefTask.timeout) {
	                            refTask.exec();
	                            refTask = null;
	                        }
	                        else {
	                            unrefTask.exec();
	                            unrefTask = null;
	                        }
	                    }
	                }
	                else {
	                    if (refTask) {
	                        refTask.exec();
	                        refTask = null;
	                    }
	                    else {
	                        unrefTask.exec();
	                        unrefTask = null;
	                    }
	                }
	                var microtask;
	                do {
	                    microtask = this.microQueue;
	                    if (microtask) {
	                        if (microtask.callback)
	                            microtask.exec();
	                        this.microQueue = microtask.next;
	                    }
	                } while (this.microQueue);
	                this.microQueueEnd = null;
	                if (!refTask)
	                    refTask = this.refQueue.pop();
	                else
	                    unrefTask = this.unrefQueue.pop();
	            }
	            if (this.shouldStop())
	                break;
	            var ref_ms = this.refQueue.msNextTask();
	            var unref_ms = this.unrefQueue.msNextTask();
	            var ms = Math.min(ref_ms, unref_ms);
	            if (ms > 10) {
	                if (ms > 10000)
	                    ms = 10000;
	                ms -= 5;
	                var seconds = Math.floor(ms / 1000);
	                var nanoseconds = (ms % 1000) * 1000000;
	                index_1.nanosleep(seconds, nanoseconds);
	            }
	            else {
	                if (ms > 1) {
	                    index_1.sched_yield();
	                }
	            }
	        }
	    };
	    return EventLoop;
	}());
	exports.EventLoop = EventLoop;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var eloop_1 = __webpack_require__(15);
	var TIMEOUT_MAX = 2147483647;
	var Timeout = (function () {
	    function Timeout() {
	        this.task = new eloop_1.Task;
	    }
	    Timeout.prototype.ref = function () {
	        this.task.ref();
	    };
	    Timeout.prototype.unref = function () {
	        this.task.unref();
	    };
	    return Timeout;
	}());
	exports.Timeout = Timeout;
	var Immediate = (function (_super) {
	    __extends(Immediate, _super);
	    function Immediate() {
	        _super.apply(this, arguments);
	    }
	    return Immediate;
	}(eloop_1.Task));
	exports.Immediate = Immediate;
	function setTimeout(callback, after, arg1, arg2, arg3) {
	    if (typeof callback !== 'function') {
	        throw new TypeError('"callback" argument must be a function');
	    }
	    after *= 1;
	    if (!(after >= 1 && after <= TIMEOUT_MAX)) {
	        after = 1;
	    }
	    var timer = new Timeout;
	    var task = timer.task;
	    task.delay = after;
	    task.callback = callback;
	    var length = arguments.length;
	    switch (length) {
	        case 0:
	        case 1:
	        case 2:
	            break;
	        default:
	            var args = new Array(length - 2);
	            for (var i = 2; i < length; i++)
	                args[i - 2] = arguments[i];
	            task.args = args;
	            break;
	    }
	    process.loop.insert(task);
	    return timer;
	}
	exports.setTimeout = setTimeout;
	function clearTimeout(timer) {
	    timer.task.cancel();
	}
	exports.clearTimeout = clearTimeout;
	function setInterval(callback, repeat) {
	    var args = arguments;
	    var timer = setTimeout.apply(null, args);
	    var wrapper = function () {
	        var new_timer = setTimeout.apply(null, args);
	        timer.task = new_timer.task;
	        timer.task.callback = wrapper;
	        callback.apply(null, arguments);
	    };
	    timer.task.callback = wrapper;
	    return timer;
	}
	exports.setInterval = setInterval;
	function clearInterval(timer) {
	    timer.task.cancel();
	}
	exports.clearInterval = clearInterval;
	function createImm(callback, arg1, arg2, arg3) {
	    if (typeof callback !== 'function') {
	        throw new TypeError('"callback" argument must be a function');
	    }
	    var i, args;
	    switch (arguments.length) {
	        case 0:
	        case 1:
	            break;
	        case 2:
	            args = [arg1];
	            break;
	        case 3:
	            args = [arg1, arg2];
	            break;
	        case 4:
	            args = [arg1, arg2, arg3];
	            break;
	        default:
	            args = [arg1, arg2, arg3];
	            for (i = 4; i < arguments.length; i++)
	                args[i - 1] = arguments[i];
	            break;
	    }
	    var timer = new Immediate;
	    timer.callback = callback;
	    timer.args = args;
	    return timer;
	}
	function setImmediate(callback, arg1, arg2, arg3) {
	    var timer = createImm(callback, arg1, arg2, arg3);
	    process.loop.insert(timer);
	    return timer;
	}
	exports.setImmediate = setImmediate;
	function clearImmediate(immediate) {
	    if (!immediate)
	        return;
	    immediate.cancel();
	}
	exports.clearImmediate = clearImmediate;
	function setIOPoll(callback, arg1, arg2, arg3) {
	    var timer = createImm(callback, arg1, arg2, arg3);
	    timer.delay = -1;
	    process.loop.insert(timer);
	    return timer;
	}
	exports.setIOPoll = setIOPoll;
	function clearIOPoll(poll) {
	    if (poll)
	        poll.cancel();
	}
	exports.clearIOPoll = clearIOPoll;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	if (!process.asyscall) {
	    if (process.hasBinaryUtils && (true)) {
	        var Asyscall = __webpack_require__(18).Asyscall;
	        var asyscall = new Asyscall;
	        asyscall.build();
	        process.asyscall = asyscall.exec.bind(asyscall);
	        process.asyscall64 = asyscall.exec64.bind(asyscall);
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


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function link(curr, next) {
	    var _a = next.getAddress(), lo = _a[0], hi = _a[1];
	    curr.writeInt32LE(lo, 72 - 8);
	    curr.writeInt32LE(hi, 72 - 8 + 4);
	}
	var Asyscall = (function () {
	    function Asyscall() {
	        this.code = null;
	        this.curr = null;
	        this.next = null;
	        this.usedFirst = null;
	        this.usedLast = null;
	    }
	    Asyscall.prototype.build = function () {
	        var bin = __webpack_require__(19);
	        this.code = StaticBuffer.alloc(bin, 'rwe');
	        this.curr = this.code.slice(this.code.length - 72);
	        this.curr.writeInt32LE(0, 0);
	        this.curr.writeInt32LE(0, 4);
	        this.next = this.newBlock();
	        link(this.curr, this.next);
	        this.code.call();
	    };
	    Asyscall.prototype.recycleBlock = function (block) {
	        if (!this.usedFirst) {
	            this.usedFirst = this.usedLast = block;
	        }
	        else {
	            var last = this.usedLast;
	            last._next = block;
	            this.usedLast = block;
	        }
	    };
	    Asyscall.prototype.newBlock = function () {
	        var block = this.usedFirst;
	        if (block && (block.readInt32LE(4) === 2)) {
	            if (this.usedLast === block) {
	                this.usedFirst = this.usedLast = null;
	            }
	            else {
	                this.usedFirst = block._next;
	                block._next = null;
	            }
	        }
	        else {
	            block = StaticBuffer.alloc(72, 'rw');
	        }
	        block.writeInt32LE(0, 0);
	        block.writeInt32LE(0, 4);
	        return block;
	    };
	    Asyscall.prototype.writeArg = function (arg, slot) {
	        var curr = this.curr;
	        if (typeof arg === 'string') {
	            var str = arg + '\0';
	            arg = new StaticBuffer(str.length);
	            for (var l = 0; l < str.length; l++)
	                arg[l] = str.charCodeAt(l);
	        }
	        if (arg instanceof Buffer) {
	            arg = arg.getAddress();
	        }
	        if (typeof arg === 'number') {
	            curr.writeInt32LE(arg, slot * 8);
	            curr.writeInt32LE(0, slot * 8 + 4);
	        }
	        else if (arg instanceof Array) {
	            curr.writeInt32LE(arg[0], slot * 8);
	            curr.writeInt32LE(arg[1], slot * 8 + 4);
	        }
	    };
	    Asyscall.prototype.fillBlock = function () {
	        var _a = this, curr = _a.curr, next = _a.next;
	        var callback;
	        for (var j = 0; j < arguments.length; j++) {
	            var arg = arguments[j];
	            if (typeof arg === 'function') {
	                callback = arg;
	                break;
	            }
	            else {
	                this.writeArg(arg, j + 1);
	            }
	        }
	        for (var j = arguments.length; j < 7; j++) {
	            curr.writeInt32LE(0, (j + 1) * 8);
	            curr.writeInt32LE(0, (j + 1) * 8 + 4);
	        }
	        curr[0] = 1;
	        return callback;
	    };
	    Asyscall.prototype.pollBlock = function (callback, is64) {
	        var _this = this;
	        var curr = this.curr;
	        var poll = function () {
	            var lock = curr[0];
	            if (lock === 3) {
	                if (is64) {
	                    callback([
	                        curr.readInt32LE(8 * 7),
	                        curr.readInt32LE(8 * 7 + 4)]);
	                }
	                else {
	                    callback(curr.readInt32LE(8 * 7));
	                }
	                _this.recycleBlock(curr);
	            }
	            else
	                setIOPoll(poll);
	        };
	        setIOPoll(poll);
	    };
	    Asyscall.prototype.exec = function () {
	        var block = this.newBlock();
	        link(this.next, block);
	        var callback = this.fillBlock.apply(this, arguments);
	        this.pollBlock(callback, false);
	        this.curr = this.next;
	        this.next = block;
	    };
	    Asyscall.prototype.exec64 = function () {
	        var block = this.newBlock();
	        link(this.next, block);
	        var callback = this.fillBlock.apply(this, arguments);
	        this.pollBlock(callback, true);
	        this.curr = this.next;
	        this.next = block;
	    };
	    Asyscall.prototype.stop = function () {
	        this.curr.writeInt32LE(4, 0);
	        this.next.writeInt32LE(4, 0);
	        this.code.free();
	    };
	    return Asyscall;
	}());
	exports.Asyscall = Asyscall;


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = [72,199,199,1,0,0,0,232,13,0,0,0,72,199,199,2,0,0,0,232,1,0,0,0,195,72,137,248,72,199,193,40,0,0,0,72,247,225,72,141,53,179,0,0,0,72,1,198,72,141,21,24,0,0,0,72,137,22,72,137,126,8,72,199,192,56,0,0,0,72,199,199,0,143,1,128,15,5,195,76,141,45,242,0,0,0,77,139,117,64,65,139,69,0,131,248,4,15,132,107,0,0,0,131,248,0,117,11,72,199,192,24,0,0,0,15,5,235,227,131,248,1,117,68,186,2,0,0,0,240,65,15,177,85,0,65,131,125,0,2,117,50,73,139,69,8,73,139,125,16,73,139,117,24,73,139,85,32,77,139,85,40,77,139,69,48,77,139,77,56,15,5,73,137,69,56,65,199,69,0,3,0,0,0,72,139,4,36,73,137,69,48,240,65,131,69,4,1,77,137,245,77,139,117,64,233,136,255,255,255,65,199,69,8,186,190,0,0,72,199,192,60,0,0,0,15,5,195,15,31,64,0,115,116,97,99,107,15,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,32,98,108,111,99,107,144,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const inspect = __webpack_require__(21).inspect;

	function assertPath(path) {
	    if (typeof path !== 'string') {
	        throw new TypeError('Path must be a string. Received ' + inspect(path));
	    }
	}

	// Resolves . and .. elements in a path with directory names
	function normalizeStringWin32(path, allowAboveRoot) {
	    var res = '';
	    var lastSlash = -1;
	    var dots = 0;
	    var code;
	    for (var i = 0; i <= path.length; ++i) {
	        if (i < path.length)
	            code = path.charCodeAt(i);
	        else if (code === 47/*/*/ || code === 92/*\*/)
	            break;
	        else
	            code = 47/*/*/;
	        if (code === 47/*/*/ || code === 92/*\*/) {
	            if (lastSlash === i - 1 || dots === 1) {
	                // NOOP
	            } else if (lastSlash !== i - 1 && dots === 2) {
	                if (res.length < 2 ||
	                    res.charCodeAt(res.length - 1) !== 46/*.*/ ||
	                    res.charCodeAt(res.length - 2) !== 46/*.*/) {
	                    if (res.length > 2) {
	                        const start = res.length - 1;
	                        var j = start;
	                        for (; j >= 0; --j) {
	                            if (res.charCodeAt(j) === 92/*\*/)
	                                break;
	                        }
	                        if (j !== start) {
	                            if (j === -1)
	                                res = '';
	                            else
	                                res = res.slice(0, j);
	                            lastSlash = i;
	                            dots = 0;
	                            continue;
	                        }
	                    } else if (res.length === 2 || res.length === 1) {
	                        res = '';
	                        lastSlash = i;
	                        dots = 0;
	                        continue;
	                    }
	                }
	                if (allowAboveRoot) {
	                    if (res.length > 0)
	                        res += '\\..';
	                    else
	                        res = '..';
	                }
	            } else {
	                if (res.length > 0)
	                    res += '\\' + path.slice(lastSlash + 1, i);
	                else
	                    res = path.slice(lastSlash + 1, i);
	            }
	            lastSlash = i;
	            dots = 0;
	        } else if (code === 46/*.*/ && dots !== -1) {
	            ++dots;
	        } else {
	            dots = -1;
	        }
	    }
	    return res;
	}

	// Resolves . and .. elements in a path with directory names
	function normalizeStringPosix(path, allowAboveRoot) {
	    var res = '';
	    var lastSlash = -1;
	    var dots = 0;
	    var code;
	    for (var i = 0; i <= path.length; ++i) {
	        if (i < path.length)
	            code = path.charCodeAt(i);
	        else if (code === 47/*/*/)
	            break;
	        else
	            code = 47/*/*/;
	        if (code === 47/*/*/) {
	            if (lastSlash === i - 1 || dots === 1) {
	                // NOOP
	            } else if (lastSlash !== i - 1 && dots === 2) {
	                if (res.length < 2 ||
	                    res.charCodeAt(res.length - 1) !== 46/*.*/ ||
	                    res.charCodeAt(res.length - 2) !== 46/*.*/) {
	                    if (res.length > 2) {
	                        const start = res.length - 1;
	                        var j = start;
	                        for (; j >= 0; --j) {
	                            if (res.charCodeAt(j) === 47/*/*/)
	                                break;
	                        }
	                        if (j !== start) {
	                            if (j === -1)
	                                res = '';
	                            else
	                                res = res.slice(0, j);
	                            lastSlash = i;
	                            dots = 0;
	                            continue;
	                        }
	                    } else if (res.length === 2 || res.length === 1) {
	                        res = '';
	                        lastSlash = i;
	                        dots = 0;
	                        continue;
	                    }
	                }
	                if (allowAboveRoot) {
	                    if (res.length > 0)
	                        res += '/..';
	                    else
	                        res = '..';
	                }
	            } else {
	                if (res.length > 0)
	                    res += '/' + path.slice(lastSlash + 1, i);
	                else
	                    res = path.slice(lastSlash + 1, i);
	            }
	            lastSlash = i;
	            dots = 0;
	        } else if (code === 46/*.*/ && dots !== -1) {
	            ++dots;
	        } else {
	            dots = -1;
	        }
	    }
	    return res;
	}

	function _format(sep, pathObject) {
	    const dir = pathObject.dir || pathObject.root;
	    const base = pathObject.base ||
	        ((pathObject.name || '') + (pathObject.ext || ''));
	    if (!dir) {
	        return base;
	    }
	    if (dir === pathObject.root) {
	        return dir + base;
	    }
	    return dir + sep + base;
	}

	const win32 = {
	    // path.resolve([from ...], to)
	    resolve: function resolve() {
	        var resolvedDevice = '';
	        var resolvedTail = '';
	        var resolvedAbsolute = false;

	        for (var i = arguments.length - 1; i >= -1; i--) {
	            var path;
	            if (i >= 0) {
	                path = arguments[i];
	            } else if (!resolvedDevice) {
	                path = process.cwd();
	            } else {
	                // Windows has the concept of drive-specific current working
	                // directories. If we've resolved a drive letter but not yet an
	                // absolute path, get cwd for that drive. We're sure the device is not
	                // a UNC path at this points, because UNC paths are always absolute.
	                path = process.env['=' + resolvedDevice];
	                // Verify that a drive-local cwd was found and that it actually points
	                // to our drive. If not, default to the drive's root.
	                if (path === undefined ||
	                    path.slice(0, 3).toLowerCase() !==
	                    resolvedDevice.toLowerCase() + '\\') {
	                    path = resolvedDevice + '\\';
	                }
	            }

	            assertPath(path);

	            // Skip empty entries
	            if (path.length === 0) {
	                continue;
	            }

	            var len = path.length;
	            var rootEnd = 0;
	            var code = path.charCodeAt(0);
	            var device = '';
	            var isAbsolute = false;

	            // Try to match a root
	            if (len > 1) {
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    // Possible UNC root

	                    // If we started with a separator, we know we at least have an
	                    // absolute path of some kind (UNC or otherwise)
	                    isAbsolute = true;

	                    code = path.charCodeAt(1);
	                    if (code === 47/*/*/ || code === 92/*\*/) {
	                        // Matched double path separator at beginning
	                        var j = 2;
	                        var last = j;
	                        // Match 1 or more non-path separators
	                        for (; j < len; ++j) {
	                            code = path.charCodeAt(j);
	                            if (code === 47/*/*/ || code === 92/*\*/)
	                                break;
	                        }
	                        if (j < len && j !== last) {
	                            const firstPart = path.slice(last, j);
	                            // Matched!
	                            last = j;
	                            // Match 1 or more path separators
	                            for (; j < len; ++j) {
	                                code = path.charCodeAt(j);
	                                if (code !== 47/*/*/ && code !== 92/*\*/)
	                                    break;
	                            }
	                            if (j < len && j !== last) {
	                                // Matched!
	                                last = j;
	                                // Match 1 or more non-path separators
	                                for (; j < len; ++j) {
	                                    code = path.charCodeAt(j);
	                                    if (code === 47/*/*/ || code === 92/*\*/)
	                                        break;
	                                }
	                                if (j === len) {
	                                    // We matched a UNC root only

	                                    device = '\\\\' + firstPart + '\\' + path.slice(last);
	                                    rootEnd = j;
	                                } else if (j !== last) {
	                                    // We matched a UNC root with leftovers

	                                    device = '\\\\' + firstPart + '\\' + path.slice(last, j);
	                                    rootEnd = j;
	                                }
	                            }
	                        }
	                    } else {
	                        rootEnd = 1;
	                    }
	                } else if ((code >= 65/*A*/ && code <= 90/*Z*/) ||
	                    (code >= 97/*a*/ && code <= 122/*z*/)) {
	                    // Possible device root

	                    code = path.charCodeAt(1);
	                    if (path.charCodeAt(1) === 58/*:*/) {
	                        device = path.slice(0, 2);
	                        rootEnd = 2;
	                        if (len > 2) {
	                            code = path.charCodeAt(2);
	                            if (code === 47/*/*/ || code === 92/*\*/) {
	                                // Treat separator following drive name as an absolute path
	                                // indicator
	                                isAbsolute = true;
	                                rootEnd = 3;
	                            }
	                        }
	                    }
	                }
	            } else if (code === 47/*/*/ || code === 92/*\*/) {
	                // `path` contains just a path separator
	                rootEnd = 1;
	                isAbsolute = true;
	            }

	            if (device.length > 0 &&
	                resolvedDevice.length > 0 &&
	                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
	                // This path points to another device so it is not applicable
	                continue;
	            }

	            if (resolvedDevice.length === 0 && device.length > 0) {
	                resolvedDevice = device;
	            }
	            if (!resolvedAbsolute) {
	                resolvedTail = path.slice(rootEnd) + '\\' + resolvedTail;
	                resolvedAbsolute = isAbsolute;
	            }

	            if (resolvedDevice.length > 0 && resolvedAbsolute) {
	                break;
	            }
	        }

	        // At this point the path should be resolved to a full absolute path,
	        // but handle relative paths to be safe (might happen when process.cwd()
	        // fails)

	        // Normalize the tail path
	        resolvedTail = normalizeStringWin32(resolvedTail, !resolvedAbsolute);

	        return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
	            '.';
	    },

	    normalize: function normalize(path) {
	        assertPath(path);
	        const len = path.length;
	        if (len === 0)
	            return '.';
	        var rootEnd = 0;
	        var code = path.charCodeAt(0);
	        var device;
	        var isAbsolute = false;

	        // Try to match a root
	        if (len > 1) {
	            if (code === 47/*/*/ || code === 92/*\*/) {
	                // Possible UNC root

	                // If we started with a separator, we know we at least have an absolute
	                // path of some kind (UNC or otherwise)
	                isAbsolute = true;

	                code = path.charCodeAt(1);
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    // Matched double path separator at beginning
	                    var j = 2;
	                    var last = j;
	                    // Match 1 or more non-path separators
	                    for (; j < len; ++j) {
	                        code = path.charCodeAt(j);
	                        if (code === 47/*/*/ || code === 92/*\*/)
	                            break;
	                    }
	                    if (j < len && j !== last) {
	                        const firstPart = path.slice(last, j);
	                        // Matched!
	                        last = j;
	                        // Match 1 or more path separators
	                        for (; j < len; ++j) {
	                            code = path.charCodeAt(j);
	                            if (code !== 47/*/*/ && code !== 92/*\*/)
	                                break;
	                        }
	                        if (j < len && j !== last) {
	                            // Matched!
	                            last = j;
	                            // Match 1 or more non-path separators
	                            for (; j < len; ++j) {
	                                code = path.charCodeAt(j);
	                                if (code === 47/*/*/ || code === 92/*\*/)
	                                    break;
	                            }
	                            if (j === len) {
	                                // We matched a UNC root only
	                                // Return the normalized version of the UNC root since there
	                                // is nothing left to process

	                                return '\\\\' + firstPart + '\\' + path.slice(last) + '\\';
	                            } else if (j !== last) {
	                                // We matched a UNC root with leftovers

	                                device = '\\\\' + firstPart + '\\' + path.slice(last, j);
	                                rootEnd = j;
	                            }
	                        }
	                    }
	                } else {
	                    rootEnd = 1;
	                }
	            } else if ((code >= 65/*A*/ && code <= 90/*Z*/) ||
	                (code >= 97/*a*/ && code <= 122/*z*/)) {
	                // Possible device root

	                code = path.charCodeAt(1);
	                if (path.charCodeAt(1) === 58/*:*/) {
	                    device = path.slice(0, 2);
	                    rootEnd = 2;
	                    if (len > 2) {
	                        code = path.charCodeAt(2);
	                        if (code === 47/*/*/ || code === 92/*\*/) {
	                            // Treat separator following drive name as an absolute path
	                            // indicator
	                            isAbsolute = true;
	                            rootEnd = 3;
	                        }
	                    }
	                }
	            }
	        } else if (code === 47/*/*/ || code === 92/*\*/) {
	            // `path` contains just a path separator, exit early to avoid unnecessary
	            // work
	            return '\\';
	        }

	        code = path.charCodeAt(len - 1);
	        var trailingSeparator = (code === 47/*/*/ || code === 92/*\*/);
	        var tail;
	        if (rootEnd < len)
	            tail = normalizeStringWin32(path.slice(rootEnd), !isAbsolute);
	        else
	            tail = '';
	        if (tail.length === 0 && !isAbsolute)
	            tail = '.';
	        if (tail.length > 0 && trailingSeparator)
	            tail += '\\';
	        if (device === undefined) {
	            if (isAbsolute) {
	                if (tail.length > 0)
	                    return '\\' + tail;
	                else
	                    return '\\';
	            } else if (tail.length > 0) {
	                return tail;
	            } else {
	                return '';
	            }
	        } else {
	            if (isAbsolute) {
	                if (tail.length > 0)
	                    return device + '\\' + tail;
	                else
	                    return device + '\\';
	            } else if (tail.length > 0) {
	                return device + tail;
	            } else {
	                return device;
	            }
	        }
	    },


	    isAbsolute: function isAbsolute(path) {
	        assertPath(path);
	        const len = path.length;
	        if (len === 0)
	            return false;
	        var code = path.charCodeAt(0);
	        if (code === 47/*/*/ || code === 92/*\*/) {
	            return true;
	        } else if ((code >= 65/*A*/ && code <= 90/*Z*/) ||
	            (code >= 97/*a*/ && code <= 122/*z*/)) {
	            // Possible device root

	            if (len > 2 && path.charCodeAt(1) === 58/*:*/) {
	                code = path.charCodeAt(2);
	                if (code === 47/*/*/ || code === 92/*\*/)
	                    return true;
	            }
	        }
	        return false;
	    },


	    join: function join() {
	        if (arguments.length === 0)
	            return '.';

	        var joined;
	        var firstPart;
	        for (var i = 0; i < arguments.length; ++i) {
	            var arg = arguments[i];
	            assertPath(arg);
	            if (arg.length > 0) {
	                if (joined === undefined)
	                    joined = firstPart = arg;
	                else
	                    joined += '\\' + arg;
	            }
	        }

	        if (joined === undefined)
	            return '.';

	        // Make sure that the joined path doesn't start with two slashes, because
	        // normalize() will mistake it for an UNC path then.
	        //
	        // This step is skipped when it is very clear that the user actually
	        // intended to point at an UNC path. This is assumed when the first
	        // non-empty string arguments starts with exactly two slashes followed by
	        // at least one more non-slash character.
	        //
	        // Note that for normalize() to treat a path as an UNC path it needs to
	        // have at least 2 components, so we don't filter for that here.
	        // This means that the user can use join to construct UNC paths from
	        // a server name and a share name; for example:
	        //   path.join('//server', 'share') -> '\\\\server\\share\\')
	        //var firstPart = paths[0];
	        var needsReplace = true;
	        var slashCount = 0;
	        var code = firstPart.charCodeAt(0);
	        if (code === 47/*/*/ || code === 92/*\*/) {
	            ++slashCount;
	            const firstLen = firstPart.length;
	            if (firstLen > 1) {
	                code = firstPart.charCodeAt(1);
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    ++slashCount;
	                    if (firstLen > 2) {
	                        code = firstPart.charCodeAt(2);
	                        if (code === 47/*/*/ || code === 92/*\*/)
	                            ++slashCount;
	                        else {
	                            // We matched a UNC path in the first part
	                            needsReplace = false;
	                        }
	                    }
	                }
	            }
	        }
	        if (needsReplace) {
	            // Find any more consecutive slashes we need to replace
	            for (; slashCount < joined.length; ++slashCount) {
	                code = joined.charCodeAt(slashCount);
	                if (code !== 47/*/*/ && code !== 92/*\*/)
	                    break;
	            }

	            // Replace the slashes if needed
	            if (slashCount >= 2)
	                joined = '\\' + joined.slice(slashCount);
	        }

	        return win32.normalize(joined);
	    },


	    // It will solve the relative path from `from` to `to`, for instance:
	    //  from = 'C:\\orandea\\test\\aaa'
	    //  to = 'C:\\orandea\\impl\\bbb'
	    // The output of the function should be: '..\\..\\impl\\bbb'
	    relative: function relative(from, to) {
	        assertPath(from);
	        assertPath(to);

	        if (from === to)
	            return '';

	        var fromOrig = win32.resolve(from);
	        var toOrig = win32.resolve(to);

	        if (fromOrig === toOrig)
	            return '';

	        from = fromOrig.toLowerCase();
	        to = toOrig.toLowerCase();

	        if (from === to)
	            return '';

	        // Trim any leading backslashes
	        var fromStart = 0;
	        for (; fromStart < from.length; ++fromStart) {
	            if (from.charCodeAt(fromStart) !== 92/*\*/)
	                break;
	        }
	        // Trim trailing backslashes (applicable to UNC paths only)
	        var fromEnd = from.length;
	        for (; fromEnd - 1 > fromStart; --fromEnd) {
	            if (from.charCodeAt(fromEnd - 1) !== 92/*\*/)
	                break;
	        }
	        var fromLen = (fromEnd - fromStart);

	        // Trim any leading backslashes
	        var toStart = 0;
	        for (; toStart < to.length; ++toStart) {
	            if (to.charCodeAt(toStart) !== 92/*\*/)
	                break;
	        }
	        // Trim trailing backslashes (applicable to UNC paths only)
	        var toEnd = to.length;
	        for (; toEnd - 1 > toStart; --toEnd) {
	            if (to.charCodeAt(toEnd - 1) !== 92/*\*/)
	                break;
	        }
	        var toLen = (toEnd - toStart);

	        // Compare paths to find the longest common path from root
	        var length = (fromLen < toLen ? fromLen : toLen);
	        var lastCommonSep = -1;
	        var i = 0;
	        for (; i <= length; ++i) {
	            if (i === length) {
	                if (toLen > length) {
	                    if (to.charCodeAt(toStart + i) === 92/*\*/) {
	                        // We get here if `from` is the exact base path for `to`.
	                        // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
	                        return toOrig.slice(toStart + i + 1);
	                    } else if (i === 2) {
	                        // We get here if `from` is the device root.
	                        // For example: from='C:\\'; to='C:\\foo'
	                        return toOrig.slice(toStart + i);
	                    }
	                }
	                if (fromLen > length) {
	                    if (from.charCodeAt(fromStart + i) === 92/*\*/) {
	                        // We get here if `to` is the exact base path for `from`.
	                        // For example: from='C:\\foo\\bar'; to='C:\\foo'
	                        lastCommonSep = i;
	                    } else if (i === 2) {
	                        // We get here if `to` is the device root.
	                        // For example: from='C:\\foo\\bar'; to='C:\\'
	                        lastCommonSep = 3;
	                    }
	                }
	                break;
	            }
	            var fromCode = from.charCodeAt(fromStart + i);
	            var toCode = to.charCodeAt(toStart + i);
	            if (fromCode !== toCode)
	                break;
	            else if (fromCode === 92/*\*/)
	                lastCommonSep = i;
	        }

	        // We found a mismatch before the first common path separator was seen, so
	        // return the original `to`.
	        // TODO: do this just for device roots (and not UNC paths)?
	        if (i !== length && lastCommonSep === -1) {
	            if (toStart > 0)
	                return toOrig.slice(toStart);
	            else
	                return toOrig;
	        }

	        var out = '';
	        if (lastCommonSep === -1)
	            lastCommonSep = 0;
	        // Generate the relative path based on the path difference between `to` and
	        // `from`
	        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
	            if (i === fromEnd || from.charCodeAt(i) === 92/*\*/) {
	                if (out.length === 0)
	                    out += '..';
	                else
	                    out += '\\..';
	            }
	        }

	        // Lastly, append the rest of the destination (`to`) path that comes after
	        // the common path parts
	        if (out.length > 0)
	            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
	        else {
	            toStart += lastCommonSep;
	            if (toOrig.charCodeAt(toStart) === 92/*\*/)
	                ++toStart;
	            return toOrig.slice(toStart, toEnd);
	        }
	    },


	    _makeLong: function _makeLong(path) {
	        // Note: this will *probably* throw somewhere.
	        if (typeof path !== 'string')
	            return path;

	        if (path.length === 0) {
	            return '';
	        }

	        const resolvedPath = win32.resolve(path);

	        if (resolvedPath.length >= 3) {
	            var code = resolvedPath.charCodeAt(0);
	            if (code === 92/*\*/) {
	                // Possible UNC root

	                if (resolvedPath.charCodeAt(1) === 92/*\*/) {
	                    code = resolvedPath.charCodeAt(2);
	                    if (code !== 63/*?*/ && code !== 46/*.*/) {
	                        // Matched non-long UNC root, convert the path to a long UNC path
	                        return '\\\\?\\UNC\\' + resolvedPath.slice(2);
	                    }
	                }
	            } else if ((code >= 65/*A*/ && code <= 90/*Z*/) ||
	                (code >= 97/*a*/ && code <= 122/*z*/)) {
	                // Possible device root

	                if (resolvedPath.charCodeAt(1) === 58/*:*/ &&
	                    resolvedPath.charCodeAt(2) === 92/*\*/) {
	                    // Matched device root, convert the path to a long UNC path
	                    return '\\\\?\\' + resolvedPath;
	                }
	            }
	        }

	        return path;
	    },


	    dirname: function dirname(path) {
	        assertPath(path);
	        const len = path.length;
	        if (len === 0)
	            return '.';
	        var rootEnd = -1;
	        var end = -1;
	        var matchedSlash = true;
	        var offset = 0;
	        var code = path.charCodeAt(0);

	        // Try to match a root
	        if (len > 1) {
	            if (code === 47/*/*/ || code === 92/*\*/) {
	                // Possible UNC root

	                rootEnd = offset = 1;

	                code = path.charCodeAt(1);
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    // Matched double path separator at beginning
	                    var j = 2;
	                    var last = j;
	                    // Match 1 or more non-path separators
	                    for (; j < len; ++j) {
	                        code = path.charCodeAt(j);
	                        if (code === 47/*/*/ || code === 92/*\*/)
	                            break;
	                    }
	                    if (j < len && j !== last) {
	                        // Matched!
	                        last = j;
	                        // Match 1 or more path separators
	                        for (; j < len; ++j) {
	                            code = path.charCodeAt(j);
	                            if (code !== 47/*/*/ && code !== 92/*\*/)
	                                break;
	                        }
	                        if (j < len && j !== last) {
	                            // Matched!
	                            last = j;
	                            // Match 1 or more non-path separators
	                            for (; j < len; ++j) {
	                                code = path.charCodeAt(j);
	                                if (code === 47/*/*/ || code === 92/*\*/)
	                                    break;
	                            }
	                            if (j === len) {
	                                // We matched a UNC root only
	                                return path;
	                            }
	                            if (j !== last) {
	                                // We matched a UNC root with leftovers

	                                // Offset by 1 to include the separator after the UNC root to
	                                // treat it as a "normal root" on top of a (UNC) root
	                                rootEnd = offset = j + 1;
	                            }
	                        }
	                    }
	                }
	            } else if ((code >= 65/*A*/ && code <= 90/*Z*/) ||
	                (code >= 97/*a*/ && code <= 122/*z*/)) {
	                // Possible device root

	                code = path.charCodeAt(1);
	                if (path.charCodeAt(1) === 58/*:*/) {
	                    rootEnd = offset = 2;
	                    if (len > 2) {
	                        code = path.charCodeAt(2);
	                        if (code === 47/*/*/ || code === 92/*\*/)
	                            rootEnd = offset = 3;
	                    }
	                }
	            }
	        } else if (code === 47/*/*/ || code === 92/*\*/) {
	            return path[0];
	        }

	        for (var i = len - 1; i >= offset; --i) {
	            code = path.charCodeAt(i);
	            if (code === 47/*/*/ || code === 92/*\*/) {
	                if (!matchedSlash) {
	                    end = i;
	                    break;
	                }
	            } else {
	                // We saw the first non-path separator
	                matchedSlash = false;
	            }
	        }

	        if (end === -1) {
	            if (rootEnd === -1)
	                return '.';
	            else
	                end = rootEnd;
	        }
	        return path.slice(0, end);
	    },


	    basename: function basename(path, ext) {
	        if (ext !== undefined && typeof ext !== 'string')
	            throw new TypeError('"ext" argument must be a string');
	        assertPath(path);
	        var start = 0;
	        var end = -1;
	        var matchedSlash = true;
	        var i;

	        // Check for a drive letter prefix so as not to mistake the following
	        // path separator as an extra separator at the end of the path that can be
	        // disregarded
	        if (path.length >= 2) {
	            const drive = path.charCodeAt(0);
	            if ((drive >= 65/*A*/ && drive <= 90/*Z*/) ||
	                (drive >= 97/*a*/ && drive <= 122/*z*/)) {
	                if (path.charCodeAt(1) === 58/*:*/)
	                    start = 2;
	            }
	        }

	        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
	            if (ext.length === path.length && ext === path)
	                return '';
	            var extIdx = ext.length - 1;
	            var firstNonSlashEnd = -1;
	            for (i = path.length - 1; i >= start; --i) {
	                const code = path.charCodeAt(i);
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    // If we reached a path separator that was not part of a set of path
	                    // separators at the end of the string, stop now
	                    if (!matchedSlash) {
	                        start = i + 1;
	                        break;
	                    }
	                } else {
	                    if (firstNonSlashEnd === -1) {
	                        // We saw the first non-path separator, remember this index in case
	                        // we need it if the extension ends up not matching
	                        matchedSlash = false;
	                        firstNonSlashEnd = i + 1;
	                    }
	                    if (extIdx >= 0) {
	                        // Try to match the explicit extension
	                        if (code === ext.charCodeAt(extIdx)) {
	                            if (--extIdx === -1) {
	                                // We matched the extension, so mark this as the end of our path
	                                // component
	                                end = i;
	                            }
	                        } else {
	                            // Extension does not match, so our result is the entire path
	                            // component
	                            extIdx = -1;
	                            end = firstNonSlashEnd;
	                        }
	                    }
	                }
	            }

	            if (start === end)
	                end = firstNonSlashEnd;
	            else if (end === -1)
	                end = path.length;
	            return path.slice(start, end);
	        } else {
	            for (i = path.length - 1; i >= start; --i) {
	                const code = path.charCodeAt(i);
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    // If we reached a path separator that was not part of a set of path
	                    // separators at the end of the string, stop now
	                    if (!matchedSlash) {
	                        start = i + 1;
	                        break;
	                    }
	                } else if (end === -1) {
	                    // We saw the first non-path separator, mark this as the end of our
	                    // path component
	                    matchedSlash = false;
	                    end = i + 1;
	                }
	            }

	            if (end === -1)
	                return '';
	            return path.slice(start, end);
	        }
	    },


	    extname: function extname(path) {
	        assertPath(path);
	        var startDot = -1;
	        var startPart = 0;
	        var end = -1;
	        var matchedSlash = true;
	        // Track the state of characters (if any) we see before our first dot and
	        // after any path separator we find
	        var preDotState = 0;
	        for (var i = path.length - 1; i >= 0; --i) {
	            const code = path.charCodeAt(i);
	            if (code === 47/*/*/ || code === 92/*\*/) {
	                // If we reached a path separator that was not part of a set of path
	                // separators at the end of the string, stop now
	                if (!matchedSlash) {
	                    startPart = i + 1;
	                    break;
	                }
	                continue;
	            }
	            if (end === -1) {
	                // We saw the first non-path separator, mark this as the end of our
	                // extension
	                matchedSlash = false;
	                end = i + 1;
	            }
	            if (code === 46/*.*/) {
	                // If this is our first dot, mark it as the start of our extension
	                if (startDot === -1)
	                    startDot = i;
	                else if (preDotState !== 1)
	                    preDotState = 1;
	            } else if (startDot !== -1) {
	                // We saw a non-dot and non-path separator before our dot, so we should
	                // have a good chance at having a non-empty extension
	                preDotState = -1;
	            }
	        }

	        if (startDot === -1 ||
	            end === -1 ||
	            // We saw a non-dot character immediately before the dot
	            preDotState === 0 ||
	            // The (right-most) trimmed path component is exactly '..'
	            (preDotState === 1 &&
	            startDot === end - 1 &&
	            startDot === startPart + 1)) {
	            return '';
	        }
	        return path.slice(startDot, end);
	    },


	    format: function format(pathObject) {
	        if (pathObject === null || typeof pathObject !== 'object') {
	            throw new TypeError(
	                'Parameter "pathObject" must be an object, not ' + (typeof pathObject)
	            );
	        }
	        return _format('\\', pathObject);
	    },


	    parse: function parse(path) {
	        assertPath(path);

	        var ret = { root: '', dir: '', base: '', ext: '', name: '' };
	        if (path.length === 0)
	            return ret;

	        var len = path.length;
	        var rootEnd = 0;
	        var code = path.charCodeAt(0);
	        var isAbsolute = false;

	        // Try to match a root
	        if (len > 1) {
	            if (code === 47/*/*/ || code === 92/*\*/) {
	                // Possible UNC root

	                isAbsolute = true;

	                code = path.charCodeAt(1);
	                rootEnd = 1;
	                if (code === 47/*/*/ || code === 92/*\*/) {
	                    // Matched double path separator at beginning
	                    var j = 2;
	                    var last = j;
	                    // Match 1 or more non-path separators
	                    for (; j < len; ++j) {
	                        code = path.charCodeAt(j);
	                        if (code === 47/*/*/ || code === 92/*\*/)
	                            break;
	                    }
	                    if (j < len && j !== last) {
	                        // Matched!
	                        last = j;
	                        // Match 1 or more path separators
	                        for (; j < len; ++j) {
	                            code = path.charCodeAt(j);
	                            if (code !== 47/*/*/ && code !== 92/*\*/)
	                                break;
	                        }
	                        if (j < len && j !== last) {
	                            // Matched!
	                            last = j;
	                            // Match 1 or more non-path separators
	                            for (; j < len; ++j) {
	                                code = path.charCodeAt(j);
	                                if (code === 47/*/*/ || code === 92/*\*/)
	                                    break;
	                            }
	                            if (j === len) {
	                                // We matched a UNC root only

	                                rootEnd = j;
	                            } else if (j !== last) {
	                                // We matched a UNC root with leftovers

	                                rootEnd = j + 1;
	                            }
	                        }
	                    }
	                }
	            } else if ((code >= 65/*A*/ && code <= 90/*Z*/) ||
	                (code >= 97/*a*/ && code <= 122/*z*/)) {
	                // Possible device root

	                code = path.charCodeAt(1);
	                if (path.charCodeAt(1) === 58/*:*/) {
	                    rootEnd = 2;
	                    if (len > 2) {
	                        code = path.charCodeAt(2);
	                        if (code === 47/*/*/ || code === 92/*\*/) {
	                            if (len === 3) {
	                                // `path` contains just a drive root, exit early to avoid
	                                // unnecessary work
	                                ret.root = ret.dir = path.slice(0, 3);
	                                return ret;
	                            }
	                            isAbsolute = true;
	                            rootEnd = 3;
	                        }
	                    } else {
	                        // `path` contains just a drive root, exit early to avoid
	                        // unnecessary work
	                        ret.root = ret.dir = path.slice(0, 2);
	                        return ret;
	                    }
	                }
	            }
	        } else if (code === 47/*/*/ || code === 92/*\*/) {
	            // `path` contains just a path separator, exit early to avoid
	            // unnecessary work
	            ret.root = ret.dir = path[0];
	            return ret;
	        }

	        if (rootEnd > 0)
	            ret.root = path.slice(0, rootEnd);

	        var startDot = -1;
	        var startPart = 0;
	        var end = -1;
	        var matchedSlash = true;
	        var i = path.length - 1;

	        // Track the state of characters (if any) we see before our first dot and
	        // after any path separator we find
	        var preDotState = 0;

	        // Get non-dir info
	        for (; i >= rootEnd; --i) {
	            code = path.charCodeAt(i);
	            if (code === 47/*/*/ || code === 92/*\*/) {
	                // If we reached a path separator that was not part of a set of path
	                // separators at the end of the string, stop now
	                if (!matchedSlash) {
	                    startPart = i + 1;
	                    break;
	                }
	                continue;
	            }
	            if (end === -1) {
	                // We saw the first non-path separator, mark this as the end of our
	                // extension
	                matchedSlash = false;
	                end = i + 1;
	            }
	            if (code === 46/*.*/) {
	                // If this is our first dot, mark it as the start of our extension
	                if (startDot === -1)
	                    startDot = i;
	                else if (preDotState !== 1)
	                    preDotState = 1;
	            } else if (startDot !== -1) {
	                // We saw a non-dot and non-path separator before our dot, so we should
	                // have a good chance at having a non-empty extension
	                preDotState = -1;
	            }
	        }

	        if (startDot === -1 ||
	            end === -1 ||
	            // We saw a non-dot character immediately before the dot
	            preDotState === 0 ||
	            // The (right-most) trimmed path component is exactly '..'
	            (preDotState === 1 &&
	            startDot === end - 1 &&
	            startDot === startPart + 1)) {
	            if (end !== -1) {
	                if (startPart === 0 && isAbsolute)
	                    ret.base = ret.name = path.slice(rootEnd, end);
	                else
	                    ret.base = ret.name = path.slice(startPart, end);
	            }
	        } else {
	            if (startPart === 0 && isAbsolute) {
	                ret.name = path.slice(rootEnd, startDot);
	                ret.base = path.slice(rootEnd, end);
	            } else {
	                ret.name = path.slice(startPart, startDot);
	                ret.base = path.slice(startPart, end);
	            }
	            ret.ext = path.slice(startDot, end);
	        }

	        if (startPart > 0)
	            ret.dir = path.slice(0, startPart - 1);
	        else if (isAbsolute)
	            ret.dir = path.slice(0, rootEnd);

	        return ret;
	    },


	    sep: '\\',
	    delimiter: ';',
	    win32: null,
	    posix: null
	};


	const posix = {
	    // path.resolve([from ...], to)
	    resolve: function resolve() {
	        var resolvedPath = '';
	        var resolvedAbsolute = false;
	        var cwd;

	        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	            var path;
	            if (i >= 0)
	                path = arguments[i];
	            else {
	                if (cwd === undefined)
	                    cwd = process.cwd();
	                path = cwd;
	            }

	            assertPath(path);

	            // Skip empty entries
	            if (path.length === 0) {
	                continue;
	            }

	            resolvedPath = path + '/' + resolvedPath;
	            resolvedAbsolute = path.charCodeAt(0) === 47/*/*/;
	        }

	        // At this point the path should be resolved to a full absolute path, but
	        // handle relative paths to be safe (might happen when process.cwd() fails)

	        // Normalize the path
	        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

	        if (resolvedAbsolute) {
	            if (resolvedPath.length > 0)
	                return '/' + resolvedPath;
	            else
	                return '/';
	        } else if (resolvedPath.length > 0) {
	            return resolvedPath;
	        } else {
	            return '.';
	        }
	    },


	    normalize: function normalize(path) {
	        assertPath(path);

	        if (path.length === 0)
	            return '.';

	        const isAbsolute = path.charCodeAt(0) === 47/*/*/;
	        const trailingSeparator = path.charCodeAt(path.length - 1) === 47/*/*/;

	        // Normalize the path
	        path = normalizeStringPosix(path, !isAbsolute);

	        if (path.length === 0 && !isAbsolute)
	            path = '.';
	        if (path.length > 0 && trailingSeparator)
	            path += '/';

	        if (isAbsolute)
	            return '/' + path;
	        return path;
	    },


	    isAbsolute: function isAbsolute(path) {
	        assertPath(path);
	        return path.length > 0 && path.charCodeAt(0) === 47/*/*/;
	    },


	    join: function join() {
	        if (arguments.length === 0)
	            return '.';
	        var joined;
	        for (var i = 0; i < arguments.length; ++i) {
	            var arg = arguments[i];
	            assertPath(arg);
	            if (arg.length > 0) {
	                if (joined === undefined)
	                    joined = arg;
	                else
	                    joined += '/' + arg;
	            }
	        }
	        if (joined === undefined)
	            return '.';
	        return posix.normalize(joined);
	    },


	    relative: function relative(from, to) {
	        assertPath(from);
	        assertPath(to);

	        if (from === to)
	            return '';

	        from = posix.resolve(from);
	        to = posix.resolve(to);

	        if (from === to)
	            return '';

	        // Trim any leading backslashes
	        var fromStart = 1;
	        for (; fromStart < from.length; ++fromStart) {
	            if (from.charCodeAt(fromStart) !== 47/*/*/)
	                break;
	        }
	        var fromEnd = from.length;
	        var fromLen = (fromEnd - fromStart);

	        // Trim any leading backslashes
	        var toStart = 1;
	        for (; toStart < to.length; ++toStart) {
	            if (to.charCodeAt(toStart) !== 47/*/*/)
	                break;
	        }
	        var toEnd = to.length;
	        var toLen = (toEnd - toStart);

	        // Compare paths to find the longest common path from root
	        var length = (fromLen < toLen ? fromLen : toLen);
	        var lastCommonSep = -1;
	        var i = 0;
	        for (; i <= length; ++i) {
	            if (i === length) {
	                if (toLen > length) {
	                    if (to.charCodeAt(toStart + i) === 47/*/*/) {
	                        // We get here if `from` is the exact base path for `to`.
	                        // For example: from='/foo/bar'; to='/foo/bar/baz'
	                        return to.slice(toStart + i + 1);
	                    } else if (i === 0) {
	                        // We get here if `from` is the root
	                        // For example: from='/'; to='/foo'
	                        return to.slice(toStart + i);
	                    }
	                } else if (fromLen > length) {
	                    if (from.charCodeAt(fromStart + i) === 47/*/*/) {
	                        // We get here if `to` is the exact base path for `from`.
	                        // For example: from='/foo/bar/baz'; to='/foo/bar'
	                        lastCommonSep = i;
	                    } else if (i === 0) {
	                        // We get here if `to` is the root.
	                        // For example: from='/foo'; to='/'
	                        lastCommonSep = 0;
	                    }
	                }
	                break;
	            }
	            var fromCode = from.charCodeAt(fromStart + i);
	            var toCode = to.charCodeAt(toStart + i);
	            if (fromCode !== toCode)
	                break;
	            else if (fromCode === 47/*/*/)
	                lastCommonSep = i;
	        }

	        var out = '';
	        // Generate the relative path based on the path difference between `to`
	        // and `from`
	        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
	            if (i === fromEnd || from.charCodeAt(i) === 47/*/*/) {
	                if (out.length === 0)
	                    out += '..';
	                else
	                    out += '/..';
	            }
	        }

	        // Lastly, append the rest of the destination (`to`) path that comes after
	        // the common path parts
	        if (out.length > 0)
	            return out + to.slice(toStart + lastCommonSep);
	        else {
	            toStart += lastCommonSep;
	            if (to.charCodeAt(toStart) === 47/*/*/)
	                ++toStart;
	            return to.slice(toStart);
	        }
	    },


	    _makeLong: function _makeLong(path) {
	        return path;
	    },


	    dirname: function dirname(path) {
	        assertPath(path);
	        if (path.length === 0)
	            return '.';
	        var code = path.charCodeAt(0);
	        var hasRoot = (code === 47/*/*/);
	        var end = -1;
	        var matchedSlash = true;
	        for (var i = path.length - 1; i >= 1; --i) {
	            code = path.charCodeAt(i);
	            if (code === 47/*/*/) {
	                if (!matchedSlash) {
	                    end = i;
	                    break;
	                }
	            } else {
	                // We saw the first non-path separator
	                matchedSlash = false;
	            }
	        }

	        if (end === -1)
	            return hasRoot ? '/' : '.';
	        if (hasRoot && end === 1)
	            return '//';
	        return path.slice(0, end);
	    },


	    basename: function basename(path, ext) {
	        if (ext !== undefined && typeof ext !== 'string')
	            throw new TypeError('"ext" argument must be a string');
	        assertPath(path);

	        var start = 0;
	        var end = -1;
	        var matchedSlash = true;
	        var i;

	        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
	            if (ext.length === path.length && ext === path)
	                return '';
	            var extIdx = ext.length - 1;
	            var firstNonSlashEnd = -1;
	            for (i = path.length - 1; i >= 0; --i) {
	                const code = path.charCodeAt(i);
	                if (code === 47/*/*/) {
	                    // If we reached a path separator that was not part of a set of path
	                    // separators at the end of the string, stop now
	                    if (!matchedSlash) {
	                        start = i + 1;
	                        break;
	                    }
	                } else {
	                    if (firstNonSlashEnd === -1) {
	                        // We saw the first non-path separator, remember this index in case
	                        // we need it if the extension ends up not matching
	                        matchedSlash = false;
	                        firstNonSlashEnd = i + 1;
	                    }
	                    if (extIdx >= 0) {
	                        // Try to match the explicit extension
	                        if (code === ext.charCodeAt(extIdx)) {
	                            if (--extIdx === -1) {
	                                // We matched the extension, so mark this as the end of our path
	                                // component
	                                end = i;
	                            }
	                        } else {
	                            // Extension does not match, so our result is the entire path
	                            // component
	                            extIdx = -1;
	                            end = firstNonSlashEnd;
	                        }
	                    }
	                }
	            }

	            if (start === end)
	                end = firstNonSlashEnd;
	            else if (end === -1)
	                end = path.length;
	            return path.slice(start, end);
	        } else {
	            for (i = path.length - 1; i >= 0; --i) {
	                if (path.charCodeAt(i) === 47/*/*/) {
	                    // If we reached a path separator that was not part of a set of path
	                    // separators at the end of the string, stop now
	                    if (!matchedSlash) {
	                        start = i + 1;
	                        break;
	                    }
	                } else if (end === -1) {
	                    // We saw the first non-path separator, mark this as the end of our
	                    // path component
	                    matchedSlash = false;
	                    end = i + 1;
	                }
	            }

	            if (end === -1)
	                return '';
	            return path.slice(start, end);
	        }
	    },


	    extname: function extname(path) {
	        assertPath(path);
	        var startDot = -1;
	        var startPart = 0;
	        var end = -1;
	        var matchedSlash = true;
	        // Track the state of characters (if any) we see before our first dot and
	        // after any path separator we find
	        var preDotState = 0;
	        for (var i = path.length - 1; i >= 0; --i) {
	            const code = path.charCodeAt(i);
	            if (code === 47/*/*/) {
	                // If we reached a path separator that was not part of a set of path
	                // separators at the end of the string, stop now
	                if (!matchedSlash) {
	                    startPart = i + 1;
	                    break;
	                }
	                continue;
	            }
	            if (end === -1) {
	                // We saw the first non-path separator, mark this as the end of our
	                // extension
	                matchedSlash = false;
	                end = i + 1;
	            }
	            if (code === 46/*.*/) {
	                // If this is our first dot, mark it as the start of our extension
	                if (startDot === -1)
	                    startDot = i;
	                else if (preDotState !== 1)
	                    preDotState = 1;
	            } else if (startDot !== -1) {
	                // We saw a non-dot and non-path separator before our dot, so we should
	                // have a good chance at having a non-empty extension
	                preDotState = -1;
	            }
	        }

	        if (startDot === -1 ||
	            end === -1 ||
	            // We saw a non-dot character immediately before the dot
	            preDotState === 0 ||
	            // The (right-most) trimmed path component is exactly '..'
	            (preDotState === 1 &&
	            startDot === end - 1 &&
	            startDot === startPart + 1)) {
	            return '';
	        }
	        return path.slice(startDot, end);
	    },


	    format: function format(pathObject) {
	        if (pathObject === null || typeof pathObject !== 'object') {
	            throw new TypeError(
	                'Parameter "pathObject" must be an object, not' + (typeof pathObject)
	            );
	        }
	        return _format('/', pathObject);
	    },


	    parse: function parse(path) {
	        assertPath(path);

	        var ret = { root: '', dir: '', base: '', ext: '', name: '' };
	        if (path.length === 0)
	            return ret;
	        var code = path.charCodeAt(0);
	        var isAbsolute = (code === 47/*/*/);
	        var start;
	        if (isAbsolute) {
	            ret.root = '/';
	            start = 1;
	        } else {
	            start = 0;
	        }
	        var startDot = -1;
	        var startPart = 0;
	        var end = -1;
	        var matchedSlash = true;
	        var i = path.length - 1;

	        // Track the state of characters (if any) we see before our first dot and
	        // after any path separator we find
	        var preDotState = 0;

	        // Get non-dir info
	        for (; i >= start; --i) {
	            code = path.charCodeAt(i);
	            if (code === 47/*/*/) {
	                // If we reached a path separator that was not part of a set of path
	                // separators at the end of the string, stop now
	                if (!matchedSlash) {
	                    startPart = i + 1;
	                    break;
	                }
	                continue;
	            }
	            if (end === -1) {
	                // We saw the first non-path separator, mark this as the end of our
	                // extension
	                matchedSlash = false;
	                end = i + 1;
	            }
	            if (code === 46/*.*/) {
	                // If this is our first dot, mark it as the start of our extension
	                if (startDot === -1)
	                    startDot = i;
	                else if (preDotState !== 1)
	                    preDotState = 1;
	            } else if (startDot !== -1) {
	                // We saw a non-dot and non-path separator before our dot, so we should
	                // have a good chance at having a non-empty extension
	                preDotState = -1;
	            }
	        }

	        if (startDot === -1 ||
	            end === -1 ||
	            // We saw a non-dot character immediately before the dot
	            preDotState === 0 ||
	            // The (right-most) trimmed path component is exactly '..'
	            (preDotState === 1 &&
	            startDot === end - 1 &&
	            startDot === startPart + 1)) {
	            if (end !== -1) {
	                if (startPart === 0 && isAbsolute)
	                    ret.base = ret.name = path.slice(1, end);
	                else
	                    ret.base = ret.name = path.slice(startPart, end);
	            }
	        } else {
	            if (startPart === 0 && isAbsolute) {
	                ret.name = path.slice(1, startDot);
	                ret.base = path.slice(1, end);
	            } else {
	                ret.name = path.slice(startPart, startDot);
	                ret.base = path.slice(startPart, end);
	            }
	            ret.ext = path.slice(startDot, end);
	        }

	        if (startPart > 0)
	            ret.dir = path.slice(0, startPart - 1);
	        else if (isAbsolute)
	            ret.dir = '/';

	        return ret;
	    },


	    sep: '/',
	    delimiter: ':',
	    win32: null,
	    posix: null
	};


	posix.win32 = win32.win32 = win32;
	posix.posix = win32.posix = posix;


	if (process.platform === 'win32')
	    module.exports = win32;
	else
	    module.exports = posix;



/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Buffer = __webpack_require__(2).Buffer;


	var isError = function(err) { return err instanceof Error; };
	var kDefaultMaxLength = 100;


	function extend(obj1, obj2) {
	    var objs = [];
	    for (var _i = 2; _i < arguments.length; _i++) {
	        objs[_i - 2] = arguments[_i];
	    }
	    if (typeof obj2 === 'object')
	        for (var i in obj2)
	            obj1[i] = obj2[i];
	    if (objs.length)
	        return extend.apply(null, [obj1].concat(objs));
	    else
	        return obj1;
	}
	exports.extend = extend;


	var Debug;

	function tryStringify(arg) {
	    try {
	        return JSON.stringify(arg);
	    } catch (_) {
	        return '[Circular]';
	    }
	}

	exports.format = function(f) {
	    if (typeof f !== 'string') {
	        const objects = new Array(arguments.length);
	        for (var index = 0; index < arguments.length; index++) {
	            objects[index] = inspect(arguments[index]);
	        }
	        return objects.join(' ');
	    }

	    var argLen = arguments.length;

	    if (argLen === 1) return f;

	    var str = '';
	    var a = 1;
	    var lastPos = 0;
	    for (var i = 0; i < f.length;) {
	        if (f.charCodeAt(i) === 37/*'%'*/ && i + 1 < f.length) {
	            switch (f.charCodeAt(i + 1)) {
	                case 100: // 'd'
	                    if (a >= argLen)
	                        break;
	                    if (lastPos < i)
	                        str += f.slice(lastPos, i);
	                    str += Number(arguments[a++]);
	                    lastPos = i = i + 2;
	                    continue;
	                case 106: // 'j'
	                    if (a >= argLen)
	                        break;
	                    if (lastPos < i)
	                        str += f.slice(lastPos, i);
	                    str += tryStringify(arguments[a++]);
	                    lastPos = i = i + 2;
	                    continue;
	                case 115: // 's'
	                    if (a >= argLen)
	                        break;
	                    if (lastPos < i)
	                        str += f.slice(lastPos, i);
	                    str += String(arguments[a++]);
	                    lastPos = i = i + 2;
	                    continue;
	                case 37: // '%'
	                    if (lastPos < i)
	                        str += f.slice(lastPos, i);
	                    str += '%';
	                    lastPos = i = i + 2;
	                    continue;
	            }
	        }
	        ++i;
	    }
	    if (lastPos === 0)
	        str = f;
	    else if (lastPos < f.length)
	        str += f.slice(lastPos);
	    while (a < argLen) {
	        const x = arguments[a++];
	        if (x === null || (typeof x !== 'object' && typeof x !== 'symbol')) {
	            str += ' ' + x;
	        } else {
	            str += ' ' + inspect(x);
	        }
	    }
	    return str;
	};




	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	    if (debugEnviron === undefined)
	        debugEnviron = process.env.NODE_DEBUG || '';
	    set = set.toUpperCase();
	    if (!debugs[set]) {
	        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	            var pid = process.pid;
	            debugs[set] = function() {
	                var msg = exports.format.apply(exports, arguments);
	                console.error('%s %d: %s', set, pid, msg);
	            };
	        } else {
	            debugs[set] = function() {};
	        }
	    }
	    return debugs[set];
	};  


	/**
	 * Echos the value of a value. Tries to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	    // default options
	    var ctx = {
	        seen: [],
	        stylize: stylizeNoColor
	    };
	    // legacy...
	    if (arguments.length >= 3) ctx.depth = arguments[2];
	    if (arguments.length >= 4) ctx.colors = arguments[3];
	    if (typeof opts === 'boolean') {
	        // legacy...
	        ctx.showHidden = opts;
	    } else if (opts) {
	        // got an "options" object
	        exports._extend(ctx, opts);
	    }
	    // set default options
	    if (ctx.showHidden === undefined) ctx.showHidden = false;
	    if (ctx.depth === undefined) ctx.depth = 2;
	    if (ctx.colors === undefined) ctx.colors = false;
	    if (ctx.customInspect === undefined) ctx.customInspect = true;
	    if (ctx.showProxy === undefined) ctx.showProxy = false;
	    if (ctx.colors) ctx.stylize = stylizeWithColor;
	    if (ctx.maxArrayLength === undefined) ctx.maxArrayLength = kDefaultMaxLength;
	    if (ctx.maxArrayLength === null) ctx.maxArrayLength = Infinity;
	    return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	    'bold': [1, 22],
	    'italic': [3, 23],
	    'underline': [4, 24],
	    'inverse': [7, 27],
	    'white': [37, 39],
	    'grey': [90, 39],
	    'black': [30, 39],
	    'blue': [34, 39],
	    'cyan': [36, 39],
	    'green': [32, 39],
	    'magenta': [35, 39],
	    'red': [31, 39],
	    'yellow': [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	    'special': 'cyan',
	    'number': 'yellow',
	    'boolean': 'yellow',
	    'undefined': 'grey',
	    'null': 'bold',
	    'string': 'green',
	    'symbol': 'green',
	    'date': 'magenta',
	    // "name": intentionally not styling
	    'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	    var style = inspect.styles[styleType];

	    if (style) {
	        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	            '\u001b[' + inspect.colors[style][1] + 'm';
	    } else {
	        return str;
	    }
	}


	function stylizeNoColor(str, styleType) {
	    return str;
	}


	function arrayToHash(array) {
	    var hash = Object.create(null);

	    for (var i = 0; i < array.length; i++) {
	        var val = array[i];
	        hash[val] = true;
	    }

	    return hash;
	}


	function getConstructorOf(obj) {
	    while (obj) {
	        var descriptor = Object.getOwnPropertyDescriptor(obj, 'constructor');
	        if (descriptor !== undefined &&
	            typeof descriptor.value === 'function' &&
	            descriptor.value.name !== '') {
	            return descriptor.value;
	        }

	        obj = Object.getPrototypeOf(obj);
	    }

	    return null;
	}


	function ensureDebugIsInitialized() {
	    if (Debug === undefined) {
	        const runInDebugContext = __webpack_require__(22).runInDebugContext;
	        Debug = runInDebugContext('Debug');
	    }
	}


	function inspectPromise(p) {
	    ensureDebugIsInitialized();
	    // Only create a mirror if the object is a Promise.
	    if (!binding.isPromise(p))
	        return null;
	    const mirror = Debug.MakeMirror(p, true);
	    return {status: mirror.status(), value: mirror.promiseValue().value_};
	}


	function formatValue(ctx, value, recurseTimes) {
	    if (ctx.showProxy &&
	        ((typeof value === 'object' && value !== null) ||
	        typeof value === 'function')) {
	        var proxy = undefined;
	        var proxyCache = ctx.proxyCache;
	        if (!proxyCache)
	            proxyCache = ctx.proxyCache = new Map();
	        // Determine if we've already seen this object and have
	        // determined that it either is or is not a proxy.
	        if (proxyCache.has(value)) {
	            // We've seen it, if the value is not undefined, it's a Proxy.
	            proxy = proxyCache.get(value);
	        } else {
	            // Haven't seen it. Need to check.
	            // If it's not a Proxy, this will return undefined.
	            // Otherwise, it'll return an array. The first item
	            // is the target, the second item is the handler.
	            // We ignore (and do not return) the Proxy isRevoked property.
	            proxy = binding.getProxyDetails(value);
	            if (proxy) {
	                // We know for a fact that this isn't a Proxy.
	                // Mark it as having already been evaluated.
	                // We do this because this object is passed
	                // recursively to formatValue below in order
	                // for it to get proper formatting, and because
	                // the target and handle objects also might be
	                // proxies... it's unfortunate but necessary.
	                proxyCache.set(proxy, undefined);
	            }
	            // If the object is not a Proxy, then this stores undefined.
	            // This tells the code above that we've already checked and
	            // ruled it out. If the object is a proxy, this caches the
	            // results of the getProxyDetails call.
	            proxyCache.set(value, proxy);
	        }
	        if (proxy) {
	            return 'Proxy ' + formatValue(ctx, proxy, recurseTimes);
	        }
	    }

	    // Provide a hook for user-specified inspect functions.
	    // Check that value is an object with an inspect function on it
	    if (ctx.customInspect &&
	        value &&
	        typeof value.inspect === 'function' &&
	        // Filter out the util module, it's inspect function is special
	        value.inspect !== exports.inspect &&
	        // Also filter out any prototype objects using the circular check.
	        !(value.constructor && value.constructor.prototype === value)) {
	        var ret = value.inspect(recurseTimes, ctx);
	        if (typeof ret !== 'string') {
	            ret = formatValue(ctx, ret, recurseTimes);
	        }
	        return ret;
	    }

	    // Primitive types cannot have properties
	    var primitive = formatPrimitive(ctx, value);
	    if (primitive) {
	        return primitive;
	    }

	    // Look up the keys of the object.
	    var keys = Object.keys(value);
	    var visibleKeys = arrayToHash(keys);

	    if (ctx.showHidden) {
	        keys = Object.getOwnPropertyNames(value);
	        keys = keys.concat(Object.getOwnPropertySymbols(value));
	    }

	    // This could be a boxed primitive (new String(), etc.), check valueOf()
	    // NOTE: Avoid calling `valueOf` on `Date` instance because it will return
	    // a number which, when object has some additional user-stored `keys`,
	    // will be printed out.
	    var formatted;
	    var raw = value;
	    try {
	        // the .valueOf() call can fail for a multitude of reasons
	        if (!isDate(value))
	            raw = value.valueOf();
	    } catch (e) {
	        // ignore...
	    }

	    if (typeof raw === 'string') {
	        // for boxed Strings, we have to remove the 0-n indexed entries,
	        // since they just noisy up the output and are redundant
	        keys = keys.filter(function(key) {
	            return !(key >= 0 && key < raw.length);
	        });
	    }

	    // Some type of object without properties can be shortcutted.
	    if (keys.length === 0) {
	        if (typeof value === 'function') {
	            var name = value.name ? ': ' + value.name : '';
	            return ctx.stylize('[Function' + name + ']', 'special');
	        }
	        if (isRegExp(value)) {
	            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	        }
	        if (isDate(value)) {
	            if (Number.isNaN(value.getTime())) {
	                return ctx.stylize(value.toString(), 'date');
	            } else {
	                return ctx.stylize(Date.prototype.toISOString.call(value), 'date');
	            }
	        }
	        if (isError(value)) {
	            return formatError(value);
	        }
	        // now check the `raw` value to handle boxed primitives
	        if (typeof raw === 'string') {
	            formatted = formatPrimitiveNoColor(ctx, raw);
	            return ctx.stylize('[String: ' + formatted + ']', 'string');
	        }
	        if (typeof raw === 'number') {
	            formatted = formatPrimitiveNoColor(ctx, raw);
	            return ctx.stylize('[Number: ' + formatted + ']', 'number');
	        }
	        if (typeof raw === 'boolean') {
	            formatted = formatPrimitiveNoColor(ctx, raw);
	            return ctx.stylize('[Boolean: ' + formatted + ']', 'boolean');
	        }
	        // Fast path for ArrayBuffer.  Can't do the same for DataView because it
	        // has a non-primitive .buffer property that we need to recurse for.
	        if (value instanceof ArrayBuffer) {
	            return getConstructorOf(value).name +
	                ' byteLength: ' + formatNumber(ctx, value.byteLength);
	        }
	    }

	    var constructor = getConstructorOf(value);
	    var base = '', empty = false, braces;
	    var formatter = formatObject;

	    // We can't compare constructors for various objects using a comparison like
	    // `constructor === Array` because the object could have come from a different
	    // context and thus the constructor won't match. Instead we check the
	    // constructor names (including those up the prototype chain where needed) to
	    // determine object types.
	    if (Array.isArray(value)) {
	        // Unset the constructor to prevent "Array [...]" for ordinary arrays.
	        if (constructor && constructor.name === 'Array')
	            constructor = null;
	        braces = ['[', ']'];
	        empty = value.length === 0;
	        formatter = formatArray;
	    // } else if (binding.isSet(value)) {
	    //     braces = ['{', '}'];
	        // With `showHidden`, `length` will display as a hidden property for
	        // arrays. For consistency's sake, do the same for `size`, even though this
	        // property isn't selected by Object.getOwnPropertyNames().
	        // if (ctx.showHidden)
	        //     keys.unshift('size');
	        // empty = value.size === 0;
	        // formatter = formatSet;
	    // } else if (binding.isMap(value)) {
	    //     braces = ['{', '}'];
	        // Ditto.
	        // if (ctx.showHidden)
	        //     keys.unshift('size');
	        // empty = value.size === 0;
	        // formatter = formatMap;
	    } else if (value instanceof ArrayBuffer) {
	        braces = ['{', '}'];
	        keys.unshift('byteLength');
	        visibleKeys.byteLength = true;
	    } else if (value instanceof DataView) {
	        braces = ['{', '}'];
	        // .buffer goes last, it's not a primitive like the others.
	        keys.unshift('byteLength', 'byteOffset', 'buffer');
	        visibleKeys.byteLength = true;
	        visibleKeys.byteOffset = true;
	        visibleKeys.buffer = true;
	    // } else if (value instanceof TypedArray) {
	    //     braces = ['[', ']'];
	    //     formatter = formatTypedArray;
	        // if (ctx.showHidden) {
	            // .buffer goes last, it's not a primitive like the others.
	            // keys.unshift('BYTES_PER_ELEMENT',
	            //     'length',
	            //     'byteLength',
	            //     'byteOffset',
	            //     'buffer');
	        // }
	    } else {
	        // var promiseInternals = inspectPromise(value);
	        // if (promiseInternals) {
	        //     braces = ['{', '}'];
	        //     formatter = formatPromise;
	        // } else {
	            // if (binding.isMapIterator(value)) {
	            //     constructor = { name: 'MapIterator' };
	            //     braces = ['{', '}'];
	            //     empty = false;
	            //     formatter = formatCollectionIterator;
	            // } else if (binding.isSetIterator(value)) {
	            //     constructor = { name: 'SetIterator' };
	            //     braces = ['{', '}'];
	            //     empty = false;
	            //     formatter = formatCollectionIterator;
	            // } else {
	                // Unset the constructor to prevent "Object {...}" for ordinary objects.
	                if (constructor && constructor.name === 'Object')
	                    constructor = null;
	                braces = ['{', '}'];
	                empty = true;  // No other data than keys.
	            // }
	        // }
	    }

	    empty = empty === true && keys.length === 0;

	    // Make functions say that they are functions
	    if (typeof value === 'function') {
	        var n = value.name ? ': ' + value.name : '';
	        base = ' [Function' + n + ']';
	    }

	    // Make RegExps say that they are RegExps
	    if (isRegExp(value)) {
	        base = ' ' + RegExp.prototype.toString.call(value);
	    }

	    // Make dates with properties first say the date
	    if (isDate(value)) {
	        base = ' ' + Date.prototype.toISOString.call(value);
	    }

	    // Make error with message first say the error
	    if (isError(value)) {
	        base = ' ' + formatError(value);
	    }

	    // Make boxed primitive Strings look like such
	    if (typeof raw === 'string') {
	        formatted = formatPrimitiveNoColor(ctx, raw);
	        base = ' ' + '[String: ' + formatted + ']';
	    }

	    // Make boxed primitive Numbers look like such
	    if (typeof raw === 'number') {
	        formatted = formatPrimitiveNoColor(ctx, raw);
	        base = ' ' + '[Number: ' + formatted + ']';
	    }

	    // Make boxed primitive Booleans look like such
	    if (typeof raw === 'boolean') {
	        formatted = formatPrimitiveNoColor(ctx, raw);
	        base = ' ' + '[Boolean: ' + formatted + ']';
	    }

	    // Add constructor name if available
	    if (base === '' && constructor)
	        braces[0] = constructor.name + ' ' + braces[0];

	    if (empty === true) {
	        return braces[0] + base + braces[1];
	    }

	    if (recurseTimes < 0) {
	        if (isRegExp(value)) {
	            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	        } else {
	            return ctx.stylize('[Object]', 'special');
	        }
	    }

	    ctx.seen.push(value);

	    var output = formatter(ctx, value, recurseTimes, visibleKeys, keys);

	    ctx.seen.pop();

	    return reduceToSingleString(output, base, braces);
	}


	function formatNumber(ctx, value) {
	    // Format -0 as '-0'. Strict equality won't distinguish 0 from -0,
	    // so instead we use the fact that 1 / -0 < 0 whereas 1 / 0 > 0 .
	    if (value === 0 && 1 / value < 0)
	        return ctx.stylize('-0', 'number');
	    return ctx.stylize('' + value, 'number');
	}


	function formatPrimitive(ctx, value) {
	    if (value === undefined)
	        return ctx.stylize('undefined', 'undefined');

	    // For some reason typeof null is "object", so special case here.
	    if (value === null)
	        return ctx.stylize('null', 'null');

	    var type = typeof value;

	    if (type === 'string') {
	        var simple = '\'' +
	            JSON.stringify(value)
	                .replace(/^"|"$/g, '')
	                .replace(/'/g, "\\'")
	                .replace(/\\"/g, '"') +
	            '\'';
	        return ctx.stylize(simple, 'string');
	    }
	    if (type === 'number')
	        return formatNumber(ctx, value);
	    if (type === 'boolean')
	        return ctx.stylize('' + value, 'boolean');
	    // es6 symbol primitive
	    if (type === 'symbol')
	        return ctx.stylize(value.toString(), 'symbol');
	}


	function formatPrimitiveNoColor(ctx, value) {
	    var stylize = ctx.stylize;
	    ctx.stylize = stylizeNoColor;
	    var str = formatPrimitive(ctx, value);
	    ctx.stylize = stylize;
	    return str;
	}


	function formatError(value) {
	    return value.stack || '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatObject(ctx, value, recurseTimes, visibleKeys, keys) {
	    return keys.map(function(key) {
	        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, false);
	    });
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	    var output = [];
	    const maxLength = Math.min(Math.max(0, ctx.maxArrayLength), value.length);
	    const remaining = value.length - maxLength;
	    for (var i = 0; i < maxLength; ++i) {
	        if (hasOwnProperty(value, String(i))) {
	            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	                String(i), true));
	        } else {
	            output.push('');
	        }
	    }
	    if (remaining > 0) {
	        output.push("... ${remaining} more item${remaining > 1 ? 's' : ''}");
	    }
	    keys.forEach(function(key) {
	        if (typeof key === 'symbol' || !key.match(/^\d+$/)) {
	            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	                key, true));
	        }
	    });
	    return output;
	}


	function formatTypedArray(ctx, value, recurseTimes, visibleKeys, keys) {
	    const maxLength = Math.min(Math.max(0, ctx.maxArrayLength), value.length);
	    const remaining = value.length - maxLength;
	    var output = new Array(maxLength);
	    for (var i = 0; i < maxLength; ++i)
	        output[i] = formatNumber(ctx, value[i]);
	    if (remaining > 0) {
	        output.push("... ${remaining} more item${remaining > 1 ? 's' : ''}");
	    }
	    for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        if (typeof key === 'symbol' || !key.match(/^\d+$/)) {
	            output.push(
	                formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	        }
	    }
	    return output;
	}


	function formatSet(ctx, value, recurseTimes, visibleKeys, keys) {
	    var output = [];
	    value.forEach(function(v) {
	        var nextRecurseTimes = recurseTimes === null ? null : recurseTimes - 1;
	        var str = formatValue(ctx, v, nextRecurseTimes);
	        output.push(str);
	    });
	    keys.forEach(function(key) {
	        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	            key, false));
	    });
	    return output;
	}


	function formatMap(ctx, value, recurseTimes, visibleKeys, keys) {
	    var output = [];
	    value.forEach(function(v, k) {
	        var nextRecurseTimes = recurseTimes === null ? null : recurseTimes - 1;
	        var str = formatValue(ctx, k, nextRecurseTimes);
	        str += ' => ';
	        str += formatValue(ctx, v, nextRecurseTimes);
	        output.push(str);
	    });
	    keys.forEach(function(key) {
	        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	            key, false));
	    });
	    return output;
	}

	function formatCollectionIterator(ctx, value, recurseTimes, visibleKeys, keys) {
	    ensureDebugIsInitialized();
	    const mirror = Debug.MakeMirror(value, true);
	    var nextRecurseTimes = recurseTimes === null ? null : recurseTimes - 1;
	    var vals = mirror.preview();
	    var output = [];
	    for(var i = 0; i < vals.length; i++) {
	        var o = vals[i];
	        output.push(formatValue(ctx, o, nextRecurseTimes));
	    }
	    return output;
	}

	function formatPromise(ctx, value, recurseTimes, visibleKeys, keys) {
	    var output = [];
	    var internals = inspectPromise(value);
	    if (internals.status === 'pending') {
	        output.push('<pending>');
	    } else {
	        var nextRecurseTimes = recurseTimes === null ? null : recurseTimes - 1;
	        var str = formatValue(ctx, internals.value, nextRecurseTimes);
	        if (internals.status === 'rejected') {
	            output.push('<rejected> ' + str);
	        } else {
	            output.push(str);
	        }
	    }
	    keys.forEach(function(key) {
	        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	            key, false));
	    });
	    return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	    var name, str, desc;
	    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	    if (desc.get) {
	        if (desc.set) {
	            str = ctx.stylize('[Getter/Setter]', 'special');
	        } else {
	            str = ctx.stylize('[Getter]', 'special');
	        }
	    } else {
	        if (desc.set) {
	            str = ctx.stylize('[Setter]', 'special');
	        }
	    }
	    if (!hasOwnProperty(visibleKeys, key)) {
	        if (typeof key === 'symbol') {
	            name = '[' + ctx.stylize(key.toString(), 'symbol') + ']';
	        } else {
	            name = '[' + key + ']';
	        }
	    }
	    if (!str) {
	        if (ctx.seen.indexOf(desc.value) < 0) {
	            if (recurseTimes === null) {
	                str = formatValue(ctx, desc.value, null);
	            } else {
	                str = formatValue(ctx, desc.value, recurseTimes - 1);
	            }
	            if (str.indexOf('\n') > -1) {
	                if (array) {
	                    str = str.replace(/\n/g, '\n  ');
	                } else {
	                    str = str.replace(/(^|\n)/g, '\n   ');
	                }
	            }
	        } else {
	            str = ctx.stylize('[Circular]', 'special');
	        }
	    }
	    if (name === undefined) {
	        if (array && key.match(/^\d+$/)) {
	            return str;
	        }
	        name = JSON.stringify('' + key);
	        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	            name = name.substr(1, name.length - 2);
	            name = ctx.stylize(name, 'name');
	        } else {
	            name = name.replace(/'/g, "\\'")
	                .replace(/\\"/g, '"')
	                .replace(/(^"|"$)/g, "'")
	                .replace(/\\\\/g, '\\');
	            name = ctx.stylize(name, 'string');
	        }
	    }

	    return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	    var length = output.reduce(function(prev, cur) {
	        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	    }, 0);

	    if (length > 60) {
	        return braces[0] +
	            // If the opening "brace" is too large, like in the case of "Set {",
	            // we need to force the first item to be on the next line or the
	            // items will not line up correctly.
	            (base === '' && braces[0].length === 1 ? '' : base + '\n ') +
	            ' ' +
	            output.join(',\n  ') +
	            ' ' +
	            braces[1];
	    }

	    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	exports.isArray = Array.isArray;

	function isBoolean(arg) {
	    return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	    return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	    return arg === null || arg === undefined;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	    return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	    return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	    return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	    return arg === undefined;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	    return re instanceof RegExp;
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	    return arg !== null && typeof arg === 'object';
	}
	exports.isObject = isObject;

	function isDate(d) {
	    return d instanceof Date;
	}
	exports.isDate = isDate;

	exports.isError = isError;

	function isFunction(arg) {
	    return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	    return arg === null ||
	        typeof arg !== 'object' && typeof arg !== 'function';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function pad(n) {
	    return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	    'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	    var d = new Date();
	    var time = [pad(d.getHours()),
	        pad(d.getMinutes()),
	        pad(d.getSeconds())].join(':');
	    return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 * @throws {TypeError} Will error if either constructor is null, or if
	 *     the super constructor lacks a prototype.
	 */
	exports.inherits = function(ctor, superCtor) {

	    if (ctor === undefined || ctor === null)
	        throw new TypeError('The constructor to "inherits" must not be ' +
	            'null or undefined');

	    if (superCtor === undefined || superCtor === null)
	        throw new TypeError('The super constructor to "inherits" must not ' +
	            'be null or undefined');

	    if (superCtor.prototype === undefined)
	        throw new TypeError('The super constructor to "inherits" must ' +
	            'have a prototype');

	    ctor.super_ = superCtor;
	    Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
	};

	exports._extend = function(origin, add) {
	    // Don't do anything if add isn't an object
	    if (add === null || typeof add !== 'object') return origin;

	    var keys = Object.keys(add);
	    var i = keys.length;
	    while (i--) {
	        origin[keys[i]] = add[keys[i]];
	    }
	    return origin;
	};

	function hasOwnProperty(obj, prop) {
	    return Object.prototype.hasOwnProperty.call(obj, prop);
	}


	// Deprecated old stuff.

	var internalUtil = {
	    deprecate: function(method, message) {
	        return function() {
	            console.log(message);
	            method.apply(null, arguments);
	        };
	    },
	};

	exports.deprecate = internalUtil.deprecate;

	exports.print = internalUtil.deprecate(function() {
	    for (var i = 0, len = arguments.length; i < len; ++i) {
	        process.stdout.write(String(arguments[i]));
	    }
	}, 'util.print is deprecated. Use console.log instead.');


	exports.puts = internalUtil.deprecate(function() {
	    for (var i = 0, len = arguments.length; i < len; ++i) {
	        process.stdout.write(arguments[i] + '\n');
	    }
	}, 'util.puts is deprecated. Use console.log instead.');


	exports.debug = internalUtil.deprecate(function(x) {
	    process.stderr.write('DEBUG: ' + x + '\n');
	}, 'util.debug is deprecated. Use console.error instead.');


	exports.error = internalUtil.deprecate(function(x) {
	    for (var i = 0, len = arguments.length; i < len; ++i) {
	        process.stderr.write(arguments[i] + '\n');
	    }
	}, 'util.error is deprecated. Use console.error instead.');


	exports._errnoException = function(err, syscall, original) {
	    var errname = err;
	    var message = syscall + ' ' + errname;
	    if (original)
	        message += ' ' + original;
	    var e = new Error(message);
	    e.code = errname;
	    e.errno = errname;
	    e.syscall = syscall;
	    return e;
	};


	exports._exceptionWithHostPort = function(err,
	                                          syscall,
	                                          address,
	                                          port,
	                                          additional) {
	    var details;
	    if (port && port > 0) {
	        details = address + ':' + port;
	    } else {
	        details = address;
	    }

	    if (additional) {
	        details += ' - Local (' + additional + ')';
	    }
	    var ex = exports._errnoException(err, syscall, details);
	    ex.address = address;
	    if (port) {
	        ex.port = port;
	    }
	    return ex;
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("vm");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Note: in general `module.js` needs 2 system calls to get `require` working:
	//  1. `fs.readFileSync()`
	//  2. `fs.statSync()`
	//
	// To add support for paths in symlinks it also needs `fs.realpathSync()`, however,
	// `realpath` IS NOT a system call, it is a function implemented in `libc`.
	//
	// So, we need to implement `fs.realpathSync()` then we can support symlinks in `require`,
	// though it might not be 100% compatible with Node.js.


	var NativeModule = __webpack_require__(24).NativeModule;
	var util = __webpack_require__(21);
	var internalModule = __webpack_require__(40);
	var internalUtil = __webpack_require__(30);
	var vm = __webpack_require__(44);
	var assert = __webpack_require__(35).ok;
	var fs = __webpack_require__(37);
	var path = __webpack_require__(20);
	var libjs = __webpack_require__(6);

	// const internalModuleReadFile = process.binding('fs').internalModuleReadFile;
	// const internalModuleStat = process.binding('fs').internalModuleStat;
	// const preserveSymlinks = !!process.binding('config').preserveSymlinks;


	// From: https://github.com/nodejs/node/blob/master/src/node_file.cc#L528
	// Used to speed up module loading.  Returns the contents of the file as
	// a string or undefined when the file cannot be opened.  The speedup
	// comes from not creating Error objects on failure.
	var internalModuleReadFile = function(path) {
	    try {
	        return fs.readFileSync(path, 'utf8');
	    } catch(e) {
	        return undefined;
	    }
	};

	// const internalModuleStat = ;
	var preserveSymlinks = false;


	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	    return Object.prototype.hasOwnProperty.call(obj, prop);
	}


	// TODO: Change this retarded `stat()` name to `isDir()`.
	function stat(filename) {
	    filename = path._makeLong(filename);
	    var cache = stat.cache;
	    if (cache !== null) {
	        var result = cache[filename];
	        if (result !== undefined) return result;
	    }

	    try {
	        var res = libjs.stat(filename);
	    } catch(errno) {
	        return errno;
	    }

	    result = (res.mode & /* libjs.S.IFDIR */ 16384) ? 1 : 0;

	    if (cache !== null)
	        cache[filename] = result;

	    return result;
	}
	stat.cache = null;


	function Module(id, parent) {
	    this.id = id;
	    this.exports = {};
	    this.parent = parent;
	    if (parent && parent.children) {
	        parent.children.push(this);
	    }

	    this.filename = null;
	    this.loaded = false;
	    this.children = [];
	}
	module.exports = Module;

	Module._cache = {};
	Module._pathCache = {};
	Module._extensions = {};
	var modulePaths = [];
	Module.globalPaths = [];

	Module.wrapper = NativeModule.wrapper;
	Module.wrap = NativeModule.wrap;
	Module._debug = util.debuglog('module');

	// We use this alias for the preprocessor that filters it out
	var debug = Module._debug;


	// given a module name, and a list of paths to test, returns the first
	// matching file in the following precedence.
	//
	// require("a.<ext>")
	//   -> a.<ext>
	//
	// require("a")
	//   -> a
	//   -> a.<ext>
	//   -> a/index.<ext>

	// check if the directory is a package.json dir
	var packageMainCache = {};

	function readPackage(requestPath) {

	    if (hasOwnProperty(packageMainCache, requestPath)) {
	        return packageMainCache[requestPath];
	    }

	    // var jsonPath = path.resolve(requestPath, 'package.json');

	    // const json = internalModuleReadFile(path._makeLong(jsonPath));
	    // console.log(jsonPath);
	    try {
	        var jsonPath = path.resolve(requestPath, 'package.json');
	        var json = internalModuleReadFile(path._makeLong(jsonPath));
	    } catch (e) {
	        return false;
	    }


	    if (json === undefined) {
	        return false;
	    }

	    try {
	        var pkg = packageMainCache[requestPath] = JSON.parse(json).main;
	    } catch (e) {
	        e.path = jsonPath;
	        e.message = 'Error parsing ' + jsonPath + ': ' + e.message;
	        throw e;
	    }
	    return pkg;
	}

	function tryPackage(requestPath, exts, isMain) {
	    var pkg = readPackage(requestPath);

	    if (!pkg) return false;

	    var filename = path.resolve(requestPath, pkg);
	    return tryFile(filename, isMain) ||
	        tryExtensions(filename, exts, isMain) ||
	        tryExtensions(path.resolve(filename, 'index'), exts, isMain);
	}

	// check if the file exists and is not a directory
	// if using --preserve-symlinks and isMain is false,
	// keep symlinks intact, otherwise resolve to the
	// absolute realpath.
	function tryFile(requestPath, isMain) {
	    // console.log(requestPath, isMain);
	    return requestPath;
	    var rc = stat(requestPath);
	    // console.log('rc', rc);
	    if(rc) return requestPath;
	    else return false;
	    // console.log(rc);
	    // if (preserveSymlinks && !isMain) {
	    //     return rc === 0 && path.resolve(requestPath);
	    // }
	    // return rc === 0 && fs.realpathSync(requestPath);
	}

	// given a path check a the file exists with any of the set extensions
	function tryExtensions(p, exts, isMain) {
	    for (var i = 0; i < exts.length; i++) {

	        var filename = tryFile(p + exts[i], isMain);

	        if (filename) {
	            return filename;
	        }
	    }
	    return false;
	}

	var warned = false;
	Module._findPath = function(request, paths, isMain) {
	    if (path.isAbsolute(request)) {
	        paths = [''];
	    } else if (!paths || paths.length === 0) {
	        return false;
	    }

	    const cacheKey = JSON.stringify({request: request, paths: paths});
	    if (Module._pathCache[cacheKey]) {
	        return Module._pathCache[cacheKey];
	    }

	    var exts;
	    const trailingSlash = request.length > 0 &&
	        request.charCodeAt(request.length - 1) === 47/*/*/;

	    // For each path
	    for (var i = 0; i < paths.length; i++) {

	        // Don't search further if path doesn't exist
	        var curPath = paths[i];
	        if (curPath && stat(curPath) < 1) continue;

	        var basePath = path.resolve(curPath, request);

	        var filename;


	        if (!trailingSlash) {
	            var rc = stat(basePath);
	            if (rc === 0) {  // File.
	                // if (preserveSymlinks && !isMain) {
	                    filename = path.resolve(basePath);
	                // } else {
	                //     filename = fs.realpathSync(basePath);
	                // }
	            } else if (rc === 1) {  // Directory.
	                if (exts === undefined)
	                    exts = Object.keys(Module._extensions);
	                filename = tryPackage(basePath, exts, isMain);
	            }

	            if (!filename) {
	                // try it with each of the extensions
	                if (exts === undefined)
	                    exts = Object.keys(Module._extensions);
	                filename = tryExtensions(basePath, exts, isMain);
	            }
	        }

	        if (!filename) {
	            if (exts === undefined)
	                exts = Object.keys(Module._extensions);
	            filename = tryPackage(basePath, exts, isMain);
	        }

	        if (!filename) {
	            // try it with each of the extensions at "index"
	            if (exts === undefined)
	                exts = Object.keys(Module._extensions);
	            filename = tryExtensions(path.resolve(basePath, 'index'), exts, isMain);
	        }

	        if (filename) {
	            // Warn once if '.' resolved outside the module dir
	            if (request === '.' && i > 0) {
	                warned = internalUtil.printDeprecationMessage(
	                    'warning: require(\'.\') resolved outside the package ' +
	                    'directory. This functionality is deprecated and will be removed ' +
	                    'soon.', warned);
	            }

	            Module._pathCache[cacheKey] = filename;
	            return filename;
	        }
	    }

	    return false;
	};

	// 'node_modules' character codes reversed
	var nmChars = [ 115, 101, 108, 117, 100, 111, 109, 95, 101, 100, 111, 110 ];
	var nmLen = nmChars.length;
	if (process.platform === 'win32') {
	    // 'from' is the __dirname of the module.
	    Module._nodeModulePaths = function(from) {
	        // guarantee that 'from' is absolute.
	        from = path.resolve(from);

	        // note: this approach *only* works when the path is guaranteed
	        // to be absolute.  Doing a fully-edge-case-correct path.split
	        // that works on both Windows and Posix is non-trivial.
	        var paths = [];
	        var p = 0;
	        var last = from.length;
	        for (var i = from.length - 1; i >= 0; --i) {
	            var code = from.charCodeAt(i);
	            if (code === 92/*\*/ || code === 47/*/*/) {
	                if (p !== nmLen)
	                    paths.push(from.slice(0, last) + '\\node_modules');
	                last = i;
	                p = 0;
	            } else if (p !== -1 && p < nmLen) {
	                if (nmChars[p] === code) {
	                    ++p;
	                } else {
	                    p = -1;
	                }
	            }
	        }

	        return paths;
	    };
	} else { // posix
	         // 'from' is the __dirname of the module.
	    Module._nodeModulePaths = function(from) {
	        // guarantee that 'from' is absolute.
	        from = path.resolve(from);
	        // Return early not only to avoid unnecessary work, but to *avoid* returning
	        // an array of two items for a root: [ '//node_modules', '/node_modules' ]
	        if (from === '/')
	            return ['/node_modules'];

	        // note: this approach *only* works when the path is guaranteed
	        // to be absolute.  Doing a fully-edge-case-correct path.split
	        // that works on both Windows and Posix is non-trivial.
	        var paths = [];
	        var p = 0;
	        var last = from.length;
	        for (var i = from.length - 1; i >= 0; --i) {
	            var code = from.charCodeAt(i);
	            if (code === 47/*/*/) {
	                if (p !== nmLen)
	                    paths.push(from.slice(0, last) + '/node_modules');
	                last = i;
	                p = 0;
	            } else if (p !== -1 && p < nmLen) {
	                if (nmChars[p] === code) {
	                    ++p;
	                } else {
	                    p = -1;
	                }
	            }
	        }

	        return paths;
	    };
	}


	// 'index.' character codes
	var indexChars = [ 105, 110, 100, 101, 120, 46 ];
	var indexLen = indexChars.length;
	Module._resolveLookupPaths = function(request, parent) {
	    if (NativeModule.nonInternalExists(request)) {
	        return [request, []];
	    }

	    var reqLen = request.length;
	    // Check for relative path
	    if (reqLen < 2 ||
	        request.charCodeAt(0) !== 46/*.*/ ||
	        (request.charCodeAt(1) !== 46/*.*/ &&
	        request.charCodeAt(1) !== 47/*/*/)) {
	        var paths = modulePaths;
	        if (parent) {
	            if (!parent.paths)
	                paths = parent.paths = [];
	            else
	                paths = parent.paths.concat(paths);
	        }

	        // Maintain backwards compat with certain broken uses of require('.')
	        // by putting the module's directory in front of the lookup paths.
	        if (request === '.') {
	            if (parent && parent.filename) {
	                paths.unshift(path.dirname(parent.filename));
	            } else {
	                paths.unshift(path.resolve(request));
	            }
	        }
	        return [request, paths];
	    }

	    // with --eval, parent.id is not set and parent.filename is null
	    if (!parent || !parent.id || !parent.filename) {
	        // make require('./path/to/foo') work - normally the path is taken
	        // from realpath(__filename) but with eval there is no filename
	        var mainPaths = ['.'].concat(Module._nodeModulePaths('.'), modulePaths);
	        return [request, mainPaths];
	    }

	    // Is the parent an index module?
	    // We can assume the parent has a valid extension,
	    // as it already has been accepted as a module.
	    const base = path.basename(parent.filename);
	    var parentIdPath;
	    if (base.length > indexLen) {
	        var i = 0;
	        for (; i < indexLen; ++i) {
	            if (indexChars[i] !== base.charCodeAt(i))
	                break;
	        }
	        if (i === indexLen) {
	            // We matched 'index.', let's validate the rest
	            for (; i < base.length; ++i) {
	                const code = base.charCodeAt(i);
	                if (code !== 95/*_*/ &&
	                    (code < 48/*0*/ || code > 57/*9*/) &&
	                    (code < 65/*A*/ || code > 90/*Z*/) &&
	                    (code < 97/*a*/ || code > 122/*z*/))
	                    break;
	            }
	            if (i === base.length) {
	                // Is an index module
	                parentIdPath = parent.id;
	            } else {
	                // Not an index module
	                parentIdPath = path.dirname(parent.id);
	            }
	        } else {
	            // Not an index module
	            parentIdPath = path.dirname(parent.id);
	        }
	    } else {
	        // Not an index module
	        parentIdPath = path.dirname(parent.id);
	    }
	    var id = path.resolve(parentIdPath, request);

	    // make sure require('./path') and require('path') get distinct ids, even
	    // when called from the toplevel js file
	    if (parentIdPath === '.' && id.indexOf('/') === -1) {
	        id = './' + id;
	    }

	    debug('RELATIVE: requested: %s set ID to: %s from %s', request, id,
	        parent.id);


	    return [id, [path.dirname(parent.filename)]];
	};


	// Check the cache for the requested file.
	// 1. If a module already exists in the cache: return its exports object.
	// 2. If the module is native: call `NativeModule.require()` with the
	//    filename and return the result.
	// 3. Otherwise, create a new module for the file and save it to the cache.
	//    Then have it load  the file contents before returning its exports
	//    object.
	Module._load = function(request, parent, isMain) {

	    if(true) {
	        if (parent) {
	            debug('Module._load REQUEST %s parent: %s', request, parent.id);
	        }
	    }

	    var filename = Module._resolveFilename(request, parent, isMain);

	    var cachedModule = Module._cache[filename];
	    if (cachedModule) {
	        return cachedModule.exports;
	    }

	    if (NativeModule.nonInternalExists(filename)) {
	        if(true) {
	            debug('load native module %s', request);
	        }
	        return NativeModule.require(filename);
	    }

	    var module = new Module(filename, parent);

	    if (isMain) {
	        process.mainModule = module;
	        module.id = '.';
	    }

	    Module._cache[filename] = module;

	    tryModuleLoad(module, filename);

	    return module.exports;
	};

	function tryModuleLoad(module, filename) {
	    var threw = true;
	    try {
	        module.load(filename);
	        threw = false;
	    } finally {
	        if (threw) {
	            delete Module._cache[filename];
	        }
	    }
	}

	Module._resolveFilename = function(request, parent, isMain) {

	    if (NativeModule.nonInternalExists(request)) {
	        return request;
	    }

	    var resolvedModule = Module._resolveLookupPaths(request, parent);

	    var id = resolvedModule[0];
	    var paths = resolvedModule[1];

	    // look up the filename first, since that's the cache key.
	    if(true) {
	        debug('looking for %j in %j', id, paths);
	    }

	    var filename = Module._findPath(request, paths, isMain);

	    // console.log(filename);
	    if (!filename) {
	        var err = new Error("Cannot find module '" + request + "'");
	        err.code = 'MODULE_NOT_FOUND';
	        throw err;
	    }

	    return filename;
	};


	// Given a file name, pass it to the proper extension handler.
	Module.prototype.load = function(filename) {
	    // console.log('f', filename);
	    if(true) {
	        debug('load %j for module %j', filename, this.id);
	    }

	    assert(!this.loaded);
	    this.filename = filename;
	    this.paths = Module._nodeModulePaths(path.dirname(filename));

	    var extension = path.extname(filename) || '.js';
	    if (!Module._extensions[extension]) extension = '.js';
	    Module._extensions[extension](this, filename);
	    this.loaded = true;
	};


	// Loads a module at the given file path. Returns that module's
	// `exports` property.
	Module.prototype.require = function(path) {
	    if(true) {
	        assert(path, 'missing path');
	        assert(typeof path === 'string', 'path must be a string');
	    }
	    return Module._load(path, this, /* isMain */ false);
	};


	// Resolved path to process.argv[1] will be lazily placed here
	// (needed for setting breakpoint when called with --debug-brk)
	var resolvedArgv;


	// Run the file contents in the correct scope or sandbox. Expose
	// the correct helper variables (require, module, exports) to
	// the file.
	// Returns exception, if any.
	Module.prototype._compile = function(content, filename) {
	    // Remove shebang
	    var contLen = content.length;
	    if (contLen >= 2) {
	        if (content.charCodeAt(0) === 35/*#*/ &&
	            content.charCodeAt(1) === 33/*!*/) {
	            if (contLen === 2) {
	                // Exact match
	                content = '';
	            } else {
	                // Find end of shebang line and slice it off
	                var i = 2;
	                for (; i < contLen; ++i) {
	                    var code = content.charCodeAt(i);
	                    if (code === 10/*\n*/ || code === 13/*\r*/)
	                        break;
	                }
	                if (i === contLen)
	                    content = '';
	                else {
	                    // Note that this actually includes the newline character(s) in the
	                    // new output. This duplicates the behavior of the regular expression
	                    // that was previously used to replace the shebang line
	                    content = content.slice(i);
	                }
	            }
	        }
	    }

	    // create wrapper function
	    var wrapper = Module.wrap(content);


	    var compiledWrapper = eval(wrapper);
	    // var compiledWrapper = vm.runInThisContext(wrapper, {
	    //     filename: filename,
	    //     lineOffset: 0,
	    //     displayErrors: true
	    // });

	    /*if (process._debugWaitConnect) {
	        if (!resolvedArgv) {
	            // we enter the repl if we're not given a filename argument.
	            if (process.argv[1]) {
	                resolvedArgv = Module._resolveFilename(process.argv[1], null);
	            } else {
	                resolvedArgv = 'repl';
	            }
	        }

	        // Set breakpoint on module start
	        if (filename === resolvedArgv) {
	            delete process._debugWaitConnect;
	            const Debug = vm.runInDebugContext('Debug');
	            Debug.setBreakPoint(compiledWrapper, 0, 0);
	        }
	    }*/
	    var dirname = path.dirname(filename);
	    var require = internalModule.makeRequireFunction.call(this);
	    var args = [this.exports, require, this, filename, dirname];
	    var depth = internalModule.requireDepth;
	    if (depth === 0) stat.cache = {};
	    var result = compiledWrapper.apply(this.exports, args);
	    if (depth === 0) stat.cache = null;
	    return result;
	};


	// Native extension for .js
	Module._extensions['.js'] = function(module, filename) {
	    var content = fs.readFileSync(filename, 'utf8');
	    module._compile(internalModule.stripBOM(content), filename);
	};


	// Native extension for .json
	Module._extensions['.json'] = function(module, filename) {
	    var content = fs.readFileSync(filename, 'utf8');
	    try {
	        module.exports = JSON.parse(internalModule.stripBOM(content));
	    } catch (err) {
	        err.message = filename + ': ' + err.message;
	        throw err;
	    }
	};


	//Native extension for .node
	// Module._extensions['.node'] = function(module, filename) {
	//     return process.dlopen(module, path._makeLong(filename));
	// };


	// bootstrap main module.
	Module.runMain = function() {
	    // Load the main module--the command line argument.
	    Module._load(process.argv[1], null, true);

	    // Handle any nextTicks added in the first tick of the program
	    // process._tickCallback();
	};

	Module._initPaths = function() {
	    const isWindows = process.platform === 'win32';

	    var homeDir;
	    if (isWindows) {
	        homeDir = process.env.USERPROFILE;
	    } else {
	        homeDir = process.env.HOME;
	    }

	    var paths = [path.resolve(process.execPath, '..', '..', 'lib', 'node')];

	    if (homeDir) {
	        paths.unshift(path.resolve(homeDir, '.node_libraries'));
	        paths.unshift(path.resolve(homeDir, '.node_modules'));
	    }

	    var nodePath = process.env['NODE_PATH'];
	    if (nodePath) {
	        paths = nodePath.split(path.delimiter).filter(function(path) {
	            return !!path;
	        }).concat(paths);
	    }

	    modulePaths = paths;

	    // clone as a read-only copy, for introspection.
	    Module.globalPaths = modulePaths.slice(0);
	};

	// TODO(bnoordhuis) Unused, remove in the future.
	// Module.requireRepl = internalUtil.deprecate(function() {
	//     return NativeModule.require('internal/repl');
	// }, 'Module.requireRepl is deprecated.');

	Module._preloadModules = function(requests) {
	    if (!Array.isArray(requests))
	        return;

	    // Preloaded modules have a dummy parent module which is deemed to exist
	    // in the current working directory. This seeds the search path for
	    // preloaded modules.
	    var parent = new Module('internal/preload', null);
	    try {
	        parent.paths = Module._nodeModulePaths(process.cwd());
	    } catch (e) {
	        if (e.code !== 'ENOENT') {
	            throw e;
	        }
	    }
	    requests.forEach(function(request) {
	        parent.require(request);
	    });
	};

	Module._initPaths();

	// backwards compatibility
	Module.Module = Module;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	function NativeModule(id) {
	    this.filename = id + '.js';
	    this.id = id;
	    this.exports = {};
	    this.loaded = false;
	    this.loading = false;
	}

	// NativeModule._source = process.binding('natives');
	NativeModule._cache = {
	    assert: null,
	    buffer: null,
	    console: null,
	    eloop: null,
	    events: null,
	    fs: null,
	    module: null,
	    path: null,
	    'static-arraybuffer': null,
	    'static-buffer': null,
	    stream: null,
	    timers: null,
	    util: null,
	};

	NativeModule.require = function(id) {
	    if (id == 'native_module') {
	        return NativeModule;
	    }

	    var cached = NativeModule.getCached(id);
	    if (cached && (cached.loaded || cached.loading)) {
	        return cached.exports;
	    }

	    if (!NativeModule.exists(id)) {
	        throw new Error('No such native module '+ id);
	    }

	    process.moduleLoadList.push('NativeModule ' + id);

	    var nativeModule = new NativeModule(id);

	    nativeModule.cache();
	    nativeModule.compile();

	    return nativeModule.exports;
	};

	NativeModule.getCached = function(id) {
	    return NativeModule._cache[id];
	};

	NativeModule.exists = function(id) {
	    // return typeof NativeModule._cache[id] !== 'undefined';
	    return NativeModule._cache.hasOwnProperty(id);
	};

	const EXPOSE_INTERNALS = process.execArgv.some(function(arg) {
	    return arg.match(/^--expose[-_]internals$/);
	});

	if (EXPOSE_INTERNALS) {
	    NativeModule.nonInternalExists = NativeModule.exists;

	    NativeModule.isInternal = function(id) {
	        return false;
	    };
	} else {
	    NativeModule.nonInternalExists = function(id) {
	        return NativeModule.exists(id) && !NativeModule.isInternal(id);
	    };

	    NativeModule.isInternal = function(id) {
	        // return id.startsWith('internal/');
	        var what = 'internal/';
	        return id.substr(0, what.length) === what;
	    };
	}


	NativeModule.getSource = function(id) {
	    // return require('./' + id);
	    // return NativeModule._source[id];
	};

	NativeModule.wrap = function(script) {
	    return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
	};

	NativeModule.wrapper = [
	    '(function (exports, require, module, __filename, __dirname) { ',
	    '\n});'
	];

	NativeModule.prototype.compile = function() {
	    var source = NativeModule.getSource(this.id);
	    source = NativeModule.wrap(source);

	    this.loading = true;

	    try {
	        // var fn = eval(source);
	        // var fn = runInThisContext(source, {
	        //     filename: this.filename,
	        //     lineOffset: 0,
	        //     displayErrors: true
	        // });
	        // fn(this.exports, NativeModule.require, this, this.filename);

	        this.exports = __webpack_require__(25)("./" + this.id);

	        this.loaded = true;
	    } finally {
	        this.loading = false;
	    }
	};

	NativeModule.prototype.cache = function() {
	    NativeModule._cache[this.id] = this;
	};

	exports.NativeModule = NativeModule;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./_stream_duplex": 26,
		"./_stream_passthrough": 32,
		"./_stream_readable": 27,
		"./_stream_transform": 31,
		"./_stream_writable": 29,
		"./assert": 35,
		"./boot": 1,
		"./buffer": 2,
		"./console": 36,
		"./eloop": 15,
		"./events": 13,
		"./fs": 37,
		"./internal/module": 40,
		"./internal/streams/BufferList": 33,
		"./internal/streams/lazy_transform": 42,
		"./internal/util": 30,
		"./module": 23,
		"./native_module": 24,
		"./path": 20,
		"./process": 12,
		"./punycode": 43,
		"./static-arraybuffer": 5,
		"./static-buffer": 11,
		"./stream": 28,
		"./timers": 16,
		"./util": 21,
		"./vm": 44
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 25;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	'use strict';

	module.exports = Duplex;

	const util = __webpack_require__(21);
	const Readable = __webpack_require__(27);
	const Writable = __webpack_require__(29);

	util.inherits(Duplex, Readable);

	var keys = Object.keys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	    var method = keys[v];
	    if (!Duplex.prototype[method])
	        Duplex.prototype[method] = Writable.prototype[method];
	}

	function Duplex(options) {
	    if (!(this instanceof Duplex))
	        return new Duplex(options);

	    Readable.call(this, options);
	    Writable.call(this, options);

	    if (options && options.readable === false)
	        this.readable = false;

	    if (options && options.writable === false)
	        this.writable = false;

	    this.allowHalfOpen = true;
	    if (options && options.allowHalfOpen === false)
	        this.allowHalfOpen = false;

	    this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	    // if we allow half-open state, or if the writable side ended,
	    // then we're ok.
	    if (this.allowHalfOpen || this._writableState.ended)
	        return;

	    // no more data can be written.
	    // But allow more writes to happen in this tick.
	    process.nextTick(onEndNT, this);
	}

	function onEndNT(self) {
	    self.end();
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = Readable;
	Readable.ReadableState = ReadableState;

	const EE = __webpack_require__(13);
	const Stream = __webpack_require__(28);
	const Buffer = __webpack_require__(2).Buffer;
	const util = __webpack_require__(21);
	const debug = util.debuglog('stream');
	const BufferList = __webpack_require__(33);
	var StringDecoder;

	util.inherits(Readable, Stream);

	var prependListener;
	if (typeof EE.prototype.prependListener === 'function') {
	    prependListener = function prependListener(emitter, event, fn) {
	        return emitter.prependListener(event, fn);
	    };
	} else {
	    prependListener = function prependListener(emitter, event, fn) {
	        // This is a hack to make sure that our error handler is attached before any
	        // userland ones.  NEVER DO THIS. This is here only because this code needs
	        // to continue to work with older versions of Node.js that do not include
	        // the prependListener() method. The goal is to eventually remove this hack.
	        if (!emitter._events || !emitter._events[event])
	            emitter.on(event, fn);
	        else if (Array.isArray(emitter._events[event]))
	            emitter._events[event].unshift(fn);
	        else
	            emitter._events[event] = [fn, emitter._events[event]];
	    };
	}

	function ReadableState(options, stream) {
	    options = options || {};

	    // object stream flag. Used to make read(n) ignore n and to
	    // make all the buffer merging and length checks go away
	    this.objectMode = !!options.objectMode;

	    if (stream instanceof Stream.Duplex)
	        this.objectMode = this.objectMode || !!options.readableObjectMode;

	    // the point at which it stops calling _read() to fill the buffer
	    // Note: 0 is a valid value, means "don't call _read preemptively ever"
	    var hwm = options.highWaterMark;
	    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	    this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	    // cast to ints.
	    this.highWaterMark = ~~this.highWaterMark;

	    // A linked list is used to store data chunks instead of an array because the
	    // linked list can remove elements from the beginning faster than
	    // array.shift()
	    this.buffer = new BufferList();
	    this.length = 0;
	    this.pipes = null;
	    this.pipesCount = 0;
	    this.flowing = null;
	    this.ended = false;
	    this.endEmitted = false;
	    this.reading = false;

	    // a flag to be able to tell if the onwrite cb is called immediately,
	    // or on a later tick.  We set this to true at first, because any
	    // actions that shouldn't happen until "later" should generally also
	    // not happen before the first write call.
	    this.sync = true;

	    // whenever we return null, then we set a flag to say
	    // that we're awaiting a 'readable' event emission.
	    this.needReadable = false;
	    this.emittedReadable = false;
	    this.readableListening = false;
	    this.resumeScheduled = false;

	    // Crypto is kind of old and crusty.  Historically, its default string
	    // encoding is 'binary' so we have to make this configurable.
	    // Everything else in the universe uses 'utf8', though.
	    this.defaultEncoding = options.defaultEncoding || 'utf8';

	    // when piping, we only care about 'readable' events that happen
	    // after read()ing all the bytes and not getting any pushback.
	    this.ranOut = false;

	    // the number of writers that are awaiting a drain event in .pipe()s
	    this.awaitDrain = 0;

	    // if true, a maybeReadMore has been scheduled
	    this.readingMore = false;

	    this.decoder = null;
	    this.encoding = null;
	    if (options.encoding) {
	        if (!StringDecoder)
	            StringDecoder = __webpack_require__(34).StringDecoder;
	        this.decoder = new StringDecoder(options.encoding);
	        this.encoding = options.encoding;
	    }
	}

	function Readable(options) {
	    if (!(this instanceof Readable))
	        return new Readable(options);

	    this._readableState = new ReadableState(options, this);

	    // legacy
	    this.readable = true;

	    if (options && typeof options.read === 'function')
	        this._read = options.read;

	    Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	    var state = this._readableState;

	    if (!state.objectMode && typeof chunk === 'string') {
	        encoding = encoding || state.defaultEncoding;
	        if (encoding !== state.encoding) {
	            chunk = Buffer.from(chunk, encoding);
	            encoding = '';
	        }
	    }

	    return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	    var state = this._readableState;
	    return readableAddChunk(this, state, chunk, '', true);
	};

	Readable.prototype.isPaused = function() {
	    return this._readableState.flowing === false;
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	    var er = chunkInvalid(state, chunk);
	    if (er) {
	        stream.emit('error', er);
	    } else if (chunk === null) {
	        state.reading = false;
	        onEofChunk(stream, state);
	    } else if (state.objectMode || chunk && chunk.length > 0) {
	        if (state.ended && !addToFront) {
	            const e = new Error('stream.push() after EOF');
	            stream.emit('error', e);
	        } else if (state.endEmitted && addToFront) {
	            const e = new Error('stream.unshift() after end event');
	            stream.emit('error', e);
	        } else {
	            var skipAdd;
	            if (state.decoder && !addToFront && !encoding) {
	                chunk = state.decoder.write(chunk);
	                skipAdd = (!state.objectMode && chunk.length === 0);
	            }

	            if (!addToFront)
	                state.reading = false;

	            // Don't add to the buffer if we've decoded to an empty string chunk and
	            // we're not in object mode
	            if (!skipAdd) {
	                // if we want the data now, just emit it.
	                if (state.flowing && state.length === 0 && !state.sync) {
	                    stream.emit('data', chunk);
	                    stream.read(0);
	                } else {
	                    // update the buffer info.
	                    state.length += state.objectMode ? 1 : chunk.length;
	                    if (addToFront)
	                        state.buffer.unshift(chunk);
	                    else
	                        state.buffer.push(chunk);

	                    if (state.needReadable)
	                        emitReadable(stream);
	                }
	            }

	            maybeReadMore(stream, state);
	        }
	    } else if (!addToFront) {
	        state.reading = false;
	    }

	    return needMoreData(state);
	}


	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	    return !state.ended &&
	        (state.needReadable ||
	        state.length < state.highWaterMark ||
	        state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	    if (!StringDecoder)
	        StringDecoder = __webpack_require__(34).StringDecoder;
	    this._readableState.decoder = new StringDecoder(enc);
	    this._readableState.encoding = enc;
	    return this;
	};

	// Don't raise the hwm > 8MB
	const MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	    if (n >= MAX_HWM) {
	        n = MAX_HWM;
	    } else {
	        // Get the next highest power of 2 to prevent increasing hwm excessively in
	        // tiny amounts
	        n--;
	        n |= n >>> 1;
	        n |= n >>> 2;
	        n |= n >>> 4;
	        n |= n >>> 8;
	        n |= n >>> 16;
	        n++;
	    }
	    return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	    if (n <= 0 || (state.length === 0 && state.ended))
	        return 0;
	    if (state.objectMode)
	        return 1;
	    if (n !== n) {
	        // Only flow one buffer at a time
	        if (state.flowing && state.length)
	            return state.buffer.head.data.length;
	        else
	            return state.length;
	    }
	    // If we're asking for more than the current hwm, then raise the hwm.
	    if (n > state.highWaterMark)
	        state.highWaterMark = computeNewHighWaterMark(n);
	    if (n <= state.length)
	        return n;
	    // Don't have enough
	    if (!state.ended) {
	        state.needReadable = true;
	        return 0;
	    }
	    return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	    debug('read', n);
	    n = parseInt(n, 10);
	    var state = this._readableState;
	    var nOrig = n;

	    if (n !== 0)
	        state.emittedReadable = false;

	    // if we're doing read(0) to trigger a readable event, but we
	    // already have a bunch of data in the buffer, then just trigger
	    // the 'readable' event and move on.
	    if (n === 0 &&
	        state.needReadable &&
	        (state.length >= state.highWaterMark || state.ended)) {
	        debug('read: emitReadable', state.length, state.ended);
	        if (state.length === 0 && state.ended)
	            endReadable(this);
	        else
	            emitReadable(this);
	        return null;
	    }

	    n = howMuchToRead(n, state);

	    // if we've ended, and we're now clear, then finish it up.
	    if (n === 0 && state.ended) {
	        if (state.length === 0)
	            endReadable(this);
	        return null;
	    }

	    // All the actual chunk generation logic needs to be
	    // *below* the call to _read.  The reason is that in certain
	    // synthetic stream cases, such as passthrough streams, _read
	    // may be a completely synchronous operation which may change
	    // the state of the read buffer, providing enough data when
	    // before there was *not* enough.
	    //
	    // So, the steps are:
	    // 1. Figure out what the state of things will be after we do
	    // a read from the buffer.
	    //
	    // 2. If that resulting state will trigger a _read, then call _read.
	    // Note that this may be asynchronous, or synchronous.  Yes, it is
	    // deeply ugly to write APIs this way, but that still doesn't mean
	    // that the Readable class should behave improperly, as streams are
	    // designed to be sync/async agnostic.
	    // Take note if the _read call is sync or async (ie, if the read call
	    // has returned yet), so that we know whether or not it's safe to emit
	    // 'readable' etc.
	    //
	    // 3. Actually pull the requested chunks out of the buffer and return.

	    // if we need a readable event, then we need to do some reading.
	    var doRead = state.needReadable;
	    debug('need readable', doRead);

	    // if we currently have less than the highWaterMark, then also read some
	    if (state.length === 0 || state.length - n < state.highWaterMark) {
	        doRead = true;
	        debug('length less than watermark', doRead);
	    }

	    // however, if we've ended, then there's no point, and if we're already
	    // reading, then it's unnecessary.
	    if (state.ended || state.reading) {
	        doRead = false;
	        debug('reading or ended', doRead);
	    } else if (doRead) {
	        debug('do read');
	        state.reading = true;
	        state.sync = true;
	        // if the length is currently zero, then we *need* a readable event.
	        if (state.length === 0)
	            state.needReadable = true;
	        // call internal read method
	        this._read(state.highWaterMark);
	        state.sync = false;
	        // If _read pushed data synchronously, then `reading` will be false,
	        // and we need to re-evaluate how much data we can return to the user.
	        if (!state.reading)
	            n = howMuchToRead(nOrig, state);
	    }

	    var ret;
	    if (n > 0)
	        ret = fromList(n, state);
	    else
	        ret = null;

	    if (ret === null) {
	        state.needReadable = true;
	        n = 0;
	    } else {
	        state.length -= n;
	    }

	    if (state.length === 0) {
	        // If we have nothing in the buffer, then we want to know
	        // as soon as we *do* get something into the buffer.
	        if (!state.ended)
	            state.needReadable = true;

	        // If we tried to read() past the EOF, then emit end on the next tick.
	        if (nOrig !== n && state.ended)
	            endReadable(this);
	    }

	    if (ret !== null)
	        this.emit('data', ret);

	    return ret;
	};

	function chunkInvalid(state, chunk) {
	    var er = null;
	    if (!(chunk instanceof Buffer) &&
	        typeof chunk !== 'string' &&
	        chunk !== null &&
	        chunk !== undefined &&
	        !state.objectMode) {
	        er = new TypeError('Invalid non-string/buffer chunk');
	    }
	    return er;
	}


	function onEofChunk(stream, state) {
	    if (state.ended) return;
	    if (state.decoder) {
	        var chunk = state.decoder.end();
	        if (chunk && chunk.length) {
	            state.buffer.push(chunk);
	            state.length += state.objectMode ? 1 : chunk.length;
	        }
	    }
	    state.ended = true;

	    // emit 'readable' now to make sure it gets picked up.
	    emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	    var state = stream._readableState;
	    state.needReadable = false;
	    if (!state.emittedReadable) {
	        debug('emitReadable', state.flowing);
	        state.emittedReadable = true;
	        if (state.sync)
	            process.nextTick(emitReadable_, stream);
	        else
	            emitReadable_(stream);
	    }
	}

	function emitReadable_(stream) {
	    debug('emit readable');
	    stream.emit('readable');
	    flow(stream);
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	    if (!state.readingMore) {
	        state.readingMore = true;
	        process.nextTick(maybeReadMore_, stream, state);
	    }
	}

	function maybeReadMore_(stream, state) {
	    var len = state.length;
	    while (!state.reading && !state.flowing && !state.ended &&
	    state.length < state.highWaterMark) {
	        debug('maybeReadMore read 0');
	        stream.read(0);
	        if (len === state.length)
	        // didn't get any data, stop spinning.
	            break;
	        else
	            len = state.length;
	    }
	    state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	    this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function(dest, pipeOpts) {
	    var src = this;
	    var state = this._readableState;

	    switch (state.pipesCount) {
	        case 0:
	            state.pipes = dest;
	            break;
	        case 1:
	            state.pipes = [state.pipes, dest];
	            break;
	        default:
	            state.pipes.push(dest);
	            break;
	    }
	    state.pipesCount += 1;
	    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	    var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	        dest !== process.stdout &&
	        dest !== process.stderr;

	    var endFn = doEnd ? onend : cleanup;
	    if (state.endEmitted)
	        process.nextTick(endFn);
	    else
	        src.once('end', endFn);

	    dest.on('unpipe', onunpipe);
	    function onunpipe(readable) {
	        debug('onunpipe');
	        if (readable === src) {
	            cleanup();
	        }
	    }

	    function onend() {
	        debug('onend');
	        dest.end();
	    }

	    // when the dest drains, it reduces the awaitDrain counter
	    // on the source.  This would be more elegant with a .once()
	    // handler in flow(), but adding and removing repeatedly is
	    // too slow.
	    var ondrain = pipeOnDrain(src);
	    dest.on('drain', ondrain);

	    var cleanedUp = false;
	    function cleanup() {
	        debug('cleanup');
	        // cleanup event handlers once the pipe is broken
	        dest.removeListener('close', onclose);
	        dest.removeListener('finish', onfinish);
	        dest.removeListener('drain', ondrain);
	        dest.removeListener('error', onerror);
	        dest.removeListener('unpipe', onunpipe);
	        src.removeListener('end', onend);
	        src.removeListener('end', cleanup);
	        src.removeListener('data', ondata);

	        cleanedUp = true;

	        // if the reader is waiting for a drain event from this
	        // specific writer, then it would cause it to never start
	        // flowing again.
	        // So, if this is awaiting a drain, then we just call it now.
	        // If we don't know, then assume that we are waiting for one.
	        if (state.awaitDrain &&
	            (!dest._writableState || dest._writableState.needDrain))
	            ondrain();
	    }

	    // If the user pushes more data while we're writing to dest then we'll end up
	    // in ondata again. However, we only want to increase awaitDrain once because
	    // dest will only emit one 'drain' event for the multiple writes.
	    // => Introduce a guard on increasing awaitDrain.
	    var increasedAwaitDrain = false;
	    src.on('data', ondata);
	    function ondata(chunk) {
	        debug('ondata');
	        increasedAwaitDrain = false;
	        var ret = dest.write(chunk);
	        if (false === ret && !increasedAwaitDrain) {
	            // If the user unpiped during `dest.write()`, it is possible
	            // to get stuck in a permanently paused state if that write
	            // also returned false.
	            // => Check whether `dest` is still a piping destination.
	            if (((state.pipesCount === 1 && state.pipes === dest) ||
	                (state.pipesCount > 1 && state.pipes.indexOf(dest) !== -1)) &&
	                !cleanedUp) {
	                debug('false write response, pause', src._readableState.awaitDrain);
	                src._readableState.awaitDrain++;
	                increasedAwaitDrain = true;
	            }
	            src.pause();
	        }
	    }

	    // if the dest has an error, then stop piping into it.
	    // however, don't suppress the throwing behavior for this.
	    function onerror(er) {
	        debug('onerror', er);
	        unpipe();
	        dest.removeListener('error', onerror);
	        if (EE.listenerCount(dest, 'error') === 0)
	            dest.emit('error', er);
	    }

	    // Make sure our error handler is attached before userland ones.
	    prependListener(dest, 'error', onerror);

	    // Both close and finish should trigger unpipe, but only once.
	    function onclose() {
	        dest.removeListener('finish', onfinish);
	        unpipe();
	    }
	    dest.once('close', onclose);
	    function onfinish() {
	        debug('onfinish');
	        dest.removeListener('close', onclose);
	        unpipe();
	    }
	    dest.once('finish', onfinish);

	    function unpipe() {
	        debug('unpipe');
	        src.unpipe(dest);
	    }

	    // tell the dest that it's being piped to
	    dest.emit('pipe', src);

	    // start the flow if it hasn't been started already.
	    if (!state.flowing) {
	        debug('pipe resume');
	        src.resume();
	    }

	    return dest;
	};

	function pipeOnDrain(src) {
	    return function() {
	        var state = src._readableState;
	        debug('pipeOnDrain', state.awaitDrain);
	        if (state.awaitDrain)
	            state.awaitDrain--;
	        if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	            state.flowing = true;
	            flow(src);
	        }
	    };
	}


	Readable.prototype.unpipe = function(dest) {
	    var state = this._readableState;

	    // if we're not piping anywhere, then do nothing.
	    if (state.pipesCount === 0)
	        return this;

	    // just one destination.  most common case.
	    if (state.pipesCount === 1) {
	        // passed in one, but it's not the right one.
	        if (dest && dest !== state.pipes)
	            return this;

	        if (!dest)
	            dest = state.pipes;

	        // got a match.
	        state.pipes = null;
	        state.pipesCount = 0;
	        state.flowing = false;
	        if (dest)
	            dest.emit('unpipe', this);
	        return this;
	    }

	    // slow case. multiple pipe destinations.

	    if (!dest) {
	        // remove all.
	        var dests = state.pipes;
	        var len = state.pipesCount;
	        state.pipes = null;
	        state.pipesCount = 0;
	        state.flowing = false;

	        for (var j = 0; j < len; j++)
	            dests[j].emit('unpipe', this);
	        return this;
	    }

	    // try to find the right one.
	    const i = state.pipes.indexOf(dest);
	    if (i === -1)
	        return this;

	    state.pipes.splice(i, 1);
	    state.pipesCount -= 1;
	    if (state.pipesCount === 1)
	        state.pipes = state.pipes[0];

	    dest.emit('unpipe', this);

	    return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	    const res = Stream.prototype.on.call(this, ev, fn);

	    if (ev === 'data') {
	        // Start flowing on next tick if stream isn't explicitly paused
	        if (this._readableState.flowing !== false)
	            this.resume();
	    } else if (ev === 'readable') {
	        const state = this._readableState;
	        if (!state.endEmitted && !state.readableListening) {
	            state.readableListening = state.needReadable = true;
	            state.emittedReadable = false;
	            if (!state.reading) {
	                process.nextTick(nReadingNextTick, this);
	            } else if (state.length) {
	                emitReadable(this, state);
	            }
	        }
	    }

	    return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	    debug('readable nexttick read 0');
	    self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	    var state = this._readableState;
	    if (!state.flowing) {
	        debug('resume');
	        state.flowing = true;
	        resume(this, state);
	    }
	    return this;
	};

	function resume(stream, state) {
	    if (!state.resumeScheduled) {
	        state.resumeScheduled = true;
	        process.nextTick(resume_, stream, state);
	    }
	}

	function resume_(stream, state) {
	    if (!state.reading) {
	        debug('resume read 0');
	        stream.read(0);
	    }

	    state.resumeScheduled = false;
	    state.awaitDrain = 0;
	    stream.emit('resume');
	    flow(stream);
	    if (state.flowing && !state.reading)
	        stream.read(0);
	}

	Readable.prototype.pause = function() {
	    debug('call pause flowing=%j', this._readableState.flowing);
	    if (false !== this._readableState.flowing) {
	        debug('pause');
	        this._readableState.flowing = false;
	        this.emit('pause');
	    }
	    return this;
	};

	function flow(stream) {
	    const state = stream._readableState;
	    debug('flow', state.flowing);
	    while (state.flowing && stream.read() !== null);
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	    var state = this._readableState;
	    var paused = false;

	    var self = this;
	    stream.on('end', function() {
	        debug('wrapped end');
	        if (state.decoder && !state.ended) {
	            var chunk = state.decoder.end();
	            if (chunk && chunk.length)
	                self.push(chunk);
	        }

	        self.push(null);
	    });

	    stream.on('data', function(chunk) {
	        debug('wrapped data');
	        if (state.decoder)
	            chunk = state.decoder.write(chunk);

	        // don't skip over falsy values in objectMode
	        if (state.objectMode && (chunk === null || chunk === undefined))
	            return;
	        else if (!state.objectMode && (!chunk || !chunk.length))
	            return;

	        var ret = self.push(chunk);
	        if (!ret) {
	            paused = true;
	            stream.pause();
	        }
	    });

	    // proxy all the other methods.
	    // important when wrapping filters and duplexes.
	    for (var i in stream) {
	        if (this[i] === undefined && typeof stream[i] === 'function') {
	            this[i] = function(method) { return function() {
	                return stream[method].apply(stream, arguments);
	            }; }(i);
	        }
	    }

	    // proxy certain important events.
	    const events = ['error', 'close', 'destroy', 'pause', 'resume'];
	    events.forEach(function(ev) {
	        stream.on(ev, self.emit.bind(self, ev));
	    });

	    // when we try to consume some more bytes, simply unpause the
	    // underlying stream.
	    self._read = function(n) {
	        debug('wrapped _read', n);
	        if (paused) {
	            paused = false;
	            stream.resume();
	        }
	    };

	    return self;
	};


	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	    // nothing buffered
	    if (state.length === 0)
	        return null;

	    var ret;
	    if (state.objectMode)
	        ret = state.buffer.shift();
	    else if (!n || n >= state.length) {
	        // read it all, truncate the list
	        if (state.decoder)
	            ret = state.buffer.join('');
	        else if (state.buffer.length === 1)
	            ret = state.buffer.head.data;
	        else
	            ret = state.buffer.concat(state.length);
	        state.buffer.clear();
	    } else {
	        // read part of list
	        ret = fromListPartial(n, state.buffer, state.decoder);
	    }

	    return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	    var ret;
	    if (n < list.head.data.length) {
	        // slice is the same for buffers and strings
	        ret = list.head.data.slice(0, n);
	        list.head.data = list.head.data.slice(n);
	    } else if (n === list.head.data.length) {
	        // first chunk is a perfect match
	        ret = list.shift();
	    } else {
	        // result spans more than one buffer
	        ret = (hasStrings
	            ? copyFromBufferString(n, list)
	            : copyFromBuffer(n, list));
	    }
	    return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	    var p = list.head;
	    var c = 1;
	    var ret = p.data;
	    n -= ret.length;
	    while (p = p.start) {
	        const str = p.data;
	        const nb = (n > str.length ? str.length : n);
	        if (nb === str.length)
	            ret += str;
	        else
	            ret += str.slice(0, n);
	        n -= nb;
	        if (n === 0) {
	            if (nb === str.length) {
	                ++c;
	                if (p.start)
	                    list.head = p.start;
	                else
	                    list.head = list.tail = null;
	            } else {
	                list.head = p;
	                p.data = str.slice(nb);
	            }
	            break;
	        }
	        ++c;
	    }
	    list.length -= c;
	    return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	    const ret = Buffer.allocUnsafe(n);
	    var p = list.head;
	    var c = 1;
	    p.data.copy(ret);
	    n -= p.data.length;
	    while (p = p.start) {
	        const buf = p.data;
	        const nb = (n > buf.length ? buf.length : n);
	        buf.copy(ret, ret.length - n, 0, nb);
	        n -= nb;
	        if (n === 0) {
	            if (nb === buf.length) {
	                ++c;
	                if (p.start)
	                    list.head = p.start;
	                else
	                    list.head = list.tail = null;
	            } else {
	                list.head = p;
	                p.data = buf.slice(nb);
	            }
	            break;
	        }
	        ++c;
	    }
	    list.length -= c;
	    return ret;
	}

	function endReadable(stream) {
	    var state = stream._readableState;

	    // If we get here before consuming all the bytes, then that is a
	    // bug in node.  Should never happen.
	    if (state.length > 0)
	        throw new Error('"endReadable()" called on non-empty stream');

	    if (!state.endEmitted) {
	        state.ended = true;
	        process.nextTick(endReadableNT, state, stream);
	    }
	}

	function endReadableNT(state, stream) {
	    // Check that we didn't get one last unshift.
	    if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	    }
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = Stream;

	const EE = __webpack_require__(13);
	const util = __webpack_require__(21);

	util.inherits(Stream, EE);
	Stream.Readable = __webpack_require__(27);
	Stream.Writable = __webpack_require__(29);
	Stream.Duplex = __webpack_require__(26);
	Stream.Transform = __webpack_require__(31);
	Stream.PassThrough = __webpack_require__(32);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;


	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	    EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	    var source = this;

	    function ondata(chunk) {
	        if (dest.writable) {
	            if (false === dest.write(chunk) && source.pause) {
	                source.pause();
	            }
	        }
	    }

	    source.on('data', ondata);

	    function ondrain() {
	        if (source.readable && source.resume) {
	            source.resume();
	        }
	    }

	    dest.on('drain', ondrain);

	    // If the 'end' option is not supplied, dest.end() will be called when
	    // source gets the 'end' or 'close' events.  Only dest.end() once.
	    if (!dest._isStdio && (!options || options.end !== false)) {
	        source.on('end', onend);
	        source.on('close', onclose);
	    }

	    var didOnEnd = false;
	    function onend() {
	        if (didOnEnd) return;
	        didOnEnd = true;

	        dest.end();
	    }


	    function onclose() {
	        if (didOnEnd) return;
	        didOnEnd = true;

	        if (typeof dest.destroy === 'function') dest.destroy();
	    }

	    // don't leave dangling pipes when there are errors.
	    function onerror(er) {
	        cleanup();
	        if (EE.listenerCount(this, 'error') === 0) {
	            throw er; // Unhandled stream error in pipe.
	        }
	    }

	    source.on('error', onerror);
	    dest.on('error', onerror);

	    // remove all the event listeners that were added.
	    function cleanup() {
	        source.removeListener('data', ondata);
	        dest.removeListener('drain', ondrain);

	        source.removeListener('end', onend);
	        source.removeListener('close', onclose);

	        source.removeListener('error', onerror);
	        dest.removeListener('error', onerror);

	        source.removeListener('end', cleanup);
	        source.removeListener('close', cleanup);

	        dest.removeListener('close', cleanup);
	    }

	    source.on('end', cleanup);
	    source.on('close', cleanup);

	    dest.on('close', cleanup);

	    dest.emit('pipe', source);

	    // Allow for unix-like usage: A.pipe(B).pipe(C)
	    return dest;
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.

	'use strict';

	module.exports = Writable;
	Writable.WritableState = WritableState;

	const util = __webpack_require__(21);
	const internalUtil = __webpack_require__(30);
	const Stream = __webpack_require__(28);
	const Buffer = __webpack_require__(2).Buffer;

	util.inherits(Writable, Stream);

	function nop() {}

	function WriteReq(chunk, encoding, cb) {
	    this.chunk = chunk;
	    this.encoding = encoding;
	    this.callback = cb;
	    this.next = null;
	}

	function WritableState(options, stream) {
	    options = options || {};

	    // object stream flag to indicate whether or not this stream
	    // contains buffers or objects.
	    this.objectMode = !!options.objectMode;

	    if (stream instanceof Stream.Duplex)
	        this.objectMode = this.objectMode || !!options.writableObjectMode;

	    // the point at which write() starts returning false
	    // Note: 0 is a valid value, means that we always return false if
	    // the entire buffer is not flushed immediately on write()
	    var hwm = options.highWaterMark;
	    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	    this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	    // cast to ints.
	    this.highWaterMark = ~~this.highWaterMark;

	    this.needDrain = false;
	    // at the start of calling end()
	    this.ending = false;
	    // when end() has been called, and returned
	    this.ended = false;
	    // when 'finish' is emitted
	    this.finished = false;

	    // should we decode strings into buffers before passing to _write?
	    // this is here so that some node-core streams can optimize string
	    // handling at a lower level.
	    var noDecode = options.decodeStrings === false;
	    this.decodeStrings = !noDecode;

	    // Crypto is kind of old and crusty.  Historically, its default string
	    // encoding is 'binary' so we have to make this configurable.
	    // Everything else in the universe uses 'utf8', though.
	    this.defaultEncoding = options.defaultEncoding || 'utf8';

	    // not an actual buffer we keep track of, but a measurement
	    // of how much we're waiting to get pushed to some underlying
	    // socket or file.
	    this.length = 0;

	    // a flag to see when we're in the middle of a write.
	    this.writing = false;

	    // when true all writes will be buffered until .uncork() call
	    this.corked = 0;

	    // a flag to be able to tell if the onwrite cb is called immediately,
	    // or on a later tick.  We set this to true at first, because any
	    // actions that shouldn't happen until "later" should generally also
	    // not happen before the first write call.
	    this.sync = true;

	    // a flag to know if we're processing previously buffered items, which
	    // may call the _write() callback in the same tick, so that we don't
	    // end up in an overlapped onwrite situation.
	    this.bufferProcessing = false;

	    // the callback that's passed to _write(chunk,cb)
	    this.onwrite = function(er) {
	        onwrite(stream, er);
	    };

	    // the callback that the user supplies to write(chunk,encoding,cb)
	    this.writecb = null;

	    // the amount that is being written when _write is called.
	    this.writelen = 0;

	    this.bufferedRequest = null;
	    this.lastBufferedRequest = null;

	    // number of pending user-supplied write callbacks
	    // this must be 0 before 'finish' can be emitted
	    this.pendingcb = 0;

	    // emit prefinish if the only thing we're waiting for is _write cbs
	    // This is relevant for synchronous Transform streams
	    this.prefinished = false;

	    // True if the error was already emitted and should not be thrown again
	    this.errorEmitted = false;

	    // count buffered requests
	    this.bufferedRequestCount = 0;

	    // allocate the first CorkedRequest, there is always
	    // one allocated and free to use, and we maintain at most two
	    this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function writableStateGetBuffer() {
	    var current = this.bufferedRequest;
	    var out = [];
	    while (current) {
	        out.push(current);
	        current = current.start;
	    }
	    return out;
	};

	Object.defineProperty(WritableState.prototype, 'buffer', {
	    get: internalUtil.deprecate(function() {
	        return this.getBuffer();
	    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' +
	        'instead.')
	});

	function Writable(options) {
	    // Writable ctor is applied to Duplexes, though they're not
	    // instanceof Writable, they're instanceof Readable.
	    if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
	        return new Writable(options);

	    this._writableState = new WritableState(options, this);

	    // legacy.
	    this.writable = true;

	    if (options) {
	        if (typeof options.write === 'function')
	            this._write = options.write;

	        if (typeof options.writev === 'function')
	            this._writev = options.writev;
	    }

	    Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	    this.emit('error', new Error('Cannot pipe, not readable'));
	};


	function writeAfterEnd(stream, cb) {
	    var er = new Error('write after end');
	    // TODO: defer error events consistently everywhere, not just the cb
	    stream.emit('error', er);
	    process.nextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	    var valid = true;
	    var er = false;
	    // Always throw error if a null is written
	    // if we are not in object mode then throw
	    // if it is not a buffer, string, or undefined.
	    if (chunk === null) {
	        er = new TypeError('May not write null values to stream');
	    } else if (!(chunk instanceof Buffer) &&
	        typeof chunk !== 'string' &&
	        chunk !== undefined &&
	        !state.objectMode) {
	        er = new TypeError('Invalid non-string/buffer chunk');
	    }
	    if (er) {
	        stream.emit('error', er);
	        process.nextTick(cb, er);
	        valid = false;
	    }
	    return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	    var state = this._writableState;
	    var ret = false;

	    if (typeof encoding === 'function') {
	        cb = encoding;
	        encoding = null;
	    }

	    if (chunk instanceof Buffer)
	        encoding = 'buffer';
	    else if (!encoding)
	        encoding = state.defaultEncoding;

	    if (typeof cb !== 'function')
	        cb = nop;

	    if (state.ended)
	        writeAfterEnd(this, cb);
	    else if (validChunk(this, state, chunk, cb)) {
	        state.pendingcb++;
	        ret = writeOrBuffer(this, state, chunk, encoding, cb);
	    }

	    return ret;
	};

	Writable.prototype.cork = function() {
	    var state = this._writableState;

	    state.corked++;
	};

	Writable.prototype.uncork = function() {
	    var state = this._writableState;

	    if (state.corked) {
	        state.corked--;

	        if (!state.writing &&
	            !state.corked &&
	            !state.finished &&
	            !state.bufferProcessing &&
	            state.bufferedRequest)
	            clearBuffer(this, state);
	    }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	    // node::ParseEncoding() requires lower case.
	    if (typeof encoding === 'string')
	        encoding = encoding.toLowerCase();
	    if (!Buffer.isEncoding(encoding))
	        throw new TypeError('Unknown encoding: ' + encoding);
	    this._writableState.defaultEncoding = encoding;
	    return this;
	};

	function decodeChunk(state, chunk, encoding) {
	    if (!state.objectMode &&
	        state.decodeStrings !== false &&
	        typeof chunk === 'string') {
	        chunk = Buffer.from(chunk, encoding);
	    }
	    return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	    chunk = decodeChunk(state, chunk, encoding);

	    if (chunk instanceof Buffer)
	        encoding = 'buffer';
	    var len = state.objectMode ? 1 : chunk.length;

	    state.length += len;

	    var ret = state.length < state.highWaterMark;
	    // we must ensure that previous needDrain will not be reset to false.
	    if (!ret)
	        state.needDrain = true;

	    if (state.writing || state.corked) {
	        var last = state.lastBufferedRequest;
	        state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	        if (last) {
	            last.next = state.lastBufferedRequest;
	        } else {
	            state.bufferedRequest = state.lastBufferedRequest;
	        }
	        state.bufferedRequestCount += 1;
	    } else {
	        doWrite(stream, state, false, len, chunk, encoding, cb);
	    }

	    return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	    state.writelen = len;
	    state.writecb = cb;
	    state.writing = true;
	    state.sync = true;
	    if (writev)
	        stream._writev(chunk, state.onwrite);
	    else
	        stream._write(chunk, encoding, state.onwrite);
	    state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	    --state.pendingcb;
	    if (sync)
	        process.nextTick(cb, er);
	    else
	        cb(er);

	    stream._writableState.errorEmitted = true;
	    stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	    state.writing = false;
	    state.writecb = null;
	    state.length -= state.writelen;
	    state.writelen = 0;
	}

	function onwrite(stream, er) {
	    var state = stream._writableState;
	    var sync = state.sync;
	    var cb = state.writecb;

	    onwriteStateUpdate(state);

	    if (er)
	        onwriteError(stream, state, sync, er, cb);
	    else {
	        // Check if we're actually ready to finish, but don't emit yet
	        var finished = needFinish(state);

	        if (!finished &&
	            !state.corked &&
	            !state.bufferProcessing &&
	            state.bufferedRequest) {
	            clearBuffer(stream, state);
	        }

	        if (sync) {
	            process.nextTick(afterWrite, stream, state, finished, cb);
	        } else {
	            afterWrite(stream, state, finished, cb);
	        }
	    }
	}

	function afterWrite(stream, state, finished, cb) {
	    if (!finished)
	        onwriteDrain(stream, state);
	    state.pendingcb--;
	    cb();
	    finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	    if (state.length === 0 && state.needDrain) {
	        state.needDrain = false;
	        stream.emit('drain');
	    }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	    state.bufferProcessing = true;
	    var entry = state.bufferedRequest;

	    if (stream._writev && entry && entry.next) {
	        // Fast case, write everything using _writev()
	        var l = state.bufferedRequestCount;
	        var buffer = new Array(l);
	        var holder = state.corkedRequestsFree;
	        holder.entry = entry;

	        var count = 0;
	        while (entry) {
	            buffer[count] = entry;
	            entry = entry.next;
	            count += 1;
	        }

	        doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	        // doWrite is almost always async, defer these to save a bit of time
	        // as the hot path ends with doWrite
	        state.pendingcb++;
	        state.lastBufferedRequest = null;
	        if (holder.next) {
	            state.corkedRequestsFree = holder.next;
	            holder.next = null;
	        } else {
	            state.corkedRequestsFree = new CorkedRequest(state);
	        }
	    } else {
	        // Slow case, write chunks one-by-one
	        while (entry) {
	            var chunk = entry.chunk;
	            var encoding = entry.encoding;
	            var cb = entry.callback;
	            var len = state.objectMode ? 1 : chunk.length;

	            doWrite(stream, state, false, len, chunk, encoding, cb);
	            entry = entry.next;
	            // if we didn't call the onwrite immediately, then
	            // it means that we need to wait until it does.
	            // also, that means that the chunk and cb are currently
	            // being processed, so move the buffer counter past them.
	            if (state.writing) {
	                break;
	            }
	        }

	        if (entry === null)
	            state.lastBufferedRequest = null;
	    }

	    state.bufferedRequestCount = 0;
	    state.bufferedRequest = entry;
	    state.bufferProcessing = false;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	    cb(new Error('not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function(chunk, encoding, cb) {
	    var state = this._writableState;

	    if (typeof chunk === 'function') {
	        cb = chunk;
	        chunk = null;
	        encoding = null;
	    } else if (typeof encoding === 'function') {
	        cb = encoding;
	        encoding = null;
	    }

	    if (chunk !== null && chunk !== undefined)
	        this.write(chunk, encoding);

	    // .end() fully uncorks
	    if (state.corked) {
	        state.corked = 1;
	        this.uncork();
	    }

	    // ignore unnecessary end() calls.
	    if (!state.ending && !state.finished)
	        endWritable(this, state, cb);
	};


	function needFinish(state) {
	    return (state.ending &&
	    state.length === 0 &&
	    state.bufferedRequest === null &&
	    !state.finished &&
	    !state.writing);
	}

	function prefinish(stream, state) {
	    if (!state.prefinished) {
	        state.prefinished = true;
	        stream.emit('prefinish');
	    }
	}

	function finishMaybe(stream, state) {
	    var need = needFinish(state);
	    if (need) {
	        if (state.pendingcb === 0) {
	            prefinish(stream, state);
	            state.finished = true;
	            stream.emit('finish');
	        } else {
	            prefinish(stream, state);
	        }
	    }
	    return need;
	}

	function endWritable(stream, state, cb) {
	    state.ending = true;
	    finishMaybe(stream, state);
	    if (cb) {
	        if (state.finished)
	            process.nextTick(cb);
	        else
	            stream.once('finish', cb);
	    }
	    state.ended = true;
	    stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	    this.next = null;
	    this.entry = null;

	    this.finish = function (err) {
	        var entry = this.entry;
	        this.entry = null;
	        while (entry) {
	            var cb = entry.callback;
	            state.pendingcb--;
	            cb(err);
	            entry = entry.next;
	        }
	        if (state.corkedRequestsFree) {
	            state.corkedRequestsFree.next = this;
	        } else {
	            state.corkedRequestsFree = this;
	        }
	    }.bind(this);
	}


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	// var binding = process.binding('util');
	var binding = {};
	var prefix = '(' + process.release.name + ':' + process.pid + ') ';

	var kArrowMessagePrivateSymbolIndex = binding['arrow_message_private_symbol'];
	var kDecoratedPrivateSymbolIndex = binding['decorated_private_symbol'];

	exports.getHiddenValue = binding.getHiddenValue;
	exports.setHiddenValue = binding.setHiddenValue;

	// All the internal deprecations have to use this function only, as this will
	// prepend the prefix to the actual message.
	exports.deprecate = function(fn, msg) {
	    return exports._deprecate(fn, msg);
	};

	// All the internal deprecations have to use this function only, as this will
	// prepend the prefix to the actual message.
	exports.printDeprecationMessage = function(msg, warned, ctor) {
	    if (warned || process.noDeprecation)
	        return true;
	    process.emitWarning(msg, 'DeprecationWarning',
	        ctor || exports.printDeprecationMessage);
	    return true;
	};

	exports.error = function(msg) {
	    var fmt = prefix + msg;
	    if (arguments.length > 1) {
	        var args = new Array(arguments.length);
	        args[0] = fmt;
	        for (var i = 1; i < arguments.length; ++i)
	            args[i] = arguments[i];
	        console.error.apply(console, args);
	    } else {
	        console.error(fmt);
	    }
	};

	exports.trace = function(msg) {
	    console.trace(prefix + msg);
	};

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports._deprecate = function(fn, msg) {
	    // Allow for deprecating things in the process of starting up.
	    if (global.process === undefined) {
	        return function() {
	            return exports._deprecate(fn, msg).apply(this, arguments);
	        };
	    }

	    if (process.noDeprecation === true) {
	        return fn;
	    }

	    var warned = false;
	    function deprecated() {
	        warned = exports.printDeprecationMessage(msg, warned, deprecated);
	        return fn.apply(this, arguments);
	    }

	    return deprecated;
	};

	exports.decorateErrorStack = function decorateErrorStack(err) {
	    if (!(exports.isError(err) && err.stack) ||
	        exports.getHiddenValue(err, kDecoratedPrivateSymbolIndex) === true)
	        return;

	    var arrow = exports.getHiddenValue(err, kArrowMessagePrivateSymbolIndex);

	    if (arrow) {
	        err.stack = arrow + err.stack;
	        exports.setHiddenValue(err, kDecoratedPrivateSymbolIndex, true);
	    }
	};

	exports.isError = function isError(e) {
	    return exports.objectToString(e) === '[object Error]' || e instanceof Error;
	};

	exports.objectToString = function objectToString(o) {
	    return Object.prototype.toString.call(o);
	};

	var noCrypto = !process.versions.openssl;
	exports.assertCrypto = function(exports) {
	    if (noCrypto)
	        throw new Error('Node.js is not compiled with openssl crypto support');
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	'use strict';

	module.exports = Transform;

	const Duplex = __webpack_require__(26);
	const util = __webpack_require__(21);
	util.inherits(Transform, Duplex);


	function TransformState(stream) {
	    this.afterTransform = function(er, data) {
	        return afterTransform(stream, er, data);
	    };

	    this.needTransform = false;
	    this.transforming = false;
	    this.writecb = null;
	    this.writechunk = null;
	    this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	    var ts = stream._transformState;
	    ts.transforming = false;

	    var cb = ts.writecb;

	    if (!cb)
	        return stream.emit('error', new Error('no writecb in Transform class'));

	    ts.writechunk = null;
	    ts.writecb = null;

	    if (data !== null && data !== undefined)
	        stream.push(data);

	    cb(er);

	    var rs = stream._readableState;
	    rs.reading = false;
	    if (rs.needReadable || rs.length < rs.highWaterMark) {
	        stream._read(rs.highWaterMark);
	    }
	}


	function Transform(options) {
	    if (!(this instanceof Transform))
	        return new Transform(options);

	    Duplex.call(this, options);

	    this._transformState = new TransformState(this);

	    // when the writable side finishes, then flush out anything remaining.
	    var stream = this;

	    // start out asking for a readable event once data is transformed.
	    this._readableState.needReadable = true;

	    // we have implemented the _read method, and done the other things
	    // that Readable wants before the first _read call, so unset the
	    // sync guard flag.
	    this._readableState.sync = false;

	    if (options) {
	        if (typeof options.transform === 'function')
	            this._transform = options.transform;

	        if (typeof options.flush === 'function')
	            this._flush = options.flush;
	    }

	    this.once('prefinish', function() {
	        if (typeof this._flush === 'function')
	            this._flush(function(er, data) {
	                done(stream, er, data);
	            });
	        else
	            done(stream);
	    });
	}

	Transform.prototype.push = function(chunk, encoding) {
	    this._transformState.needTransform = false;
	    return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function(chunk, encoding, cb) {
	    throw new Error('Not implemented');
	};

	Transform.prototype._write = function(chunk, encoding, cb) {
	    var ts = this._transformState;
	    ts.writecb = cb;
	    ts.writechunk = chunk;
	    ts.writeencoding = encoding;
	    if (!ts.transforming) {
	        var rs = this._readableState;
	        if (ts.needTransform ||
	            rs.needReadable ||
	            rs.length < rs.highWaterMark)
	            this._read(rs.highWaterMark);
	    }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function(n) {
	    var ts = this._transformState;

	    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	        ts.transforming = true;
	        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	    } else {
	        // mark that we need a transform, so that any data that comes in
	        // will get processed, now that we've asked for it.
	        ts.needTransform = true;
	    }
	};


	function done(stream, er, data) {
	    if (er)
	        return stream.emit('error', er);

	    if (data !== null && data !== undefined)
	        stream.push(data);

	    // if there's nothing in the write buffer, then that means
	    // that nothing more will ever be provided
	    var ws = stream._writableState;
	    var ts = stream._transformState;

	    if (ws.length)
	        throw new Error('Calling transform done when ws.length != 0');

	    if (ts.transforming)
	        throw new Error('Calling transform done when still transforming');

	    return stream.push(null);
	}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	'use strict';

	module.exports = PassThrough;

	const Transform = __webpack_require__(31);
	const util = __webpack_require__(21);
	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	    if (!(this instanceof PassThrough))
	        return new PassThrough(options);

	    Transform.call(this, options);
	}

	PassThrough.prototype._transform = function(chunk, encoding, cb) {
	    cb(null, chunk);
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const Buffer = __webpack_require__(2).Buffer;

	module.exports = BufferList;

	function BufferList() {
	    this.head = null;
	    this.tail = null;
	    this.length = 0;
	}

	BufferList.prototype.push = function(v) {
	    const entry = { data: v, next: null };
	    if (this.length > 0)
	        this.tail.next = entry;
	    else
	        this.head = entry;
	    this.tail = entry;
	    ++this.length;
	};

	BufferList.prototype.unshift = function(v) {
	    const entry = { data: v, next: this.head };
	    if (this.length === 0)
	        this.tail = entry;
	    this.head = entry;
	    ++this.length;
	};

	BufferList.prototype.shift = function() {
	    if (this.length === 0)
	        return;
	    const ret = this.head.data;
	    if (this.length === 1)
	        this.head = this.tail = null;
	    else
	        this.head = this.head.next;
	    --this.length;
	    return ret;
	};

	BufferList.prototype.clear = function() {
	    this.head = this.tail = null;
	    this.length = 0;
	};

	BufferList.prototype.join = function(s) {
	    if (this.length === 0)
	        return '';
	    var p = this.head;
	    var ret = '' + p.data;
	    while (p = p.next)
	        ret += s + p.data;
	    return ret;
	};

	BufferList.prototype.concat = function(n) {
	    if (this.length === 0)
	        return Buffer.alloc(0);
	    if (this.length === 1)
	        return this.head.data;
	    const ret = Buffer.allocUnsafe(n >>> 0);
	    var p = this.head;
	    var i = 0;
	    while (p) {
	        p.data.copy(ret, i);
	        i += p.data.length;
	        p = p.next;
	    }
	    return ret;
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("string_decoder");

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// UTILITY
	// const compare = process.binding('buffer').compare;
	const util = __webpack_require__(21);
	const Buffer = __webpack_require__(2).Buffer;
	const pToString = function(obj) { return Object.prototype.toString.call(obj); };

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	const assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	assert.AssertionError = function AssertionError(options) {
	    this.name = 'AssertionError';
	    this.actual = options.actual;
	    this.expected = options.expected;
	    this.operator = options.operator;
	    if (options.message) {
	        this.message = options.message;
	        this.generatedMessage = false;
	    } else {
	        this.message = getMessage(this);
	        this.generatedMessage = true;
	    }
	    var stackStartFunction = options.stackStartFunction || fail;
	    Error.captureStackTrace(this, stackStartFunction);
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function truncate(s, n) {
	    if (typeof s === 'string') {
	        return s.length < n ? s : s.slice(0, n);
	    } else {
	        return s;
	    }
	}

	function getMessage(self) {
	    return truncate(util.inspect(self.actual), 128) + ' ' +
	        self.operator + ' ' +
	        truncate(util.inspect(self.expected), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	    throw new assert.AssertionError({
	        message: message,
	        actual: actual,
	        expected: expected,
	        operator: operator,
	        stackStartFunction: stackStartFunction
	    });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	    if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	    if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	    if (actual == expected) {
	        fail(actual, expected, message, '!=', assert.notEqual);
	    }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	    if (!_deepEqual(actual, expected, false)) {
	        fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	    }
	};

	assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	    if (!_deepEqual(actual, expected, true)) {
	        fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	    }
	};

	function _deepEqual(actual, expected, strict, memos) {
	    // 7.1. All identical values are equivalent, as determined by ===.
	    if (actual === expected) {
	        return true;
	    } else if (actual instanceof Buffer && expected instanceof Buffer) {
	        return Buffer.compare(actual, expected) === 0;

	        // 7.2. If the expected value is a Date object, the actual value is
	        // equivalent if it is also a Date object that refers to the same time.
	    } else if (util.isDate(actual) && util.isDate(expected)) {
	        return actual.getTime() === expected.getTime();

	        // 7.3 If the expected value is a RegExp object, the actual value is
	        // equivalent if it is also a RegExp object with the same source and
	        // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	    } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	        return actual.source === expected.source &&
	            actual.global === expected.global &&
	            actual.multiline === expected.multiline &&
	            actual.lastIndex === expected.lastIndex &&
	            actual.ignoreCase === expected.ignoreCase;

	        // 7.4. Other pairs that do not both pass typeof value == 'object',
	        // equivalence is determined by ==.
	    } else if ((actual === null || typeof actual !== 'object') &&
	        (expected === null || typeof expected !== 'object')) {
	        return strict ? actual === expected : actual == expected;

	        // If both values are instances of typed arrays, wrap their underlying
	        // ArrayBuffers in a Buffer each to increase performance
	        // This optimization requires the arrays to have the same type as checked by
	        // Object.prototype.toString (aka pToString). Never perform binary
	        // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	        // bit patterns are not identical.
	    } else if (ArrayBuffer.isView(actual) && ArrayBuffer.isView(expected) &&
	        pToString(actual) === pToString(expected) &&
	        !(actual instanceof Float32Array ||
	        actual instanceof Float64Array)) {
	        return Buffer.compare(Buffer.from(actual.buffer),
	                Buffer.from(expected.buffer)) === 0;

	        // 7.5 For all other Object pairs, including Array objects, equivalence is
	        // determined by having the same number of owned properties (as verified
	        // with Object.prototype.hasOwnProperty.call), the same set of keys
	        // (although not necessarily the same order), equivalent values for every
	        // corresponding key, and an identical 'prototype' property. Note: this
	        // accounts for both named and indexed properties on Arrays.
	    } else {
	        memos = memos || {actual: [], expected: []};

	        const actualIndex = memos.actual.indexOf(actual);
	        if (actualIndex !== -1) {
	            if (actualIndex === memos.expected.indexOf(expected)) {
	                return true;
	            }
	        }

	        memos.actual.push(actual);
	        memos.expected.push(expected);

	        return objEquiv(actual, expected, strict, memos);
	    }
	}

	function isArguments(object) {
	    return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b, strict, actualVisitedObjects) {
	    if (a === null || a === undefined || b === null || b === undefined)
	        return false;
	    // if one is a primitive, the other must be same
	    if (util.isPrimitive(a) || util.isPrimitive(b))
	        return a === b;
	    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	        return false;
	    const aIsArgs = isArguments(a);
	    const bIsArgs = isArguments(b);
	    if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	        return false;
	    const ka = Object.keys(a);
	    const kb = Object.keys(b);
	    var key, i;
	    // having the same number of owned properties (keys incorporates
	    // hasOwnProperty)
	    if (ka.length !== kb.length)
	        return false;
	    //the same set of keys (although not necessarily the same order),
	    ka.sort();
	    kb.sort();
	    //~~~cheap key test
	    for (i = ka.length - 1; i >= 0; i--) {
	        if (ka[i] !== kb[i])
	            return false;
	    }
	    //equivalent values for every corresponding key, and
	    //~~~possibly expensive deep test
	    for (i = ka.length - 1; i >= 0; i--) {
	        key = ka[i];
	        if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	            return false;
	    }
	    return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	    if (_deepEqual(actual, expected, false)) {
	        fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	    }
	};

	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	    if (_deepEqual(actual, expected, true)) {
	        fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	    }
	}


	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	    if (actual !== expected) {
	        fail(actual, expected, message, '===', assert.strictEqual);
	    }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	    if (actual === expected) {
	        fail(actual, expected, message, '!==', assert.notStrictEqual);
	    }
	};

	function expectedException(actual, expected) {
	    if (!actual || !expected) {
	        return false;
	    }

	    if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	        return expected.test(actual);
	    }

	    try {
	        if (actual instanceof expected) {
	            return true;
	        }
	    } catch (e) {
	        // Ignore.  The instanceof check doesn't work for arrow functions.
	    }

	    if (Error.isPrototypeOf(expected)) {
	        return false;
	    }

	    return expected.call({}, actual) === true;
	}

	function _tryBlock(block) {
	    var error;
	    try {
	        block();
	    } catch (e) {
	        error = e;
	    }
	    return error;
	}

	function _throws(shouldThrow, block, expected, message) {
	    var actual;

	    if (typeof block !== 'function') {
	        throw new TypeError('"block" argument must be a function');
	    }

	    if (typeof expected === 'string') {
	        message = expected;
	        expected = null;
	    }

	    actual = _tryBlock(block);

	    message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	        (message ? ' ' + message : '.');

	    if (shouldThrow && !actual) {
	        fail(actual, expected, 'Missing expected exception' + message);
	    }

	    const userProvidedMessage = typeof message === 'string';
	    const isUnwantedException = !shouldThrow && util.isError(actual);
	    const isUnexpectedException = !shouldThrow && actual && !expected;

	    if ((isUnwantedException &&
	        userProvidedMessage &&
	        expectedException(actual, expected)) ||
	        isUnexpectedException) {
	        fail(actual, expected, 'Got unwanted exception' + message);
	    }

	    if ((shouldThrow && actual && expected &&
	        !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	        throw actual;
	    }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	    _throws(true, block, error, message);
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	    _throws(false, block, error, message);
	};

	assert.ifError = function(err) { if (err) throw err; };


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(21);


	function Console(stdout, stderr) {
	    if (!(this instanceof Console)) {
	        return new Console(stdout, stderr);
	    }
	    if (!stdout || typeof stdout.write !== 'function') {
	        throw new TypeError('Console expects a writable stream instance');
	    }
	    if (!stderr) {
	        stderr = stdout;
	    } else if (typeof stderr.write !== 'function') {
	        throw new TypeError('Console expects writable stream instances');
	    }

	    // var prop = {
	    //     writable: true,
	    //     enumerable: false,
	    //     configurable: true
	    // };
	    // prop.value = stdout;
	    // Object.defineProperty(this, '_stdout', prop);
	    this._stdout = stdout;

	    // prop.value = stderr;
	    // Object.defineProperty(this, '_stderr', prop);
	    this._stderr = stderr;

	    // prop.value = new Map();
	    // Object.defineProperty(this, '_times', prop);
	    this._times = {};

	    // bind the prototype functions to this Console instance
	    var keys = Object.keys(Console.prototype);
	    for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        this[k] = this[k].bind(this);
	    }
	}


	// As of v8 5.0.71.32, the combination of rest param, template string
	// and .apply(null, args) benchmarks consistently faster than using
	// the spread operator when calling util.format.
	Console.prototype.log = function() {
	    this._stdout.write(util.format.apply(null, arguments) + '\n');
	};


	Console.prototype.info = Console.prototype.log;


	Console.prototype.warn = function() {
	    this._stderr.write(util.format.apply(null, arguments) + '\n');
	};


	Console.prototype.error = Console.prototype.warn;


	Console.prototype.dir = function(object, options) {
	    options = Object.assign({customInspect: false}, options);
	    this._stdout.write(util.inspect(object, options) + '\n');
	};


	Console.prototype.time = function(label) {
	    this._times[label] = process.hrtime();
	};


	Console.prototype.timeEnd = function(label) {
	    // const time = this._times.get(label);
	    const time = this._times[label];
	    if (!time) {
	        process.emitWarning("No such label '" + label + "' for console.timeEnd()");
	        return;
	    }
	    const duration = process.hrtime(time);
	    const ms = duration[0] * 1000 + duration[1] / 1e6;
	    this.log('%s: %sms', label, ms.toFixed(3));
	    delete this._times[label];
	};


	Console.prototype.trace = function trace() {
	    // TODO probably can to do this better with V8's debug object once that is
	    // exposed.
	    var err = new Error();
	    err.name = 'Trace';
	    err.message = util.format.apply(null, arguments);
	    Error.captureStackTrace(err, trace);
	    this.error(err.stack);
	};


	Console.prototype.assert = function(expression) {
	    if (!expression) {
	        __webpack_require__(35).ok(false, util.format.apply(null, arguments));
	    }
	};


	module.exports = new Console(process.stdout, process.stderr);
	module.exports.Console = Console;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var build = __webpack_require__(38).build;


	module.exports = build({
	    path: __webpack_require__(20),
	    EventEmitter: __webpack_require__(13).EventEmitter,
	    Buffer: __webpack_require__(2).Buffer,
	    StaticBuffer: __webpack_require__(11).StaticBuffer,
	    Readable: __webpack_require__(28).Readable,
	    Writable: __webpack_require__(28).Writable
	});



/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var libjs = __webpack_require__(6);
	var inotify_1 = __webpack_require__(39);
	var extend = __webpack_require__(21).extend;
	if (true) {
	    exports.isFullJS = true;
	}
	function noop() { }
	function formatError(errno, func, path, path2) {
	    if (func === void 0) { func = ''; }
	    if (path === void 0) { path = ''; }
	    if (path2 === void 0) { path2 = ''; }
	    switch (-errno) {
	        case 2: return "ENOENT: no such file or directory, " + func + " '" + path + "'";
	        case 9: return "EBADF: bad file descriptor, " + func;
	        case 22: return "EINVAL: invalid argument, " + func;
	        case 1: return "EPERM: operation not permitted, " + func + " '" + path + "' -> '" + path2 + "'";
	        case 71: return "EPROTO: protocol error, " + func + " '" + path + "' -> '" + path2 + "'";
	        case 17: return "EEXIST: file already exists, " + func + " '" + path + "' -> '" + path2 + "'";
	        default: return "Error occurred in " + func + ": errno = " + errno;
	    }
	}
	function throwError(errno, func, path, path2) {
	    if (func === void 0) { func = ''; }
	    if (path === void 0) { path = ''; }
	    if (path2 === void 0) { path2 = ''; }
	    throw Error(formatError(errno, func, path, path2));
	}
	function pathOrError(path) {
	    if (path instanceof Buffer)
	        path = path.toString();
	    if (typeof path !== 'string')
	        return TypeError(ERRSTR.PATH_STR);
	    return path;
	}
	function validPathOrThrow(path) {
	    var p = pathOrError(path);
	    if (p instanceof TypeError)
	        throw p;
	    else
	        return p;
	}
	function validateFd(fd) {
	    if (typeof fd !== 'number')
	        throw TypeError(ERRSTR.FD);
	}
	(function (flags) {
	    flags[flags["r"] = 0] = "r";
	    flags[flags['r+'] = 2] = 'r+';
	    flags[flags["rs"] = 1069056] = "rs";
	    flags[flags['rs+'] = 1069058] = 'rs+';
	    flags[flags["w"] = 577] = "w";
	    flags[flags["wx"] = 705] = "wx";
	    flags[flags['w+'] = 578] = 'w+';
	    flags[flags['wx+'] = 706] = 'wx+';
	    flags[flags["a"] = 1089] = "a";
	    flags[flags["ax"] = 1217] = "ax";
	    flags[flags['a+'] = 1090] = 'a+';
	    flags[flags['ax+'] = 1218] = 'ax+';
	})(exports.flags || (exports.flags = {}));
	var flags = exports.flags;
	var CHUNK = 4096;
	var F_OK = 0;
	var R_OK = 4;
	var W_OK = 2;
	var X_OK = 1;
	var appendFileDefaults = {
	    encoding: 'utf8',
	    mode: 438,
	    flag: 'a'
	};
	var writeFileDefaults = {
	    encoding: 'utf8',
	    mode: 438,
	    flag: 'w'
	};
	var ERRSTR = {
	    PATH_STR: 'path must be a string',
	    FD: 'fd must be a file descriptor',
	    MODE_INT: 'mode must be an integer',
	    CB: 'callback must be a function',
	    UID: 'uid must be an unsigned int',
	    GID: 'gid must be an unsigned int',
	    LEN: 'len must be an integer',
	    ATIME: 'atime must be an integer',
	    MTIME: 'mtime must be an integer',
	    PREFIX: 'filename prefix is required',
	    BUFFER: 'buffer must be an instance of Buffer or StaticBuffer',
	    OFFSET: 'offset must be an integer',
	    LENGTH: 'length must be an integer',
	    POSITION: 'position must be an integer'
	};
	var ERRSTR_OPTS = function (tipeof) { return ("Expected options to be either an object or a string, but got " + tipeof + " instead"); };
	function flagsToFlagsValue(f) {
	    if (typeof f === 'number')
	        return flags;
	    if (typeof f !== 'string')
	        throw TypeError("flags must be string or number");
	    var flagsval = flags[f];
	    if (typeof flagsval !== 'number')
	        throw TypeError("Invalid flags string value '" + f + "'");
	    return flagsval;
	}
	var optionsDefaults = {
	    encoding: 'utf8'
	};
	var readFileOptionsDefaults = {
	    flag: 'r'
	};
	var Stats = (function () {
	    function Stats() {
	    }
	    Stats.prototype.isFile = function () {
	        return (this.mode & 32768) == 32768;
	    };
	    Stats.prototype.isDirectory = function () {
	        return (this.mode & 16384) == 16384;
	    };
	    Stats.prototype.isBlockDevice = function () {
	        return (this.mode & 24576) == 24576;
	    };
	    Stats.prototype.isCharacterDevice = function () {
	        return (this.mode & 8192) == 8192;
	    };
	    Stats.prototype.isSymbolicLink = function () {
	        return (this.mode & 40960) == 40960;
	    };
	    Stats.prototype.isFIFO = function () {
	        return (this.mode & 4096) == 4096;
	    };
	    Stats.prototype.isSocket = function () {
	        return (this.mode & 49152) == 49152;
	    };
	    return Stats;
	}());
	exports.Stats = Stats;
	function build(deps) {
	    var pathModule = deps.path, _EE = deps.EventEmitter, Buffer = deps.Buffer, StaticBuffer = deps.StaticBuffer, Readable = deps.Readable, Writable = deps.Writable;
	    var EE = _EE;
	    function accessSync(path, mode) {
	        if (mode === void 0) { mode = F_OK; }
	        var vpath = validPathOrThrow(path);
	        var res = libjs.access(vpath, mode);
	        if (res < 0)
	            throwError(res, 'access', vpath);
	    }
	    function access(path, a, b) {
	        var mode, callback;
	        if (typeof a === 'function') {
	            callback = a;
	            mode = F_OK;
	        }
	        else {
	            mode = a;
	            callback = b;
	            if (typeof callback !== 'function')
	                throw TypeError(ERRSTR.CB);
	        }
	        var vpath = pathOrError(path);
	        if (vpath instanceof TypeError)
	            return callback(vpath);
	        libjs.accessAsync(vpath, mode, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'access', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function appendFileSync(file, data, options) {
	        if (!options)
	            options = appendFileDefaults;
	        else {
	            var tipof = typeof options;
	            switch (tipof) {
	                case 'object':
	                    options = extend({}, appendFileDefaults, options);
	                    break;
	                case 'string':
	                    options = extend({ encoding: options }, appendFileDefaults);
	                    break;
	                default:
	                    throw TypeError(ERRSTR_OPTS(tipof));
	            }
	        }
	        var b;
	        if (Buffer.isBuffer(data))
	            b = data;
	        else
	            b = new Buffer(String(data), options.encoding);
	        var sb = StaticBuffer.isStaticBuffer(b) ? b : StaticBuffer.from(b);
	        var fd;
	        var is_fd = typeof file === 'number';
	        if (is_fd) {
	            fd = file;
	        }
	        else {
	            var filename;
	            if (Buffer.isBuffer(file))
	                filename = file.toString();
	            else if (typeof file === 'string')
	                filename = file;
	            else
	                throw TypeError(ERRSTR.PATH_STR);
	            var flags = flagsToFlagsValue(options.flag);
	            if (typeof options.mode !== 'number')
	                throw TypeError(ERRSTR.MODE_INT);
	            fd = libjs.open(filename, flags, options.mode);
	            if (fd < 0)
	                throwError(fd, 'appendFile', filename);
	        }
	        var res = libjs.write(fd, sb);
	        if (res < 0)
	            throwError(res, 'appendFile', String(file));
	        if (!is_fd)
	            libjs.close(fd);
	    }
	    function appendFile(file, data, options, callback) {
	        var opts;
	        if (typeof options === 'function') {
	            callback = options;
	            opts = appendFileDefaults;
	        }
	        else {
	            var tipof = typeof options;
	            switch (tipof) {
	                case 'object':
	                    opts = extend({}, appendFileDefaults, options);
	                    break;
	                case 'string':
	                    opts = extend({ encoding: options }, appendFileDefaults);
	                    break;
	                default:
	                    throw TypeError(ERRSTR_OPTS(tipof));
	            }
	            if (typeof callback !== 'function')
	                throw TypeError(ERRSTR.CB);
	        }
	        var b;
	        if (Buffer.isBuffer(data))
	            b = data;
	        else
	            b = new Buffer(String(data), opts.encoding);
	        var sb = StaticBuffer.isStaticBuffer(b) ? b : StaticBuffer.from(b);
	        function on_open(fd, is_fd) {
	            var res = libjs.write(fd, sb);
	            if (res < 0)
	                throwError(res, 'appendFile', String(file));
	            if (!is_fd)
	                libjs.closeAsync(fd, noop);
	        }
	        var fd;
	        var is_fd = typeof file === 'number';
	        if (is_fd) {
	            fd = file;
	            on_open(fd, is_fd);
	        }
	        else {
	            var filename;
	            if (Buffer.isBuffer(file))
	                filename = file.toString();
	            else if (typeof file === 'string')
	                filename = file;
	            else
	                throw TypeError(ERRSTR.PATH_STR);
	            var flags = flagsToFlagsValue(opts.flag);
	            if (typeof opts.mode !== 'number')
	                throw TypeError(ERRSTR.MODE_INT);
	            libjs.openAsync(filename, flags, opts.mode, function (fd) {
	                if (fd < 0)
	                    return callback(Error(formatError(fd, 'appendFile', filename)));
	                on_open(fd, is_fd);
	            });
	        }
	    }
	    function chmodSync(path, mode) {
	        var vpath = validPathOrThrow(path);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        var result = libjs.chmod(vpath, mode);
	        if (result < 0)
	            throwError(result, 'chmod', vpath);
	    }
	    function chmod(path, mode, callback) {
	        var vpath = validPathOrThrow(path);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        libjs.chmodAsync(vpath, mode, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'chmod', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function fchmodSync(fd, mode) {
	        validateFd(fd);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        var result = libjs.fchmod(fd, mode);
	        if (result < 0)
	            throwError(result, 'chmod');
	    }
	    function fchmod(fd, mode, callback) {
	        validateFd(fd);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        libjs.fchmodAsync(fd, mode, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'chmod')));
	            else
	                callback(null);
	        });
	    }
	    function chownSync(path, uid, gid) {
	        var vpath = validPathOrThrow(path);
	        if (typeof uid !== 'number')
	            throw TypeError(ERRSTR.UID);
	        if (typeof gid !== 'number')
	            throw TypeError(ERRSTR.GID);
	        var result = libjs.chown(vpath, uid, gid);
	        if (result < 0)
	            throwError(result, 'chown', vpath);
	    }
	    function chown(path, uid, gid, callback) {
	        var vpath = validPathOrThrow(path);
	        if (typeof uid !== 'number')
	            throw TypeError(ERRSTR.UID);
	        if (typeof gid !== 'number')
	            throw TypeError(ERRSTR.GID);
	        libjs.chownAsync(vpath, uid, gid, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'chown', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function fchownSync(fd, uid, gid) {
	        validateFd(fd);
	        if (typeof uid !== 'number')
	            throw TypeError(ERRSTR.UID);
	        if (typeof gid !== 'number')
	            throw TypeError(ERRSTR.GID);
	        var result = libjs.fchown(fd, uid, gid);
	        if (result < 0)
	            throwError(result, 'fchown');
	    }
	    function fchown(fd, uid, gid, callback) {
	        validateFd(fd);
	        if (typeof uid !== 'number')
	            throw TypeError(ERRSTR.UID);
	        if (typeof gid !== 'number')
	            throw TypeError(ERRSTR.GID);
	        libjs.fchownAsync(fd, uid, gid, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'fchown')));
	            else
	                callback(null);
	        });
	    }
	    function lchownSync(path, uid, gid) {
	        var vpath = validPathOrThrow(path);
	        if (typeof uid !== 'number')
	            throw TypeError(ERRSTR.UID);
	        if (typeof gid !== 'number')
	            throw TypeError(ERRSTR.GID);
	        var result = libjs.lchown(vpath, uid, gid);
	        if (result < 0)
	            throwError(result, 'lchown', vpath);
	    }
	    function lchown(path, uid, gid, callback) {
	        var vpath = validPathOrThrow(path);
	        if (typeof uid !== 'number')
	            throw TypeError(ERRSTR.UID);
	        if (typeof gid !== 'number')
	            throw TypeError(ERRSTR.GID);
	        libjs.lchownAsync(vpath, uid, gid, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'lchown', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function closeSync(fd) {
	        if (typeof fd !== 'number')
	            throw TypeError(ERRSTR.FD);
	        var result = libjs.close(fd);
	        if (result < 0)
	            throwError(result, 'close');
	    }
	    function close(fd, callback) {
	        if (typeof fd !== 'number')
	            throw TypeError(ERRSTR.FD);
	        libjs.closeAsync(fd, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'close')));
	            else
	                callback(null);
	        });
	    }
	    function existsSync(path) {
	        try {
	            accessSync(path);
	            return true;
	        }
	        catch (e) {
	            return false;
	        }
	    }
	    function exists(path, callback) {
	        access(path, function (err) { callback(!err); });
	    }
	    function fsyncSync(fd) {
	        if (typeof fd !== 'number')
	            throw TypeError(ERRSTR.FD);
	        var result = libjs.fsync(fd);
	        if (result < 0)
	            throwError(result, 'fsync');
	    }
	    function fsync(fd, callback) {
	        if (typeof fd !== 'number')
	            throw TypeError(ERRSTR.FD);
	        libjs.fsyncAsync(fd, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'fsync')));
	            else
	                callback(null);
	        });
	    }
	    function fdatasyncSync(fd) {
	        if (typeof fd !== 'number')
	            throw TypeError(ERRSTR.FD);
	        var result = libjs.fdatasync(fd);
	        if (result < 0)
	            throwError(result, 'fdatasync');
	    }
	    function fdatasync(fd, callback) {
	        if (typeof fd !== 'number')
	            throw TypeError(ERRSTR.FD);
	        libjs.fdatasyncAsync(fd, function (result) {
	            if (result < 0)
	                callback(Error(formatError(result, 'fdatasync')));
	            else
	                callback(null);
	        });
	    }
	    function createStatsObject(res) {
	        var stats = new Stats;
	        stats.dev = res.dev;
	        stats.mode = res.mode;
	        stats.nlink = res.nlink;
	        stats.uid = res.uid;
	        stats.gid = res.gid;
	        stats.rdev = res.rdev;
	        stats.blksize = res.blksize;
	        stats.ino = res.ino;
	        stats.size = res.size;
	        stats.blocks = res.blocks;
	        stats.atime = new Date((res.atime * 1000) + Math.floor(res.atime_nsec / 1000000));
	        stats.mtime = new Date((res.mtime * 1000) + Math.floor(res.mtime_nsec / 1000000));
	        stats.ctime = new Date((res.ctime * 1000) + Math.floor(res.ctime_nsec / 1000000));
	        stats.birthtime = stats.ctime;
	        return stats;
	    }
	    function statSync(path) {
	        var vpath = validPathOrThrow(path);
	        try {
	            var res = libjs.stat(vpath);
	            return createStatsObject(res);
	        }
	        catch (errno) {
	            throwError(errno, 'stat', vpath);
	        }
	    }
	    function stat(path, callback) {
	        var vpath = validPathOrThrow(path);
	        libjs.statAsync(vpath, function (err, res) {
	            if (err)
	                callback(Error(formatError(err, 'stat', vpath)));
	            else
	                callback(null, createStatsObject(res));
	        });
	    }
	    function fstatSync(fd) {
	        validateFd(fd);
	        try {
	            var res = libjs.fstat(fd);
	            return createStatsObject(res);
	        }
	        catch (errno) {
	            throwError(errno, 'fstat');
	        }
	    }
	    function fstat(fd, callback) {
	        validateFd(fd);
	        libjs.fstatAsync(fd, function (err, res) {
	            if (err)
	                callback(Error(formatError(err, 'fstat')));
	            else
	                callback(null, createStatsObject(res));
	        });
	    }
	    function lstatSync(path) {
	        var vpath = validPathOrThrow(path);
	        try {
	            var res = libjs.lstat(vpath);
	            return createStatsObject(res);
	        }
	        catch (errno) {
	            throwError(errno, 'lstat', vpath);
	        }
	    }
	    function lstat(path, callback) {
	        var vpath = validPathOrThrow(path);
	        libjs.lstatAsync(vpath, function (err, res) {
	            if (err)
	                callback(Error(formatError(err, 'lstat', vpath)));
	            else
	                callback(null, createStatsObject(res));
	        });
	    }
	    function truncateSync(path, len) {
	        var vpath = validPathOrThrow(path);
	        if (typeof len !== 'number')
	            throw TypeError(ERRSTR.LEN);
	        var res = libjs.truncate(vpath, len);
	        if (res < 0)
	            throwError(res, 'truncate', vpath);
	    }
	    function truncate(path, len, callback) {
	        var vpath = validPathOrThrow(path);
	        if (typeof len !== 'number')
	            throw TypeError(ERRSTR.LEN);
	        libjs.truncateAsync(vpath, len, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'truncate', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function ftruncateSync(fd, len) {
	        validateFd(fd);
	        if (typeof len !== 'number')
	            throw TypeError(ERRSTR.LEN);
	        var res = libjs.ftruncate(fd, len);
	        if (res < 0)
	            throwError(res, 'ftruncate');
	    }
	    function ftruncate(fd, len, callback) {
	        validateFd(fd);
	        if (typeof len !== 'number')
	            throw TypeError(ERRSTR.LEN);
	        libjs.ftruncateAsync(fd, len, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'ftruncate')));
	            else
	                callback(null);
	        });
	    }
	    function utimesSync(path, atime, mtime) {
	        var vpath = validPathOrThrow(path);
	        if (typeof atime !== 'number')
	            throw TypeError(ERRSTR.ATIME);
	        if (typeof mtime !== 'number')
	            throw TypeError(ERRSTR.MTIME);
	        var vatime = atime;
	        var vmtime = mtime;
	        if (!isFinite(vatime))
	            vatime = Date.now();
	        if (!isFinite(vmtime))
	            vmtime = Date.now();
	        vatime = Math.round(vatime / 1000);
	        vmtime = Math.round(vmtime / 1000);
	        var times = {
	            actime: [libjs.UInt64.lo(vatime), libjs.UInt64.hi(vatime)],
	            modtime: [libjs.UInt64.lo(vmtime), libjs.UInt64.hi(vmtime)]
	        };
	        var res = libjs.utime(vpath, times);
	        if (res < 0)
	            throwError(res, 'utimes', vpath);
	    }
	    function utimes(path, atime, mtime, callback) {
	        var vpath = validPathOrThrow(path);
	        if (typeof atime !== 'number')
	            throw TypeError(ERRSTR.ATIME);
	        if (typeof mtime !== 'number')
	            throw TypeError(ERRSTR.MTIME);
	        var vatime = atime;
	        var vmtime = mtime;
	        if (!isFinite(vatime))
	            vatime = Date.now();
	        if (!isFinite(vmtime))
	            vmtime = Date.now();
	        vatime = Math.round(vatime / 1000);
	        vmtime = Math.round(vmtime / 1000);
	        var times = {
	            actime: [libjs.UInt64.lo(vatime), libjs.UInt64.hi(vatime)],
	            modtime: [libjs.UInt64.lo(vmtime), libjs.UInt64.hi(vmtime)]
	        };
	        libjs.utimeAsync(vpath, times, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'utimes', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function linkSync(srcpath, dstpath) {
	        var vsrcpath = validPathOrThrow(srcpath);
	        var vdstpath = validPathOrThrow(dstpath);
	        var res = libjs.link(vsrcpath, vdstpath);
	        if (res < 0)
	            throwError(res, 'link', vsrcpath, vdstpath);
	    }
	    function link(srcpath, dstpath, callback) {
	        var vsrcpath = validPathOrThrow(srcpath);
	        var vdstpath = validPathOrThrow(dstpath);
	        libjs.linkAsync(vsrcpath, vdstpath, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'link', vsrcpath, vdstpath)));
	            else
	                callback(null);
	        });
	    }
	    function mkdirSync(path, mode) {
	        if (mode === void 0) { mode = 511; }
	        var vpath = validPathOrThrow(path);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        var res = libjs.mkdir(vpath, mode);
	        if (res < 0)
	            throwError(res, 'mkdir', vpath);
	    }
	    function mkdir(path, mode, callback) {
	        if (mode === void 0) { mode = 511; }
	        var vpath = validPathOrThrow(path);
	        if (typeof mode === 'function') {
	            callback = mode;
	            mode = 511;
	        }
	        else {
	            if (typeof mode !== 'number')
	                throw TypeError(ERRSTR.MODE_INT);
	            if (typeof callback !== 'function')
	                throw TypeError(ERRSTR.CB);
	        }
	        libjs.mkdirAsync(vpath, mode, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'mkdir', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function rndStr6() {
	        return (+new Date).toString(36).slice(-6);
	    }
	    function mkdtempSync(prefix) {
	        if (!prefix || typeof prefix !== 'string')
	            throw new TypeError(ERRSTR.PREFIX);
	        var retries = 10;
	        var fullname;
	        var found_tmp_name = false;
	        for (var i = 0; i < retries; i++) {
	            fullname = prefix + rndStr6();
	            try {
	                accessSync(fullname);
	            }
	            catch (e) {
	                found_tmp_name = true;
	                break;
	            }
	        }
	        if (found_tmp_name) {
	            mkdirSync(fullname);
	            return fullname;
	        }
	        else {
	            throw Error("Could not find a new name, mkdtemp");
	        }
	    }
	    function mkdtemp(prefix, callback) {
	        if (!prefix || typeof prefix !== 'string')
	            throw new TypeError(ERRSTR.PREFIX);
	        var retries = 10;
	        var fullname;
	        function mk_dir() {
	            mkdir(fullname, function (err) {
	                if (err)
	                    callback(err);
	                else
	                    callback(null, fullname);
	            });
	        }
	        function name_loop() {
	            if (retries < 1) {
	                callback(Error('Could not find a new name, mkdtemp'));
	                return;
	            }
	            retries--;
	            fullname = prefix + rndStr6();
	            access(fullname, function (err) {
	                if (err)
	                    mk_dir();
	                else
	                    name_loop();
	            });
	        }
	        name_loop();
	    }
	    function openSync(path, flags, mode) {
	        if (mode === void 0) { mode = 438; }
	        var vpath = validPathOrThrow(path);
	        var flagsval = flagsToFlagsValue(flags);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        var res = libjs.open(vpath, flagsval, mode);
	        if (res < 0)
	            throwError(res, 'open', vpath);
	        return res;
	    }
	    function open(path, flags, mode, callback) {
	        if (typeof mode === 'function') {
	            callback = mode;
	            mode = 438;
	        }
	        var vpath = validPathOrThrow(path);
	        var flagsval = flagsToFlagsValue(flags);
	        if (typeof mode !== 'number')
	            throw TypeError(ERRSTR.MODE_INT);
	        libjs.openAsync(vpath, flagsval, mode, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'open', vpath)));
	            return callback(null, res);
	        });
	    }
	    function readSync(fd, buffer, offset, length, position) {
	        validateFd(fd);
	        if (!(buffer instanceof Buffer))
	            throw TypeError(ERRSTR.BUFFER);
	        if (typeof offset !== 'number')
	            throw TypeError(ERRSTR.OFFSET);
	        if (typeof length !== 'number')
	            throw TypeError(ERRSTR.LENGTH);
	        if (position !== null) {
	            if (typeof position !== 'number')
	                throw TypeError(ERRSTR.POSITION);
	            var seekres = libjs.lseek(fd, position, 0);
	            if (seekres < 0)
	                throwError(seekres, 'read');
	        }
	        var buf = buffer.slice(offset, offset + length);
	        var res = libjs.read(fd, buf);
	        if (res < 0)
	            throwError(res, 'read');
	        return res;
	    }
	    function read(fd, buffer, offset, length, position, callback) {
	        validateFd(fd);
	        if (!(buffer instanceof Buffer))
	            throw TypeError(ERRSTR.BUFFER);
	        if (typeof offset !== 'number')
	            throw TypeError(ERRSTR.OFFSET);
	        if (typeof length !== 'number')
	            throw TypeError(ERRSTR.LENGTH);
	        function do_read() {
	            var buf = buffer.slice(offset, offset + length);
	            libjs.readAsync(fd, buf, function (res) {
	                if (res < 0)
	                    callback(Error(formatError(res, 'read')));
	                else
	                    callback(null, res, buffer);
	            });
	        }
	        if (position !== null) {
	            if (typeof position !== 'number')
	                throw TypeError(ERRSTR.POSITION);
	            libjs.lseekAsync(fd, position, 0, function (seekres) {
	                if (seekres < 0)
	                    callback(Error(formatError(seekres, 'read')));
	                else
	                    do_read();
	            });
	        }
	        else {
	            do_read();
	        }
	    }
	    function optsEncoding(options) {
	        if (!options)
	            return optionsDefaults.encoding;
	        else {
	            var typeofopt = typeof options;
	            switch (typeofopt) {
	                case 'string': return options;
	                case 'object':
	                    return options.encoding
	                        ? options.encoding : optionsDefaults.encoding;
	                default: throw TypeError(ERRSTR_OPTS(typeofopt));
	            }
	        }
	    }
	    function readdirSync(path, options) {
	        var vpath = validPathOrThrow(path);
	        var encoding = optsEncoding(options);
	        return libjs.readdirList(vpath, encoding);
	    }
	    function readdir(path, options, callback) {
	        var vpath = validPathOrThrow(path);
	        var encoding;
	        if (typeof options === 'function') {
	            callback = options;
	            encoding = optionsDefaults.encoding;
	        }
	        else {
	            encoding = optsEncoding(options);
	            if (typeof callback !== 'function')
	                throw TypeError(ERRSTR.CB);
	        }
	        options = extend(options, optionsDefaults);
	        libjs.readdirListAsync(vpath, encoding, function (errno, list) {
	            if (errno < 0)
	                callback(Error(formatError(errno, 'readdir', vpath)));
	            else
	                callback(null, list);
	        });
	    }
	    function readFileSync(file, options) {
	        if (options === void 0) { options = {}; }
	        var opts;
	        if (typeof options === 'string')
	            opts = extend({ encoding: options }, readFileOptionsDefaults);
	        else if (typeof options !== 'object')
	            throw TypeError('Invalid options');
	        else
	            opts = extend(options, readFileOptionsDefaults);
	        if (opts.encoding && (typeof opts.encoding != 'string'))
	            throw TypeError('Invalid encoding');
	        var fd;
	        if (typeof file === 'number')
	            fd = file;
	        else {
	            var vfile = validPathOrThrow(file);
	            var flag = flags[opts.flag];
	            fd = libjs.open(vfile, flag, 438);
	            if (fd < 0)
	                throwError(fd, 'readFile', vfile);
	        }
	        var list = [];
	        do {
	            var buf = new Buffer(CHUNK);
	            var res = libjs.read(fd, buf);
	            if (res < 0)
	                throwError(res, 'readFile');
	            if (res < CHUNK)
	                buf = buf.slice(0, res);
	            list.push(buf);
	        } while (res > 0);
	        libjs.close(fd);
	        var buffer = Buffer.concat(list);
	        if (opts.encoding)
	            return buffer.toString(opts.encoding);
	        else
	            return buffer;
	    }
	    function readFile(file, options, callback) {
	        if (options === void 0) { options = {}; }
	        var opts;
	        if (typeof options === 'function') {
	            callback = options;
	            opts = readFileOptionsDefaults;
	        }
	        else {
	            if (typeof options === 'string')
	                opts = extend({ encoding: options }, readFileOptionsDefaults);
	            else if (typeof options !== 'object')
	                return callback(TypeError('Invalid options'));
	            else
	                opts = extend(options, readFileOptionsDefaults);
	            if (opts.encoding && (typeof opts.encoding != 'string'))
	                return callback(TypeError('Invalid encoding'));
	        }
	        function on_open(fd) {
	            var list = [];
	            function done() {
	                libjs.closeAsync(fd, function () {
	                    var buffer = Buffer.concat(list);
	                    if (opts.encoding)
	                        callback(null, buffer.toString(opts.encoding));
	                    else
	                        callback(null, buffer);
	                });
	            }
	            function loop() {
	                var buf = new StaticBuffer(CHUNK);
	                libjs.readAsync(fd, buf, function (res) {
	                    if (res < 0)
	                        return callback(Error(formatError(res, 'readFile')));
	                    if (res < CHUNK)
	                        buf = buf.slice(0, res);
	                    list.push(buf);
	                    if (res > 0)
	                        loop();
	                    else
	                        done();
	                });
	            }
	            loop();
	        }
	        if (typeof file === 'number')
	            on_open(file);
	        else {
	            var vfile = pathOrError(file);
	            if (vfile instanceof TypeError)
	                return callback(vfile);
	            var flag = flags[opts.flag];
	            libjs.openAsync(vfile, flag, 438, function (fd) {
	                if (fd < 0)
	                    callback(Error(formatError(fd, 'readFile', vfile)));
	                else
	                    on_open(fd);
	            });
	        }
	    }
	    function readlinkSync(path, options) {
	        if (options === void 0) { options = null; }
	        path = validPathOrThrow(path);
	        var encBuffer = false;
	        var filename;
	        if (typeof path === 'string') {
	            filename = path;
	        }
	        else if (Buffer.isBuffer(path)) {
	            var encoding = optsEncoding(options);
	            if (encoding === 'buffer') {
	                filename = path.toString();
	                encBuffer = true;
	            }
	            else {
	                filename = path.toString(encoding);
	            }
	        }
	        else
	            throw TypeError(ERRSTR.PATH_STR);
	        try {
	            var res = libjs.readlink(filename);
	        }
	        catch (errno) {
	            throwError(errno, 'readlink', path);
	        }
	        return !encBuffer ? res : new Buffer(res);
	    }
	    function renameSync(oldPath, newPath) {
	        var voldPath = validPathOrThrow(oldPath);
	        var vnewPath = validPathOrThrow(newPath);
	        var res = libjs.rename(voldPath, vnewPath);
	        if (res < 0)
	            throwError(res, 'rename', voldPath, vnewPath);
	    }
	    function rename(oldPath, newPath, callback) {
	        var voldPath = validPathOrThrow(oldPath);
	        var vnewPath = validPathOrThrow(newPath);
	        libjs.renameAsync(voldPath, vnewPath, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'rename', voldPath, vnewPath)));
	            else
	                callback(null);
	        });
	    }
	    function rmdirSync(path) {
	        var vpath = validPathOrThrow(path);
	        var res = libjs.rmdir(vpath);
	        if (res < 0)
	            throwError(res, 'rmdir', vpath);
	    }
	    function rmdir(path, callback) {
	        var vpath = validPathOrThrow(path);
	        libjs.rmdirAsync(vpath, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'rmdir', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function symlinkSync(target, path) {
	        var vtarget = validPathOrThrow(target);
	        var vpath = validPathOrThrow(path);
	        var res = libjs.symlink(vtarget, vpath);
	        if (res < 0)
	            throwError(res, 'symlink', vtarget, vpath);
	    }
	    function symlink(target, path, type, callback) {
	        var vtarget = validPathOrThrow(target);
	        var vpath = validPathOrThrow(path);
	        if (typeof type === 'function') {
	            callback = type;
	        }
	        if (typeof callback !== 'function')
	            throw TypeError(ERRSTR.CB);
	        libjs.symlinkAsync(vtarget, vpath, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'symlink', vtarget, vpath)));
	            else
	                callback(null);
	        });
	    }
	    function unlinkSync(path) {
	        var vpath = validPathOrThrow(path);
	        var res = libjs.unlink(vpath);
	        if (res < 0)
	            throwError(res, 'unlink', vpath);
	    }
	    function unlink(path, callback) {
	        var vpath = validPathOrThrow(path);
	        libjs.unlinkAsync(vpath, function (res) {
	            if (res < 0)
	                callback(Error(formatError(res, 'unlink', vpath)));
	            else
	                callback(null);
	        });
	    }
	    function createWriteStream(path, options) { }
	    var FSWatcher = (function (_super) {
	        __extends(FSWatcher, _super);
	        function FSWatcher() {
	            _super.apply(this, arguments);
	            this.inotify = new inotify_1.Inotify;
	        }
	        FSWatcher.prototype.start = function (filename, persistent, recursive, encoding) {
	            var _this = this;
	            this.inotify.encoding = encoding;
	            this.inotify.onerror = noop;
	            this.inotify.onevent = function (event) {
	                var is_rename = (event.mask & 192) || (event.mask & 256);
	                if (is_rename) {
	                    _this.emit('change', 'rename', event.name);
	                }
	                else {
	                    _this.emit('change', 'change', event.name);
	                }
	            };
	            this.inotify.start();
	            this.inotify.addPath(filename);
	        };
	        FSWatcher.prototype.close = function () {
	            this.inotify.stop();
	            this.inotify = null;
	        };
	        return FSWatcher;
	    }(EE));
	    var watchOptionsDefaults = {
	        encoding: 'utf8',
	        persistent: true,
	        recursive: false
	    };
	    var StatWatcher = (function (_super) {
	        __extends(StatWatcher, _super);
	        function StatWatcher() {
	            _super.apply(this, arguments);
	            this.last = null;
	        }
	        StatWatcher.prototype.loop = function () {
	            var _this = this;
	            stat(this.filename, function (err, stats) {
	                if (err)
	                    return _this.emit('error', err);
	                if (_this.last instanceof Stats) {
	                    if (_this.last.atime.getTime() != stats.atime.getTime()) {
	                        _this.emit('change', stats, _this.last);
	                    }
	                }
	                _this.last = stats;
	            });
	        };
	        StatWatcher.prototype.start = function (filename, persistent, interval) {
	            var _this = this;
	            this.filename = filename;
	            stat(filename, function (err, stats) {
	                if (err)
	                    return _this.emit('error', err);
	                _this.last = stats;
	                _this.interval = setInterval(_this.loop.bind(_this), interval);
	            });
	        };
	        StatWatcher.prototype.stop = function () {
	            clearInterval(this.interval);
	            this.last = null;
	        };
	        StatWatcher.map = {};
	        return StatWatcher;
	    }(EE));
	    var watchFileOptionDefaults = {
	        persistent: true,
	        interval: 5007
	    };
	    function watchFile(filename, a, b) {
	        if (a === void 0) { a = {}; }
	        var vfilename = validPathOrThrow(filename);
	        vfilename = pathModule.resolve(vfilename);
	        var opts;
	        var listener;
	        if (typeof a !== 'object') {
	            opts = watchFileOptionDefaults;
	            listener = a;
	        }
	        else {
	            opts = extend(a, watchFileOptionDefaults);
	            listener = b;
	        }
	        if (typeof listener !== 'function')
	            throw new Error('"watchFile()" requires a listener function');
	        var watcher = StatWatcher.map[vfilename];
	        if (!watcher) {
	            watcher = new StatWatcher;
	            watcher.start(vfilename, opts.persistent, opts.interval);
	            StatWatcher.map[vfilename] = watcher;
	        }
	        watcher.on('change', listener);
	        return watcher;
	    }
	    function unwatchFile(filename, listener) {
	        var vfilename = validPathOrThrow(filename);
	        vfilename = pathModule.resolve(vfilename);
	        var watcher = StatWatcher.map[vfilename];
	        if (!watcher)
	            return;
	        if (typeof listener === 'function')
	            watcher.removeListener('change', listener);
	        else
	            watcher.removeAllListeners('change');
	        if (watcher.listenerCount('change') === 0) {
	            watcher.stop();
	            delete StatWatcher.map[vfilename];
	        }
	    }
	    function writeSync(fd, data, a, b, c) {
	        validateFd(fd);
	        var buf;
	        var position;
	        if (typeof b === 'number') {
	            if (!(data instanceof Buffer))
	                throw TypeError('buffer must be instance of Buffer.');
	            var offset = a;
	            if (typeof offset !== 'number')
	                throw TypeError('offset must be an integer');
	            var length = b;
	            buf = data.slice(offset, offset + length);
	            position = c;
	        }
	        else {
	            var encoding = 'utf8';
	            if (b) {
	                if (typeof b !== 'string')
	                    throw TypeError('encoding must be a string');
	                encoding = b;
	            }
	            if (data instanceof Buffer)
	                buf = data;
	            else if (typeof data === 'string') {
	                buf = new Buffer(data, encoding);
	            }
	            else
	                throw TypeError('data must be a Buffer or a string.');
	            position = a;
	        }
	        if (typeof position === 'number') {
	            var sres = libjs.lseek(fd, position, 0);
	            if (sres < 0)
	                throwError(sres, 'write:lseek');
	        }
	        var sb = StaticBuffer.isStaticBuffer(buf)
	            ? buf : StaticBuffer.from(buf);
	        var res = libjs.write(fd, sb);
	        if (res < 0)
	            throwError(res, 'write');
	    }
	    function getOptions(defaults, options) {
	        if (!options)
	            return defaults;
	        else {
	            var tipeof = typeof options;
	            switch (tipeof) {
	                case 'string': return extend({}, writeFileDefaults, { encoding: options });
	                case 'object': return extend({}, writeFileDefaults, options);
	                default: throw TypeError(ERRSTR_OPTS(tipeof));
	            }
	        }
	    }
	    function getWriteFileOptions(options) {
	        return getOptions(writeFileDefaults, options);
	    }
	    function writeFileSync(file, data, options) {
	        var opts = getWriteFileOptions(options);
	        var fd;
	        var vpath;
	        var is_fd = typeof file === 'number';
	        if (is_fd) {
	            fd = file;
	        }
	        else {
	            vpath = validPathOrThrow(file);
	            var flags = flagsToFlagsValue(opts.flag);
	            fd = libjs.open(vpath, flags, opts.mode);
	            if (fd < 0)
	                throwError(fd, 'writeFile', vpath);
	        }
	        var sb = StaticBuffer.isStaticBuffer(data) ? data : StaticBuffer.from(data);
	        var res = libjs.write(fd, sb);
	        if (res < 0)
	            throwError(res, 'writeFile', is_fd ? String(fd) : vpath);
	        if (!is_fd)
	            libjs.close(fd);
	    }
	    return {
	        flags: flags,
	        F_OK: F_OK,
	        R_OK: R_OK,
	        W_OK: W_OK,
	        X_OK: X_OK,
	        accessSync: accessSync,
	        appendFileSync: appendFileSync,
	        chmodSync: chmodSync,
	        chownSync: chownSync,
	        closeSync: closeSync,
	        existsSync: existsSync,
	        fchmodSync: fchmodSync,
	        fchownSync: fchownSync,
	        fdatasyncSync: fdatasyncSync,
	        fstatSync: fstatSync,
	        fsyncSync: fsyncSync,
	        ftruncateSync: ftruncateSync,
	        utimesSync: utimesSync,
	        lchownSync: lchownSync,
	        linkSync: linkSync,
	        lstatSync: lstatSync,
	        mkdtempSync: mkdtempSync,
	        mkdirSync: mkdirSync,
	        openSync: openSync,
	        readFileSync: readFileSync,
	        readlinkSync: readlinkSync,
	        symlinkSync: symlinkSync,
	        statSync: statSync,
	        truncateSync: truncateSync,
	        renameSync: renameSync,
	        readSync: readSync,
	        writeSync: writeSync,
	        writeFileSync: writeFileSync,
	        unlinkSync: unlinkSync,
	        rmdirSync: rmdirSync,
	        readdirSync: readdirSync,
	        access: access,
	        appendFile: appendFile,
	        chmod: chmod,
	        fchmod: fchmod,
	        chown: chown,
	        fchown: fchown,
	        lchown: lchown,
	        close: close,
	        exists: exists,
	        fsync: fsync,
	        fdatasync: fdatasync,
	        stat: stat,
	        fstat: fstat,
	        lstat: lstat,
	        ftruncate: ftruncate,
	        truncate: truncate,
	        utimes: utimes,
	        link: link,
	        mkdtemp: mkdtemp,
	        mkdir: mkdir,
	        open: open,
	        read: read,
	        readFile: readFile,
	        readdir: readdir,
	        rename: rename,
	        rmdir: rmdir,
	        symlink: symlink,
	        unlink: unlink
	    };
	}
	exports.build = build;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var libjs = __webpack_require__(6);
	function noop() { }
	var Inotify = (function () {
	    function Inotify(poll_interval, buffer_size) {
	        if (poll_interval === void 0) { poll_interval = 200; }
	        if (buffer_size === void 0) { buffer_size = 4096; }
	        this.onevent = noop;
	        this.onerror = noop;
	        this.wdCount = 0;
	        this.wd = {};
	        this.wdr = {};
	        this.pollBound = this.poll.bind(this);
	        this.encoding = 'utf8';
	        this.pollInterval = poll_interval;
	        this.bufSize = buffer_size;
	    }
	    Inotify.prototype.poll = function () {
	        var res = libjs.read(this.fd, this.buf);
	        if (res < 0) {
	            if (-res == 11) {
	            }
	            else {
	                this.onerror(Error("Could not poll for events: errno = " + res), res);
	            }
	            this.nextTick();
	            return;
	        }
	        if (res > 0) {
	            var offset = 0;
	            var struct = libjs.inotify_event;
	            while (offset < res) {
	                var event = struct.unpack(this.buf, offset);
	                var name_off = offset + struct.size;
	                var name = this.buf.slice(name_off, name_off + event.len).toString(this.encoding);
	                name = name.substr(0, name.indexOf("\0"));
	                event.name = name;
	                event.path = this.wdr[event.wd];
	                this.onevent(event);
	                offset += struct.size + event.len;
	            }
	        }
	        this.nextTick();
	    };
	    Inotify.prototype.nextTick = function () {
	        if (this.hasStarted() && this.wdCount)
	            this.timeout = setTimeout(this.pollBound, this.pollInterval);
	    };
	    Inotify.prototype.stopPolling = function () {
	        clearTimeout(this.timeout);
	        this.timeout = null;
	    };
	    Inotify.prototype.hasStarted = function () {
	        return !!this.fd;
	    };
	    Inotify.prototype.start = function () {
	        this.fd = libjs.inotify_init1(2048);
	        if (this.fd < 0)
	            throw Error("Could not init: errno = " + this.fd);
	        this.buf = new Buffer(this.bufSize);
	        return this.fd;
	    };
	    Inotify.prototype.stop = function () {
	        this.stopPolling();
	        for (var pathname in this.wd)
	            this.removePath(pathname);
	        var fd = this.fd;
	        this.fd = 0;
	        return libjs.close(fd);
	    };
	    Inotify.prototype.addPath = function (pathname, events) {
	        if (events === void 0) { events = 4095; }
	        if (!this.fd)
	            throw Error("inotify file descriptor not initialized, call .init() first.");
	        var wd = libjs.inotify_add_watch(this.fd, pathname, events);
	        if (wd < 0)
	            throw Error("Could not add watch: errno = " + wd);
	        this.wdCount++;
	        this.wd[pathname] = wd;
	        this.wdr[wd] = pathname;
	        if (this.wdCount == 1)
	            this.nextTick();
	        return wd;
	    };
	    Inotify.prototype.removePath = function (pathname) {
	        var wd = this.wd[pathname];
	        if (!wd)
	            return -1;
	        delete this.wd[pathname];
	        delete this.wdr[wd];
	        this.wdCount--;
	        return libjs.inotify_rm_watch(this.fd, wd);
	    };
	    return Inotify;
	}());
	exports.Inotify = Inotify;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var require;'use strict';

	exports = module.exports = {
	    makeRequireFunction: makeRequireFunction,
	    stripBOM: stripBOM,
	    addBuiltinLibsToObject: addBuiltinLibsToObject
	};

	exports.requireDepth = 0;

	// Invoke with makeRequireFunction.call(module) where |module| is the
	// Module object to use as the context for the require() function.
	function makeRequireFunction() {
	    var Module = this.constructor;
	    var self = this;

	    function require(path) {
	        try {
	            exports.requireDepth += 1;
	            return self.require(path);
	        } finally {
	            exports.requireDepth -= 1;
	        }
	    }

	    function resolve(request) {
	        return Module._resolveFilename(request, self);
	    }

	    require.resolve = resolve;

	    require.main = process.mainModule;

	    // Enable support to add extra extension types.
	    require.extensions = Module._extensions;

	    require.cache = Module._cache;

	    return require;
	}

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 * because the buffer-to-string conversion in `fs.readFileSync()`
	 * translates it to FEFF, the UTF-16 BOM.
	 */
	function stripBOM(content) {
	    if (content.charCodeAt(0) === 0xFEFF) {
	        content = content.slice(1);
	    }
	    return content;
	}

	exports.builtinLibs = ['assert', 'buffer', 'child_process', 'cluster',
	    'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net',
	    'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
	    'string_decoder', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

	function addBuiltinLibsToObject(object) {
	    // Make built-in modules available directly (loaded lazily).
	    exports.builtinLibs.forEach(function (name) {
	        // Goals of this mechanism are:
	        // - Lazy loading of built-in modules
	        // - Having all built-in modules available as non-enumerable properties
	        // - Allowing the user to re-assign these variables as if there were no
	        //   pre-existing globals with the same name.

	        var setReal = function(val) {
	        // Deleting the property before re-assigning it disables the
	        // getter/setter mechanism.
	        delete object[name];
	    object[name] = val;
	};

	    Object.defineProperty(object, name, {
	            get: function() {
	                var r = require;
	            var lib = __webpack_require__(41)(name);

	    // Disable the current getter/setter and set up a new
	    // non-enumerable property.
	    delete object[name];
	    Object.defineProperty(object, name, {
	            get: function() { return lib; },
	        set: setReal,
	        configurable: true,
	        enumerable: false
	});

	    return lib;
	},
	    set: setReal,
	        configurable: true,
	        enumerable: false
	});
	});
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./module": 40,
		"./streams/BufferList": 33,
		"./streams/lazy_transform": 42,
		"./util": 30
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 41;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// LazyTransform is a special type of Transform stream that is lazily loaded.
	// This is used for performance with bi-API-ship: when two APIs are available
	// for the stream, one conventional and one non-conventional.
	'use strict';

	const stream = __webpack_require__(28);
	const util = __webpack_require__(21);

	module.exports = LazyTransform;

	function LazyTransform(options) {
	    this._options = options;
	}
	util.inherits(LazyTransform, stream.Transform);

	[
	    '_readableState',
	    '_writableState',
	    '_transformState'
	].forEach(function(prop, i, props) {
	    Object.defineProperty(LazyTransform.prototype, prop, {
	        get: function() {
	            stream.Transform.call(this, this._options);
	            this._writableState.decodeStrings = false;
	            this._writableState.defaultEncoding = 'latin1';
	            return this[prop];
	        },
	        set: function(val) {
	            Object.defineProperty(this, prop, {
	                value: val,
	                enumerable: true,
	                configurable: true,
	                writable: true
	            });
	        },
	        configurable: true,
	        enumerable: true
	    });
	});


/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	/** Highest positive signed 32-bit float value */
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'

	/** Regular expressions */
	var regexPunycode = /^xn--/;
	var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
	var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

	/** Error messages */
	var errors = {
	    'overflow': 'Overflow: input needs wider integers to process',
	    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	    'invalid-input': 'Invalid input'
	};

	/** Convenience shortcuts */
	var baseMinusTMin = base - tMin;
	var floor = Math.floor;
	var stringFromCharCode = String.fromCharCode;


	// `.fromCodePoint` shim
	if (!String.fromCodePoint) {
	    (function() {
	        var defineProperty = (function() {
	            // IE 8 only supports `Object.defineProperty` on DOM elements
	            try {
	                var object = {};
	                var $defineProperty = Object.defineProperty;
	                var result = $defineProperty(object, object, object) && $defineProperty;
	            } catch(error) {}
	            return result;
	        }());
	        var stringFromCharCode = String.fromCharCode;
	        var floor = Math.floor;
	        var fromCodePoint = function() {
	            var MAX_SIZE = 0x4000;
	            var codeUnits = [];
	            var highSurrogate;
	            var lowSurrogate;
	            var index = -1;
	            var length = arguments.length;
	            if (!length) {
	                return '';
	            }
	            var result = '';
	            while (++index < length) {
	                var codePoint = Number(arguments[index]);
	                if (
	                    !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
	                    codePoint < 0 ||              // not a valid Unicode code point
	                    codePoint > 0x10FFFF ||       // not a valid Unicode code point
	                    floor(codePoint) != codePoint // not an integer
	                ) {
	                    throw RangeError('Invalid code point: ' + codePoint);
	                }
	                if (codePoint <= 0xFFFF) { // BMP code point
	                    codeUnits.push(codePoint);
	                } else { // Astral code point; split in surrogate halves
	                    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
	                    codePoint -= 0x10000;
	                    highSurrogate = (codePoint >> 10) + 0xD800;
	                    lowSurrogate = (codePoint % 0x400) + 0xDC00;
	                    codeUnits.push(highSurrogate, lowSurrogate);
	                }
	                if (index + 1 == length || codeUnits.length > MAX_SIZE) {
	                    result += stringFromCharCode.apply(null, codeUnits);
	                    codeUnits.length = 0;
	                }
	            }
	            return result;
	        };
	        if (defineProperty) {
	            defineProperty(String, 'fromCodePoint', {
	                'value': fromCodePoint,
	                'configurable': true,
	                'writable': true
	            });
	        } else {
	            String.fromCodePoint = fromCodePoint;
	        }
	    }());
	}




	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
	    throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
	    var result = [];
	    var length = array.length;
	    while (length--) {
	        result[length] = fn(array[length]);
	    }
	    return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
	    var parts = string.split('@');
	    var result = '';
	    if (parts.length > 1) {
	        // In email addresses, only the domain name should be punycoded. Leave
	        // the local part (i.e. everything up to `@`) intact.
	        result = parts[0] + '@';
	        string = parts[1];
	    }
	    // Avoid `split(regex)` for IE8 compatibility. See #17.
	    string = string.replace(regexSeparators, '\x2E');
	    var labels = string.split('.');
	    var encoded = map(labels, fn).join('.');
	    return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
	    var output = [];
	    var counter = 0;
	    var length = string.length;
	    while (counter < length) {
	        var value = string.charCodeAt(counter++);
	        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	            // It's a high surrogate, and there is a next character.
	            var extra = string.charCodeAt(counter++);
	            if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
	                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	            } else {
	                // It's an unmatched surrogate; only append this code unit, in case the
	                // next code unit is the high surrogate of a surrogate pair.
	                output.push(value);
	                counter--;
	            }
	        } else {
	            output.push(value);
	        }
	    }
	    return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	var ucs2encode = function(array) { String.fromCodePoint.apply(null, array); }

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	var basicToDigit = function(codePoint) {
	    if (codePoint - 0x30 < 0x0A) {
	        return codePoint - 0x16;
	    }
	    if (codePoint - 0x41 < 0x1A) {
	        return codePoint - 0x41;
	    }
	    if (codePoint - 0x61 < 0x1A) {
	        return codePoint - 0x61;
	    }
	    return base;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	var digitToBasic = function(digit, flag) {
	    //  0..25 map to ASCII a..z or A..Z
	    // 26..35 map to ASCII 0..9
	    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	var adapt = function(delta, numPoints, firstTime) {
	    var k = 0;
	    delta = firstTime ? floor(delta / damp) : delta >> 1;
	    delta += floor(delta / numPoints);
	    for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
	        delta = floor(delta / baseMinusTMin);
	    }
	    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};


	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	var decode = function(input) {
	    // Don't use UCS-2.
	    var output = [];
	    var inputLength = input.length;
	    var i = 0;
	    var n = initialN;
	    var bias = initialBias;

	    // Handle the basic code points: var `basic` be the number of input code
	    // points before the last delimiter, or `0` if there is none, then copy
	    // the first basic code points to the output.

	    var basic = input.lastIndexOf(delimiter);
	    if (basic < 0) {
	        basic = 0;
	    }

	    for (var j = 0; j < basic; ++j) {
	        // if it's not a basic code point
	        if (input.charCodeAt(j) >= 0x80) {
	            error('not-basic');
	        }
	        output.push(input.charCodeAt(j));
	    }

	    // Main decoding loop: start just after the last delimiter if any basic code
	    // points were copied; start at the beginning otherwise.

	    for (var index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

	        // `index` is the index of the next character to be consumed.
	        // Decode a generalized variable-length integer into `delta`,
	        // which gets added to `i`. The overflow checking is easier
	        // if we increase `i` as we go, then subtract off its starting
	        // value at the end to obtain `delta`.
	        var oldi = i;
	        for (var w = 1, k = base; /* no condition */; k += base) {

	            if (index >= inputLength) {
	                error('invalid-input');
	            }

	            var digit = basicToDigit(input.charCodeAt(index++));

	            if (digit >= base || digit > floor((maxInt - i) / w)) {
	                error('overflow');
	            }

	            i += digit * w;
	            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

	            if (digit < t) {
	                break;
	            }

	            var baseMinusT = base - t;
	            if (w > floor(maxInt / baseMinusT)) {
	                error('overflow');
	            }

	            w *= baseMinusT;

	        }

	        var out = output.length + 1;
	        bias = adapt(i - oldi, out, oldi == 0);

	        // `i` was supposed to wrap around from `out` to `0`,
	        // incrementing `n` each time, so we'll fix that now:
	        if (floor(i / out) > maxInt - n) {
	            error('overflow');
	        }

	        n += floor(i / out);
	        i %= out;

	        // Insert `n` at position `i` of the output.
	        output.splice(i++, 0, n);

	    }

	    return String.fromCodePoint.apply(null, output);
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	var encode = function(input) {
	    var output = [];

	    // Convert the input in UCS-2 to an array of Unicode code points.
	    input = ucs2decode(input);

	    // Cache the length.
	    var inputLength = input.length;

	    // Initialize the state.
	    var n = initialN;
	    var delta = 0;
	    var bias = initialBias;

	    // Handle the basic code points.
	    for (var i = 0; i < input.length; i++) {
	        var currentValue = input[i];
	        if (currentValue < 0x80) {
	            output.push(stringFromCharCode(currentValue));
	        }
	    }

	    var basicLength = output.length;
	    var handledCPCount = basicLength;

	    // `handledCPCount` is the number of code points that have been handled;
	    // `basicLength` is the number of basic code points.

	    // Finish the basic string with a delimiter unless it's empty.
	    if (basicLength) {
	        output.push(delimiter);
	    }

	    // Main encoding loop:
	    while (handledCPCount < inputLength) {

	        // All non-basic code points < n have been handled already. Find the next
	        // larger one:
	        var m = maxInt;
	        for (var i = 0; i < input.length; i++) {
	            var currentValue = input[i];
	            if (currentValue >= n && currentValue < m) {
	                m = currentValue;
	            }
	        }

	        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
	        // but guard against overflow.
	        var handledCPCountPlusOne = handledCPCount + 1;
	        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
	            error('overflow');
	        }

	        delta += (m - n) * handledCPCountPlusOne;
	        n = m;

	        for (var i = 0; i < input.length; i++) {
	            var currentValue = input[i];
	            if (currentValue < n && ++delta > maxInt) {
	                error('overflow');
	            }
	            if (currentValue == n) {
	                // Represent delta as a generalized variable-length integer.
	                var q = delta;
	                for (var k = base; /* no condition */; k += base) {
	                    var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	                    if (q < t) {
	                        break;
	                    }
	                    var qMinusT = q - t;
	                    var baseMinusT = base - t;
	                    output.push(
	                        stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
	                    );
	                    q = floor(qMinusT / baseMinusT);
	                }

	                output.push(stringFromCharCode(digitToBasic(q, 0)));
	                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
	                delta = 0;
	                ++handledCPCount;
	            }
	        }

	        ++delta;
	        ++n;

	    }
	    return output.join('');
	};

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	var toUnicode = function(input) {
	    return mapDomain(input, function(string) {
	        return regexPunycode.test(string)
	            ? decode(string.slice(4).toLowerCase())
	            : string;
	    });
	};

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	var toASCII = function(input) {
	    return mapDomain(input, function(string) {
	        return regexNonASCII.test(string)
	            ? 'xn--' + encode(string)
	            : string;
	    });
	};

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	var punycode = {
	    /**
	     * A string representing the current Punycode.js version number.
	     * @memberOf punycode
	     * @type String
	     */
	    'version': '2.0.0',
	    /**
	     * An object of methods to convert from JavaScript's internal character
	     * representation (UCS-2) to Unicode code points, and back.
	     * @see <https://mathiasbynens.be/notes/javascript-encoding>
	     * @memberOf punycode
	     * @type Object
	     */
	    'ucs2': {
	        'decode': ucs2decode,
	        'encode': ucs2encode
	    },
	    'decode': decode,
	    'encode': encode,
	    'toASCII': toASCII,
	    'toUnicode': toUnicode
	};

	module.exports = punycode;


/***/ },
/* 44 */
/***/ function(module, exports) {

	// Taken from https://github.com/substack/vm-browserify

	var indexOf = (function() {
	    var indexOf = [].indexOf;

	    return function (arr, obj) {
	        if (indexOf) return arr.indexOf(obj);
	        for (var i = 0; i < arr.length; ++i) {
	            if (arr[i] === obj) return i;
	        }
	        return -1;
	    };
	})();

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var defineProp = (function() {
	    try {
	        Object.defineProperty({}, '_', {});
	        return function(obj, name, value) {
	            Object.defineProperty(obj, name, {
	                writable: true,
	                enumerable: false,
	                configurable: true,
	                value: value
	            })
	        };
	    } catch(e) {
	        return function(obj, name, value) {
	            obj[name] = value;
	        };
	    }
	}());

	var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
	    'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
	    'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
	    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
	    'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInContext = function (context) {
	    //if (!(context instanceof Context)) {
	    //    throw new TypeError("needs a 'context' argument.");
	    //}
	    if (typeof context != 'object') {
	        throw new TypeError("needs a 'context' argument.");
	    }

	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';

	    document.body.appendChild(iframe);

	    var win = iframe.contentWindow;
	    var wEval = win.eval, wExecScript = win.execScript;

	    if (!wEval && wExecScript) {
	        // win.eval() magically appears when this is called in IE:
	        wExecScript.call(win, 'null');
	        wEval = win.eval;
	    }

	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	    forEach(globals, function (key) {
	        if (context[key]) {
	            win[key] = context[key];
	        }
	    });

	    var winKeys = Object_keys(win);

	    var res = wEval.call(win, this.code);

	    forEach(Object_keys(win), function (key) {
	        // Avoid copying circular objects like `top` and `window` by only
	        // updating existing context properties or new properties in the `win`
	        // that was only introduced after the eval.
	        if (key in context || indexOf(winKeys, key) === -1) {
	            context[key] = win[key];
	        }
	    });

	    forEach(globals, function (key) {
	        if (!(key in context)) {
	            defineProp(context, key, win[key]);
	        }
	    });

	    document.body.removeChild(iframe);

	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInNewContext = function (context) {
	    var ctx = Script.createContext(context);
	    var res = this.runInContext(ctx);

	    forEach(Object_keys(ctx), function (key) {
	        context[key] = ctx[key];
	    });

	    return res;
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	//exports.createContext = Script.createContext = function (context) {
	exports.createContext = function (context) {
	    return context;
	    //var copy = new Context();
	    //if(typeof context === 'object') {
	    //    forEach(Object_keys(context), function (key) {
	    //        copy[key] = context[key];
	    //    });
	    //}
	    //return copy;
	};

	exports.runInThisContext = function(code) {
	    var script = new Script(code);
	    script.runInThisContext();
	};


/***/ }
/******/ ]);