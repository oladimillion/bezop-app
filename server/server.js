const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	path = require('path'),
	http = require('http').Server(app);


// loading env variables
require('dotenv').config();

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));




app.use(express.static(path.join(__dirname,  './build')));
app.use(express.static(path.join(__dirname,  './uploads')));
// app.use(express.static(path.join(__dirname + './../template')));

if(process.env.NODE_ENV != "production"){
	const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//load all routes
app.use(require('./routes/index'));

app.set('port', process.env.PORT || 8000);

// connecting to database
require("./models/database");

http.listen(app.get('port'), function (err) {
  if (!err) console.log('server listening on port ', app.get('port'));
  else console.log(err);
});


