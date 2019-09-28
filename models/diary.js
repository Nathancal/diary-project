var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var diary = new Schema({
    title:{type: String, default:"New Diary", required: true},

    submissions:[{type: ObjectId, ref:'Submission'}]

});

module.exports = mongoose.model('Diary', diary);