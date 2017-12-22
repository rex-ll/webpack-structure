const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
const baseWebpackConfig = require('./webpack.base.config.js');

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


const Entry = getEntry('./src/views/**/*.js');
const HtmlTpl = getEntry('./src/views/**/*.ejs');
const htmlConfig = () => {
    let config = [];
    
    for (let attr in HtmlTpl) {
        console.log(attr, '=====>', HtmlTpl[attr]);
        config.push(
            new HtmlWebpackPlugin({
                filename: `./${attr}.html`,
                favicon: path.resolve(__dirname, '../favicon.ico'),
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
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: './static/js/[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verbose: true,
            loaders: ['css-loader?mportLoaders=1&minimize=true&sourceMap=true']
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verbose: true,
            loaders: ['less-loader?sourceMap=true']
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            verbose: true,
            loaders: ['babel-loader?cacheDirectory=true']
        }),
        new ExtractTextPlugin({
            filename: './static/css/[name].css' //  ./css/[name].[contenthash].css
        }),
        new FriendlyErrorsPlugin()
    ].concat(htmlConfig())
    
    
})