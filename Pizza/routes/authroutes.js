const express=require('express')
const { authcontroller } = require('../app/controller/auth/authcontroller')
const { auth } = require('../app/middleware/authmiddlware')
const authrouter=express.Router()

authrouter.get('/user',auth,authcontroller.user)
authrouter.post('/register',authcontroller.register)
authrouter.post('/login',authcontroller.login)

module.exports={authrouter}