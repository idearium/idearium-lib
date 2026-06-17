const { defineConfig } = require('eslint/config');

module.exports = (async () => {
    const ideariumConfig = await import('@idearium/eslint-config');

    return defineConfig([{ ignores: ['docusaurus/**'] }, ideariumConfig]);
})();
