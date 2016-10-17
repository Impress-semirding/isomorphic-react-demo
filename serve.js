// server.js
var express = require('express'),
path = require('path'),
app = express(),
port = 4444,
bodyParser = require('body-parser');

const webpack = require('webpack');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require("./webpack.config.js");
// Make sure to include the JSX transpiler
// require('node-jsx').install();

const compiler = webpack(webpackConfig);

if (process.env.NODE_ENV === 'production') {
  compiler.run(function(err, stats) {
    if(err) throw new Error("webpack", err);
    console.log("[webpack]", stats.toString({
      colors: true
    }));
  });
  //app.use(varConfig.publicPath, Express.static(varConfig.assetsPath));
} else {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    //colors: true,
    publicPath: '/'
  }));
  app.use(webpackHotMiddleware(compiler));
}

// Include static assets. Not advised for production
app.use(express.static(path.join(__dirname, 'dist')));
// Set view path
app.set('views', path.join(__dirname, 'views'));
// set up ejs for templating. You can use whatever
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
