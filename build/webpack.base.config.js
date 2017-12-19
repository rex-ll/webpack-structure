const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PostcssConfigPath = './postcss.config.js';
const directories = require('./directories.config');


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//判断是开发环境还是生产环境
const baseUrl = directories.publicPath;
module.exports = {
    entry: {
        app: directories.srcPath + 'main.js',
        vendors: [directories.srcPath + 'vendors.js'],
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')]
        },
            {
                test: /\.ejs$/,
                exclude: /node_modules/,
                use: ['ejs-loader']
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader'},
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: PostcssConfigPath
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {loader: 'less-loader'},
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: PostcssConfigPath
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: baseUrl + 'img/[name].[ext]?v=[hash:5]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: baseUrl + 'media/[name].[ext]?v=[hash:5]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: baseUrl + 'fonts/[name].[ext]?v=[hash:5]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ejs'],
        alias: {
            '@': resolve('src/' + directories.projectName)
        }
    }
    
}
