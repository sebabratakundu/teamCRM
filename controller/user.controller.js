const tokenService = require("../services/token.service");
const database = require("../services/database.service");
const createUser = async (req,res)=>{
  // verify token to get actual data
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    try{
      // auto login during signup
      const tokenData = {
        body : token.data.data,
        domain : req.get("origin") || `https://${req.get("host")}`,
        endpoint  : req.originalUrl
      }
      const newToken = await tokenService.createCustomToken(tokenData,86400);

      // userDataToCreate
      const userData = {
        ...token.data,
        token : newToken,
        role :"admin",
        expiresIn : 86400,
        isLogged : true
      }
      const response = await database.createRecord(userData,"users");
      res.status(201);
      res.json({
        isUserCreated : true,
        status : 201,
        message : "user register success",
        token : newToken,
        expiresIn : (86400*1000)
      });
    }catch(error){
      res.status(500);
      res.json({
        status : 500,
        isUserCreated : false,
        message : "internal server error"
      })
    }   
  }else{
    res.status(401);
    res.json({
      status : 401,
      message : "permission denide"
    });
  }
}

const getUser = async (req,res)=>{

  // verify token
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    // get user data
    const query = {
      uid : token.data
    }
    try{
      const response = await database.getRecordByQuery(query,"users");
      if(response.length > 0){
        res.json({
          status : 200,
          isCompanyExists : true,
          message : "user found",
          data : response
        });
      }else{
        res.status(404);
        res.json({
          status : 404,
          isCompanyExists : false,
          message : "Company not found"
        });
      }
    }catch(error){
      res.status(500);
      res.json({
        status : 500,
        isCompanyExists: false,
        message : "internal server error",
        error
      });
    }
  }else{
    res.status(401);
    res.json({
      status : 401,
      message : "unauthorized user"
    });
  }
}

const createLog = async (req,res)=>{
  // verify token
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const query = {
      uid : req.params.id
    }
    
    try{
      const createLogResponse  = await database.updateRecord(query,req.body.data,"users");
      res.json({
        status : 200,
        message : "login success",
        isLogged : true
      });
    }catch(error){
      res.status(500);
      res.json({
        status : 500,
        isLogged : false,
        message : "internal server error"
      });  
    }
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
  createUser,
  getUser,
  createLog
}