var express = require('express');
var router = express.Router();
var passport = require('passport');

var Rule = require('../models/rule');
var User = require('../models/user');

/* GET admin listing. */
router.get('/', isAdmin, function(req, res, next) {

    var user = req.user;
    var admin = req.user.info.admin;


    var view = "";
    if (req.session.view) {
        view = req.session.view;
    } else {
        view = "main";
    }

    switch (view) {
        case "main":
            // res.render('admin', {title: 'MineCTC', user: user, mode: 'admin', view: view, admin: admin});
        case "rules":
            Rule.findOne({}, {}, { sort: { 'editDate' : -1 } }, function(err, rules) {

                if (rules) {
                    console.log("rules exist");
                    var rulesText = rules.data.body;
                    console.log("after rulesText Assignment")
                } else {
                    console.log("no rules exist");
                    var rulesText = "no rules have been set";
                }


                if (admin) {
                    res.render('admin', {title: 'MineCTC', user: user, mode: 'admin', view: view, rules: rulesText, admin: admin});
                } else {
                    res.redirect('/');
                }
            });
        case "users":
            User.find({}, function (err, users) {
                if (admin) {

                    console.log(users);

                    res.render('admin', {title: 'MineCTC', user: user, mode: 'admin', view: view, users: users, admin: admin});
                } else {
                    res.redirect('/');
                }
            });
        case "tickets":
        default:

    }




    // if (admin && view === "users") {
    //     res.render('admin', {title: 'MineCTC', user: user, mode: 'admin', view: view, users: rulesText, admin: admin});
    // } else {
    //     res.redirect('/');
    // }


});

router.post('/rules/save', isAdmin, function (req, res, next) {

    var rulesText = req.body.text;
    var newRule = new Rule();

    newRule.data.body = rulesText;
    newRule.editDate = Date.now();
    newRule.save();
    res.redirect('/admin');
});

router.post('/user/save', isAdmin, function (req, res, next) {

    var userForm = req.body;
    var username = userForm.username;

    console.log("userForm:");
    console.log(userForm);

    User.findOne({'local.username': username}, function (err, user) {
        if (err) {
            return done(err);    //database error
        }

        console.log("in findOne")

        user.email = userForm.email;
        user.verified = userForm.verified;
        user.first_name = userForm.first;
        user.last_name = userForm.last;
        user.banned = userForm.banned;

        user.save()
    });

    res.redirect('/admin');
});



router.get('/main', isAdmin, function (req, res, next) {
    req.session.view = "main";
    res.redirect('/admin')
});

router.get('/rules', isAdmin, function (req, res, next) {
    req.session.view = "rules";
    res.redirect('/admin')
});

router.get('/users', isAdmin, function (req, res, next) {
    req.session.view = "users";
    res.redirect('/admin')
});

router.get('/tickets', isAdmin, function (req, res, next) {
    req.session.view = "tickets";
    res.redirect('/admin')
});



/* Middle ware to determine logged in*/
function isAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        next();
    } else {
        res.redirect('/')
    }
}

module.exports = router;
