const express = require("express"),
  app = express();
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  Loan = require("./models/loan"),
  User = require("./models/user"),
  Client = require("./models/client"),
  loanRoutes = require("./routes/loans.js"),
  indexRoutes = require("./routes/index.js"),
  clientRoutes = require("./routes/clients.js");

const deepPopulate = require('mongoose-deep-populate')(mongoose);
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local");

//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Aughnacurra is the cutest best amazing estate",
  resave: false,
  saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

mongoose.connect("mongodb://localhost/loansapp");

app.use(indexRoutes);
app.use("/loans", loanRoutes);
app.use("/clients", clientRoutes);
//PASSPORT LINKS
app.get("/login", function(req, res){
  res.render("login");
});

app.listen(3000, function() {
  console.log("Server started")
});

var calcRepaid = function(loan){
  var tally = 0;
  if(!loan) return;
  loan.forEach(function(loan){
    console.log("For Each 2");
    tally += loan.amountRepaid;
  });
  return tally;
}
