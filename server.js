// Get dependencies
var express = require('express'),
	path = require('path'),
	http = require('http'),
	compression = require('compression');

var app = express()
app.use(compression())

// Serve static assets - Point static path to site
var oneMonth = 86400000 * 30; // 30 days in milliseconds
var assetMaxAge = oneMonth;

var basePath = '/build/';
app.use('/', express.static(path.join(__dirname, basePath), {maxAge: assetMaxAge, redirect: true}));

module.exports = app;

// To serve index.html file
var indexPath = '/index.html';
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, basePath, indexPath));
});

// To serve gzip file
// app.get('*.js', function (req, res, next) {
// 	req.url = req.url + '.gz';
// 	res.set('Content-Encoding', 'gzip');
// 	next();
// });

// Catch all other routes and serve 404 (Page not found) Screen
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, basePath, indexPath));
});

// Get port from environment and store in Express
const port = '8080';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port
server.listen(port, () => console.log(`API running on port:${port}`));
