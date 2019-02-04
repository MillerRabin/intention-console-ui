const path = require('path');

if (exports.production == null)
    exports.production = (process.argv[2] != 'debug');

exports.root = path.resolve(path.join(__dirname, '..'));
exports.serverPath = exports.production ? 'https://intension.tech' : 'http://localhost:8084';

exports.useHttp2 = false;