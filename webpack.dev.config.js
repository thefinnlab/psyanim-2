import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    target: 'web',
    mode: 'development',
    entry: './test/index.js',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Output Management',
          template: './test/index.html'
        }),
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
            // {
            //     test:/\.(js|jsx)$/,
            //     exclude: /node_modules/,
            //     use: {
            //       loader: "babel-loader",
            //       options: {
            //         presets: ['@babel/preset-env', '@babel/preset-react']
            //       }
            //     }
            // },
            {
              test: /\.(sass|less|css)$/,
              use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    }
}