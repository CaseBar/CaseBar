var User = require('../models/user.js');
var Post = require('../models/post.js');
var Response = require('../models/response.js');


exports.reviewDetailGet = function(req, res){
    if (req.session.login == null)
        var login = false;
    else
        var login = true;

    var username = req.session.username;
    console.log(username);
    var context = {
        username: username,
        login: login,
    }

    User.find(function(err, users){
        signupContext = {
            users: users.map(function(User){
                return {
                    user: User.username,
                }
            })
        };
    });
    setTimeout(function() {
        console.log("222")
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
    }, 2000 );

    setTimeout(function() {
    //留言
    Response.find({ responsePost: req.session.postId }, function(err,responses){
        console.log("111")
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
}, 2500 );
//預設文章
var defaultPost = true;
    //點選文章
    if (req.session.postId != null)
        defaultPost = false;
    //所有文章


    setTimeout(function() {
        console.log( "c" )

        var context = {
            //user: signupContext.users,
            thisPost: thisPost.posts,
            responses: responseContext.responses,
            defaultPost: defaultPost,
            login: login,
            username: req.session.username,
        };
        res.render('reviewDetail', context);
    }, 3000 );

};

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
                        for (var i = User.agreeposts.length - 1; i >= 0; i--) {
                            if (User.agreeposts[i] == req.session.postId) {

                                console.log(req.session.postId);
                                console.log(User.agreeposts[i]);
                                console.log("has");
                                state = 1;
                            }
                        }
                        for (var i = User.disagreeposts.length - 1; i >= 0; i--) {
                            if (User.disagreeposts[i] == req.session.postId) {

                                console.log(req.session.postId);
                                console.log("hasdis");
                                state = 2;
                            }
                        }
                        for (var i = User.neutralposts.length - 1; i >= 0; i--) {
                            if (User.neutralposts[i] == req.session.postId) {

                                console.log(req.session.postId);
                                console.log("hasnnnn");
                                state = 3;
                            }
                        }
                    }
                }
                //console.log("aaaa");
            });
            //console.log("bbbb");

        })
    }, 500 );

    setTimeout(function() {

        console.log("-------");
        console.log(state);
        if(state==1){

            User.update({ username: req.session.username},
                { "$pull": { "agreeposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else if(state==2){
            User.update({ username: req.session.username},
                { "$push": { "agreeposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
            User.update({ username: req.session.username},
                { "$pull": { "disagreeposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else if(state==3){
            User.update({ username: req.session.username},
                { "$push": { "agreeposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
            User.update({ username: req.session.username},
                { "$pull": { "neutralposts": req.session.postId } },
                {multi: true},  
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }
        else{
            User.update({ username: req.session.username},
                { "$push": { "agreeposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
        }




    }, 1000 );

    setTimeout(function() {


////////////////////////
if(state==1){

    Post.update({_id: req.session.postId},
        { $inc : { postagree : -1 }},
        { upsert: true },
        function(err,Post){
            if (err){
                console.error(err.stack);
                return res.redirect(303, '/reviewDetail');
            }
        }

        );

}

else if(state==2){
    Post.update({_id: req.session.postId},
        { $inc : { postagree : 1 }},
        { upsert: true },
        function(err,Post){
            if (err){
                console.error(err.stack);
                return res.redirect(303, '/reviewDetail');
            }
                //res.redirect(303, '/reviewDetail');
            }

            );
    Post.update({_id: req.session.postId},
        { $inc : { postdisagree : -1 }},
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

else if(state==3){
    Post.update({_id: req.session.postId},
        { $inc : { postagree : 1 }},
        { upsert: true },
        function(err,Post){
            if (err){
                console.error(err.stack);
                return res.redirect(303, '/reviewDetail');
            }
                //res.redirect(303, '/reviewDetail');
            }

            );
    Post.update({_id: req.session.postId},
        { $inc : { postneutral : -1 }},
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
else{

    Post.update({_id: req.session.postId},
        { $inc : { postagree : 1 }},
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



/////////////////////



}, 1500 );

    return res.redirect(303, '/reviewDetail');

}

//文章不同意+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
else if (req.body.postDisagree != null) {
    var state= 0;
    setTimeout(function() {

        User.find(function(err, user){
            user = user.map(function(User){
                if(req.session.username == User.username){

                    if(User.disagreeposts!=null){
                        for (var i = User.agreeposts.length - 1; i >= 0; i--) {
                            if (User.agreeposts[i] == req.session.postId) {

                                console.log(req.session.postId);
                                console.log(User.agreeposts[i]);
                                console.log("has");
                                state = 1;
                            }
                        }
                        for (var i = User.disagreeposts.length - 1; i >= 0; i--) {
                            if (User.disagreeposts[i] == req.session.postId) {

                                console.log(req.session.postId);
                                console.log("hasdis");
                                state = 2;
                            }
                        }
                        for (var i = User.neutralposts.length - 1; i >= 0; i--) {
                            if (User.neutralposts[i] == req.session.postId) {

                                console.log(req.session.postId);
                                console.log("hasnnnn");
                                state = 3;
                            }
                        }
                    }
                }

            });
        })
    }, 500 );

    setTimeout(function() {
        


        console.log("-------");
        console.log(state);
        if(state==1){

            User.update({ username: req.session.username},
                { "$pull": { "agreeposts": req.session.postId } },
                {multi: true},  
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
            User.update({ username: req.session.username},
                { "$push": { "disagreeposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else if(state==2){

            User.update({ username: req.session.username},
                { "$pull": { "disagreeposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else if(state==3){
            User.update({ username: req.session.username},
                { "$push": { "disagreeposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
            User.update({ username: req.session.username},
                { "$pull": { "neutralposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }


        else{


            User.update({ username: req.session.username},
                { "$push": { "disagreeposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                //res.redirect(303, '/reviewDetail');
            });
        }



    }, 1000 );

    setTimeout(function() {
        



        if(state==1){

            Post.update({_id: req.session.postId},
                { $inc : { postagree : -1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                }

                );

            Post.update({_id: req.session.postId},
                { $inc : { postdisagree : 1 }},
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

        else if(state==2){
            Post.update({_id: req.session.postId},
                { $inc : { postdisagree : -1 }},
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

        else if(state==3){
            Post.update({_id: req.session.postId},
                { $inc : { postdisagree : 1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                }

                );
            Post.update({_id: req.session.postId},
                { $inc : { postneutral : -1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                }

                );

        }


        else{
            Post.update({_id: req.session.postId},
                { $inc : { postdisagree : 1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                //res.redirect(303, '/reviewDetail');
            });
        }

    }, 1500 );

    return res.redirect(303, '/reviewDetail');

}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

                                console.log(req.session.postId);
                                console.log(User.agreeposts[i]);
                                console.log("has");
                                state = 1;
                            }
                        }
                        for (var i = User.disagreeposts.length - 1; i >= 0; i--) {
                            if (User.disagreeposts[i] == req.session.postId) {
                                console.log(req.session.postId);
                                console.log("hasdis");
                                state = 2;
                            }
                        }

                        for (var i = User.neutralposts.length - 1; i >= 0; i--) {
                            if (User.neutralposts[i] == req.session.postId) {
                                console.log(req.session.postId);
                                console.log("hasnnnn");
                                state = 3;
                            }
                        }

                    }
                }
            });


        });
    }, 500 );

    setTimeout(function() {


        console.log("-------");
        console.log(state);
        if(state==1){

            User.update({ username: req.session.username},
                { "$pull": { "agreeposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
            User.update({ username: req.session.username},
                { "$push": { "neutralposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else if(state==2){

            User.update({ username: req.session.username},
                { "$pull": { "disagreeposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });
            User.update({ username: req.session.username},
                { "$push": { "neutralposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else if(state==3){
            User.update({ username: req.session.username},
                { "$pull": { "neutralposts": req.session.postId } },
                {multi: true}, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                });

        }

        else {

            User.update({ username: req.session.username},
                { "$push": { "neutralposts": req.session.postId } },
                { new: true, upsert: true }, 
                function(err,User){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                //res.redirect(303, '/reviewDetail');
            });

        }
        



        
    }, 1000 );





    setTimeout(function() {

        if(state==1){

            Post.update({_id: req.session.postId},
                { $inc : { postagree : -1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                }

                );

            Post.update({_id: req.session.postId},
                { $inc : { postneutral : 1 }},
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

        else if(state==2){
            Post.update({_id: req.session.postId},
                { $inc : { postdisagree : -1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                //res.redirect(303, '/reviewDetail');
            }

            );
            Post.update({_id: req.session.postId},
                { $inc : { postneutral : 1 }},
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

        else if(state==3){
            Post.update({_id: req.session.postId},
                { $inc : { postneutral : -1 }},
                { upsert: true },
                function(err,Post){
                    if (err){
                        console.error(err.stack);
                        return res.redirect(303, '/reviewDetail');
                    }
                }

                );

        }


        else{
            Post.update({_id: req.session.postId},
                { $inc : { postneutral : 1 }},
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
    }, 1500 );

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


////////
exports.reviseReviewGet = function(req, res){
    if (req.session.login == null)
        var login = false;
    else
        var login = true;
    Post.find({ _id: req.session.postId }, function(err, posts){
        var thisPost = {
            login: login,
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
    if (req.session.login == null)
        var login = false;
    else
        var login = true;
    var context = {
        login: login,
        username: req.session.username,
    };
    res.render('reviewPost', context);
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