var express = require("express");
var router = express.Router();
var Patient = require("../models/patient");
var middleware = require("../middleware");
var Record = require("../models/record");
var nodemailer=require("nodemailer");
var notification = require("../models/notification");
var multer = require("multer");

var storage =   multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage : storage}).single('image');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/patients", middleware.isLoggedIn, function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      
      Patient.find({"name": regex, "doctor.username":req.user.username}, function(err, allPatients){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allPatients);
         }
      });
  } else {
      
      Patient.find({"doctor.username":req.user.username}, function(err, allPatients){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allPatients);
            } else {
              res.render("patients/index",{patients: allPatients, page: 'patients'});
            }
         }
      });
  }
});



//CREATE - add new patient to DB.
router.post("/patients", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    upload(req, res, function(err) {
        var name = req.body.name;
     if(typeof req.file !== "undefined") {
            var image = '/uploads/' + req.file.filename;
        } else {
            var image = '/uploads/no-image.png';
        }
    var gender = req.body.gender;
    var age = req.body.age;
    var description = req.body.description;
    var email = req.body.email;
    var doctor = {
        id: req.user._id,
        username: req.user.username
    }
    
    var newPatient = {email:email, name: name, gender: gender, age: age, image: image, description: description, doctor: doctor};
    
    //Create a new patient and save to DB.
    Patient.create(newPatient, function(err, newlyCreated){
       if(err) {
           console.log(err);
       } else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'eaglesun1010@gmail.com',
                    pass: 'tq08qzo5bp9lm0i+_'
                    }
                });
                
            let mailOptions = {
                from: '"MovingLung 👩️" <eaglesun1010@gmail.com>', // sender address
                to: email, // list of receivers
                subject: 'Authentication Number', // Subject line
                text: 'Hello world ?', // plain text body
                html: '<h2>Hi '+name+':</h2><p>Welcome to use MovingLung!</p><p>Now you can download our mobile app to reach your daily activity target and interact with your doctor.</p><p><strong>For iOS</strong>: https://itunes.apple.com/us/app/nike-run-club/id387771637?mt=8</p><p><strong>For Android</strong>: https://play.google.com/store/apps/details?id=com.nike.plusgps&hl=en</p><h3>Please use your own Activation Code to use the app:</h3><h3>'+newlyCreated._id+'</h3>' // html body
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
           
           req.flash("success", "Done! Activation Code has been sent to patient's mailbox.");
           //redirect back to campgrounds page
           res.redirect("/patients");
       }
    });

    });
    
});

router.post("/patients/:id/token", function(req,res){
   Patient.findByIdAndUpdate(req.params.id, {deviceToken:req.body.deviceToken}, function(err, updatedPatient){
      if(err){
          console.log(err);
      } else {
          res.send("Success");
      }
   });
});

//NEW - show from to create new patient
router.get("/patients/new", middleware.isLoggedIn, function(req, res){
   res.render("patients/new"); 
});


//SHOW - show more info about a patient.
router.get("/patients/:id", middleware.checkCampgroundOwnership, function(req, res){
    Patient.findById(req.params.id).populate("notifications").exec(function(err, foundPatient){
        
        var index;
        var period;
        var currentRecords=[];
        var average31=0;
        var average81=0;
        var average71=0;
        var average61=0;
        var average51=0;
        var average41=0;
        var averagef31=0;
        var averagef81=0;
        var averagef71=0;
        var averagef61=0;
        var averagef51=0;
        var averagef41=0;
        var averagef31=0;
        var gooddays=0;
        var baddays=0;
        
        
        if(err){
            console.log(err);
            res.send({patient:{}});
            
        } else {
            //find current records
            Record.find({'patientid':req.params.id},function(err,foundRecords){
                if(err){
                    console.log(err);
                    res.send({patient:{}});
                }
                else{
                    
                    foundRecords.sort(function(a,b){
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return c-d;
                    });
                    
                    foundRecords.forEach(function(foundRecord){
                       if(foundRecord.distance>=foundRecord.target){
                           gooddays++;
                       } else {
                           baddays++;
                       }
                    });
                    
                    for (index = foundRecords.length-1; index>=0 ; index--){
                        if(foundRecords[index].isStart == true){
                        period = foundRecords[index].period;
                        break;
                        } 
                     }
                    
                    currentRecords = foundRecords.slice(index, index+period+1);
                    
                    Patient.find({age: { $gt: 41, $lt: 50 }, "gender": "Male"},function(err, patients41) {
                        if(err){
                            console.log(err);
                        } else {
                            patients41.forEach(function(patient41){
                                average41+=patient41.average;
                            });
                            average41=average41/patients41.length;
                            
                            Patient.find({age: { $gt: 51, $lt: 60 }, "gender": "Male"},function(err, patients51) {
                                if(err){
                                    console.log(err);
                                } else {
                                    patients51.forEach(function(patient51){
                                        average51+=patient51.average;
                                    });
                                    average51=average51/patients51.length;
                                    
                                    Patient.find({age: { $gt: 61, $lt: 70 }, "gender": "Male"},function(err, patients61) {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            patients61.forEach(function(patient61){
                                                average61+=patient61.average;
                                            });
                                            average61=average61/patients61.length;
                                    
                                            Patient.find({age: { $gt: 71, $lt: 80 }, "gender": "Male"},function(err, patients71) {
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    patients71.forEach(function(patient71){
                                                        average71+=patient71.average;
                                                    });
                                                    average71=average71/patients71.length;
                                    
                                                    Patient.find({age: { $gt: 81, $lt: 90 }, "gender": "Male"},function(err, patients81) {
                                                        if(err){
                                                            console.log(err)
                                                        } else {
                                                            patients81.forEach(function(patient81){
                                                                average81+=patient81.average;
                                                            });
                                                            
                                                            average81=average81/patients81.length;
                                                            
                                                            Patient.find({age: { $gt: 31, $lt: 40 }, "gender": "Male"},function(err, patients31) {
                                                                if(err){
                                                                    console.log(err);
                                                                } else {
                                                                    patients31.forEach(function(patient31){
                                                                        average31+=patient31.average;
                                                                    });
                                                            
                                                                    average31=average31/patients31.length;
                                                                    
                                                                    console.log('average31: '+average31);
                                                                    console.log('average41: '+average41);
                                                                    console.log('average51: '+average51);
                                                                    console.log('average61: '+average61);
                                                                    console.log('average71: '+average71);
                                                                    console.log('average81: '+average81);
                                                                    
                                                                    
                                                                    Patient.find({age: { $gt: 41, $lt: 50 }, "gender": "Female"},function(err, patientsf41) {
                        if(err){
                            console.log(err);
                        } else {
                            patientsf41.forEach(function(patientf41){
                                averagef41+=patientf41.average;
                            });
                            averagef41=averagef41/patientsf41.length;
                            
                            Patient.find({age: { $gt: 51, $lt: 60 }, "gender": "Female"},function(err, patientsf51) {
                                if(err){
                                    console.log(err);
                                } else {
                                    patientsf51.forEach(function(patientf51){
                                        averagef51+=patientf51.average;
                                    });
                                    averagef51=averagef51/patientsf51.length;
                                    
                                    Patient.find({age: { $gt: 61, $lt: 70 }, "gender": "Female"},function(err, patientsf61) {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            patientsf61.forEach(function(patientf61){
                                                averagef61+=patientf61.average;
                                            });
                                            averagef61=averagef61/patientsf61.length;
                                    
                                            Patient.find({age: { $gt: 71, $lt: 80 }, "gender": "Female"},function(err, patientsf71) {
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    patientsf71.forEach(function(patientf71){
                                                        averagef71+=patientf71.average;
                                                    });
                                                    averagef71=averagef71/patientsf71.length;
                                    
                                                    Patient.find({age: { $gt: 81, $lt: 90 }, "gender": "Female"},function(err, patientsf81) {
                                                        if(err){
                                                            console.log(err)
                                                        } else {
                                                            patientsf81.forEach(function(patientf81){
                                                                averagef81+=patientf81.average;
                                                            });
                                                            
                                                            averagef81=averagef81/patientsf81.length;
                                                            
                                                            Patient.find({age: { $gt: 31, $lt: 40 }, "gender": "Female"},function(err, patientsf31) {
                                                                if(err){
                                                                    console.log(err);
                                                                } else {
                                                                    patientsf31.forEach(function(patientf31){
                                                                        averagef31+=patientf31.average;
                                                                    });
                                                            
                                                                    averagef31=averagef31/patientsf31.length;
                                                                    
                                                                    console.log('faverage31: '+averagef31);
                                                                    console.log('faverage41: '+averagef41);
                                                                    console.log('faverage51: '+averagef51);
                                                                    console.log('faverage61: '+averagef61);
                                                                    console.log('faverage71: '+averagef71);
                                                                    console.log('faverage81: '+averagef81);
                                                                    
                                                                    
                                                                    
                                                                    res.render("patients/show", {patient: foundPatient, currentUser:req.user, currentRecords: currentRecords, average31:average31,average41:average41,average51:average51,average61:average61,average71:average71,average81:average81, averagef31:averagef31,averagef41:averagef41,averagef51:averagef51,averagef61:averagef61,averagef71:averagef71,averagef81:averagef81,gooddays:gooddays,baddays:baddays});
                                                                                                                                        
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                                
                            })
                        }
                    })
                                                                    
                                                                    
                                                                    
                                                                                                                                        
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                                
                            })
                        }
                    })
                    
                    
                    
                        
                    }
                  });
        }
    });
});



//Edit patient route
router.get("/patients/:id/edit", function(req, res) {
   Patient.findById(req.params.id, function(err, foundPatient) {
       if(err){
           res.redirect("/patients");
       } else {
           res.render("patients/edit", {patient: foundPatient});        
       }
         
   });
   
});

//

router.put("/patients/:id", middleware.checkCampgroundOwnership, function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.send("Error uploading file.");
        }
        if(req.body.removeImage) {
            req.body.patient.image = '/uploads/no-image.png';
        }
        else if(req.file) {
            req.body.patient.image = '/uploads/' + req.file.filename;
        }
        //find and update the correct campground
        Patient.findByIdAndUpdate(req.params.id, req.body.patient, function(err, updatedPatient){
            if(err){
                res.redirect("/patients");
            } else {
                res.redirect("/patients/" + req.params.id);
            }
        });
    });
});


//For app use

//SHOW - show more info about a patient.
router.get("/patients/app/:id/", function(req, res){
    Patient.findById(req.params.id).populate("notifications").exec(function(err, foundPatient){
        
        var index;
        var period;
        var currentRecords=[];
        
        if(err){
            console.log(err);
            res.send({patient:"Failure"});
        } else {
            //find current records
            Record.find({'patientid':req.params.id},function(err,foundRecords){
                if(err){
                    console.log(err);
                    res.send({patient:"Failure"});
                }
                else{
                    
                    foundRecords.sort(function(a,b){
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return c-d;
                    });
                    
                    for (index = foundRecords.length-1; index>=0 ; index--){
                        if(foundRecords[index].isStart == true){
                        period = foundRecords[index].period;
                        break;
                        } 
                     }
                    
                    currentRecords = foundRecords.slice(index, index+period+1);
                    console.log("index: "+index);
                    console.log("period:"+period);
                    
                     console.log(currentRecords);
                    //render show template with that patient
                        res.send({patient: foundPatient, currentUser:req.user, currentRecords: currentRecords});
                        
                        }
                    });
        }
    });
});





module.exports = router;
