var express = require("express");
var router = express.Router();
var Patient = require("../models/patient");
var Record = require("../models/record");
var middleware = require("../middleware");
var moment = require("moment");


router.get("/patients/:id/records/app/:date", function(req, res) {
   Record.find({'patientid':req.params.id, 'dateapp': req.params.date}, function(err, record){
       if(err){
           console.log(err);
       } else{
           res.send({record:record});
           
       }
   });
});


router.post("/patients/:id/records/app/:date", function(req, res) {
   console.log("====================================");
   console.log(req.params.id);
   console.log(req.params.date);
   console.log(req.body);
   var totalDistance=0;
   var averageDistance;
   
   Record.findOne({patientid:req.params.id, dateapp:req.params.date}, function(err, record) {
       if(err){
           res.send("No Session!");
       } else {
           if(record==null){
               res.send("No Session!");
           } else {
           record.distance=req.body.distance;
           req.body.coordinates.forEach(function(point){
              record.coordinates.push(Number(point)); 
           });
           record.save();
           Patient.findByIdAndUpdate(req.params.id,{'lastWalkTime':req.body.lastWalkTime}, function(err, updatedPatient) {
               if(err){
                   console.log(err);
               } else {
                   Record.find({'patientid':req.params.id, 'distance':{$ne:0}},function(err,averageRecords){
                          if(err){
                              console.log(err);
                          } else {
                              
                              console.log("%%%%%%%%%%%%%%%%%");
                              console.log(averageRecords);
                              console.log("%%%%%%%%%%%%%%%%%");
                              averageRecords.forEach(function(valueRecord){
                                  totalDistance=totalDistance+valueRecord.distance;
                              });
                              averageDistance = totalDistance / averageRecords.length;
                              updatedPatient.average=averageDistance;
                              updatedPatient.save();
                              res.send("Success");
                          }
                      });
                      updatedPatient.save();
               }
           });
           }
       }
   })
   
    
});




router.get("/patients/:id/records/new", middleware.isLoggedIn, function(req, res) {
   Patient.findById(req.params.id, function(err, patient){
       if(err){
           console.log(err);
       } else{
           res.render("records/new", {patient:patient});
       }
   })
});


router.post("/patients/:id/records/chart", function(req, res) {
   console.log(req.body.year); 
   console.log(req.body.month);
   if(req.body.month!==""){
       Record.find({'patientid':req.params.id,'year':req.body.year,'month':req.body.month}, function(err, records){
          if(err){
              console.log(err);
          } else {
              records.sort(function(a,b){
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return c-d;
                    });
              res.render("records/chart/month", {records: records});
          }
       });
   } else {
      Record.find({'patientid':req.params.id, 'year':req.body.year}, function(err, records){
          if(err){
              console.log(err);
          } else {
              
              var jan=0, feb=0, mar=0, apr=0, may=0, jun=0, jul=0, aug=0, sep=0 ,oct=0, nov=0, dec=0;
             
              var janT=0, febT=0, marT=0, aprT=0, mayT=0, junT=0, julT=0, augT=0, sepT=0, octT=0, novT=0, decT=0; 
              
              records.forEach(function(record){
                  switch (record.month) {
                      case 1:
                          jan+=record.distance
                          janT+=record.target
                          break;
                      case 2:
                          feb+=record.distance
                          febT+=record.target
                          break;
                      case 3:
                          mar=record.distance
                          marT+=record.target
                          break;
                      case 4:
                          apr+=record.distance
                          aprT+=record.target
                          break;
                      case 5:
                          may+=record.distance
                          mayT+=record.target
                          break;
                      case 6:
                          jun+=record.distance
                          junT+=record.target
                          break;
                      case 7:
                          jul+=record.distance
                          julT+=record.target
                          break;
                      case 8:
                          aug+=record.distance
                          augT+=record.target
                          break;
                      case 9:
                          sep+=record.distance
                          sepT+=record.target
                          break;
                      case 10:
                          oct+=record.distance
                          octT+=record.target
                          break;
                      case 11:
                          nov+=record.distance
                          novT+=record.target
                          break;
                      case 12:
                          dec+=record.distance
                          decT+=record.target
                          break;
                  }
              });
              
              res.render("records/chart/year", {records: records, jan:jan, feb:feb, mar:mar, apr:apr, may:may, jun:jun, jul:jul, aug:aug, sep:sep, oct:oct, nov:nov, dec:dec, janT:janT, febT:febT, marT:marT, aprT:aprT, mayT:mayT, junT:junT, julT:julT, augT:augT, sepT:sepT, octT:octT, novT:novT, decT:decT}
              );
          }
      });
      
        
   }
});


router.post("/patients/:id/records",middleware.isLoggedIn, function(req, res) {

    var date = req.body.date;
    var dateapp = 20+moment(req.body.date).format('YYMMDD');
    var period = req.body.period;
    var target = req.body.target;
    var distance = 0;
    //var distance = Math.floor((Math.random() * 7) + 1);
    var isStart = true;
    var year = moment(req.body.date).format('YYYY');
    var month = moment(req.body.date).format('M');
    var patientid = req.params.id;
    // var year = 0;
    // var month = 0;
    
    var newRecord = {patientid: patientid, year: year, month: month, date: date, dateapp: dateapp, distance:distance, target:target, period: period, isStart:isStart};
    
    for(var i=0;i<period;i++){
        
        
        Patient.findById(req.params.id, function(err, patient){
        if(err){
            console.log(err);
                } else {
                    Record.create(newRecord, function(err,record){
                       if(err){
                           console.log(err);
                       } else {
                           patient.records.push(record);
                           patient.save();
                           
                        }
                        });
                        }       
        
        date = moment(date).add(1,'day');
        month = moment(date).format('M');
        year = moment(date).format('YYYY');
        dateapp = 20+moment(date).format('YYMMDD');
        isStart = false;
        //distance = Math.floor((Math.random() * 7) + 1);
        distance = 0;
        newRecord = {dateapp: dateapp, patientid: patientid, year: year, month: month, date: date, distance:distance, target:target, period: period, isStart:isStart};
        
        
        });
        
    }
    
     Patient.findById(req.params.id, function(err, patient){
        if(err){
            console.log(err);
        } else {
           
            Patient.findByIdAndUpdate(req.params.id, {target:target}, function(err, updatedPatient){
           if(err){
               console.log(err);
           } else {
               Record.find({'patientid':req.params.id, 'distance':{$ne:0}},function(err,averageRecords){
                   var totalDistance=0;
                   var averageDistance;
                          if(err){
                              console.log(err);
                          } else {
                              console.log("%%%%%%%%%%%%%%%%%")
                              console.log(averageRecords)
                              console.log("%%%%%%%%%%%%%%%%%")
                              averageRecords.forEach(function(valueRecord){
                                  totalDistance=totalDistance+valueRecord.distance;
                              });
                              averageDistance = totalDistance / averageRecords.length;
                              updatedPatient.average=averageDistance;
                              updatedPatient.save();
                              
                          }
                      });
               res.redirect("/patients/"+patient._id);
           }
        });
            
        }
    
     });
    
    
});




module.exports = router;
