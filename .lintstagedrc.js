export default {
    '*.{css,md}': 'prettier --write',
    '*.{js,jsx}': ['eslint', 'prettier --write'],
    'packages/amqp/**/*.{js,jsx}': () => 'npm test -w packages/amqp',
    'packages/certs/**/*.{js,jsx}': () => 'npm test -w packages/certs',
    'packages/cloudflare-queues/**/*.{js,jsx}': () =>
        'npm test -w packages/cloudflare-queues',
    'packages/cookie/**/*.{js,jsx}': () => 'npm test -w packages/cookie',
    'packages/encryption/**/*.{js,jsx}': () =>
        'npm test -w packages/encryption',
    'packages/fetch/**/*.{js,jsx}': () => 'npm test -w packages/fetch',
    'packages/lists/**/*.{js,jsx}': () => 'npm test -w packages/lists',
    'packages/log/**/*.{js,jsx}': () => 'npm test -w packages/log',
    'packages/log-http/**/*.{js,jsx}': () => 'npm test -w packages/log-http',
    'packages/log-insightops/**/*.{js,jsx}': () =>
        'npm test -w packages/log-insightops',
    'packages/log-structured/**/*.{js,jsx}': () =>
        'npm test -w packages/log-structured',
    'packages/phone/**/*.{js,jsx}': () => 'npm test -w packages/phone',
    'packages/promise-all-settled/**/*.{js,jsx}': () =>
        'npm test -w packages/promise-all-settled',
    'packages/safe-promise/**/*.{js,jsx}': () =>
        'npm test -w packages/safe-promise',
    'packages/text-sort/**/*.{js,jsx}': () => 'npm test -w packages/text-sort',
};
