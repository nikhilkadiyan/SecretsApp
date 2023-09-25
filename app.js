require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(()=> res.render("secrets.ejs"));
});
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((data)=>{
        if(data === null){
            console.log("User not found");
        }else{
            if(data.password === password){
                res.render("secrets.ejs");
            }
        }
    });
});






app.listen(3000,()=>{
    console.log("Server started at port 3000");
})
