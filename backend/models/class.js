var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    course		: String,
    instructor  : [String],
    course_id   : String,
    active      : Boolean,
    sessions    : Number
});


module.exports = mongoose.model('Class', classSchema);
