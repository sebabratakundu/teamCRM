const express = require("express");
const router = express.Router();
const exportController = require("../controller/export.controller");
// routing
router.get("/",(req,res)=>{

})

router.post("/pdf",(req,res)=>{
  exportController.exportToPDF(req,res);
})

router.delete("/:filename",(req,res)=>{
  exportController.deletePDF(req,res);
})

module.exports = router;