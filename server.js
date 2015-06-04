var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

// self define js library
var router = require("./server/router.js");

var app = express();

// all environments
app.set('port', process.env.PORT || 18080);
app.set('views', path.join(__dirname, 'jade'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'static/favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

router.register(app);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});