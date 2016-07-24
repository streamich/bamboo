require('./index');


// console.log(process.pid);
// console.log(process.getgid());
// console.log(process.getgid());

// var path = require("./lib/path");
// var path = require("./lib/path");
// console.log(fs.readFileSync(__dirname + '/package.json').toString());
// console.log(path.resolve('./', './lol.js'));


var module = require('./lib/module');
// console.log(__dirname + '/lol.js', null, true);
module.Module._load(__dirname + '/lol', null, true);
// require('./lol.js');


