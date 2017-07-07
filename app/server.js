
// module dependencies

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');/////

var sites = require('./controllers/sites');
var posts = require('./controllers/posts');
var user = require('./controllers/user');

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
//app.post('/surfReview', posts.reviewDetailGet);


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
app.get('/search', posts.search);

//TODO SOCIAL MEDIA USER

// var User = require('./models/user.js');
// var Post = require('./models/post.js');
// var Response = require('./models/response.js');

// var passport = require('passport');
// app.use(passport.initialize());
// app.use(passport.session());
// require('./config/passport')(passport);

// app.get('/auth/google', 
// 	passport.authenticate('google', { scope : ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//     passport.authenticate('google', {
//     	successRedirect : '/googlelogin',
//     	failureRedirect : '/landingpage'
//     })
// );

// app.get('/googlelogin', function(req, res,user){
//     req.session.login = true;
//     req.session.username = req.user.google.name;
// 	res.redirect(303, '/landingpage');
// });
// app.get('/auth/facebook',
//     passport.authenticate('facebook', {session: false, scope : ['email'] })
// );

// app.get('/auth/facebook/callback',
// 	passport.authenticate('facebook',  { session: false, failureRedirect : '/'}),
	
//     function(req,res) {
// 		res.render('json', {data: JSON.stringify(req.user.access_token)});
//     },
    
//     function(err,req,res,next) {
//         if(err) {
//         	res.status(400);
//         	res.render('error', {message: err.message});
//         }
//     }
// );

// app.get('/facebooklogin', function(req, res,user){
//     req.session.login = true;
//     req.session.username = req.user.google.name;
//     res.redirect(303, '/landingpage');
// });

//TODO

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
