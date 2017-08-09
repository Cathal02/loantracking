var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require("passport");

router.get("/", function(req, res){
  res.redirect("/loans");
})
router.post("/login", passport.authenticate("local", {
  successRedirect: "/loans",
  failureRedirect: "/login"
}), function(req, res){});

router.get("/register", function(req, res){
  res.render("register");
});


router.post("/register", function(req, res){
  var newUser = new User({
    username: req.body.username,
    firstname: req.body.firstName,
    lastname: req.body.lastName
  });
  User.register(newUser, req.body.password, function(err, User){
    if(err){
      console.log(err);
      return res.render("register");
    } else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/loans");
      });
    }
  });
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/loans");
});
function IsLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    res.redirect("/login");
  }
}

var calcRepaid = function(loan){
  var tally = 0;
  if(!loan) return;
  loan.forEach(function(loan){
    console.log("For Each 2");
    tally += loan.amountRepaid;
  });
  return tally;
}


module.exports = router;
