var express = require('express');
var router = express.Router();
var passport = require('passport');

var Rule = require('../models/rule');
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {

    var user = req.user;

    if (!req.session.view) {
        var view = "main";
    } else {
        var  view = req.session.view;
    }

    switch (view) {
        case "rules":
            Rule.findOne({}, {}, { sort: { 'editDate' : -1 } }, function(err, rules) {

                if (rules) {
                    console.log("rules exist");
                    var rulesText = rules.data.body;
                } else {
                    console.log("no rules exist");
                    var rulesText = "no rules have been set";
                }


                res.render('index', { title: 'MineCTC', user: user, mode: 'home', view: view, rules: rulesText });
            });
            break;
        default:
            res.render('index', { title: 'MineCTC', user: user, mode: 'home', view: view });
    }
});

// TODO Home
// TODO DynMap
// TODO Downloads
// TODO Rules



// remove i think...
// /* POST to signup page. */
// router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/usr/',
//     failureRedirect: '/signup',
//     failureFlash: true
// }));

// login and out routes
// cannot 'GET' Login so redirect...
router.get('/login', function(req, res, next) {
    res.redirect('/');
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));


router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});


router.get('/main', isLoggedIn, function (req, res, next) {
    req.session.view = "main";
    res.redirect('/')
});

router.get('/rules', isLoggedIn, function (req, res, next) {
    req.session.view = "rules";
    res.redirect('/')
});

router.get('/downloads', isLoggedIn, function (req, res, next) {
    req.session.view = "downloads";
    res.redirect('/')
});

router.get('/map', isLoggedIn, function (req, res, next) {
    req.session.view = "map";
    res.redirect('/')
});



/* Middle ware to determine logged in*/
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        next();
    } else {
        res.redirect('/')
    }
}

/* Middle ware to determine logged in*/
function isAdminIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        next();
    } else {
        res.redirect('/')
    }
}

module.exports = router;
