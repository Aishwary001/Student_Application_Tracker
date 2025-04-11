const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    company : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },

    isPinned : {
        type : Boolean,
        required : false
    },
    userId : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        default : new Date().getTime()
    },
    applicationLink : {
        type : String,
        default : true
    }
})

module.exports = mongoose.model("Job",jobSchema);