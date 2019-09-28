
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var submission = new Schema({

    title: String,
    content: String,
    date: String,
    time: String,
    sms: Boolean

});

module.exports = mongoose.model('Submission', submission);