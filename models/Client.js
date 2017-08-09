var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var clientSchema = mongoose.Schema({
  emailAddress: String,
  firstName: String,
  lastName: String,
  contactNumber: String ,
  dateCreated: {type: Date, default: Date.now},
  gender: String,
  address: String,
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: "loan"}]
});

clientSchema.plugin(deepPopulate /* more on options below */);
module.exports = mongoose.model("Client", clientSchema);
