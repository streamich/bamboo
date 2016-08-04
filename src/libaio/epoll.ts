import * as libjs from '../libjs/index';
import {Buffer} from '../lib/buffer';
import {StaticBuffer} from '../lib/static-buffer';
import {IEventPoll, ISocket, noop, TonData, TonError, TonStart, TonStop, Tcallback} from "./event";
import {setMicroTask} from "../lib/timers";


const CHUNK = 8192;


export abstract class Socket implements ISocket {
    poll: Poll = null;
    fd: number = 0;    // socket` file descriptor
    type: libjs.SOCK;
    connected = false;
    reffed = false;

    onstart:    TonStart    = noop as any as TonStart;  // Maps to "listening" event.
    onstop:     TonStop     = noop as any as TonStop;   // Maps to "close" event.
    ondata:     TonData     = noop as any as TonData;   // Maps to "message" event.

    // TODO: Synchronous first level errors: do we (1) `return`, (2) `throw`, or (3) `.onerror()` them?
    onerror:    TonError    = noop as any as TonError;  // Maps to "error" event.


    // Events that come from `Poll`.
    abstract update(events: number);

    start(): Error {
        this.fd = libjs.socket(libjs.AF.INET, this.type, 0);
        if(this.fd < 0) return Error(`Could not create scoket: errno = ${this.fd}`);

        // Socket is not a file, we just created the file descriptor for it, flags
        // for this file descriptor are set to 0 anyways, so we just overwrite 'em,
        // no need to fetch them and OR'em.
        var fcntl = libjs.fcntl(this.fd, libjs.FCNTL.SETFL, libjs.FLAG.O_NONBLOCK);
        if(fcntl < 0) return Error(`Could not make socket non-blocking: errno = ${fcntl}`);
    }

    stop() {
        // TODO: When closing fd, it gets removed from `epoll` automatically, right?
        if(this.fd) {
            // TODO: Is socket `close` non-blocking, so we just use `close`.
            libjs.close(this.fd);
            // libjs.closeAsync(this.fd, noop);
            this.fd = 0;
        }

        this.onstop();
    }
}


export class SocketUdp extends Socket {
    type = libjs.SOCK.DGRAM;
    isIPv4 = true;

    start(): Error {
        var err = super.start();
        if(err) return err;

        var fd = this.fd;
        var event: libjs.epoll_event = {
            // TODO: Do we need `EPOLLOUT` for dgram sockets, or they are ready for writing immediately?
            events: libjs.EPOLL_EVENTS.EPOLLIN | libjs.EPOLL_EVENTS.EPOLLOUT,
            data: [fd, 0],
        };

        var ctl = libjs.epoll_ctl(this.poll.epfd, libjs.EPOLL_CTL.ADD, fd, event);
        if(ctl < 0) return Error(`Could not add epoll events: errno = ${ctl}`);
    }

    send(buf: Buffer|StaticBuffer, ip: string, port: number) {
        var addr: libjs.sockaddr_in = {
            sin_family: libjs.AF.INET,
            sin_port: libjs.hton16(port),
            sin_addr: {
                s_addr: new libjs.Ipv4(ip),
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0],
        };

        // Make sure socket is non-blocking and don't rise `SIGPIPE` signal if the other end is not receiving.
        const flags = libjs.MSG.DONTWAIT | libjs.MSG.NOSIGNAL;
        var res = libjs.sendto(this.fd, buf, flags, addr, libjs.sockaddr_in);
        if(res < 0) {
            if(-res == libjs.ERROR.EAGAIN) {
                // This just means, we executed the send *asynchronously*, so no worries.
                return;
            } else {
                return Error(`sendto error, errno = ${res}`);
                // return res;
            }
        }
    }

    bind(port: number, ip: string = '0.0.0.0'): Error {
        var addr: libjs.sockaddr_in = {
            sin_family: libjs.AF.INET,
            sin_port: libjs.hton16(port),
            sin_addr: {
                s_addr: new libjs.Ipv4(ip),
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0],
        };

        var res = libjs.bind(this.fd, addr, libjs.sockaddr_in);
        if(res < 0)
            return Error(`bind error, errno = ${res}`);

        this.reffed = true;
        this.poll.refs++;
    }

    update(events: number) {
        console.log('events', events);

        // TODO: Do we need this or UDP sockets are automatically writable after `bind()`.
        if(events & libjs.EPOLL_EVENTS.EPOLLOUT) {
            console.log(this.fd, 'EPOLLOUT');

            this.connected = true;

            var event: libjs.epoll_event = {
                events: libjs.EPOLL_EVENTS.EPOLLIN,
                data: [this.fd, 0],
            };
            var res = libjs.epoll_ctl(this.poll.epfd, libjs.EPOLL_CTL.MOD, this.fd, event)
            // TODO: check `res`

            this.onstart();
        }

        if((events & libjs.EPOLL_EVENTS.EPOLLIN) || (events & libjs.EPOLL_EVENTS.EPOLLPRI)) {
            console.log(this.fd, 'EPOLLIN');

            var err = null;
            do {
                // var buf = new StaticBuffer(CHUNK);
                var buf = new Buffer(CHUNK);
                var bytes = libjs.read(this.fd, buf as any as StaticBuffer);
                if(bytes < -1) {
                    err = Error(`Error reading data: ${bytes}`);
                    break;
                } else {
                    this.ondata(buf.slice(0, bytes));
                }
            } while (bytes === CHUNK);
        }

        if(events & libjs.EPOLL_EVENTS.EPOLLERR) {
            console.log(this.fd, 'EPOLLERR');
            this.onerror(Error(`Some error on ${this.fd}`));
        }

        if(events & libjs.EPOLL_EVENTS.EPOLLRDHUP) {
            console.log(this.fd, 'EPOLLRDHUP');
        }

        if(events & libjs.EPOLL_EVENTS.EPOLLHUP) {
            console.log(this.fd, 'EPOLLHUP');
        }
        // if(!this.connected) {
        //     if((event.events & libjs.EPOLL_EVENTS.EPOLLOUT) > 0) { // Socket to send data.
        //         clearInterval(polli);
        // this.connected = true;
        // this.onconnect();
        // }
        // }
        // if((event.events & libjs.EPOLL_EVENTS.EPOLLIN) > 0) { // Socket received data.
        //     var buf = new StaticBuffer(1000);
        //     var bytes = libjs.read(this.fd, buf);
        //     if(bytes < -1) {
        //         this.onerror(Error(`Error reading data: ${bytes}`));
        //     }
        //     if(bytes > 0) {
        //         var data = buf.toString().substr(0, bytes);
        //         this.ondata(data);
        //     }
        // }
        // if((event.events & libjs.EPOLL_EVENTS.EPOLLERR) > 0) { // Check for errors.
        // }
    }

    setTtl(ttl: number) {
        if (ttl < 1 || ttl > 255) return -libjs.ERROR.EINVAL;
        var buf = libjs.optval_t.pack(ttl);
        return this.isIPv4
            ? libjs.setsockopt(this.fd, libjs.IPPROTO.IP, libjs.IP.TTL, buf)
            : libjs.setsockopt(this.fd, libjs.IPPROTO.IPV6, libjs.IPV6.UNICAST_HOPS, buf);
    }

    setMulticastTtl(ttl: number) {
        var buf = libjs.optval_t.pack(ttl);
        return this.isIPv4
            ? libjs.setsockopt(this.fd, libjs.IPPROTO.IP, libjs.IP.MULTICAST_TTL, buf)
            : libjs.setsockopt(this.fd, libjs.IPPROTO.IPV6, libjs.IPV6.MULTICAST_HOPS, buf);
    }

    setMulticastLoop(on: boolean) {
        var buf = libjs.optval_t.pack(on ? 1 : 0);
        return this.isIPv4
            ? libjs.setsockopt(this.fd, libjs.IPPROTO.IP, libjs.IP.MULTICAST_LOOP, buf)
            : libjs.setsockopt(this.fd, libjs.IPPROTO.IPV6, libjs.IPV6.MULTICAST_LOOP, buf);
    }

    setBroadcast(on: boolean) {
        var buf = libjs.optval_t.pack(on ? 1 : 0);
        return this.isIPv4
            ? libjs.setsockopt(this.fd, libjs.IPPROTO.IP, libjs.SOL.SOCKET, buf)
            : libjs.setsockopt(this.fd, libjs.IPPROTO.IPV6, libjs.SO.BROADCAST, buf);
    }
}


export class SocketTcp extends Socket {
    type = libjs.SOCK.STREAM;

    connected = false;

    connect(opts: {host: string, port: number}) {

        // on read check for:
        // EAGAINN and EWOULDBLOCK

        var addr_in: libjs.sockaddr_in = {
            sin_family: libjs.AF.INET,
            sin_port: libjs.hton16(opts.port),
            sin_addr: {
                s_addr: new libjs.Ipv4(opts.host),
            },
            sin_zero: [0, 0, 0, 0, 0, 0, 0, 0],
        };
        var res = libjs.connect(this.fd, addr_in);

        // Everything is OK, we are connecting...
        if(res == -libjs.ERROR.EINPROGRESS) {
            this.poll(); // Start event loop.
            return;
        }

        // Error occured.
        if(res < 0) throw Error(`Could no connect: ${res}`);

        // TODO: undefined behaviour.
        throw Error('Something went not according to plan.');
    }

    // This function has been called by the event loop.
    onRead() {

    }

    write(data) {
        var sb = StaticBuffer.from(data + '\0');
        var res = libjs.write(this.fd, sb);
        return res;
    }
}


// export class EpollPool extends Pool {
export class Poll implements IEventPoll {

    protected socks: {[n: number]: Socket} = {};

    refs: number = 0;

    // `epoll` file descriptor
    epfd: number = 0;

    onerror: TonError = noop as TonError;

    maxEvents = 10;
    bufSize = libjs.epoll_event.size;

    constructor() {
        this.epfd = libjs.epoll_create1(0);
        if(this.epfd < 0) throw Error(`Could not create epoll fd: errno = ${this.epfd}`);
    }

    wait(timeout: number) {
        const EVENT_SIZE = this.bufSize;
        var evbuf = new StaticBuffer(this.maxEvents * EVENT_SIZE);
        var waitres = libjs.epoll_wait(this.epfd, evbuf, this.maxEvents, timeout);

        if(waitres > 0) { // New events arrived.
            // console.log(waitres);
            // evbuf.print();
            // console.log(this.socks);
            for(var i = 0; i < waitres; i++) {
                var event = libjs.epoll_event.unpack(evbuf, i * EVENT_SIZE);
                // console.log(event);
                var [fd,] = event.data;
                var socket = this.socks[fd];
                if(socket) {
                    socket.update(event.events);
                } else {
                    this.onerror(Error(`Socket not in pool: ${fd}`));
                }
            }
        } else if(waitres < 0) {
            this.onerror(Error(`Error while waiting for connection: ${waitres}`));
        }

        // Hook to the global event loop.
        setTimeout(this.wait.bind(this), 1000);
    }

    hasRefs() {
        return !!this.refs;
    }

    createUdpSocket(): SocketUdp|Error {
        var sock = new SocketUdp;
        sock.poll = this;
        var err = sock.start();
        this.socks[sock.fd] = sock;

        if(err) return err;
        else return sock;
    }
}
