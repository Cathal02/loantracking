var express = require("express"),
 router = express.Router(),
 Loan = require("../models/loan");

router.get("/new", IsLoggedIn, function(req, res){
  res.render("clients/new");
});

router.post("/",IsLoggedIn, function(req, res){
   var client = req.body.client;
   Client.create(client, function(err, client){
     if(err) {
       console.log(err);
     } else{
       User.findByIdAndUpdate(req.user._id,{$push: {"clients": client}}, function(err, user){
         if(err){
           console.log(err);
           console.log(user);
         } else{
           res.redirect("/");
         }
       });

     }
   });
});

router.get("/:id/loans/new", IsLoggedIn, function(req, res) {
  res.render("new", {id: req.params.id});
});

router.post("/:id/loans", IsLoggedIn, function(req, res) {
  var loan = req.body.loan;
  Loan.create(loan, function(err, loan){
    if(err){
        console.log(err);
    } else{
        Client.findById(req.params.id, function(err, client){
        if(err){
          console.log(err);
        } else{
          client.loans.push(loan);
          client.save();
          res.redirect("/");
        }
      });
    }
  });
});

function IsLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    res.redirect("/login");
  }
}


module.exports = router;
