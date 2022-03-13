const express=require("express");
const authcontroller = require("../app/controller/auth/auth");
const auth=express.Router()
auth.get("/", authcontroller.index);
auth.post('/login',authcontroller.login)

module.exports=auth