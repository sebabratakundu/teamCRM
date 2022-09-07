const express = require("express");
const {canView} = require("../middleware/permission.middleware");
const router = express.Router();

router.get("/", canView,(req,res)=>{
  res.redirect('/dashboard');
});

module.exports = router;