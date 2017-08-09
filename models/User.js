const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// CHANGE from 1.x: need to pass in mongoose instance
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client"}]
});
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(deepPopulate /* more on options below */);
module.exports = mongoose.model("User", UserSchema);
