var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});


//show sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
router.post("/register", function(req, res){
    if(req.body.password!==req.body.cpassword){
        req.flash("Fail", "Please type in the same Password");
        res.redirect("/register");
    } else {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/patients");
        });
    });
    }
});

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});
//login logic
//middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/patients",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome to PatientHome!'
}) ,function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you later!");
    res.redirect("/");
});



module.exports = router;