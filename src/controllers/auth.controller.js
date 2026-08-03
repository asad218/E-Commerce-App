const userModel = require('../models/user.model');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req,res) =>{
    try{
        const {username , password , email , role = "customer"} = req.body;
        if(!username || !email || !password){
          return  res.status(400).json({
                message:"All three are required fields "
            })
        }

        const isUserExists = await userModel.findOne({
           $or: [
                { username },
                { email }
            ]
        })

        if(isUserExists){
            return res.status(400).json({
                message:"user already exists "
            })
        }


         const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        });

        return res.status(201).json({
            message:"user created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    }catch(err){
        res.status(400).json({
            message:"error creating new user ", err
        })
    }

}

const loginUser = async (req,res) =>{
    try{

    const { username, email, password } = req.body;
    if((!username || !password )&& !password){
        return res.status(400).json({
            message:"these  are mandatory field , please provide them  "
        })
    }


    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({
            message:"Cannot find  "
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message : "wrong password please try again "
        })
    }

    const token = jwt.sign({
            id: user._id,
            role :user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });




     res.cookie("token",token)   




     res.status(200).json({
        message:"Login successfull",
        user:{
            id:user._id,
            username:username,
            email:user.email
        }
     })






    } catch(err){
        res.status(500).json({
            message:"Internal server error"
        })
    }






    
}


module.exports = {registerUser , loginUser};