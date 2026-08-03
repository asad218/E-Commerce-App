const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username :{
        required: true,
        type: String,
        
    },
    password :{
        required: true,
        type: String,
        
    },
    email:{
        required:true,
        type:String
    },

      role:{
        type: String,
        enum:['admin','customer'],
        default:'customer'
    }

})


const userModel = new mongoose.model('user',userSchema);

module.exports = userModel;