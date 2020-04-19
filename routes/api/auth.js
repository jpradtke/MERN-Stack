const express = require("express");
const router = express.Router();
const User = require("../../models/User")
const auth = require("../../middleware/auth")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs")
const {check, validationResult} = require("express-validator")


//@route GET api/auth
//@desc Test route
//@access Public
router.get("/", auth, async (req, res) => {
try{
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
}catch(err){
    console.error(err.message)
    res.status(500).send("Server Error")
}
})


//@route POST api/auth
//@desc Authenticate User and get token
//@access Public
router.post("/", [
    check("email", "Die E-Mail Adresse ist nicht korrekt. Bitte eine gültige E-mail Adress eingeben").isEmail(),
    check("password", "Password ist ein Pflichtfeld").exists()
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password} = req.body

    try{
         //See if user exists
         let user = await User.findOne({
             email
            })
             if(!user){
             return   res.status(400).json({ errors: [ { 
                    msg: "Die eingegebene Kombination konnte nicht gefunden werden."
                 } ] })
             }
        // check email and passwor combination
             const isMatch = await bcrypt.compare(password, user.password)

             if (!isMatch){
                return   res.status(400).json({ errors: [ { 
                    msg: "Die eingegebene Kombination konnte nicht gefunden werden."
                 } ] })
             }

         //return the JSON Web Token

             const payload = {
                 user:{
                     id: user.id
                 }
             }
             jwt.sign(payload, 
                config.get("jwtSecret"),
                {expiresIn: 360000},
                (err, token) =>{
                if(err) throw err;
                res.json({ token })
            })

    }catch(err){
        console.error(err.message)
        res.status(500).send("Server error")
        
    }

   
})

module.exports = router;