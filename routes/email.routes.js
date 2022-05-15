const express = require("express");
const router = express.Router();
const emailController = require("../controller/email.controller");
router.post("/invite",(req,res)=>{
  emailController.sendMail(req,res);
})

module.exports = router;