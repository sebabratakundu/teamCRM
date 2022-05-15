const express = require("express");
const router = express.Router();
const companyController = require("../controller/company.controller");
// routing
router.get("/",(req,res)=>{
  companyController.getCompanyId(req,res);
});

router.post("/",(req,res)=>{
  companyController.createCompany(req,res);
});

router.put("/:id",(req,res)=>{
  companyController.updateCompany(req,res);
});

module.exports = router;