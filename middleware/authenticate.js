const jwt =require ('jsonwebtoken');
const user = require("../UserSchema");


const Authenticate = async (req,res,next)=>{
    console.log(process.env.SECRETKEY);
    console.log(req.cookies.jwtoken);

    try {
        const token = req.cookies.jwtoken;
       
        const verifytoken = jwt.verify(token , process.env.SECRETKEY)
        
        
        const userdata  = await user.findOne({ _id: verifytoken._id , "tokens.token" :token})
        
        if(!userdata){throw new Error ('user not found')}
        
        req.token = token ;
        req.userdata = userdata;
        req.userid = userdata._id;
        next();
    } catch (error) {
        res.status(401).send("unothrized dg");
        console.log(error);
    }
    
}

module.exports = Authenticate;