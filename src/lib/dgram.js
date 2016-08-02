var SocketDgram = require('../libaio/epoll').SocketDgram;
var Buffer = require('./buffer').Buffer;
console.log('dgram');
var dgram = new SocketDgram;
console.log(dgram);
dgram.start();
dgram.send(new Buffer('cool stuff'), '127.0.0.1', 1234);
dgram.send(new Buffer('yolo'), '127.0.0.1', 1234);
dgram.send(new Buffer('Hi, there'), '127.0.0.1', 1234);
