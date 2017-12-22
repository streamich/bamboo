/* eslint-disable required-modules */
'use strict';

const path = require('path');
const fs = require('fs');

const fixturesDir = path.join(__dirname, '..', 'fixtures');

function fixturesPath(step) {
  return path.join(fixturesDir, step);
}

function readFixtureSync(args, enc) {
  if (Array.isArray(args))
    return fs.readFileSync(fixturesPath.apply(null, args), enc);
  return fs.readFileSync(fixturesPath(args), enc);
}

function readFixtureKey(name, enc) {
  return fs.readFileSync(fixturesPath('keys', name), enc);
}

module.exports = {
  fixturesDir: fixturesDir,
  path: fixturesPath,
  readSync: readFixtureSync,
  readKey: readFixtureKey
};
