var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Rule = require('../models/rule');

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
    var user = req.user.local.username;
    req.session.view = "main";
    res.redirect('/usr/' + user);
});

router.get('/signup', function(req, res, next) {
    // redirect to homepage if 'get' signup
    res.redirect('/');
});

// router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/users',
//     failureRedirect: '/',
//     failureFlash: true
// }));

router.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/usr/' + user.local.username);
        });
    })(req, res, next);
});

router.get('/:username', isLoggedIn, function (req, res, next) {
    // console.log(req.user.local.username);

    var url_user = req.params.username;
    var username = req.user.local.username;

    var admin = req.user.info.admin;
    var user = req.user;
    var view = req.session.view;

    console.log(view);

    switch (view) {
        // case "rules":
        //     Rule.findOne({}, {}, {sort: {'editDate': -1}}, function (err, rules) {
        //
        //         if (rules) {
        //             console.log("rules exist");
        //             var rulesText = rules.data.body;
        //         } else {
        //             console.log("no rules exist");
        //             var rulesText = "no rules have been set";
        //         }
        //
        //         if (admin) {
        //             res.render('users', {
        //                 title: 'MineCTC',
        //                 user: user,
        //                 mode: 'user',
        //                 view: view,
        //                 rules: rulesText,
        //                 admin: admin
        //             });
        //         } else {
        //             res.redirect('/');
        //         }
        //     });
        case "tickets":
            res.render('users', {title: 'MineCTC', user: user, mode: 'user', view: view, admin: admin});
        default:
            res.render('users', { title: 'MineCTC', user: user, mode: 'user', view: view, admin: admin});

    }
});

router.get('/:username/verify/:verify_string', function(req, res, next) {

    var username = req.params.username;
    var verify_string = req.params.verify_string;


    User.findOne({'local.username': username}, function (err, user) {

        if (err) {
            res.redirect('/')
            // return done(err)    //database error
        }

        if (!user) {
            console.log('bad username');
            // return done(null, false, req.flash('verifyMessage', 'Invalid username!'))
            res.redirect('/')
        }

        console.log( ((Date.now() - user.info.emailSent) / 1000 ) / 3600 );

        if ( (((Date.now() - user.info.emailSent) / 1000 ) / 3600) < 24 ) {
            console.log('less than a day');

            if (verify_string === user.info.verify_string) {

                console.log('string matches');

                user.info.verified = true;
                user.info.verify_string = "";

                user.save();

                res.redirect('/usr/' + username)
            } else {

                console.log('string does not match');
                res.redirect('/usr')

            }
        } else {
            console.log('more than a day');
            res.redirect('/usr')
        }

        // return done(null, user);
    });


    res.render('users', { title: 'MineCTC', user: 'asouer', mode: 'user', admin: true });


});


router.post('/:user/rules', isLoggedIn, function(req, res, next) {

    let username = req.user.local.username;
    let route_user = req.params.user;
    let user = req.user;

    if ( route_user === req.user.local.username) {

        User.findOne({'local.username': username}, function (err, user) {

            if (err) {
                res.redirect('/')
                // return done(err)    //database error
            }

            if (!user) {
                console.log('bad username');
                // return done(null, false, req.flash('verifyMessage', 'Invalid username!'))
                res.redirect('/')
            }

            user.info.rules = true;
            user.save();

            res.redirect('/usr');

        });
    } else {
        res.render('/', { title: 'MineCTC', user: user, mode: 'user', admin: user.info.admin });
    }
});


router.get('/main', isLoggedIn, function (req, res, next) {
    req.session.view = "main";
    res.redirect('/usr')
});

router.get('/tickets', isLoggedIn, function (req, res, next) {
    req.session.view = "tickets";
    res.redirect('/usr')
});


/* Middle ware to determine logged in*/
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/')
    }
}

/* Middle ware to determine logged in*/
function isAdminIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/')
    }
}

module.exports = router;
