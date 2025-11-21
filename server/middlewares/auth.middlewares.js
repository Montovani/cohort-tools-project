const jwt = require('jsonwebtoken')

function tokenAuth (req,res,next){
    
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token,process.env.TOKEN_SECRET)
        console.log(payload)
        req.payload = payload
        next()
    } catch (error) {
        res.status(401).json({errorMessage: 'Token is not valid, it is not exist or it has been modified '})
    }




}

module.exports = tokenAuth
