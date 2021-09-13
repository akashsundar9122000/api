const express = require('express');
  
const User = require('./models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const router = express.Router();

router.post('/signup',(req,res)=>{
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
      const user = new User({
        email:req.body.email,
        password:hash
      })
      user.save()
        .then(result=>{
          res.status(201).json({
            message:'User created!!!',
            result:result
          })
        })
        .catch(err=>{
          res.status(500).json({
              message:'Invalid authentication credentials'
          })
        })
    })
    .catch(err=>{
      res.status(500).json({
        message:'User Already Exists'
      })
    })
})

router.post('/login',(req,res)=>{
    
    let fetchedUser;
  User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        return res.status(401).json({
          message:'No User Found'
        })
      }
      fetchedUser=user;
      
      return bcrypt.compare(req.body.password,user.password);
    })
    .then(result=>{
        
      if(!result){
        return res.status(401).json({
          message:'Password mismatch'
        })
      }
      
      const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},"this_is_the_secret_message_and_it_should_be_long_enough",{expiresIn:"1h"})
      res.status(200).json({
        token:token,
        expiresIn:3600,  //seconds
        userId:fetchedUser._id
      })
    })
    .catch(err=>{
      return res.status(401).json({
        message:'Invalid authentication credential'
      })
    })
})

module.exports=router;