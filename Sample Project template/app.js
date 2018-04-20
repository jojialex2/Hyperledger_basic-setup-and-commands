var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./config.json');
var login = require('./routes/models/login');
var home = require('./routes/models/home');

var sess = 	{ 	
	secret: config.secret, 
	/*genid: function(req) {
		return genuuid() // use UUIDs for session IDs
	},*/
	resave: true, 
	cookie: { secure: false, maxAge: (10*60*1000) }, // 60*1000 (one minute)
	saveUninitialized: true 
}

var app = express();
app.enable('trust proxy');

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sess));

app.use(function(req,res,next){
	if(req.session.user){
		console.log("Extending session expiration time....");
		var hour = 10*60*1000;
		req.session._garbage = Date();
		req.session.touch();
		req.session.cookie.expires = new Date(Date.now() + hour);
		req.session.cookie.maxAge = hour;
	}
	next();
});

app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(path.join(__dirname, 'node_modules')));

if (app.get('env') === 'production') {
	app.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true // serve secure cookies
}

app.use(function (req, res, next) {
	var user = req.session.user;	
	var url = req.originalUrl;
	console.log(url, user);
	url = url.replace(/\//gi, '');
	console.log(url);
	if(user !== undefined || url === '' || url.endsWith('authenticate') || url ==='logout'){ //url.startsWith('masterdata') || url.endsWith('.png')
		next();
	} else {
		console.log('Session time out :'+url);
		if(url !== 'login' && url !== 'home' && url.length>0)
			res.status(401).send('Session time out');
		else if(url === 'login' || url === 'home')
			res.render('session-timeout', {});
		else
			next();	
	}
});

app.use('/api', require('./routes/models/app.controller'));
app.use('/home', home);

app.get('/md-table-progress.html', function(req, res){
	console.log("hits md-table-progress")
	res.sendFile(path.join(__dirname+'/node_modules/angular-material-data-table/src/templates/md-table-progress.html'));
});

app.get('/md-table-pagination.html', function(req, res){
	console.log("hits md-table-pagination")
	res.sendFile(path.join(__dirname+'/node_modules/angular-material-data-table/src/templates/md-table-pagination.html'));
});

app.use('/', login);

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  session.cookie.secure = true // serve secure cookies
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
