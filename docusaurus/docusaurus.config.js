'use strict';

module.exports = {
    baseUrl: '/idearium-lib/',
    favicon: 'img/favicon.ico',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    organizationName: 'idearium',
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    editUrl:
                        'https://github.com/idearium/idearium-lib/tree/feature-monorepo/docusaurus/',
                    sidebarPath: require.resolve('./sidebars.js')
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            }
        ]
    ],
    projectName: 'idearium-lib',
    tagline: 'For developer productivity',
    themeConfig: {
        footer: {
            copyright: `Copyright © ${new Date().getFullYear()} Idearium Pty ltd`,
            links: [],
            style: 'dark'
        },
        navbar: {
            items: [
                {
                    activeBasePath: 'packages',
                    label: 'Packages',
                    position: 'left',
                    to: 'docs/'
                },
                {
                    href: 'https://github.com/idearium/idearium-lib',
                    label: 'GitHub',
                    position: 'right'
                }
            ],
            logo: {
                alt: 'Idearium Lib Logo',
                src: 'img/il-logo.png'
            },
            title: 'Idearium Lib'
        }
    },
    title: 'Idearium Lib',
    url: 'https://idearium.github.io'
};
