var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var helpers = require('./hbshelpers/helpers');
var session = require('express-session');
var passport = require('passport');
var passportConfig = require('./config/passport')(passport);
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);


var MongoClient = require('mongodb').MongoClient;


var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();
// ,
//     mailer = require('express-mailer');

var email_user = process.env.MINECTC_EMAIL_USER;
var email_pword = process.env.MINECTC_EMAIL_PWORD;


// mailer.extend(app, {
//     from: 'minectc@gmail.com',
//     host: 'smtp.gmail.com', // hostname
//     secureConnection: true, // use SSL
//     port: 465, // port for secure SMTP
//     transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
//     auth: {
//         user: email_user,
//         pass: email_pword
//     }
// });

var db_url = process.env.MONGO_URL;
db_url = db_url.replace('{user}', process.env.MONGO_MINECTC_USER);
db_url = db_url.replace('{pword}', process.env.MONGO_MINECTC_PW);
db_url = db_url.replace('{db}', process.env.MONGO_MINECTC_DB);

// console.log(db_url);

var local = true;

mongoose.connect(db_url, {useMongoClient: true})
    .then( () => {console.log("Connected to MongoDB")})
.catch( (err) => { console.log("Error connecting to MongoDB", err); });
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// register partials folders
hbs.registerPartials(__dirname + '/views/emails');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/partials/admin_views');
hbs.registerPartials(__dirname + '/views/partials/home_views');
hbs.registerPartials(__dirname + '/views/partials/user_views');
hbs.registerPartials(__dirname + '/views/partials/modals');
hbs.registerHelper(helpers);

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// changes the name of the session store depending on if app is running on heroku or locally
if (local) {
    var store = new MongoDBStore({uri: db_url, collection: 'sessions'}, function (err) {
        if (err) {
            console.log('Error, can\'t connect to store session local')
        }
    });
} else {
    var store = new MongoDBStore({uri: db_url, collection: 'sessions-minectc'}, function (err) {
        if (err) {
            console.log('Error, can\'t connect to store session remote')
        }
    });
}


// sets configs for session
app.use(session({
    secret: 'cWrqJPd2CBv8oKtYiMGWpEiKuqD2AfzHkDEH8MTwYU',
    resave: true,
    saveUninitialized: true,
    store: store
}));


// registers passport
app.use(passport.initialize());
app.use(passport.session());

// registers flash
app.use(flash());

// registers routes
app.use('/', index);
app.use('/usr', users);
app.use('/admin', admin);

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
    res.render('error');
});

module.exports = app;
