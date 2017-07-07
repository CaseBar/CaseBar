var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	realname: String,
	username: String,
	password: String,
	birthday: Date,
	email: String,
	google: {
		id: String,
		token: String,
		name: String,
		email: String
	},
	facebook: {
		id: String,
		token: String,
		name: String,
		email: String
	},
	agreeposts:{
		type: Array,
		default: []
	},
	disagreeposts:{
		type: Array,
		default: []
	},
	neutralposts:{
		type: Array,
		default: []
	}
});
var User = mongoose.model('User', userSchema);
module.exports = User;