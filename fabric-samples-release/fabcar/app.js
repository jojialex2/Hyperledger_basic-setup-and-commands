require('rootpath')();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config.json');
const fileUpload = require('express-fileupload');

var app = express();
app.enable('trust proxy');
// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(/(?!^\/updateDocument$)/,bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views-modules')));
app.use('/template', express.static(path.join(__dirname, 'views_templates')));
app.use('/lib', express.static(path.join(__dirname, 'node_modules')));

app.use('/', require('./srv-controllers/n.index'));
app.use('/order', require('./srv-controllers/n.order.controller'));
app.use('/freight', require('./srv-controllers/n.freight.controller'));
app.use('/insurer', require('./srv-controllers/n.insurer.controller'));
app.use('/carrier', require('./srv-controllers/n.carrier.controller'));
app.use('/shipping', require('./srv-controllers/n.shipping.controller'));


// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});