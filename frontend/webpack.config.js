const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
let style;

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        style = 'style-loader'
    }

    if (argv.mode === 'production') {
        style = MiniCssExtractPlugin.loader
    }
    return{
        entry: path.join(__dirname, 'src', 'app.js'),
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'index.[contenthash].js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                },
                {
                    test: /\.css|\.pcss$/,
                    use: [
                        style,
                        'css-loader',
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.svg$/,
                    type: 'asset/resource',
                    generator: {
                        filename: path.join('icons', '[name].[contenthash][ext]'),
                    },
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        optimization: {
            minimizer: [
                new TerserPlugin(),
                new CssMinimizerPlugin()
            ],
            minimize: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src/pages', 'index.pug'),
                filename: 'index.html',
            }),
            new FileManagerPlugin({
                events: {
                    onStart: {
                        delete: ['build'],
                    },
                },
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
            new StyleLintPlugin({
                files: [path.resolve(__dirname, 'src/styles/*.{css,scss,pcss}')]
            }),
            new ESLintPlugin({
                files: [path.resolve(__dirname, 'src/**/*.{js,jsx}')]
            }),

            new CopyWebpackPlugin({
                patterns:[
                    {
                        from:path.resolve(__dirname, 'src/images'),
                        to:path.resolve(__dirname, 'build/images'),
                        noErrorOnMissing: true,
                    }
                ]
            })

        ],
        devServer: {
            watchFiles: path.join(__dirname, 'src'),
            port: 9000,
            open: true
        },
    }
};