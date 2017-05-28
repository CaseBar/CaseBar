var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	realname: String,
	username: String,
	password: String,
	birthday: Date,
	email: String,
});
var User = mongoose.model('User', userSchema);
module.exports = User;