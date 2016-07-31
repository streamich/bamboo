var fs = require('fs');



var res = fs.writeFileSync(__dirname + '/writeFile.txt', 'Hello\n');
console.log(res);
