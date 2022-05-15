const tokenService = require("../services/token.service");
const emailService = require("../services/email.service");
const sendMail = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    try{
      const emailRes = await emailService.sendMail(JSON.parse(req.body.emailInfo));
      res.json({
        message : "Email successfully sent",
        data : emailRes
      })
    }catch(error){
      res.status(427);
      res.json({
        message : "something went wrong",
        data : error
      })
    }

  }else{
    res.status(401);
    res.json({
      status : 401,
      message : "Permission denide"
    });
  }

}

module.exports = {
  sendMail
}