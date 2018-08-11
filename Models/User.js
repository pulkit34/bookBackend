var mongoose = require("mongoose")
var Schema=mongoose.Schema
var UserSchema = new Schema({
    userId:{
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    phone:{
        type:String
    }

})
module.exports=mongoose.model("user",UserSchema)