const express = require("express"),
  app = express();
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  Loan = require("./models/loan");
//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
  extended: true
}));




mongoose.connect("mongodb://localhost/loansapp");

app.get("/", function(req, res) {
  res.redirect("/loans");
})

app.get("/loans", function(req, res) {

  Loan.find({}, function(err, loans){
    if(err){
      console.log(err);
    } else{
        var amountRepaid = calcRepaid(loans);
        res.render("index", {loans: loans, amountRepaid: amountRepaid});
    }
  })

});
app.get("/loans/new", function(req, res) {
  res.render("new");
});


app.get("/loans/:id", function(req, res){
    Loan.findById(req.params.id, function(err, loan){
      if(err){
        console.log(err);
        res.redirect("/loans");
      } else{
        res.render("settings", {loan: loan})
      }
    })

});

app.post("/loans", function(req, res) {
  var loan = req.body.loan;
  Loan.create(loan, function(err, loan){
    if(err){
        console.log(err);
    } else{
      res.redirect("/loans");
    }
  })
});

app.delete("/loans/:id/remove", function(req, res){
    Loan.findByIdAndRemove(req.params.id, function(err) {
      if(err){
        console.log(err);
      } else{
        res.redirect("/loans");
      }
    });
})


app.listen(3000, function() {
  console.log("Server started")
});

var calcRepaid = function(loan){
  var tally = 0;
  loan.forEach(function(loan){
    tally += loan.amountRepaid;
  });
  return tally;
}
