var express = require('express');
var router = express.Router();
var async = require("async");
var requireLogin = require('../middleware/requireLogin');
var User = require('../models/user');
var Meeting = require('../models/meeting');

router.get('/meeting',requireLogin,(req,res)=>{
    Meeting.find({createdBy:req.user._id}).populate("createdBy","_id name email").
    then(meetings=>{
        res.render('meeting',{meetings:meetings,user:req.user});
    }).catch(err=>{
        console.log(err)
    });
});
router.get('/createmeeting',requireLogin,(req,res)=>{
    User.find().then(users=>{
        res.render('createmeeting',{users:users,user:req.user});
    }).catch(err=>{
        console.log(err);
    });  
   
});
router.post('/createmeeting',requireLogin,(req,res)=>{
    const {title,selectuser,date,time} = req.body;

    if(!title || !selectuser|| !date || !time){
        req.flash('error_msg','Please fill all the fields.');
        return res.redirect('/createmeeting');
    }

    Meeting.findOne({meetingwith:selectuser,date:date}).then(meeting=>{
        if(meeting){
            req.flash('error_msg','On this date meeting is already fixed with the same user.')
            return res.redirect('/createmeeting');
        }else{

            req.user.password =undefined;
            const meeting = new Meeting ({
                title,
                meetingwith:selectuser,
                date,
                time, 
                createdBy:req.user
            });
            meeting.save().then(meeting=>{
                req.flash('success_msg','You have successfully created your meeting.')
                res.redirect('/meeting');
            })
            .catch(err=>{
                console.log(err);
            }); 

        }
    }).catch(err=>{
        console.log(err);
    });

    
    
});


router.get('/editmeeting/:id',requireLogin,(req,res)=>{
    var id = req.params.id;
    var locals = {};
    
    
    var tasks = [

        // Load meeting
        function(callback) {
            Meeting.findById(id,(function(err, meeting) {
                if (err) return callback(err);
                locals.meeting = meeting;
                callback();
            }));
        },
        // Load users
        function(callback) {
            User.find({},(function(err,users) {
                if (err) return callback(err);
                locals.users = users;
                callback();
            }));
        }
        
    ];

    async.parallel(tasks, function(err) {
        if(err) throw err;
        res.render('editmeeting',locals);
    });
});

router.post('/editmeeting',requireLogin,(req,res)=>{
    const {title,selectuser,date,time} = req.body;
    
    var meetingData ={
        title,
        meetingwith:selectuser,
        date,
        time,
        createdBy:req.user

    }    
    Meeting.findByIdAndUpdate(req.body.id,meetingData,function(err,meeting){
        if(err) throw err;
        req.flash('success_msg','You have successfully updated your meeting.')
        res.redirect('/meeting');
    });

});

router.get('/delete/:id',(req,res)=>{
    var id = req.params.id;
    Meeting.findByIdAndDelete(id,function(err){
        if(err) throw err;
        req.flash('success_msg','You have successfully deleted your meeting.')
        res.redirect('/meeting');

    });
    
});



router.get('/view/:id',(req,res)=>{
    var id = req.params.id;
    Meeting.findById(id,(err,meeting)=>{
        if(err) throw err;
        res.render('viewmeeting',{meeting:meeting});
    });
});

module.exports = router;