const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  loans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "loan"
  }]
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
