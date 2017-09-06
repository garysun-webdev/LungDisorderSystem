var mongoose = require("mongoose");

var recordSchema = new mongoose.Schema({
   patientid: String,
   year: Number,
   month: Number,
   date: Date,
   period: {type:Number,default:1},
   isStart: {type: Boolean,default:false},
   target: {type: Number, default:0},
   distance: {type: Number, default:0},
   dateapp: Number,
   coordinates:{type: [Number], default:[]}
   
});

module.exports = mongoose.model("Record", recordSchema);