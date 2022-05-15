const pdfService = require("../services/pdf.service");
const tokenService = require("../services/token.service");
const fs = require("fs");
const path = require("path");
const exportToPDF = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const tableData = {
      companyInfo : token.data,
      data : JSON.parse(req.body.data)
    };
    let pdfName = pdfService.generatePDF(tableData);
    res.json({
      message : "pdf generated successfully",
      filename : pdfName
    })
  }else{
    res.status(401);
    res.json({
      status : 401,
      isLogged : false,
      message : "unauthorized user"
    });
  }
}

const deletePDF = (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    
    res.json({
      message : path.join(__dirname,"/public/exports/"+file)
    })
  }else{
    res.status(401);
    res.json({
      status : 401,
      isLogged : false,
      message : "unauthorized user"
    });
  }
}


module.exports = {
  exportToPDF,
  deletePDF
}