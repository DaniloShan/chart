const path = require('path');
module.exports = app => {
    const exports = {};

    exports.logger = {
        consoleLevel: 'DEBUG',
        dir: path.join(app.baseDir, 'logs')
    };

    exports.static = {
        prefix: '/public/',
        dir: path.join(app.baseDir, 'public')
    };

    exports.keys = '123456';

    exports.middleware = [
        'access'
    ];

    return exports;
};
