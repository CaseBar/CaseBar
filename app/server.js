
// module dependencies

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');/////

var sites = require('./routes/sites');
var posts = require('./routes/posts');
var user = require('./routes/user');

module.exports = app;

// config

app.set('port', process.env.PORT || 8000);
app.set("view engine", 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
	secret: 'my_session_secret',
	cookie: { maxAge: 24 * 60 * 60 * 1000 } /////
}));

var opts = {
	server: {
		socketOptions: { keepAlive: 1 }/////
	}
};

//database

mongoose.connect('mongodb://demo:12345@ds127101.mlab.com:27101/snademo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Database Connected.");
});

mongoose.Promise = global.Promise;

//routers

app.get('/landingpage', sites.index);
app.get('/aboutUs', sites.aboutUs);
app.get('/rule', sites.rule);
app.get('/surfReview', sites.surfReviewGet);
app.post('/surfReview', sites.surfReviewPost);

app.get('/login', user.loginGet);
app.post('/login', user.loginPost);
app.get('/signup', user.signupGet);
app.post('/signup', user.signupPost);
app.get('/logout', user.logout);
app.get('/logout_l', user.logout_l);

app.get('/reviewDetail', posts.reviewDetailGet);
app.post('/reviewDetail', posts.reviewDetailPost);
app.get('/reviseReview', posts.reviseReviewGet);
app.post('/reviseReview', posts.reviseReviewPost);
app.get('/reviewPost', posts.reviewPostGet);
app.post('/reviewPost', posts.reviewPostPost);









var User = require('./models/user.js');
var Post = require('./models/post.js');
var Response = require('./models/response.js');

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
app.get('/auth/google/callback',
    passport.authenticate('google', {
    	successRedirect : '/googlelogin',
    	failureRedirect : '/landingpage'
    })
);

app.get('/googlelogin', function(req, res,user){
    req.session.login = true;
    req.session.username = req.user.google.name;
	//console.log(req.session.login);
	//console.log(req.session.username);
	res.redirect(303, '/landingpage');
});
app.get('/auth/facebook',
    passport.authenticate('facebook', {session: false, scope : ['email'] })
);
// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
	passport.authenticate('facebook',  { session: false, failureRedirect : '/'}),
	
    // on succes
    function(req,res) {
		res.render('json', {data: JSON.stringify(req.user.access_token)});
    },
    
    function(err,req,res,next) {
        if(err) {
        	res.status(400);
        	res.render('error', {message: err.message});
        }
    }
);

app.get('/facebooklogin', function(req, res,user){
    req.session.login = true;
    req.session.username = req.user.google.name;
    console.log(req.session.login);
    console.log(req.session.username);
    res.redirect(303, '/landingpage');
});



app.get('/search', function (req, res) {


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

//預設文章
var defaultPost = true;
	//點選文章
	if (req.session.postId != null)
		defaultPost = false;

	var word = req.query.keyword;


	Post.find(
		{ $or:[
			{"postcontent": { "$regex": word, "$options": "i" } },
			{"posttitle": { "$regex": word, "$options": "i" } }
			]
		}  ,

		function(err, posts){
			var context = {
				user: signupContext.users,
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
		}

		);

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



