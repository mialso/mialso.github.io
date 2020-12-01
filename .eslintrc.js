module.exports = {
    extends: 'airbnb-base',
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.mjs'],
            },
        },
    },
    rules: {
        indent: ['error', 4],
        semi: 'off',
        'no-use-before-define': 'off',
    },
    env: {
        browser: true,
    },
    globals: {
        miro: 'readonly',
        Terminal: 'readonly',
    },
}
