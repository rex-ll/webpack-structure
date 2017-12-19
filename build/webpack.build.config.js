const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require("glob");
const merge = require('webpack-merge');
const directories = require('./directories.config');
const baseWebpackConfig = require('./webpack.base.config');


function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;
    
    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
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
        config.push(
            new HtmlWebpackPlugin({
                filename: `views/${attr}.html`,
                template: `${HtmlTpl[attr]}`,
                inject: true,
                //favicon: path.join(__dirname, '../' + directories.srcPath + 'static/favicon.ico'),
                minify: {
                    removeComments: true, //删除注释
                    collapseWhitespace: false, // 压缩
                    removeAttributeQuotes: false // 去掉路径引号
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                //title:`${attr}`,
                chunksSortMode: 'dependency',
                chunks: ['vendors', 'app', `${attr}`]
            })
        )
    }
    
    return config;
}

module.exports = merge(baseWebpackConfig, {
    entry: Entry,
    output: {
        path: path.resolve(__dirname, '../dist/' + directories.distPath),//项目输出目录
        filename: directories.publicPath + 'js/[name].js?v=[chunkhash:8]', // js/[name].[chunkhash].js
        //publicPath: directories.distPath      //资源路径（配合服务器）
    },
    plugins: [
        new CleanWebpackPlugin(
            ['dist/' + directories.distPath], {
                root: path.resolve(__dirname, '../'), //根目录
                verbose: true, //开启在控制台输出信息
                dry: true　　 //启用删除文件
            }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            comments: false
        }),
        new ExtractTextPlugin({
            filename: directories.publicPath + 'css/[name].css?v=[chunkhash:8]' //  ./css/[name].[contenthash].css
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                discardComments: {removeAll: true}
            }
        }),
        new webpack.BannerPlugin(
            `${ new Date }`
        ),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: directories.publicPath + 'static',
            ignore: ['.*']
        }])
    ].concat(htmlConfig()), //.concat(htmls)
    externals: {
        //'jquery':'window.jQuery'
    }
})
