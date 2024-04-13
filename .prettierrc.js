module.exports = {
    trailingComma: "all",
    printWidth: 120,
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: "avoid",
    endOfLine: "auto",
    jsxSingleQuote: false,
    quoteProps: "as-needed",
    htmlWhitespaceSensitivity: "css",
    vueIndentScriptAndStyle: false,
    embeddedLanguageFormatting: "auto",
    
    overrides: [
        {
            files: "*.json",
            options: {
                tabWidth: 2,
            },
            "prettier.printWidth": 100,
            "prettier.semi": false,
            "prettier.singleQuote": true,
            "prettier.trailingComma": "all"
        },
        {
            files: "*.css",
            options: {
                tabWidth: 2,
            },
            "prettier.printWidth": 100,
            "prettier.semi": false,
            "prettier.singleQuote": true,
            "prettier.trailingComma": "all"

        },
        {
            files: "*.js",
            options: {
                tabWidth: 2,
            },
            "prettier.printWidth": 100,
            "prettier.semi": false,
            "prettier.singleQuote": true,
            "prettier.trailingComma": "all"
        },


     ],



  };