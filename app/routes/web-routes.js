var React = require('React'),
    ReactDOMServer = require('react-dom/server'),
    browserify = require('browserify'),
    literalify = require('literalify'),
	ReactApp = React.createFactory(require('../../dist/index.js').default),
	TagsOnProductsMobileFactory = React.createFactory(require('../../dist/index.js').default);

var data = require('./../data/data.json'),
	_data = require('./../data/data2.json');

module.exports = function(app) {

	app.get('/', function(req, res){
		var reactHtml = ReactDOMServer.renderToString(TagsOnProductsMobileFactory({data:data}));
    	res.render('index.ejs', {reactOutput: reactHtml});
	});

	app.get('/loader-more',function(req,res){
		res.end(JSON.stringify(_data));
	})

	app.get('/main.js',function(req, res){
		res.setHeader('Content-Type', 'text/javascript')
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
