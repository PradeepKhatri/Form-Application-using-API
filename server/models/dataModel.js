const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        // required:["Enter Name"]
    },
    email:{
        type:String,
        // required:["Enter Email"]
    },
    number:{
        type:Number,
        // required:["Enter Number"]
    },
    hobbies:{
        type:Array
    }
})

const User = mongoose.model("UserData", UserSchema);

module.exports = User;

