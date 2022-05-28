const express = require("express");
const tokenService = require("../services/token.service");
const http = require("../services/http.service");
const bcrypt = require("../services/bcrypt.service");
const router = express.Router();

// roles
const roles = {
  admin : function(req,res,token,expiresIn){
    adminLogin(req,res,token,expiresIn);
  },
  client : function(req,res,token,expiresIn){
    clientLogin(req,res,token,expiresIn);
  }
}

// login
router.post("/",async (req,res)=>{

  // examine role
  const role = req.body.role;
  if(!roles.hasOwnProperty(role)){
    res.status(400)
        .json({
          message: 'bad request'
        });
  }

  // generate token
  const expiresIn = 120;
  const token = await tokenService.createToken(req,expiresIn);
  roles[role](req,res,token,expiresIn);
});

const adminLogin = async (req,res,token,expiresIn)=>{
  // request company api to get data
  const response = await http.getRequest({
    domain : req.get("origin"),
    endpoint : "/api/private/company",
    token
  });
  
  // check company exist or not
  if(response.isCompanyExists){
    // request user api to get the password
    const userData = {
      body : response.data[0]._id,
      domain : req.get("origin"),
      endpoint : req.originalUrl
    }
    
    // generate token
    const uidToken = await tokenService.createCustomToken(userData,expiresIn);
    
    // request user api
    const passwordResponse = await http.getRequest({
      domain : req.get("origin"),
      endpoint : "/api/private/user",
      token : uidToken 
    });

    // check is company exists?
    if(passwordResponse.isCompanyExists){
      const realPassword = passwordResponse.data[0].password;
      const typedPassword = req.body.login_password;
      const isValidPassword = await bcrypt.match(realPassword,typedPassword);
      if(isValidPassword){

        // single device login
        // if(passwordResponse.data[0].isLogged){
        //   res.status(406);
        //   res.json({
        //     status : 406,
        //     message : "you are already logged in on one device, please signout"
        //   });
        //   return false;
        // }
        
        const oneDayInSecond = 3600*24*7;
        const userInfo = {
          body : {
            ...response.data[0],
            role : passwordResponse.data[0].role
          },
          domain : req.get("origin"),
          endpoint : req.originalUrl
        }
        const authToken = await tokenService.createCustomToken(userInfo,oneDayInSecond);
        
        // create user log
        const creatLogResponse = await http.putRequest({
          domain : req.get("origin"),
          endpoint : "/api/private/user",
          token : authToken,
          query : userData.body,
          data: {
            token : authToken,
            isLogged : true,
            expiresIn : oneDayInSecond,
            createdAt : Date.now()
          }
        });
        
        creatLogResponse.isLogged ? res.cookie("authToken",authToken,{maxAge : (3600*24*7*1000)}) : null; 
        res.status(creatLogResponse.status);
        res.json({
          ...creatLogResponse,
          role : "admin"
        });
      }else{
        res.status(401);
        res.json({
          status : 401,
          isLogged : false,
          message : "username or password is invalid"
        });
      }

    }else{
      res.status(response.status);
      res.json(passwordResponse);
    }

  }else{
    res.status(response.status);
    res.json(response);
  }
}
const clientLogin = async (req,res,token,expiresIn)=>{

  // request client api to get data
  const response = await http.getRequest({
    domain : req.get("origin"),
    endpoint : "/client/login",
    token
  });
  // check company exist or not
  if(response.isClientExists){
    // request user api to get the password
    const userData = {
      body : response.data[0]._id,
      domain : req.get("origin"),
      endpoint : req.originalUrl
    }
    
    // generate token
    const uidToken = await tokenService.createCustomToken(userData,expiresIn);
    
    // request user api
    const passwordResponse = await http.getRequest({
      domain : req.get("origin"),
      endpoint : "/api/private/user",
      token : uidToken 
    });

    // check is company exists?
    if(passwordResponse.isCompanyExists){
      const realPassword = passwordResponse.data[0].password;
      const typedPassword = req.body.login_password;
      const isValidPassword = await bcrypt.match(realPassword,typedPassword);
      if(isValidPassword){

        // single device login
        // if(passwordResponse.data[0].isLogged){
        //   res.status(406);
        //   res.json({
        //     status : 406,
        //     message : "you are already logged in on one device, please signout"
        //   });
        //   return false;
        // }
        const oneDayInSecond = 3600*24*7;
        const userInfo = {
          body : {
            ...response.data[0],
            role : passwordResponse.data[0].role
          },
          domain : req.get("origin"),
          endpoint : req.originalUrl
        }
        const authToken = await tokenService.createCustomToken(userInfo,oneDayInSecond);
        
        // create user log
        const creatLogResponse = await http.putRequest({
          domain : req.get("origin"),
          endpoint : "/api/private/user",
          token : authToken,
          query : userData.body,
          data: {
            token : authToken,
            isLogged : true,
            expiresIn : oneDayInSecond,
            createdAt : Date.now()
          }
        });
        
        creatLogResponse.isLogged ? res.cookie("authToken",authToken,{maxAge : (3600*24*7*1000)}) : null; 
        res.status(creatLogResponse.status);
        res.json({
          ...creatLogResponse,
          role : "client"
        });
      }else{
        res.status(401);
        res.json({
          status : 401,
          isLogged : false,
          message : "username or password is invalid"
        });
      }

    }else{
      res.status(response.status);
      res.json(passwordResponse);
    }

  }else{
    res.status(response.status);
    res.json(response);
  }
}

module.exports = router;