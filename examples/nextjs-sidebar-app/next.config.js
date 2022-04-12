const path = require('path')

module.exports = {
    i18n: {
        locales: ['en', 'sv'],
        defaultLocale: 'en'
    },
    images: {
        domains: ['a.callback.com'],
    },
    eslint: {
        dirs: ['pages', 'src'], // Only run ESLint on the 'pages' and 'utils' directories during production builds
    },
    webpack: (config, {dev}) => {
        if (dev) {
            // Avoid importing two different versions of react. If this happens, the 'rule of hooks' will be broken
            Object.assign(config.resolve.alias, {
                '@johannes-lindgren/storyblok-js': path.resolve('./node_modules/@johannes-lindgren/callback-js'),
                'react': path.resolve('./node_modules/react'),
                'react-dom': path.resolve('./node_modules/react-dom'),
            })
        }
        // Important: return the modified config
        return config
    },
}