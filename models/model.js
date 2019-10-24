var mongoose =require('mongoose');
bcrypt = require('bcrypt');
var user = new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },

    email:{
        type:String,
        required:true,
       
    },
    password:{
        type:String,
        required:true
    }
})
user.methods.hashpassword=function(password){
   
 return   bcrypt.hashSync(password, 10);
};

user.methods.validpassword=function(password){
    return bcrypt.comparesync(password,this.password);
};
module.exports=mongoose.model('user',user);
   
    
