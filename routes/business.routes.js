const express = require("express");
const router = express.Router();
const rolePermission = require("../middleware/permission.middleware");

router.get("/",rolePermission,(req,res)=>{
  res.render("business");
})

module.exports = router;