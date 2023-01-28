const jwt =require('jsonwebtoken');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const authenticate=require("../middleware/authenticate");
const cookieparser=require("cookie-parser");
router.use(cookieparser());

require('../middleware/db/Connection')
const User=require('../Model/userSchema');



router.post('/register',async (req,res)=>{

    const{name,email,phone,work,password,cpassword}=req.body;
   
    // res.json({message:req.body});
if(!name || !email || !phone || !work || !password || !cpassword){
 return res.status(422).json({error:"Please filled field properly"});
}

try{

 const  userExit=await User.findOne({email:email})

    if(userExit){
        return res.status(422).json({message:"Email already exit...!!"})
    }
    else if(password != cpassword){
        res.status(422).json({error:"Password are not matching..!!!"})
    }
    else{
        const user=new User({name,email,phone,work,password,cpassword})

     await user.save() 
     res.status(201).json({message:"User registration successifully..!!"})
    
    }

    
    }

catch(err){console.log(err)}
})


//login
router.post('/signin',async (req,res)=>{
    // console.log(req.body);
    // res.json({message:"awesome"})
    try{
        let token;
        const{email,password}=req.body;
        if(!email || !password){
            res.status(400).json({error:"Please filled field properly...!!"})
        }

        const userLogin= await User.findOne({email:email})
        console.log(userLogin);
        
        if(userLogin){
            const isMatch=await bcrypt.compare(password,userLogin.password);
              
             token = await userLogin.generateAuthToken();
            console.log(token)

            res.cookie("jwtoken",token,{
                expires:new Date (Date.now()+25892000000),
                httpOnly:true
            })

            if(!isMatch){
                res.status(400).json({message:"Invalid credentials..!!"})
            }else{
        res.status(200).json({message:"Signin successifully..!!1"})
            }
        }else{
            res.status(400).json({message:"Invalid credentials..!!"})
        }

    }catch(err){
        console.log(err)
    }
})

//about us page

router.get("/about", authenticate, (req,res)=>{
    console.log("Hello about us page");
    res.send(req.rootUser);

})

//contact us page

router.get("/getdata",authenticate,(req,res)=>{
    console.log("Hello about us page");
    res.send(req.rootUser);
})

router.post("/contact", authenticate,async (req,res)=>{
try{
    const{name,email,phone,message}=req.body;

    if(!name || !email || !phone || !message){
        console.log("error in contact form")
        return res.json({error:"Please filled contact form"})
    }

    const userContact= await User.findOne({_id:req.userID})
    if(userContact){
        const userMessage=await userContact .addMessage(name,email,phone,message)
        await userContact.save();
        res.status(201).json({message:"User contact successifully...!!!"})
    }
}
catch(err){
  console.log(err)
}
})

//Logout page
router.get("/logout", authenticate, (req,res)=>{
    console.log("Hello about us page");
    res.clearCookie('jwtoken',{path:"/"})
    res.status(200).send("User logout");

})

module.exports=router;