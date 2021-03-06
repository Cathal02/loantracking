var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var LoanSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  contactNumber: Number,
  amountBorrowed: Number,
  length: String,
  address: String,
  dateDue: Date,
  gender: String,
  date: { type: Date, default: Date.now },
  amountRepaid: { type: Number, default: 0},
  loanRepaid: {type: Boolean, default: false}

});

LoanSchema.plugin(deepPopulate /* more on options below */);

module.exports = mongoose.model("loan", LoanSchema);
