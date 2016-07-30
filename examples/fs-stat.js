var fs = require('fs');


// Run this example multiple times to see variance.


var stop = false;
var file = __dirname + '/data.txt';


var stats = fs.statSync(file);
console.log(stats);



function print() {
    console.log('printing...');
    if(!stop) setImmediate(print);
}



fs.stat(file, function(err, stats) {
    console.log(stats);
    stop = true;
});



setImmediate(print);
