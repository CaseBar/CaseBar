var User = require('../models/user.js');
var Post = require('../models/post.js');
var Response = require('../models/response.js');

//TODO AND BUG NEED FIX
exports.reviewDetailGet = function(req, res){

    User.find(function(err, users){
        signupContext = {
            users: users.map(function(User){
                return {
                    user: User.username,
                }
            })
        };
    });

    // function promise(req, res){
    //     return new Promise(function(resolve, reject){
    //             resolve();
    //     });
    // }

    console.log("0701");
    console.log(req.session.postId);

    // promise(req, res)
    // .then(function(){
    setTimeout(function() {
            Post.find({ _id: req.session.postId }, function(err, posts){
                thisPost = {
                    posts: posts.map(function(Post){
                        return {
                            thisPosttitle: Post.posttitle,
                            thisPostcontent: Post.postcontent,
                            thisPostowner: Post.postowner,
                            thisPostagree:Post.postagree,
                            thisPostdisagree:Post.postdisagree,
                            thisPostresponsenum: Post.postresponsenum,
                            thisPosttype:Post.posttype,
                            thisPoststar:Post.poststar,
                            thisPostneutral: Post.postneutral
                        }
                    })
                };
            });
            // console.log(thisPost.posts);
        // })

        // .then(function(){
            Response.find({ responsePost: req.session.postId }, function(err,responses){
                responseContext = {
                    responses: responses.map(function(Response){
                        if (Response.responseWriter != req.session.username) {
                            return {
                                response: Response.response,
                                responseTime: Response.responseDate,
                                responseWriter: Response.responseWriter,
                                responseWriterIsUser: false,
                                _id: Response._id,
                            }
                        }
                        else {
                            return {
                                response: Response.response,
                                responseTime: Response.responseDate,
                                responseWriter: Response.responseWriter,
                                responseWriterIsUser: true,
                                _id: Response._id,
                            }
                        }
                    })
                };
            });
            console.log("070122");
    }, 2000 );
        // })

        // .then(function(){
    setTimeout(function() {
            console.log("070133");
            // var defaultPost = true;
            // if (req.session.postId != null)
            //     defaultPost = false;
            console.log(req.session.postId);
            // console.log(thisPost.posts);
            var context = {
                user: signupContext.users,
                thisPost: thisPost.posts,
                responses: responseContext.responses,
                //defaultPost: defaultPost,
                username: req.session.username,
            };
            res.render('reviewDetail', context);
    }, 2500 );
        // })
        // .catch(function(){
        //     console.log("Something went wrong!");
        // })
};


// TODO 看能怎樣改寫

// 使用者 同意、不同意、圍觀 意見變動
function deleteUserAdvice(req, res, type){
    User.update({ username: req.session.username},
        { "$pull": { [type]: req.session.postId } },
        { multi : true }, 
        function(err,User){
            if (err){
            console.error(err.stack);
            return res.redirect(303, '/reviewDetail');
        }
    });
}

function addUserAdvice(req, res, type){
    User.update({ username: req.session.username},
        { "$push": { [type]: req.session.postId } },
        { new: true, upsert: true }, 
        function(err,User){
            if (err){
                console.error(err.stack);
                return res.redirect(303, '/reviewDetail');
        }
    });
}

// 文章 同意、不同意、圍觀 意見數量變動
function changePostAdviceNum(req, res, type, num){
    Post.update({_id: req.session.postId},
        { $inc : { [type] : num }},
        { upsert: true },
        function(err,Post){
            if (err){
                console.error(err.stack);
                return res.redirect(303, '/reviewDetail');
            }
            //res.redirect(303, '/reviewDetail');
        }
    );
}

exports.reviewDetailPost = function(req, res){

    var state = 0;
    // 1 2 3

    //文章同意
    if (req.body.postAgree != null) {
        setTimeout(function() {
            User.find(function(err, user){
                user = user.map(function(User){
                    if(req.session.username == User.username){
                        if(User.agreeposts!=null){
                            //另一種寫法，但是版本低ie好像不支援
                            // if ( User.agreeposts.indexOf(req.session.postId) != -1) {
                            //     state = 1;
                            // }
                            for (var i = User.agreeposts.length - 1; i >= 0; i--) {
                                if (User.agreeposts[i] == req.session.postId) {
                                    state = 1;
                                }
                            }
                            for (var i = User.disagreeposts.length - 1; i >= 0; i--) {
                                if (User.disagreeposts[i] == req.session.postId) {
                                    state = 2;
                                }
                            }
                            for (var i = User.neutralposts.length - 1; i >= 0; i--) {
                                if (User.neutralposts[i] == req.session.postId) {
                                    state = 3;
                                }
                            }
                        }
                    }
                });
            })
        }, 500 );

        setTimeout(function() {

            if(state == 1){
                deleteUserAdvice(req, res, "agreeposts");
                changePostAdviceNum(req, res, "postagree", -1);
            } else if(state == 2){
                addUserAdvice(req, res, "agreeposts");
                deleteUserAdvice(req, res, "disagreeposts");
                changePostAdviceNum(req, res, "postagree", 1);
                changePostAdviceNum(req, res, "postdisagree", -1);
            } else if(state == 3){
                addUserAdvice(req, res, "agreeposts");
                deleteUserAdvice(req, res, "neutralposts");
                changePostAdviceNum(req, res, "postagree", 1);
                changePostAdviceNum(req, res, "postneutral", -1);
            } else{
                addUserAdvice(req, res, "agreeposts");
                changePostAdviceNum(req, res, "postagree", 1);
            }

        }, 1000 );

        return res.redirect(303, '/reviewDetail');

    }

    //文章不同意
    else if (req.body.postDisagree != null) {
        var state= 0;
        setTimeout(function() {
            User.find(function(err, user){
                user = user.map(function(User){
                    if(req.session.username == User.username){

                        if(User.disagreeposts!=null){
                            for (var i = User.agreeposts.length - 1; i >= 0; i--) {
                                if (User.agreeposts[i] == req.session.postId) {
                                    state = 1;
                                }
                            }
                            for (var i = User.disagreeposts.length - 1; i >= 0; i--) {
                                if (User.disagreeposts[i] == req.session.postId) {
                                    state = 2;
                                }
                            }
                            for (var i = User.neutralposts.length - 1; i >= 0; i--) {
                                if (User.neutralposts[i] == req.session.postId) {
                                    state = 3;
                                }
                            }
                        }
                    }

                });
            })
        }, 500 );

        setTimeout(function() {
            
            if(state == 1){
                deleteUserAdvice(req, res, "agreeposts");
                addUserAdvice(req, res, "disagreeposts");
                changePostAdviceNum(req, res, "postagree", -1);
                changePostAdviceNum(req, res, "postdisagree", 1);
            } else if(state == 2){
                deleteUserAdvice(req, res, "disagreeposts");
                changePostAdviceNum(req, res, "postdisagree", -1);
            } else if(state == 3){
                deleteUserAdvice(req, res, "neutralposts");
                addUserAdvice(req, res, "disagreeposts");
                changePostAdviceNum(req, res, "postneutral", -1);
                changePostAdviceNum(req, res, "postdisagree", 1);
            } else{
                addUserAdvice(req, res, "disagreeposts");
                changePostAdviceNum(req, res, "postdisagree", 1);
            }

        }, 1000 );

        return res.redirect(303, '/reviewDetail');

    }

    //文章圍觀
    else if (req.body.postNeutral != null) {
        var state=0;
        setTimeout(function() {
            User.find(function(err, user){
                user = user.map(function(User){
                    if(req.session.username == User.username){

                        if(User.neutralposts!=null){

                            for (var i = User.agreeposts.length - 1; i >= 0; i--) {
                                if (User.agreeposts[i] == req.session.postId) {
                                    state = 1;
                                }
                            }
                            for (var i = User.disagreeposts.length - 1; i >= 0; i--) {
                                if (User.disagreeposts[i] == req.session.postId) {
                                    state = 2;
                                }
                            }

                            for (var i = User.neutralposts.length - 1; i >= 0; i--) {
                                if (User.neutralposts[i] == req.session.postId) {
                                    state = 3;
                                }
                            }
                        }
                    }
                });
            });
        }, 500 );

        setTimeout(function() {

            if(state == 1){
                deleteUserAdvice(req, res, "agreeposts");
                addUserAdvice(req, res, "neutralposts");
                changePostAdviceNum(req, res, "postagree", -1);
                changePostAdviceNum(req, res, "postneutral", 1);
            } else if(state == 2){
                deleteUserAdvice(req, res, "disagreeposts");
                addUserAdvice(req, res, "neutralposts");
                changePostAdviceNum(req, res, "postdisagree", -1);
                changePostAdviceNum(req, res, "postneutral", 1);
            } else if(state == 3){
                deleteUserAdvice(req, res, "neutralposts");
                changePostAdviceNum(req, res, "postneutral", -1);
            } else {
                addUserAdvice(req, res, "neutralposts");
                changePostAdviceNum(req, res, "postneutral", 1);
            }
        }, 1000 );

        return res.redirect(303, '/reviewDetail');

    }

    //刪除文章
    else if (req.body.postDelete != null) {
        setTimeout(function() {
            Response.remove({responsePost: req.session.postId},function(err){
                if (err){
                    console.error(err.stack);
                }
            }
            );
        }, 1000 );

        setTimeout(function() {
            Post.remove({_id: req.session.postId},function(err){
                if (err){
                    console.error(err.stack);
                    req.session.postId = null;
                    return res.redirect(303, '/surfReview');
                }
                req.session.postId = null;
                //return res.redirect(303, '/reviewDetail');
            }
            );
        }, 500 );
        return res.redirect(303, '/surfReview');
    }

    //刪除留言
    else if (req.body.responseDelete != null) {
        setTimeout(function() {
            Response.remove(
                {_id: req.body.responseDelete},
                function(err){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                    //return res.redirect(303, '/reviewDetail');
                }
                );
        }, 500 );

        setTimeout(function() {

            Post.update({_id: req.session.postId},
                { $inc : { postresponsenum : -1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                    //res.redirect(303, '/reviewDetail');
                }

                );
        }, 1000 );
        return res.redirect(303, '/reviewDetail');
    }

    //留言
    else if (req.body.response != null) {
        setTimeout(function() {
            Response.update(
                { responseDate: Date.now() },
                { response: req.body.response,
                    responseWriter: req.session.username,
                    responsePost: req.session.postId },
                    { upsert: true },
                    function(err){
                        if (err){
                            console.error(err.stack);
                            return res.redirect(303, '/reviewDetail');
                        }
                        //return res.redirect(303, '/reviewDetail');
                    }
                    );
        }, 500 );

        setTimeout(function() {
            Post.update({_id: req.session.postId},
                { $inc : { postresponsenum : 1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                    //res.redirect(303, '/reviewDetail');
                }

                );
        }, 1000 );
        return res.redirect(303, '/reviewDetail');
    }

    //儲存點選文章
    // else if (req.body.postId != null) {
    //  req.session.postId = req.body.postId;
    //  return res.redirect(303, '/reviewDetail');
    // }

};


exports.reviseReviewGet = function(req, res){

    Post.find({ _id: req.session.postId }, function(err, posts){
        var thisPost = {
            username: req.session.username,
            posts: posts.map(function(Post){
                return {
                    thisPosttitle: Post.posttitle,
                    thisPostcontent: Post.postcontent,
                }
            })
        };
        res.render('reviseReview', thisPost);
    });
};

exports.reviseReviewPost = function(req, res){
    Post.update(
        { _id: req.session.postId },
        { postdate: Date.now(),
            posttitle: req.body.posttitle,
            postcontent: req.body.postcontent },
            { upsert: true },
            function(err){
                if (err){
                    console.error(err.stack);
                    return res.redirect(303, '/reviewDetail');
                }
                return res.redirect(303, '/reviewDetail');
            }
            );
};

exports.reviewPostGet = function(req, res){

    res.render('reviewPost', {username: req.session.username});
};

exports.reviewPostPost = function(req, res){
    Post.update(
        { postdate: Date.now() },
        { posttitle: req.body.posttitle,
            postcontent: req.body.postcontent,
            postagree: 0,
            postdisagree: 0,
            postneutral: 0,
            postresponsenum: 0,
            posttype: req.body.posttype,
            poststar: req.body.starnum,
            postowner:req.session.username},
            { upsert: true },
            function(err){
                if (err){
                    console.error(err.stack);
                    delete req.session.postId;
                    return res.redirect(303, '/surfReview');
                }
                delete req.session.postId;
                return res.redirect(303, '/surfReview');
            }
    );
};

exports.search = function(req, res){

    User.find(function(err, users){
        signupContext = {
            users: users.map(function(User){
                return {
                    user: User.username,
                }
            })
        };
    });

    var defaultPost = true;
    if (req.session.postId != null)
        defaultPost = false;

    var word = req.query.keyword;

    Post.find(
        { $or:[
            {"postcontent": { "$regex": word, "$options": "i" } },
            {"posttitle": { "$regex": word, "$options": "i" } }
            ]
        },
        function(err, posts){
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
                        posttype:Post.posttype,
                        poststar:Post.poststar,
                        _id: Post._id,
                    }
                })
            };
            res.render('surfReview', context);
        }
    );
};
