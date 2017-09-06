var mongoose = require("mongoose");
var Patient = require("./models/patient");
var Record  = require("./models/record");

var data = [
    {
        name: "Jim Green", 
        gender: "Male", 
        age: "47", 
        image: "https://www.endocrineweb.com/sites/default/files/imagecache/gallery-large/wysiwyg_imageupload/48/2015/06/05/asian_patient_hospital38642503_m.jpg",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like be"
    },
    {
        name: "Linda Spencer", 
        gender: "Female", 
        age: "27", 
        image: "https://cdn.shutterstock.com/shutterstock/videos/7006255/thumb/1.jpg?i10c=img.resize(height:160)",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quae"
    },
    {
        name: "Jane Slatter", 
        gender: "Female", 
        age: "63", 
        image: "http://cdn2.drprem.com/medical-tourism/wp-content/uploads/sites/8/2014/08/lady-doctor-and-old-patient.jpg",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like be"
    }
]





function seedDB() {
    Patient.remove({}, function(err) { 
      if(err){
          console.log(err);
      }
      console.log('collection removed') 
      data.forEach(function(seed){
       Patient.create(seed, function(err, patient){
           if(err){
               console.log(err);
           } else{
               console.log("added a patient");
               Record.create(
                   {
                       name: "Jim Green",
                       date: Date.now(),
                       distance: 5,
                       speed: 12,
                       ascent: 200
                       
                   }, function(err, record){
                       if(err){
                           console.log(err);
                       } else {
                           patient.records.push(record);
                           patient.save();
                           console.log("Created new record");
                       }
                   }
                   )
           }
        }) 
        });
    
    });
    
    
};

module.exports = seedDB;




// var data = [
//     {
//         name: "Cloud's Rest", 
//         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         description: "blah blah blah"
//     },
//     {
//         name: "Desert Mesa", 
//         image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
//         description: "blah blah blah"
//     },
//     {
//         name: "Canyon Floor", 
//         image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//         description: "blah blah blah"
//     }
// ]

// function seedDB(){
//   //Remove all campgrounds
//   Campground.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed campgrounds!");
//          //add a few campgrounds
//         data.forEach(function(seed){
//             Campground.create(seed, function(err, campground){
//                 if(err){
//                     console.log(err)
//                 } else {
//                     console.log("added a campground");
//                     //create a comment
//                     Comment.create(
//                         {
                            
//                 }
//             });
//         });
//     }); 
//     //add a few comments
// }

// module.exports = seedDB;
