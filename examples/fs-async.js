var fs = require('fs');


var buf = fs.readFileSync(__dirname + '/data.txt');
console.log(buf.toString());

function print() {
    console.log('printing...');
}

setImmediate(print);


fs.readFile(__dirname + '/data.txt', function(err, buf) {
    console.log(err, buf);
});
