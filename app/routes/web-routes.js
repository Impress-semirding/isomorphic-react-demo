var React = require('React'),
    ReactDOMServer = require('react-dom/server'),
    browserify = require('browserify'),
    literalify = require('literalify'),
	ReactApp = React.createFactory(require('../../dist/index.js').default),
	TagsOnProductsMobileFactory = React.createFactory(require('../../dist/index.js').default);

var data = require('./../data/data.json');

module.exports = function(app) {

	app.get('/', function(req, res){
		// React.renderToString takes your component
    // and generates the markup
		var reactHtml = ReactDOMServer.renderToString(TagsOnProductsMobileFactory({data:data}));
    // Output html rendered by react
		// console.log(myAppHtml);
    res.render('index.ejs', {reactOutput: reactHtml});
	});

	app.get('/main.js',function(req, res){
		res.setHeader('Content-Type', 'text/javascript')

    // Here we invoke browserify to package up browser.js and everything it requires.
    // DON'T do it on the fly like this in production - it's very costly -
    // either compile the bundle ahead of time, or use some smarter middleware
    // (eg browserify-middleware).
    // We also use literalify to transform our `require` statements for React
    // so that it uses the global variable (from the CDN JS file) instead of
    // bundling it up with everything else
	    browserify()
	      .add('./app/components/staticRender.js')
	      .transform(literalify.configure({
	        'react': 'window.React',
	        'react-dom': 'window.ReactDOM',
	      }))
	      .bundle()
	      .pipe(res)
	})

};
