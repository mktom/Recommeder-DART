const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const devMode = process.env.NODE_ENV !== 'production';

const config = {
    //https://youtu.be/8_UjmdSCE1o
    context: path.resolve(__dirname, 'src'),
    entry:  {
        app: './index.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    module: {
        rules: [
          {
            test: /\.jsx?/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "babel-loader",
                    query: {
                        presets:[ '@babel/react', '@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            ]
          },
          {
            test: /\.css?/,
            use: [
                    {
                        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    {
                        // loader: 'style-loader!css-loader'
                        loader:'css-loader'
                    }
                ]
          },
          {
            test: /\.svg$/,
            loader: 'svg-inline-loader?classPrefix'
          },
          {    
            test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
            {
                loader: 'file-loader',
                options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
                }
            },
            ]
          },
          {
            test: /\.(png|jpe?g|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 1024000,
                        name: '[path][name].[ext]'    
                    }
                }
            ]
            
        }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? "output.css" : "output.[contenthash].css",
            chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css"
        }),
        new WebpackMd5Hash()
    ]
};

module.exports = config;
