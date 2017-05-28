var mongoose = require('mongoose');
var responseSchema = mongoose.Schema({
	responseDate: Date,
	response: String,
	responseOwner: String,
	responseWriter: String,
	responsePost: String,
});
var ResponseSchema = mongoose.model('ResponseSchema', responseSchema);
module.exports = ResponseSchema;