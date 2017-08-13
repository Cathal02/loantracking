var express = require("express");
var router = express.Router();
var Loan = require("../models/loan.js");
var User = require("../models/user.js");


router.get("/", IsLoggedIn, function(req, res) {
  User.findById(req.user._id).populate( { path: "clients", populate: {path: "loans"}}).exec(function(err, user){
    if(err){
      console.log(err);
    } else{
       res.render("index", {clients: user.clients});
    }

    });

  });


router.get("/:id", IsLoggedIn, function(req, res){
    Loan.findById(req.params.id, function(err, loan){
      if(err){
        console.log(err);
        res.redirect("/loans");
      } else{
        res.render("settings", {loan: loan})
      }
    })
});


router.put("/:id/add", IsLoggedIn, function(req, res){
    Loan.findById(req.params.id, function(err, loan){
      if(err){
        console.log(err);
        res.redirect("/loans");
      } else{
        var updatedLoan = loan;
         updatedLoan.dateDue.setDate(loan.dateDue.getDate() + parseInt(req.body.numOfDays));
        Loan.findByIdAndUpdate(req.params.id, updatedLoan, function(req, updatedLoan){
          if(err){
            res.redirect("/loans");
          } else{
            res.redirect("/loans/");
          }
        });
      }
    });
});

router.delete("/:id/remove", IsLoggedIn,function(req, res){
    Loan.findByIdAndRemove(req.params.id, function(err) {
      if(err){
        console.log(err);
      } else{
        res.redirect("/loans");
      }
    });
});

router.put("/:id/addDays", IsLoggedIn, function(req, res){
  Loan.findById(req.params.id, function(err, loan){
    if(err){
      res.redirect("/loans");
    } else {
      var updatedLoan = {amountRepaid: loan.amountRepaid += parseInt(req.body.paymentAmount)}
      Loan.update({_id: req.params.id}, updatedLoan, function(err, loan) {
        if(err){
          res.redirect("/loans");
        } else{
          res.redirect("/loans/" + req.params.id);
        }
      });
    }
    });
  });

  router.put("/:id/setDate", function(req, res){
    var updatedLoan = {dateDue: req.body.dateDue}
    Loan.findByIdAndUpdate(req.params.id, updatedLoan, function(err, loan){
      if(err){
        res.redirect("/loans");
      } else{
        res.redirect("/loans/:id");
      }
    })
  })

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
