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
    context = initLoginState(req, res);
    res.render('landingpage', context);
};

exports.aboutUs = function(req, res){
    context = initLoginState(req, res);
    res.render('aboutUs', context);
};

exports.rule = function(req, res){
    context = initLoginState(req, res);
    res.render('rule', context);
};

exports.surfReviewGet = function(req, res){

    context = initLoginState(req, res);

    User.find(function(err, users){
        signupContext = {
            users: users.map(function(User){
                return {
                    user: User.username,
                }
            })
        };
    });

    //預設文章
    var defaultPost = true;
    //點選文章
    if (req.session.postId != null)
        defaultPost = false;
    //所有文章

    setTimeout(function() {
        Post.find({ }, function(err, posts){
            var context = {
                user: signupContext.users,
            //thisPost: thisPost.posts,
            defaultPost: defaultPost,
            login: login,
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
                    posttype:Post.posttype,
                    poststar:Post.poststar,
                    _id: Post._id,
                }
            })

    };
    res.render('surfReview', context);
    }).sort({postdate: -1});
    }, 1500 );

};

exports.surfReviewPost = function(req, res){

    if (req.body.postId != null) {
        req.session.postId = req.body.postId;
        return res.redirect(303, '/reviewDetail');
    }

};