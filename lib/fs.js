var build = require('../libfs/index').build;


var fs = module.exports = build({
    path: require('./path'),
    EventEmitter: require('./events').EventEmitter,
    Buffer: require('./buffer').Buffer,
    Readable: require('./stream').Readable,
    Writable: require('./stream').Writable
});


