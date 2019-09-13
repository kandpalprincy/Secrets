//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
mongoose.connect("mongodb://localhost:27017/userDB",{ useUnifiedTopology: true ,useNewUrlParser: true });

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({
     email : String,
     password : String
});


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
    password=req.body.password;

bcrypt.hash(password, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  const user = new User({
    email : email,
    password : hash
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

});



app.post("/login",function(req,res){

    User.findOne({email: req.body.username},function(err,user){

      if(err)
      {
        console.log(err);
      }
      else if(user)
             bcrypt.compare(req.body.password,user.password, function(err, result) {
               if(result === true)
               {
                  // result == true
                  res.render("secrets");
                }
                else if(err)
                {
                  console.log(err);
                }
     });
    });
});















app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
