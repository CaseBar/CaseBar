var User = require('../models/user.js');
var Post = require('../models/post.js');
var Response = require('../models/response.js');

exports.loginGet = function(req, res){
    res.render('login', {username: req.session.username});
};

exports.loginPost = function(req, res){
    username = req.body.username;
    password = req.body.password;
    User.find(function(err, user){
        user = user.map(function(User){
            if (username == User.username && password == User.password) {
                req.session.username = username;
                res.redirect(303, 'landingpage');
            }
        });
    });
};

exports.signupGet = function(req, res){
    res.render('landingpage', {username: req.session.username});
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
            }
            return res.redirect(303, 'landingpage');
        }
    );
};

exports.logout = function(req, res){
    delete req.session.username;
    delete req.session.postId;
    delete req.session.ownername;
    res.redirect(303, 'landingpage');
};

exports.logout_l = function(req, res){
    delete req.session.username;
    delete req.session.postId;
    delete req.session.ownername;
    res.redirect(303, 'surfReview');
};