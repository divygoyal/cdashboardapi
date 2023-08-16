const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens : [
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    date :
        {
            type :Date,
            default:Date.now
        }
        ,
        car:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        messages:[{
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phone:{
                type:Number,
                required:true
            },
            message:{
                type:String,
                required:true
            }
        }]
    
})

userSchema.pre('save' , async function (next){
    console.log("Ss");
    if(this.isModified('password')){
        this.password  = await bcrypt.hash(this.password,12);
        this.cpassword  = await bcrypt.hash(this.cpassword,12);
    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    try {
        console.log(process.env.SECRETKEY);
        let token = jwt.sign({_id:this._id},process.env.SECRETKEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

userSchema.methods.addmessage = async function(name , email , phone , message){
    try {
        this.messages = this.messages.concat({name , email , phone , message});
        console.log(email, name ,phone ,message);
        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error);
    }
}
const User = mongoose.model('USER',userSchema);
module.exports  = User;