const {spawn} = require('child_process');
const path = require('path');
const args = require('yargs-parser')(process.argv.slice(2))

const runtime = args.runtime || args.r || 'duktape';
const lib = args.lib || path.join(__dirname, 'node_modules', 'bamboo-core', 'dist', 'bamboo.js');
const file = args._[0];

if (!file) {
    console.error('File name not specified.');
    return;
}

const cmd = path.join(__dirname, '..', `bamboo-runtime-${runtime}`, 'bin', 'runtime');

const subprocess = spawn(cmd, [lib, file], {
    stdio: 'inherit'
});
