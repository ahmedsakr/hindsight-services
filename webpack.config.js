const path = require('path');

module.exports = {
    target: "node",
    output: {
        path: process.cwd(),
        filename: "services.js",
        library: "hindsight-services",
        libraryTarget: "umd"
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-proposal-optional-chaining", "@babel/plugin-transform-runtime"],
                    }
                }
            }
        ],
    }
};