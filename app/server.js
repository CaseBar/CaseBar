var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 8000);

app.set("view engine", 'ejs');

app.use(require('body-parser')());

var fs = require('fs');

var cookieParser = require('cookie-parser');
app.use(cookieParser('my_cookie_secret'));

var session = require('express-session');
app.use(session({
	secret: 'my_session_secret',
	cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

var mongoose = require('mongoose');
var opts = {
 server: {
 socketOptions: { keepAlive: 1 }
 }
};

mongoose.connect('mongodb://demo:12345@ds127101.mlab.com:27101/snademo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Database Connected.");
});

mongoose.Promise = global.Promise;

var User = require('./models/user.js');
var Post = require('./models/post.js');
var Response = require('./models/response.js');


app.get('/reviseReview', function(req, res){
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
});
app.post('/reviseReview', function(req, res){
	Post.update(
		{ _id: req.session.postId },
		{ postdate: Date.now(),
			posttitle: req.body.posttitle,
			posttext: req.body.posttext },
			{ upsert: true },
			function(err){
				if (err){
					console.error(err.stack);
					return res.redirect(303, '/reviewDetail');
				}
				return res.redirect(303, '/reviewDetail');
			}
			);
});















app.get('/landingpage', function(req, res){
	if (req.session.login == null)
		var login = false;
	else
		var login = true;

	var username = req.session.username;
	var context = {
		username: username,
		login: login,
	}
	var context = {
		login: login,
		username: req.session.username,
	};
	res.render('landingpage', context);

});

app.get('/login', function(req, res){
	if (req.session.login == null)
		var login = false;
	else
		var login = true;
	var username = req.session.username;
	var context = {
		username: username,
		login: login,
	}
	res.render('login', context);
});
app.post('/login', function(req, res){
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
});

app.get('/signup', function(req, res){
	if (req.session.login == null)
	var login = false;
	else
	var login = true;
	var username = req.session.username;
	var context = {
		username: username,
		login: login,
	}
	res.render('landingpage', context);
});
app.post('/signup', function(req, res){
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
});

app.get('/logout_l', function(req, res){
	delete req.session.username;
	delete req.session.login;
	res.redirect(303, 'landingpage');
});

app.get('/logout', function(req, res){
	delete req.session.username;
	delete req.session.login;
	delete req.session.postId;
	delete req.session.ownername;
	res.redirect(303, 'surfReview');
});

app.get('/surfReview', function(req, res){
	if (req.session.login == null)
		var login = false;
	else
		var login = true;

	var username = req.session.username;
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

// if (req.session.postId != null) {
// 	Post.find({ _id: req.session.postId }, function(err, posts){
// 		thisPost = {
// 			posts: posts.map(function(Post){
// 				return {
// 					thisPosttitle: Post.posttitle,
// 					thisPostcontent: Post.postcontent,
// 					thisPostowner: Post.postowner,
// 					thisPostagree:Post.postagree,
// 					thisPostdisagree:Post.postdisagree,
// 					thisPosttype:Post.posttype
// 				}
// 			})
// 		};
// 	});
// 	thisPost: thisPost.posts;
// 	console.log("ttttt")
// }

//預設文章
var defaultPost = true;
	//點選文章
	if (req.session.postId != null)
		defaultPost = false;
	//所有文章
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
					postowner: Post.postowner,
					posttype:Post.posttype,
					_id: Post._id,
				}
			})
		};
		res.render('surfReview', context);
	});
});

app.post('/surfReview', function(req, res){

	if (req.body.postId != null) {
		req.session.postId = req.body.postId;
		return res.redirect(303, '/reviewDetail');
	}

});


app.get('/reviewDetail', function(req, res){
	if (req.session.login == null)
		var login = false;
	else
		var login = true;

	var username = req.session.username;
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
	Post.find({ _id: req.session.postId }, function(err, posts){
		thisPost = {
			posts: posts.map(function(Post){
				return {
					thisPosttitle: Post.posttitle,
					thisPostcontent: Post.postcontent,
					thisPostowner: Post.postowner,
					thisPostagree:Post.postagree,
					thisPostdisagree:Post.postdisagree,
					thisPosttype:Post.posttype
				}
			})
		};
	});
	}, 100 );

	setTimeout(function() {
	//留言
	Response.find({ responsePost: req.session.postId }, function(err,responses){
		console.log("111")
		responseContext = {
			responses: responses.map(function(Response){
				if (Response.responseWriter != req.session.username) {
					return {
						response: Response.response,
						responseWriter: Response.responseWriter,
						responseWriterIsUser: false,
						_id: Response._id,
					}
				}
				else {
					return {
						response: Response.response,
						responseWriter: Response.responseWriter,
						responseWriterIsUser: true,
						_id: Response._id,
					}
				}
			})
		};

	});
	}, 7000 );
//預設文章
	var defaultPost = true;
	//點選文章
	if (req.session.postId != null)
		defaultPost = false;
	//所有文章

	//Post.find({ }, function(err, posts){
	//	console.log("222")
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
	}, 8000 );
	//});
	

});

app.post('/reviewDetail', function(req, res){
	///////////--------------------------------------------

 //var num = req.body.postAgreeNum;
//文章同意
if (req.body.postAgree != null) {

	setTimeout(function() {
		var temp = false;
		var done = false;
		User.find(function(err, user){
			user = user.map(function(User){
				if(req.session.username == User.username){
					console.log(User.username)
					console.log(User.agreeposts)
		//console.log(User.agreeposts[0])
		console.log(User.agreeposts.length)
		if(User.agreeposts!=null){


			for (var i = User.agreeposts.length - 1; i >= 0; i--) {
				if (User.agreeposts[i] == req.session.postId) {
					temp = true;
					console.log(req.session.postId);
					console.log(User.agreeposts[i]);
					console.log("has");
				}
				if(i == 0){
					done = true;
				}
				console.log(done);
				console.log(temp);
				console.log(i);
			}
		}
		}
		console.log("aaaa");
		});
					console.log("bbbb");

				})
			}, 1000 );

	setTimeout(function() {
		
		User.update({ username: req.session.username},
			{ "$push": { "agreeposts": req.session.postId } },
			{ new: true, upsert: true }, 
			function(err,User){
				if (err){
					console.error(err.stack);
					return res.redirect(303, '/reviewDetail');
				}
				return res.redirect(303, '/reviewDetail');
			});
console.log("cccc");
	}, 2000 );

	setTimeout(function() {
		
		Post.update({_id: req.session.postId},
			{ $inc : { postagree : 1 }},
			{ upsert: true },
			function(err,Post){
				if (err){
					console.error(err.stack);
					return res.redirect(303, '/reviewDetail');
				}
				return res.redirect(303, '/reviewDetail');
			}

			);
console.log("dddd");
	}, 3000 );

}

//文章不同意
else if (req.body.postDisagree != null) {
	
	Post.update({_id: req.session.postId},
		{ $inc : { postdisagree : 1 }},
		{ upsert: true },
		function(err,Post){
			if (err){
				console.error(err.stack);
				return res.redirect(303, '/reviewDetail');
			}
			return res.redirect(303, '/reviewDetail');
		}

	);

}

///////////--------------------------------------------

//刪除文章
else if (req.body.postDelete != null) {
	Response.remove({responsePost: req.session.postId},function(err){
			if (err){
				console.error(err.stack);
			}
		}
	);
	Post.remove({_id: req.session.postId},function(err){
			if (err){
				console.error(err.stack);
				req.session.postId = null;
				return res.redirect(303, '/reviewDetail');
			}
			req.session.postId = null;
			return res.redirect(303, '/reviewDetail');
		}
	);
}
//刪除留言
else if (req.body.responseDelete != null) {
	Response.remove(
		{_id: req.body.responseDelete},
		function(err){
			if (err){
				console.error(err.stack);
				return res.redirect(303, '/reviewDetail');
			}
			return res.redirect(303, '/reviewDetail');
		}
	);
}
//留言
else if (req.body.response != null) {
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
			return res.redirect(303, '/reviewDetail');
		}
	);
}

//儲存點選文章
// else if (req.body.postId != null) {
// 	req.session.postId = req.body.postId;
// 	return res.redirect(303, '/reviewDetail');
// }
});

app.get('/reviewPost', function(req, res){
	if (req.session.login == null)
		var login = false;
	else
		var login = true;
	var context = {
		login: login,
		username: req.session.username,
	};
	res.render('reviewPost', context);
});
app.post('/reviewPost', function(req, res){
	Post.update(
		{ postdate: Date.now() },
		{ posttitle: req.body.posttitle,
		  postcontent: req.body.postcontent,
		  postagree: 0,
		  postdisagree: 0,
		  posttype: req.body.posttype,
		  postowner: req.session.ownername },
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
});



//index
// app.get('/', function(req, res){
// 	if (req.session.login == null)
// 		var login = false;
// 	else
// 		var login = true;

// 	var username = req.session.username;
// 	var context = {
// 		username: username,
// 		login: login,
// 	}

// 	User.find(function(err, users){
// 		signupContext = {
// 			users: users.map(function(User){
// 				return {
// 					user: User.username,
// 				}
// 			})
// 		};
// 	});

// 	Post.find({ _id: req.session.postId }, function(err, posts){
// 		thisPost = {
// 			posts: posts.map(function(Post){
// 				return {
// 					thisPosttitle: Post.posttitle,
// 					thisPostcontent: Post.postcontent,
// 					thisPostowner: Post.postowner,
// 					thisPostagree:Post.postagree,
// 					thisPostdisagree:Post.postdisagree
// 				}
// 			})
// 		};
// 	});

// 	//留言
// 	Response.find({ responsePost: req.session.postId }, function(err,responses){
// 		responseContext = {
// 			responses: responses.map(function(Response){
// 			if (Response.responseWriter != req.session.username) {
// 			return {
// 				response: Response.response,
// 				responseWriter: Response.responseWriter,
// 				responseWriterIsUser: false,
// 				_id: Response._id,
// 			}
// 			}
// 			else {
// 				return {
// 				response: Response.response,
// 				responseWriter: Response.responseWriter,
// 				responseWriterIsUser: true,
// 				_id: Response._id,
// 				}
// 			}
// 			})
// 		};
// 	});

// //預設文章
// 	var defaultPost = true;
// 	//點選文章
// 	if (req.session.postId != null)
// 		defaultPost = false;
// 	//所有文章
// 	Post.find({ }, function(err, posts){
// 		var context = {
// 			user: signupContext.users,
// 			thisPost: thisPost.posts,
// 			responses: responseContext.responses,
// 			defaultPost: defaultPost,
// 			login: login,
// 			username: req.session.username,
// 			posts: posts.map(function(Post){
// 				return {
// 					posttitle: Post.posttitle,
// 					postcontent: Post.postcontent,
// 					postagree: Post.postagree,
// 					postdisagree: Post.postdisagree,
// 					postowner: Post.postowner,
// 					_id: Post._id,
// 				}
// 			})
// 		};
// 		res.render('index', context);
// 	});

// });

// //index
// app.post('/', function(req, res){

// ///////////--------------------------------------------

//  //var num = req.body.postAgreeNum;
// //文章同意
// if (req.body.postAgree != null) {
	
// 	Post.update({_id: req.session.postId},
// 		{ $inc : { postagree : 1 }},
// 		{ upsert: true },
// 		function(err,Post){
// 			if (err){
// 				console.error(err.stack);
// 				return res.redirect(303, '/');
// 			}
// 			return res.redirect(303, '/');
// 		}

// 	);

// }

// //文章不同意
// if (req.body.postDisagree != null) {
	
// 	Post.update({_id: req.session.postId},
// 		{ $inc : { postdisagree : 1 }},
// 		{ upsert: true },
// 		function(err,Post){
// 			if (err){
// 				console.error(err.stack);
// 				return res.redirect(303, '/');
// 			}
// 			return res.redirect(303, '/');
// 		}

// 	);

// }

// ///////////--------------------------------------------

// //刪除文章
// else if (req.body.postDelete != null) {
// 	Response.remove({responsePost: req.session.postId},function(err){
// 			if (err){
// 				console.error(err.stack);
// 			}
// 		}
// 	);
// 	Post.remove({_id: req.session.postId},function(err){
// 			if (err){
// 				console.error(err.stack);
// 				req.session.postId = null;
// 				return res.redirect(303, '/');
// 			}
// 			req.session.postId = null;
// 			return res.redirect(303, '/');
// 		}
// 	);
// }
// //刪除留言
// else if (req.body.responseDelete != null) {
// 	Response.remove(
// 		{_id: req.body.responseDelete},
// 		function(err){
// 			if (err){
// 				console.error(err.stack);
// 				return res.redirect(303, '/');
// 			}
// 			return res.redirect(303, '/');
// 		}
// 	);
// }
// //留言
// else if (req.body.response != null) {
// 	Response.update(
// 		{ responseDate: Date.now() },
// 		{ response: req.body.response,
// 		 responseWriter: req.session.username,
// 		 responsePost: req.session.postId },
// 		{ upsert: true },
// 		function(err){
// 			if (err){
// 				console.error(err.stack);
// 				return res.redirect(303, '/');
// 			}
// 			return res.redirect(303, '/');
// 		}
// 	);
// }

// //儲存點選文章
// else if (req.body.postId != null) {
// 	req.session.postId = req.body.postId;
// 	return res.redirect(303, '/');
// }

// });

//signup
// app.get('/signup', function(req, res){
// 	if (req.session.login == null)
// 	var login = false;
// 	else
// 	var login = true;
// 	var username = req.session.username;
// 	var context = {
// 		username: username,
// 		login: login,
// 	}
// 	res.render('signup', context);
// });
// app.post('/signup', function(req, res){
// 	User.update(
// 		{ username: req.body.username },
// 		{ realname: req.body.realname,
// 		  password: req.body.password,
// 		  birthday: req.body.birthday,
// 		  email: req.body.email
// 		},
// 		{ upsert: true },
// 		function(err){
// 			if (err){
// 				console.error(err.stack);
// 				return res.redirect(303, '/');
// 			}
// 			if(User.username!=null){
// 				req.session.username = req.body.username;
// 				req.session.login = 'login';
// 			}
// 			return res.redirect(303, '/');
// 		}
// 	);
// });

//login
// app.get('/login', function(req, res){
// 	if (req.session.login == null)
// 		var login = false;
// 	else
// 		var login = true;
// 	var username = req.session.username;
// 	var context = {
// 		username: username,
// 		login: login,
// 	}
// 	res.render('login', context);
// });
// app.post('/login', function(req, res){
// 	username = req.body.username;
// 	password = req.body.password;
// 	User.find(function(err, user){
// 		user = user.map(function(User){
// 			if (username == User.username && password == User.password) {
// 				req.session.username = username;
// 				req.session.login = 'login';
// 			}
// 		});
// 		if (req.session.login == null) {
// 			var login = false;
// 			res.redirect(303, 'login');
// 		}
// 		else {
// 				var login = true;
// 			res.redirect(303, '/');
// 		}
// 	});
// });

//logout
// app.get('/logout', function(req, res){
// 	delete req.session.username;
// 	delete req.session.login;
// 	delete req.session.postId;
// 	delete req.session.ownername;
// 	res.redirect(303, '/');
// });

//new post
// app.get('/newpost', function(req, res){
// 	if (req.session.login == null)
// 		var login = false;
// 	else
// 		var login = true;
// 	var context = {
// 		login: login,
// 		username: req.session.username,
// 	};
// 	res.render('newpost', context);
// });
// app.post('/newpost', function(req, res){
// 	Post.update(
// 		{ postdate: Date.now() },
// 		{ posttitle: req.body.posttitle,
// 		  postcontent: req.body.postcontent,
// 		  postagree: 0,
// 		  postdisagree: 0,
// 		  postowner: req.session.ownername },
// 		{ upsert: true },
// 		function(err){
// 			if (err){
// 				console.error(err.stack);
// 				delete req.session.postId;
// 				return res.redirect(303, '/');
// 			}
// 			delete req.session.postId;
// 			return res.redirect(303, '/');
// 		}
// 	);
// });

//編輯文章
// app.get('/updatepost', function(req, res){
// 	if (req.session.login == null)
// 		var login = false;
// 	else
// 		var login = true;
// 	Post.find({ _id: req.session.postId }, function(err, posts){
// 		var thisPost = {
// 			login: login,
// 			username: req.session.username,
// 			posts: posts.map(function(Post){
// 				return {
// 					thisPosttitle: Post.posttitle,
// 					thisPostcontent: Post.postcontent,
// 				}
// 			})
// 		};
// 		res.render('updatepost', thisPost);
// 	});
// });
// app.post('/updatepost', function(req, res){
// 	Post.update(
// 		{ _id: req.session.postId },
// 		{ postdate: Date.now(),
// 			posttitle: req.body.posttitle,
// 			posttext: req.body.posttext },
// 			{ upsert: true },
// 			function(err){
// 				if (err){
// 					console.error(err.stack);
// 					return res.redirect(303, '/');
// 				}
// 				return res.redirect(303, '/');
// 			}
// 			);
// });


app.get('/rule', function(req, res){
	res.render('rule', "");
});

app.get('/aboutUs', function(req, res){
	res.render('aboutUs', "");
});

app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log("Server started on", app.get('port'));
});



