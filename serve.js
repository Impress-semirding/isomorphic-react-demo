// server.js
var express = require('express'),
path = require('path'),
app = express(),
port = 4444,
bodyParser = require('body-parser');





var webpack = require('webpack');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackDevServer = require('webpack-dev-server');
var config = require("./webpack.config.js");

config.entry.index.unshift("webpack-dev-server/client?http://localhost:9000");  // 将执替换js内联进去
config.entry.index.unshift("webpack/hot/only-dev-server");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
    hot: true,
    historyApiFallback: false,
    // noInfo: true,
    stats: { 
        colors: true  // 用颜色标识
    },
    proxy: {
        "*": "http://localhost:9000" // 用于转发api数据，但webpack自己提供的并不太好用
    },
});
server.listen(9000);

// var webpack = require('webpack');
// var config = require('./webpack.config.js')
// var compiler = require('webpack')(config)
// app.use(require('webpack-dev-middleware')(compiler, {
// noInfo: false,
// hot:true,
// inline: true,
// publicPath: "/static",
// stats: {
//   colors: true
// }
// }))
// app.use(require('webpack-hot-middleware')(compiler));

// Make sure to include the JSX transpiler
// require('node-jsx').install();

// Include static assets. Not advised for production
app.use(express.static(path.join(__dirname, 'dist')));
// Set view path
app.set('views', path.join(__dirname, 'views'));
// set up ejs for templating. You can use whateverß
app.set('view engine', 'ejs');

// Set up Routes for the application
require('./app/routes/web-routes.js')(app);

//Route not found -- Set 404
app.get('*', function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
