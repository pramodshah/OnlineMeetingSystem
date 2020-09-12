var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');

var requireLogin = require('../middleware/requireLogin');


router.get('/signin',(req,res)=>{
    res.render('signin');
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});


router.post('/signup',(req,res)=>{ 
    const {name,email,password} = req.body;
    console.log(req.body);
    
    if(!name || !email || !password){
        req.flash('error_msg','Please fill all fields.')
        res.redirect('/signup');
    }else{
        User.findOne({email:email}).then((savedUser)=>{
            if(savedUser){
               req.flash('error_msg','Email is already exists.')
               res.redirect('/signup');
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    name,
                    email,
                    password:hashedpassword
                })
                user.save().then(user=>{
                    req.flash('success_msg','You are signed up successfully.')
                    res.redirect('/signin');
                })
                .catch(err=>{
                    console.log(err);
                });   

            });
            
        })
        .catch(err=>{
            console.log(err)
        });
    }

    
    


});

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || ! password){
        res.render('signin',{error:"Invalid email or password!"});
    }

    User.findOne({email:email}).then((savedUser=>{
        if(!savedUser){
            req.flash("error_msg","Email is not registered!!");
            res.redirect('/signin');
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                var token = jwt.sign({_id:savedUser._id,},JWT_SECRET);
                var sess = req.session;
                sess.token= token;
                sess._id = savedUser._id;
                sess.name= savedUser.name;
                sess.email= savedUser.email;
               
               
               
                req.flash('success_msg','You are signed in successfully.')
                res.redirect('/home');  
            }else{
                req.flash('error_msg','Invalid password.')
                res.redirect('/signin');
            }
        })
        .catch(err=>{
            console.log(err);
        })


    }))
    .catch(err=>{
        console.log(err);
    })

});
router.get('/profile',requireLogin,(req,res)=>{
    res.render('profile',{user:req.user});
})
router.get('/signout',(req,res) => {
    req.flash('success_msg','You are successfully signed out.')
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        
        res.redirect('/');
    });

});
module.exports = router;