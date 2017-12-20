const path = require('path');
const args = require('yargs-parser')(process.argv.slice(2))

const runtime = args.runtime || args.r || 'node';
const file = args._[0];

if (!file) {
    console.error('File name not specified.');
    return;
}

const runtimePath = path.join(__dirname, '..', `bamboo-runtime-${runtime}`, 'bin', 'runtime');

console.log(runtimePath);
