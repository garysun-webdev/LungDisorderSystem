var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Record = require("./models/record"),
    Patient = require("./models/patient"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    cookieParser = require("cookie-parser"),
    Notification     = require("./models/notification"),
    apn = require("apn")
    
    
var patientRoutes = require("./routes/patients");
var notificationRoutes = require("./routes/notifications");
var indexRoutes = require("./routes/index");
var recordRoutes = require("./routes/records");

mongoose.connect("mongodb://localhost/patient_home");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(cookieParser('secret'));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "To see the world and to love it!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//comming from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(patientRoutes);
app.use(recordRoutes);
app.use(notificationRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Doctor Server Has Started!");
});





