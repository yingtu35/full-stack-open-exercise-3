module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-trailing-spaces": "error",
        "arrow-spacing": [
            "error",
            { "before": true, "after": true }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "no-console": 0
    }
}
