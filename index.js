const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const generateToken = require("./generateToken")
const jwt = require("jsonwebtoken")
const app = express()
require('dotenv').config()

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
  
const User = mongoose.model('User', userSchema);


// Register New User
app.post('/register', async (req,res) => {
    const {username, password} = req.body

    let user = await User.findOne({ username })

    if (user) {
        res.status(400);
    }

    user = new User({
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
    //   console.log("user.password", user.password)

      await user.save();

    if (user) {
        res.status(201).json({
          token: generateToken(user._id),
        });
    } else {
        res.status(400);
    }
})


// Reset password for existing user
app.post('/reset', async (req,res) => {
    const token = req.header('x-auth-token')
    const { password, confirmPassword } = req.body

    if(!token){
        return res.json({msg: "No token found"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(decoded){
            if(password === confirmPassword){
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                // console.log("hash", hashedPassword)

                await User.findByIdAndUpdate(decoded.id, {password: hashedPassword})
            } else {
                res.json({msg: "password and confirm password do not match"})
            }
        }

    } catch(err) {
        res.send({msg: "Token is invalid"})
    }
})


// login route
app.post('/login', async (req,res) => {
    const {username, password} = req.body

    try{
        let user = await User.findOne({ username })
    
        if(!user){
            return res.json({msg: "User does not exist"})
        }  

        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched){
            return res.json({msg: "Password does not match"})
        } else {
            res.json({
                token: generateToken(user._id),
            });
        }

    } catch (err) {
        return res.json({msg: err})
    }    

})


app.listen(5000, () => {
    console.log("Server is live on port 5000")
})