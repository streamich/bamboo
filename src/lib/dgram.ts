import {ISocketUdp} from '../libaio/event';
import {EventEmitter} from './events';
import {Buffer} from './buffer';
import {StaticBuffer} from './static-buffer';
import * as libjs from '../libjs/index';
var util = require('./util');
const errnoException = util._errnoException;


function lookup4(address, callback) {
    callback();
}

function sliceBuffer(buffer, offset, length) {
    if (typeof buffer === 'string')
        buffer = Buffer.from(buffer);
    else if (!(buffer instanceof Buffer))
        throw new TypeError('First argument must be a buffer or string');

    offset = offset >>> 0;
    length = length >>> 0;

    return buffer.slice(offset, offset + length);
}


function fixBufferList(list) {
    const newlist = new Array(list.length);

    for (var i = 0, l = list.length; i < l; i++) {
        var buf = list[i];
        if (typeof buf === 'string')
            newlist[i] = Buffer.from(buf);
        else if (!(buf instanceof Buffer))
            return null;
        else
            newlist[i] = buf;
    }
    return newlist;
}


type Tmsg = Buffer|StaticBuffer|string|(Buffer[])|(StaticBuffer[]);


export class Socket extends EventEmitter {
    protected sock: ISocketUdp = process.loop.poll.createUdpSocket();
    protected lookup = lookup4;

    constructor() {
        super();

        this.sock.ondata = () => {

        };
        this.sock.onstart = () => {

        };
        this.sock.onstop = () => {

        };
        this.sock.onerror = () => {

        };
    }

    send(msg: Tmsg, offset: number, length: number,     port: number,           address: string,    callback?: Tcallback);
    send(msg: Tmsg, port: number,   address: string,    callback?: Tcallback);
    send(msg: Tmsg, a: number,      b: number|string,   c?: number|Tcallback,   d?: string,         e?: Tcallback) {

        var port: number;
        var address: string;
        var callback: Tcallback;

        const typeofb = typeof b;
        if(typeofb[0] === 'n') {
            var offset = a as number;
            var length = b as number;
            msg = sliceBuffer(msg, offset, length);
            port = c as number;
            address = d;
            callback = e;
        } else if(typeofb[1] === 't') {
            port = a;
            address = b as string;
            callback = c as Tcallback;
        } else
            throw TypeError('3rd arguments must be length or address');


        let list: Buffer[];
        if (!Array.isArray(msg)) {
            if (typeof msg === 'string') {
                list = [ Buffer.from(msg) ];
            } else if (!(msg instanceof Buffer)) {
                throw new TypeError('First argument must be a buffer or a string');
            } else {
                list = [ msg ];
            }
        } else if (!(list = fixBufferList(msg))) {
            throw new TypeError('Buffer list arguments must be buffers or strings');
        }


        port = port >>> 0;
        if (port === 0 || port > 65535)
            throw new RangeError('Port should be > 0 and < 65536');

        if(typeof callback !== 'function')
            callback = undefined;

        // if (self._bindState == BIND_STATE_UNBOUND)
        //     self.bind({port: 0, exclusive: true}, null);

        // TODO: Why send nothing, we need this?
        if (list.length === 0)
            list.push(new Buffer(0));

        // If the socket hasn't been bound yet, push the outbound packet onto the
        // send queue and send after binding is complete.
        // if (self._bindState != BIND_STATE_BOUND) {
        //     enqueue(self, self.send.bind(self, list, port, address, callback));
        //     return;
        // }

        this.lookup(address, (err, ip) => {
            var err = this.sock.send(list[0], address, port);
            if(callback) callback(err);
        });
    }

    address() {

    }

    bind(options, callback?: Tcallback);
    bind(port?: number, address?: string, callback?: Tcallback);
    bind(a?: number, b?: string|Tcallback, c?: Tcallback) {

    }

    close(callback?) {
        this.sock.stop();
    }

    addMembership(multicastAddress, multicastInterface?) {

    }

    dropMembership(multicastAddress, multicastInterface?) {

    }

    setBroadcast(flag) {
        var res = this.sock.setBroadcast(flag);
        if(res < 0) throw errnoException(res, 'setBroadcast');
    }

    setMulticastLoopback(flag) {
        var res = this.sock.setMulticastLoop(flag);
        if(res < 0)
            throw errnoException(res, 'setMulticastLoopback');
        return flag;
    }

    setTTL(ttl) {
        if(typeof ttl !== 'number')
            throw TypeError('Argument must be a number');

        var res = this.sock.setTtl(ttl);
        if (res < 0)
            throw errnoException(res, 'setTTL');

        return ttl;
    }

    setMulticastTTL(ttl) {
        if(typeof ttl !== 'number')
            throw new TypeError('Argument must be a number');

        var err = this.sock.setMulticastTtl(ttl);
        if(err < 0) throw errnoException(err, 'setMulticastTTL');

        return ttl;
    }

    ref() {
        this.sock.ref();
    }

    unref() {
        this.sock.unref();
    }
}


export function createSocket(type) {
    var socket = new Socket;
    return socket;
}
