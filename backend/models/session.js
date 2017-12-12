var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
    course		: String,
    course_id   : String,
    date: { type: Date, default: Date.now },
    questions   : [String],
    answeredQuestions: [String],
    savedQuestions: [String],
    ansUpvotes: [Number],
    savedUpvotes: [Number],
    upvotes     : [Number],
    active      : Boolean,
    session_num : Number
});


module.exports = mongoose.model('Session', sessionSchema);
