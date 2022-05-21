require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const secretKey = process.env.SECRET_KEY;
const tokenIssuerService = require("./iss.service");
const databaseService = require("../services/database.service");

const createToken = async (request,expiresIn)=>{
  const data = request.body;
  const iss = request.get("origin")+request.originalUrl;
  const token = await jwt.sign({
    iss,
    data
  },secretKey,{expiresIn});

  return token;
}

const createCustomToken = async (request,expiresIn)=>{
  const data = request.body;
  const iss = request.domain+request.endpoint;
  const token = await jwt.sign({
    iss,
    data
  },secretKey,{expiresIn});

  return token;
}

const verifyToken = (req)=>{
  let token = req.method == "GET" ? req.headers["x-auth-token"] || req.cookies.authToken : req.body.token;
  if(token){
    try{
      const response = jwt.verify(token,secretKey);
      if(tokenIssuerService.includes(response.iss)){
        return {
          isVerified : true,
          data : response.data
        }
      }else{
        return {
          isVerified : false
        }
      }
    }catch(error){
      return {
        isVerified : false
      }
    }

  }else{
    return {
      isVerified : false
    }
  }
}

const refreshToken = async (data,req)=>{
  const tokenData = {
    body : data,
    domain : req.get("origin") || `http://${req.get("host")}`,
    endpoint  : req.originalUrl
  }
  const token = await createCustomToken(tokenData,86400);

  // update token
  const updateData = {
    token,
    updatedAt : Date.now(),
    expiresIn : 86400
  }
  const query = {
    uid : data._id
  }
  try{
    const updateResponse = await databaseService.updateRecord(query,updateData,"users");
    if(updateResponse.modifiedCount){
      return{
        isTokenRefreshed : true,
        token
      }
    }else{
      return{
        isTokenRefreshed : false
      }
    }
  }catch(error){
    return{
      isTokenRefreshed : false,
      error
    }
  }
}

const verifyCustomToken = (token) =>{
  if(token){
    try{
      const response = jwt.verify(token,secretKey);
      if(tokenIssuerService.includes(response.iss)){
        return {
          isVerified : true,
          data : response.data
        }
      }else{
        return {
          isVerified : false
        }
      }
    }catch(error){
      return {
        isVerified : false
      }
    }

  }else{
    return {
      isVerified : false
    }
  }
}

module.exports = {
  createToken,
  createCustomToken,
  verifyToken,
  verifyCustomToken,
  refreshToken
}