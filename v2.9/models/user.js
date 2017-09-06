var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchedma = new mongoose.Schema({
    username: String,
    password: String,
});

UserSchedma.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchedma);
