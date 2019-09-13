//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
mongoose.connect("mongodb://localhost:27017/userDB",{ useUnifiedTopology: true ,useNewUrlParser: true });

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({
     email : String,
     password : String
});

userSchema.plugin(encrypt,{secret : process.env.SECRET,encryptFields:["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){

  res.render("home");

});
app.get("/login",function(req,res){

  res.render("login");

});
app.get("/register",function(req,res){

  res.render("register");

});

app.post("/register",function(req,res){

    email= req.body.username;
    password= req.body.password;

    const user = new User({
      email : email,
      password : password
    });

     user.save(function(err){
        if(!err)
        {
          res.render("secrets");
        }
        else
        {
          console.log(err);
        }
     });
});

app.post("/login",function(req,res){

    User.findOne({email: req.body.username},function(err,user){

      if(err)
      {
        console.log(err);
      }
      else if(user.password === req.body.password)
           res.render("secrets");

    });

});















app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
