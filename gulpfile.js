// var config = require("./webpack.config.js");
// var gulp = require('gulp');
// var webpack = require('webpack');
// var webpackDevServer = require("webpack-dev-server");
// var compiler = webpack(config);


// gulp.task("default",function(){
// 	var server = new webpackDevServer(compiler, {
// 	  hot: true
// 	});
// 	server.listen(8080);
// });	

var gulp = require('gulp');

gulp.task("default",function(){
	var webpack = require('webpack');
	var WebpackDevServer = require('webpack-dev-server');
	var config = require('./webpack.config.js');
	new WebpackDevServer(webpack(config), {
	  path: './assest',
	  publicPath: "http://127.0.0.1:9090/static",
	  hot: true,
	  noInfo: false,
	  historyApiFallback: true
	}).listen(9090, '127.0.0.1', function (err, result) {
	  if (err) {
	    console.log(err);
	  }
	  console.log('Listening at localhost:9090');
	});
})