const User = require('../models/User.model')
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenAuth = require('../middlewares/auth.middlewares')



//1 Sign up the user - api/auth/signup

router.post('/signup',async(req,res,next)=>{
    const {username,email,password} = req.body

    if(!username || !email || !password){
        res.status(400).json({errorMessage: 'Username, Email, and password are required.'})
        return
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g

    if(!passwordRegex.test(password)){
        res.status(400).json({errorMessage: 'The  password is not strong enought, please add numbers, capilized words, and at least 8 characters'})
        return
    }

    try {
        const foundUser = await User.findOne({email})
        if(foundUser) {
            res.status(400).json({errorMessage: 'This email is already exist, please try a new one.'})
            return
        }
        const hashPassword = await bcrypt.hash(password, 12)
        User.create({
            username,
            email,
            password: hashPassword
        })
        res.sendStatus(200)
    } catch (error) {
        next(error)
    }



})

// 2 Login (auth)
router.post('/login', async(req,res,next)=>{
    const {email, password} = req.body
     if(!email || !password){
        res.status(400).json({errorMessage: 'Email, and password are required.'})
        return
    }

    try {
        const foundUser = await User.findOne({email})
        if(!foundUser){
          res.status(400).json({errorMessage: 'This email is not in use, please signup.'})
          return
        }
        const isPasswordMatch = await bcrypt.compare(password,foundUser.password)

        if(isPasswordMatch === false){
            res.status(400).json({errorMessage: 'Incorrect password, please try again'})
          return
        }

        const payload = {
            _id: foundUser._id,
            email: foundUser.email
        }
        const authToken = jwt.sign(payload,process.env.TOKEN_SECRET,{algorithm: "HS256", expiresIn: '7d'})

        res.status(200).json({authToken})
        
    } catch (error) {
        next(error)
    }



    // Check if the email exist and get the user information
    // Check if the password matches the hash password
})


// 3 Verify
router.get('/verify',tokenAuth, (req,res)=>{
    res.status(200).json(req.payload)
    
})



module.exports = router
