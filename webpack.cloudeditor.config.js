const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: './experiments/cloudeditor/index.js',
    devtool: 'inline-source-map',
    devServer: {
        static: './public',
    },
    performance: {
        maxEntrypointSize: 100000000,
        maxAssetSize: 100000000,
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Output Management',
          template: './experiments/cloudeditor/index.html'
        }),
      ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
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