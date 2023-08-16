const express = require('express');
const bcrypt = require('bcryptjs')
const router = express.Router();
const logger = require('logger');
const Authenticate = require('../middleware/authenticate')
console.log("hello1");
// require('../../Db/Conn')
require('../Db/Conn')
// const User = require('../../UserSchema')
const User = require('../UserSchema')

router.get('/',(req,res)=>{
    res.send("mf");
})

router.post('/register' ,async (req,res)=>{
    const {name , email  , work ,car,location, phone , password , cpassword} = req.body;
   console.log(req.body);
    if(!name || !email|| !work || !phone || !password || !cpassword || !car || !location ){
       return res.status(422).json({message:"fill all the fields"});
    }
    if(password != cpassword){
        
        return res.json({message:"password should be same"});

    }

    try {
        const findone = await User.findOne({email : email});
        if(findone){
           return  res.json({message:"ALREADY REGISTRED"});

        }
        else{
            const user = new User ({name , email  , work ,car, phone ,location, password , cpassword});
            
                
                const status = await user.save();

                if(status){
                    console.log("user registered")
                    res.json({message:"user registered"})
                }
             
            else{
                res.json({message:"falied to register"})
                
            }
            
        }
    } catch (error) {
        console.log("error falied")
        res.json({message:"failed twice "})
    }


   

    // without async 
    // User.findOne({email : email}).then ((userexist)=>{
    //     if(userexist){
    //         return res.json({message:"gaandmara"});
    //     }
    //     const user = new User ({name , email  , work , phone , password , cpassword});
    //     user.save().then(()=>{
    //         res.json({message:"user registered"})
    //     }).catch((err)=>{
    //         res.json({message:"falied to register"})
    //         console.log(err);
    //     })
        
    // }).catch((err)=>{
    //     console.log("error falied")
    //     // res.json({message:"failed twice "})
    // })

   
    
})


router.get('/signin ' ,(req,res)=>{
    res.send("mf");
})
router.post('/signin' , async (req,res)=>{
    try {
        const {email , password} = req.body;

        if(!email || !password ){
            return res.status(400).json({error:"fill all credential"});
        }
    
        const search = await User.findOne({email : email});

        
        
        if(search){
            const matchornot = await bcrypt.compare(password,search.password);

            const token = await search.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() +25892000000)
            , maxAge: 1000 * 60 * 10, httpOnly: false ,sameSite: "none",domain: "api-08sb.onrender.com",secure: true});
            
            

            
            if(matchornot){
                return res.json({message:"singed successfully"});
            }
            else{
                return res.status(400).json({message:"invalid creditiinal"})
            }
        }
        else{
            return res.status(400).json({message:"invalid creditional"})
        }
    } catch (error) {
        res.status(400).send({message:"invalid credential"});
    }
   
    
})

router.get('/about',Authenticate,(req,res)=>{
    
    console.log("kke");
    res.send(req.userdata);
})

router.get('/getdata',Authenticate,(req,res)=>{
    
    console.log("kke");
    res.send(req.userdata);
})
router.post('/contact',Authenticate,async(req,res)=>{
    
   try {
    const {name , email , phone , message} = req.body;
    if(!name || !email || !phone || !message){
        return res.json("please fill all the details");

    }
    else{
        const usercontact = await User.findOne({_id:req.userid });
        if(usercontact){
            const usermessage = await  usercontact.addmessage(name , email , phone , message);
            
            await usercontact.save();
            res.status(201).json("message sussecccessfully sent");

        }
    }
   } catch (error) {
    console.log(error);
   }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('jwtoken',{path:'/', httpOnly: false ,sameSite: "none",domain: "api-08sb.onrender.com",secure: true});
    res.status(200).json("logoud succesful");
})
router.get('/buyerslist',async (req,res)=>{
    try {
        const latestUsers = await User.find().sort({ date: -1 }).limit(10);
        res.json(latestUsers);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
})

module.exports = router;
