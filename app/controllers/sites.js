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

exports.index = function(req, res){
    //context = initLoginState(req, res);
    res.render('landingpage', initLoginState(req, res));
};

exports.aboutUs = function(req, res){
    //context = initLoginState(req, res);
    res.render('aboutUs', initLoginState(req, res));
};

exports.rule = function(req, res){
    //context = initLoginState(req, res);
    res.render('rule', initLoginState(req, res));
};

exports.surfReviewGet = function(req, res){

    // if (req.session.login == null)
    //     var login = false;
    // else
    //     var login = true;

    // var username = req.session.username;
    // var context = {
    //     username: username,
    //     login: login,
    // }

    function promise(req, res){
        return new Promise(function(resolve, reject){
                resolve();
        });
    }

    promise(req, res)
    .then(function(){
        User.find(function(err, users){
            signupContext = {
                users: users.map(function(User){
                    return {
                        user: User.username,
                    }
                })
            };
            });
    })

    .then(function(){
        var defaultPost = true;
        if (req.session.postId != null)
            defaultPost = false;

        Post.find({ }, function(err, posts){
            var context = {
                user: signupContext.users,
                defaultPost: defaultPost,
                //login: login,
                username: req.session.username,
                posts: posts.map(function(Post){
                    return {
                        posttitle: Post.posttitle,
                        postcontent: Post.postcontent,
                        postagree: Post.postagree,
                        postdisagree: Post.postdisagree,
                        postneutral: Post.postneutral,
                        postresponsenum: Post.postresponsenum,
                        postowner: Post.postowner,
                        posttype: Post.posttype,
                        poststar: Post.poststar,
                        _id: Post._id,
                    }
                })
            };
            res.render('surfReview', context);
        }).sort({postdate: -1});
    });
};

exports.surfReviewPost = function(req, res){
    if (req.body.postId != null) {
        req.session.postId = req.body.postId;
        res.redirect(303, '/reviewDetail');
    }
};
