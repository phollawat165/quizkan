const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    poweredByHeader: false,
    images: {
        domains: ['localhost', '127.0.0.1'],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
});
