var User = require('../models/user.js');
var Post = require('../models/post.js');
var Response = require('../models/response.js');

exports.index = function(req, res){
    res.render('landingpage', {username: req.session.username});
};

exports.aboutUs = function(req, res){
    res.render('aboutUs', {username: req.session.username});
};

exports.rule = function(req, res){
    res.render('rule', {username: req.session.username});
};

exports.surfReviewGet = function(req, res){

    function promise(req, res){
        return new Promise(function(resolve, reject){
            User.find(function(err, users){
                signupContext = {
                    users: users.map(function(User){
                        return {
                            user: User.username,
                        }
                    })
                };
            });
            resolve();
        });
    }

    promise(req, res)
    .then(function(){

        var defaultPost = true;
        if (req.session.postId != null)
            defaultPost = false;

        Post.find({ }, function(err, posts){
            var context = {
                user: signupContext.users,
                defaultPost: defaultPost,
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
