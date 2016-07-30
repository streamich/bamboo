var build = require('../libfs/index').build;


module.exports = build({
    path: require('./path'),
    EventEmitter: require('./events').EventEmitter,
    Buffer: require('./buffer').Buffer,
    StaticBuffer: require('./static-buffer').StaticBuffer,
    Readable: require('./stream').Readable,
    Writable: require('./stream').Writable
});

