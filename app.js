// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');

var productAPI = require('./routes/api/productapi');
var firmAPI = require('./routes/api/firmapi');
var purchaseAPI = require('./routes/api/purchaseapi');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));
app.use('/fontawesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/angular-resource', express.static(__dirname + '/node_modules/angular-resource'));
app.use('/ngTable', express.static(__dirname + '/node_modules/ng-table'));
app.use('/angular-ui-bootstrap', express.static(__dirname + '/node_modules/angular-ui-bootstrap'));
app.use('/ui-select', express.static(__dirname + '/node_modules/ui-select/dist'));
app.use('/angular-sanitize', express.static(__dirname + '/node_modules/angular-sanitize'));

//app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard mahaveershop',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

routes.post('/login', passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/login'
}));

routes.get('/home', function (req, res) {
    if (!req.user) return res.redirect(301, '/login');
    res.render('home', {user: req.user});
});

routes.get('/user', function (req, res) {
    if (!req.user) return res.redirect(301, '/login');
    res.render('home', {user: req.user});
});

app.use('/', routes);
app.use('/api/product', productAPI);
app.use('/api/firm', firmAPI);
app.use('/api/purchase', purchaseAPI);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/supershop');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.redirect(301, '/login');
        return;
    }
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
