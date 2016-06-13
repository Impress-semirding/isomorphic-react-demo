var React = require('React'),
	ReactApp = React.createFactory(require('../../dist/index.js').default),
	TagsOnProductsMobileFactory = React.createFactory(require('../../dist/index.js').default);

var data = require('./../data/data.json');

module.exports = function(app) {

	app.get('/', function(req, res){
		// React.renderToString takes your component
    // and generates the markup
		var reactHtml = React.renderToString(TagsOnProductsMobileFactory({data:data}));
    // Output html rendered by react
		// console.log(myAppHtml);
    res.render('index.ejs', {reactOutput: reactHtml});
	});

};
