const path = require('path');
const { withPlugins, optional } = require('next-compose-plugins');
const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const withPWA = require('next-pwa');

module.exports = withPlugins(
    [
        [
            optional(() =>
                require('@next/bundle-analyzer')({
                    enabled: process.env.ANALYZE === 'true',
                }),
            ),
            {},
            [PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD],
        ],
        withPWA,
    ],
    {
        poweredByHeader: false,
        future: {
            webpack5: true,
        },
        images: {
            domains: ['localhost', '127.0.0.1'],
        },
        sassOptions: {
            includePaths: [path.join(__dirname, 'styles')],
        },
        pwa: {
            dest: 'public',
            disable: process.env.NODE_ENV === 'development',
        },
    },
);
