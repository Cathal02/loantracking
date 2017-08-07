const express = require("express"),
  app = express();
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  Loan = require("./models/loan"),
  User = require("./models/user");

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

app.get("/", function(req, res) {
  res.redirect("/loans");
})

app.get("/loans", IsLoggedIn, function(req, res) {
  User.findById(req.user._id).populate('loans').exec(function(err, user){
    if(err){
      console.log(err);
    } else{
        var amountRepaid = calcRepaid(user.loans);
        res.render("index", {user: user, amountRepaid: amountRepaid});
    }
  });

});
app.get("/loans/new", IsLoggedIn, function(req, res) {
  res.render("new");
});


app.get("/loans/:id", IsLoggedIn, function(req, res){
    Loan.findById(req.params.id, function(err, loan){
      if(err){
        console.log(err);
        res.redirect("/loans");
      } else{
        res.render("settings", {loan: loan})
      }
    })
});

app.post("/loans", IsLoggedIn, function(req, res) {
  var loan = req.body.loan;
  Loan.create(loan, function(err, loan){
    if(err){
        console.log(err);
    } else{
      req.user.loans.push(loan);
      req.user.save();
      res.redirect("/loans");
    }
  })
});


app.post("/loans/:id/add", IsLoggedIn, function(req, res){
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
    })
});

app.delete("/loans/:id/remove", IsLoggedIn,function(req, res){
    Loan.findByIdAndRemove(req.params.id, function(err) {
      if(err){
        console.log(err);
      } else{
        res.redirect("/loans");
      }
    });
});

app.post("/loans/:id/addDays", IsLoggedIn, function(req, res){
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

  app.put("/loans/:id/setDate", function(req, res){
    var updatedLoan = {dateDue: req.body.dateDue}
    Loan.findByIdAndUpdate(req.params.id, updatedLoan, function(err, loan){
      if(err){
        res.redirect("/loans");
      } else{
        res.redirect("/loans/:id");
      }
    })
  })



//PASSPORT LINKS
app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/loans",
  failureRedirect: "/login"
}), function(req, res){})
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
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

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/loans");
});

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

function IsLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    res.redirect("/login");
  }
}
