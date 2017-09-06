var mongoose = require("mongoose");

var patientSchema = new mongoose.Schema({
   name: String,
   deviceToken: {type: String, default:0},
   average: {type: Number, default:0},
   gender: String,
   age: Number,
   image: String,
   description: String,
   email:String,
   doctor:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
   
   records:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record"
    }
],
    
     notifications: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Notification"
      }
   ],
   
   target:{ type: Number, default: 5 },
   lastWalkTime:{ type: Number, default: 0 }
   
    
});
    

module.exports = mongoose.model("Patient", patientSchema);