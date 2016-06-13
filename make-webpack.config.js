/*
* @Author: dmyang
* @Date:   2015-08-02 14:16:41
* @Last Modified by:   dmyang
* @Last Modified time: 2016-05-23 09:41:32
*/

'use strict';

let path = require('path')
let fs = require('fs')

let webpack = require('webpack')
let _ = require('lodash')
let glob = require('glob')

let ExtractTextPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')

let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

let srcDir = path.resolve(process.cwd(), 'app')
let assets = path.resolve(process.cwd(), 'assets')
let nodeModPath = path.resolve(__dirname, './node_modules')
let pathMap = require('./src/pathmap.json')

let entries = (() => {
    let jsDir = path.resolve(srcDir, 'js')
    let entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    let map = {}

    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })

    return map
}())
let chunks = Object.keys(entries)

module.exports = (options) => {
    options = options || {}

    let debug = options.debug !== undefined ? options.debug : true
    // 这里publicPath要使用绝对路径，不然scss/css最终生成的css图片引用路径是错误的，应该是scss-loader的bug
    let publicPath = '/'
    let extractCSS
    let cssLoader
    let sassLoader

    // generate entry html files
    // 自动生成入口文件，入口js名必须和入口文件名相同
    // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
    let plugins = () => {
        let entryHtml = glob.sync(srcDir + '/*.html')
        let r = []

        entryHtml.forEach((filePath) => {
            let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            let conf = {
                template: 'html!' + filePath,
                filename: filename + '.html'
            }

            if(filename in entries) {
                conf.inject = 'body'
                conf.chunks = ['vender', 'common', filename]
            }

            if(/b|c/.test(filename)) conf.chunks.splice(2, 0, 'common-b-c')

            r.push(new HtmlWebpackPlugin(conf))
        })

        return r
    }()

    // 没有真正引用也会加载到runtime，如果没安装这些模块会导致报错，有点坑
    /*plugins.push(
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            _: 'lodash', 按需引用
            $: 'jquery'
        })
    )*/

    if(debug) {
        extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]')
        cssLoader = extractCSS.extract(['css'])
        sassLoader = extractCSS.extract(['css', 'sass'])
        plugins.push(extractCSS, new webpack.HotModuleReplacementPlugin())
    } else {
        extractCSS = new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        })
        cssLoader = extractCSS.extract(['css?minimize'])
        sassLoader = extractCSS.extract(['css?minimize', 'sass'])

        plugins.push(
            extractCSS,
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            }),
            // new AssetsPlugin({
            //     filename: path.resolve(assets, 'source-map.json')
            // }),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
        )

        plugins.push(new UglifyJsPlugin())
    }

    let config = {
        entry: Object.assign(entries, {
            // 用到什么公共lib（例如React.js），就把它加进vender去，目的是将公用库单独提取打包
            'vender': ['zepto']
        }),

        output: {
            path: assets,
            filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },

        resolve: {
            root: [srcDir, nodeModPath],
            alias: pathMap,
            extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg']
        },

        module: {
            loaders: [
                {
                    test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                    loaders: [
                        // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                        // 否则则调用file-loader，参数直接传入
                        'url?limit=10000&name=img/[hash:8].[name].[ext]',
                        'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                    ]
                },
                {
                    test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                    loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
                },
                {test: /\.(tpl|ejs)$/, loader: 'ejs'},
                {test: /\.css$/, loader: cssLoader},
                {test: /\.scss$/, loader: sassLoader},
                {test: /\.jsx?$/, loader: 'babel?presets[]=react,presets[]=es2015'}
            ]
        },

        plugins: [
            new CommonsChunkPlugin({
                name: 'common-b-c',
                chunks: ['b', 'c']
            }),
            new CommonsChunkPlugin({
                name: 'common',
                chunks: ['common-b-c', 'a']
            }),
            new CommonsChunkPlugin({
                name: 'vender',
                chunks: ['common']
            })
        ].concat(plugins),

        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    }

    if (debug) {
        // 为实现webpack-hot-middleware做相关配置
        // @see https://github.com/glenjamin/webpack-hot-middleware
        ((entry) => {
            for (let key of Object.keys(entry)) {
                if (! Array.isArray(entry[key])) {
                    entry[key] = Array.of(entry[key])
                }
                entry[key].push('webpack-hot-middleware/client?reload=true')
            }
        })(config.entry)

        config.plugins.push( new webpack.HotModuleReplacementPlugin() )
        config.plugins.push( new webpack.NoErrorsPlugin() )
    }

    return config
}
