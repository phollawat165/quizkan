const path = require('path');

module.exports = {
    poweredByHeader: false,
    images: {
        domains: ['localhost', '127.0.0.1'],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};
