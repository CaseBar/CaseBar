var User = require('../models/user.js');
var Post = require('../models/post.js');
var Response = require('../models/response.js');


function initLoginState(req, res){
    if (req.session.login == null)
        var login = false;
    else
        var login = true;

    var username = req.session.username;
    var context = {
        username: username,
        login: login,
    }
    return context;
}

exports.loginGet = function(req, res){
    context = initLoginState(req, res);
    res.render('login', context);
};

exports.loginPost = function(req, res){
    username = req.body.username;
    password = req.body.password;
    User.find(function(err, user){
        user = user.map(function(User){
            if (username == User.username && password == User.password) {
                req.session.username = username;
                req.session.login = 'login';
            }
        });
        if (req.session.login == null) {
            var login = false;
            res.redirect(303, 'landingpage');
        }
        else {
            var login = true;
            res.redirect(303, 'landingpage');
        }
    });
};

exports.signupGet = function(req, res){
    context = initLoginState(req, res);
    res.render('landingpage', context);
};
exports.signupPost = function(req, res){
    User.update(
        { username: req.body.username },
        { realname: req.body.realname,
            password: req.body.password,
            birthday: req.body.birthday,
            email: req.body.email
        },
        { upsert: true },
        function(err){
            if (err){
                console.error(err.stack);
                return res.redirect(303, 'landingpage');
            }
            if(User.username!=null){
                req.session.username = req.body.username;
                req.session.login = 'login';
            }
            return res.redirect(303, 'landingpage');
        }
        );
};

exports.logout = function(req, res){
    delete req.session.username;
    delete req.session.login;
    delete req.session.postId;
    delete req.session.ownername;
    res.redirect(303, 'landingpage');
};

exports.logout_l = function(req, res){
    delete req.session.username;
    delete req.session.login;
    delete req.session.postId;
    delete req.session.ownername;
    res.redirect(303, 'surfReview');
};