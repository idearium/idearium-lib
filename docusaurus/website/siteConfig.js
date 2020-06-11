'use strict';

// See https://docusaurus.io/docs/site-config for all the possible

const users = [
    {
        caption: 'User1',
        image: '/img/undraw_open_source.svg',
        infoLink: 'https://www.facebook.com',
        pinned: true
    }
];

const siteConfig = {
    baseUrl: '/idearium-lib/',
    cleanUrl: true,
    colors: {
        primaryColor: '#EB1484',
        secondaryColor: '#7C1744'
    },
    copyright: `Copyright © ${new Date().getFullYear()} Idearium Pty ltd`,
    favicon: 'img/favicon.ico',
    footerIcon: 'img/il-icon.png',
    headerIcon: 'img/il-icon.png',
    headerLinks: [{ doc: 'encryption', label: 'Packages' }],
    highlight: { theme: 'default' },
    logo: 'img/il-logo.png',
    ogImage: 'img/undraw_online.svg',
    onPageNav: 'separate',
    organizationName: 'idearium',
    projectName: 'idearium-lib',
    scripts: ['https://buttons.github.io/buttons.js'],
    tagline: 'For developer productivity',
    title: 'Idearium Lib',
    twitterImage: 'img/undraw_tweetstorm.svg',
    url: 'https://idearium.github.io',
    users
};

module.exports = siteConfig;
