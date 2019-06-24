module.exports = {
    parser: "babel-eslint",
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/forbid-prop-types": [0, { "forbid": ["object"] }],
        "no-param-reassign": 0,
        "no-use-before-define": 0,
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
    },
    "settings": { "import/resolver": { "node": { "paths": ["src"] } } }
};