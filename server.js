// upload user local preferences if any
try {var env=require('./.noderc');} catch (e) {var env='';}

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var port = env.HTTP || 8080; // set our port
var staticdir = env.MODE === 'prod' ? 'dist.prod' : 'dist.dev'; // get static files dir

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/' + staticdir)); // set the static files location /public/img will be /img for users

// routes ==================================================

require('./devServer/routes')(app); // configure application routes

// rewrite requested URL to include Angular hashPrompt
app.get('/*', function(req, res) {res.redirect('/#!' + req.originalUrl);});

// start app ===============================================
app.listen(port);
console.log('Starting server on port ' + port);
exports = module.exports = app; // expose app