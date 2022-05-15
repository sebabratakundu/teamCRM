const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
  res.render("access-denide");
})

module.exports = router;