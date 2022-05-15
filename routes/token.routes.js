const express = require("express");
const router = express.Router();
const tokenController = require("../controller/token.controller");
router.get("/generate/:id",(req,res)=>{
  tokenController.generateToken(req,res);
})

module.exports = router;