var mongoose = require('mongoose');
var {ObjectId} = mongoose.Schema.Types;
var meetingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    meetingwith:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    createdBy:{
        type:ObjectId,
        ref:"User"
    }
});

var Meeting = mongoose.model("Meeting",meetingSchema);
module.exports = Meeting;