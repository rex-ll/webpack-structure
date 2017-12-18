const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.config');
const directories = require('./directories.config')

const glob = require('glob');


Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})


function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;
    
    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        //console.log( basename );
        entries[basename] = entry;
    });
    return entries;
}


//console.log( getEntry('./src/views/**/*.ejs').map(  ) );


const Entry = getEntry(directories.srcPath + 'views/**/*.js');
const HtmlTpl = getEntry(directories.srcPath + 'views/**/*.ejs');
const htmlConfig = () => {
    let config = [];
    
    for (let attr in HtmlTpl) {
        console.log(attr, '===>', HtmlTpl[attr]);
        config.push(
            new HtmlWebpackPlugin({
                filename: `./${attr}.html`,
                template: `${HtmlTpl[attr]}`,
                chunks: ['vendors', 'app', `${attr}`],
                inject: true
            })
        )
    }
    return config;
}


module.exports = merge(baseWebpackConfig, {
    entry: Entry,
    devtool: '#cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, '../dist/' + directories.distPath),
        filename: 'dev/js/[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new HtmlWebpackPlugin({
        //     filename: './index.html',
        //     template: 'index.ejs',
        //     inject: true
        // }),
        // new HtmlWebpackPlugin({
        //     filename: './about.html',
        //     template: 'about.ejs',
        //     inject: true
        // }),
        new ExtractTextPlugin({
            filename: 'dev/css/[name].css' //  ./css/[name].[contenthash].css
        }),
        new FriendlyErrorsPlugin()
    ].concat(htmlConfig())
    
    
})