const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");
const createCompany = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const companyData = token.data;
    // store company data
    try{
      const response = await databaseService.createRecord(companyData,"companies");
      res.status(201);
      res.json({
        status : 201,
        isCompanyCreated : true,
        message : "company created",
        data : response
      });
    }catch(error){
      res.status(409);
      res.json({
        status : 409,
        isCompanyCreated : false,
        data : error
      });
    }

  }else{
    res.status(401);
    res.json({
      status : 401,
      message : "Permission denide"
    });
  }
}

const getCompanyId = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    // find company by email
    const query = {
      email : token.data.username
    }
    try{
      const response = await databaseService.getRecordByQuery(query,"companies");
      if(response.length > 0){
        res.json({
          isCompanyExists : true,
          data : response,
          message : "company found"
        })
      }else{
        res.status(404);
        res.json({
          status : 404,
          isCompanyExists : false,
          message : "company not found"
        });
      }
    }catch(error){
      res.status(500);
      res.json({
        status : 500,
        isCompanyExists : false,
        message : "internal server error",
        error
      });
    }
  }else{
    res.status(401);
    res.json({
      status : 401,
      isCompanyExists : false,
      message : "unauthorized user"
    });
  }
}

const updateCompany = async (req,res)=>{
 const token = tokenService.verifyToken(req);
 if(token.isVerified){
   const obj = JSON.parse(req.body.data);
  const dataToUpdate = {
    ...obj,
    updatedAt : Date.now()
  }
  try{
    const updateRes = await databaseService.updateRecordById(req.params.id,dataToUpdate,"companies");

    // manually define issuer for refreshing token
    const issInfo = {
      originalUrl : "/api/private/company",
      get : (param)=>{
        return req.get(param);
      }
    }
    const newAuthToken = await tokenService.refreshToken(updateRes,issInfo);
    if(newAuthToken.isTokenRefreshed){
      res.cookie("authToken",newAuthToken.token,{maxAge : (3600*24*7*1000)});
      res.status(201);
      res.json({
        message : "record updated",
        data : updateRes,
      })
    }
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
    message : "unauthorized user"
  });
 }
}

module.exports = {
  createCompany,
  getCompanyId,
  updateCompany
}