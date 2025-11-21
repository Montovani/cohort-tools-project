const express = require("express")
const router = express.Router()
const cohortRoutes = require("./cohort.routes")
const studentRoutes = require("./student.routes")
const authRoutes = require('./auth.routes')
const tokenAuth = require('../middlewares/auth.middlewares')

router.use("/cohorts", cohortRoutes)
router.use("/students", studentRoutes)
router.use('/auth', authRoutes )

router.get('/private',tokenAuth,(req,res)=>{
   console.log(req.payload)
    res.send('you are allowed to see this')
})
module.exports = router
