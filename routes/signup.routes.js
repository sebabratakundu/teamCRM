const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
// routing
router.post("/",async (req,res)=>{
  // res.json(req.body);
  const expiresIn = 120;
  const token = await tokenService.createToken(req,expiresIn);
  
  // request company api with token
  const response = await httpService.postRequest({
    domain : req.get("origin"),
    endpoint : "/api/private/company",
    token
  });

  if(response.isCompanyCreated){
    // create token for user private api
    const userInfo = {
      body : {
        uid : response.data._id,
        data : {...response.data,role : "admin"},
        password : req.body.password
      },
      domain : req.get("origin"),
      endpoint : req.originalUrl
    }

    const userToken = await tokenService.createCustomToken(userInfo,expiresIn);

    // requrest user api
    const userResponse = await httpService.postRequest({
      domain : req.get("origin"),
      endpoint : "/api/private/user",
      token : userToken
    });  

    // send direct gateway response
    res.status(userResponse.status);
    res.cookie("authToken",userResponse.token,{maxAge : userResponse.expiresIn});
    delete userResponse.token;
    res.json(userResponse);

  }else{
    // send direct gateway error response
    res.status(response.status);
    res.json(response);
  }
});

module.exports = router;