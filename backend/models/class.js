var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var classSchema = mongoose.Schema({
    course		: String,
    instructor  : [String]
});

classSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

classSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Class', classSchema);
