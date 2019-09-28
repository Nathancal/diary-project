var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({

    userName: String,
    passWord: String,
    title: String,
    forename: String,
    surname: String,
    loggedIn: Boolean

});

module.exports = mongoose.model('User', user);