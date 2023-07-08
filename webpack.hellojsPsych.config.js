const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './experiments/jspsych_example/index.js',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Output Management',
          template: './experiments/jspsych_example/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "./experiments/jspsych_example/img/blue.png", to: "./img/blue.png"},
                { from: "./experiments/jspsych_example/img/orange.png", to: "./img/orange.png"}
            ],
        })
      ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
    },
    module: {
        rules: [
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: 'file-loader',
                }
            }
        ]
    }
}