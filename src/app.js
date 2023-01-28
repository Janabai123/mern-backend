const dotenv=require("dotenv");
const mongoose=require('mongoose');
const express=require('express');
const app=express();




dotenv.config({path:'./config.env'});


require('../middleware/db/Connection')
const User=require('../Model/userSchema')

app.use(express.json());
//we link router files to make our rout easy
 app.use(require('../Router/auth.js'));

const PORT=process.env.PORT || 5000;

// -app.use(express.urlencoded({extended:false}));
// app.use(
//     cors({
//         origin:["http://localhost:3000", "https://mern-app1-api.onrender.com"],
//     })
// )

app.listen(PORT,()=>{
    console.log(`Listening at port ${PORT}...!!!!`)
})