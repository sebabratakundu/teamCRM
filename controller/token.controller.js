const tokenService = require("../services/token.service");

const generateToken = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const companyData = JSON.parse(req.query.companyInfo);
    const body = {
      id : req.params.id,
      name : req.query.customerName,
      companyId : companyData.data._id,
      companyName : companyData.data.company_name,
      companyLogo : companyData.data.company_logo
    }

    const request = {
      body,
      domain : `https://${req.headers.host}`,
      endpoint : req.baseUrl
    }

    const clientAccessToken = await tokenService.createCustomToken(request,840000);
    res.json({
      token : clientAccessToken
    })

  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

module.exports = {
  generateToken
}