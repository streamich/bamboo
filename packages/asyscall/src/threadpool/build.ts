const AsyscallCompiler = require('./asm').AsyscallCompiler;
const fs = require('fs');
const path = require('path');


const compiler = new AsyscallCompiler;
const bin = compiler.compile(2, 100);
const str = 'export default [' + bin.join(',') + ']; \n';
fs.writeFile(path.join(__dirname, '/bin.ts'), str);
