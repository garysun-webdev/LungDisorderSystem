var express = require("express");
var router  = express.Router({mergeParams: true});
var Patient = require("../models/patient");
var Notification = require("../models/notification");
var middleware = require("../middleware");
var apn = require("apn");

//Comments New
router.get("/patients/:id/notifications/new", middleware.isLoggedIn, function(req, res){
    // find patient by id
    console.log(req.params.id);
    Patient.findById(req.params.id, function(err, patient){
        if(err){
            console.log(err);
        } else {
             res.render("notifications/new", {patient: patient});
        }
    })
});

//Comments Create
router.post("/patients/:id/notifications", function(req, res) {
    var text = req.body.text;
    
    var newNotification = {text: text};
    
    //Create a new patient and save to DB.
    Patient.findById(req.params.id, function(err, patient){
        if(err){
            console.log(err);
        } else {
            //apn feature
            
            const apn = require("apn");

                let tokens = patient.deviceToken;
                
                let service = new apn.Provider({
                  cert: "cert.pem",
                  key: "key.pem",
                });
                
                let note = new apn.Notification({
                	alert:  text,
                });
                
                // The topic is usually the bundle identifier of your application.
                note.topic = "healthcarelung.eresearch.unimelb.edu.au";
                
                console.log(`Sending: ${note.compile()} to ${tokens}`);
                service.send(note, tokens).then( result => {
                    console.log("sent:", result.sent.length);
                    console.log("failed:", result.failed.length);
                    console.log(result.failed);
                });
                
                
                // For one-shot notification tasks you may wish to shutdown the connection
                // after everything is sent, but only call shutdown if you need your 
                // application to terminate.
                service.shutdown();
            //apn ends
            
            Notification.create(newNotification, function(err,notification){
               if(err){
                   console.log(err);
               } else {
                   patient.notifications.push(notification);
                   patient.save();
                   res.redirect("/patients/"+patient._id);
               }
            });
        }
    });
});



module.exports = router;