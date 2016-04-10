// config/database.js
var config = {};

config = {
	mongoURI: {
		development: 'mongodb://localhost/articles', // looks like mongodb://<user>:<pass>@localhost:27017/articles
		production: 'mongodb://localhost/articles-production',
		test: 'mongodb://localhost/articles-test'
	},
	port: {
		development: 3000,
		production: 8080,
		test: 3002
	},
	secret: 'atsecretjsonwebtoken'
};

module.exports = config