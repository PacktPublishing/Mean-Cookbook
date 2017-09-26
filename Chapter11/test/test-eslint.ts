import * as lint from 'mocha-eslint';

let paths = [
    'src',
    'test'
];

let options = {
    formatter: 'stylish',
    strict: true,
    contextName: 'ESLint'
};

lint(paths, options);