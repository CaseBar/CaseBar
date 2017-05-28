var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
	postdate: Date,
	posttitle: String,
	postcontent: String,
	postowner: String,
	posttype: String,
	postagree: { type: Number, default: 0 },
	postdisagree: { type: Number, default: 0 }
});
var Post = mongoose.model('Post', postSchema);
module.exports = Post;
