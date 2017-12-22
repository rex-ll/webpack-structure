const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const happyPack = require('happypack');

const postcssConfig = './postcss.config.js';

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


module.exports = {
    entry: {
        app: './src/main.js',
        vendors: ['./src/vendors.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=babel',
                exclude: /node_modules/,
                include: [resolve('src')]
            },
            {
                test: /\.ejs$/,
                exclude: /node_modules/,
                include: [resolve('src')],
                use: ['ejs-loader']
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'happypack/loader?id=css'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: postcssConfig
                                }
                            }
                        }
                    ],
                    publicPath: '../../'
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'happypack/loader?id=css'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: postcssConfig
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'happypack/loader?id=less'
                        }
                    
                    ],
                    fallback: "style-loader",
                    publicPath: '../../'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/img/[name].[ext]'
                        },
                    },
                    /*对图片进行压缩*/
                    {
                        loader: 'image-webpack-loader'/*,
                        query: {
                            progressive: true,
                            optimizationLevel: 6,
                            interlaced: false,
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        }*/
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/fonts/[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ejs'],
        alias: {
            '@': resolve('src'),
            '@assets': resolve('src/assets'),
            '@components': resolve('src/components')
        }
    },
}