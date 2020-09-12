const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = require('../models/user');
module.exports = (req,res,next)=>{
    var sess = req.session;
    const authorization = "Bearer " + sess.token;
    //authorization === Bearer ewefwegwrherhe
    if(!authorization){
        req.flash('error_msg','You must be signed in.')
        res.redirect('/signin');
    }else{
        const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            req.flash('error_msg',"You must be signed in.")
            res.redirect('/signin');
        }else{
            const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        });

        } 
        
    });

    }
    
}