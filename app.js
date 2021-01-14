var express = require("express");
var app = express();
var bodyparser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
// var MongoStore = require('connect-mongo')(session);
var cookieparser = require('cookie-parser');
var {MONGOURI}= require('./config/keys');
const requireLogin = require("./middleware/requireLogin");


app.use(cookieparser());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));


app.use(flash())

// global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(function(req,res,next){
    res.locals.user =false;
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});


// database connection
mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(!err){
        console.log("MongoDB Connected successfully");
    }else{
        console.log(err);
    }
});




//port running
var PORT = process.env.PORT || 3000;

// view engine setup
app.use(expressLayouts);
app.set('view engine','ejs');


// static file
app.use(express.static('public'));


// homepage
app.get('/',(req,res)=>{
    res.render("index");
});
app.get('/home',requireLogin,(req,res)=>{
    res.render("home",{user:req.user});
});



//routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));


// port listen on
app.listen(PORT,(req,res)=>{
    console.log("Server running on port",PORT);
})