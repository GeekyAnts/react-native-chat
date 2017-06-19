{
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
        "react-native"
    ],
    "rules": {
        "no-underscore-dangle": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/forbid-prop-types": "off",
        "no-alert": "off",
        "no-console": "off",
        "class-methods-use-this": "off",
        "import/imports-first": "off",
        "global-require": "off",
        "import/newline-after-import": "off"
    },
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".android.js", ".ios.js"]
            }
        }
    },
    "globals": {
        "fetch": true,
        "navigator": true,
        "window": true,
      }
}