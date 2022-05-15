const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const checkUserLogin = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    // check token in database
    const query = {
      token : req.cookies.authToken,
      isLogged : true
    }
    const tokenResponse = await databaseService.getRecordByQuery(query,"users");
    if(tokenResponse.length > 0){
      const newToken = await tokenService.refreshToken(token.data,req);
      if(newToken.isTokenRefreshed){
        res.cookie("authToken",newToken.token,{maxAge : (86400*1000)});
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }else{
    return false;
  }
}

const logout = async (req,res) =>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const updateData = {
      isLogged : false,
      logoutAt : Date.now()
    }

    const query = {
      uid : token.data
    }
    
    try{
      const response = await databaseService.updateRecord(query,updateData,"users");
      if(response.modifiedCount){
        res.clearCookie("authToken");
        res.redirect("/");
      }else{
        res.redirect("/profile");
      }
    }catch(error){
      res.redirect("/profile");
    }

  }else{
    res.status(401);
    res.json({
      status : 401,
      message : "unauthenicated user"
    })
  }
}

const getClientById = async (id)=>{
  try{
      const client = await databaseService.getRecordById(id,"clients");
      return client;
    }catch(error){
      return false;
    }
}

const invite = async (req,res)=>{
  const clientToken = tokenService.verifyCustomToken(req.params.token);
  if(clientToken.isVerified){
    const client = await getClientById(clientToken.data.id);
    if(client){
    !client.isUser ? res.render("invite",{
      token : req.params.token,
      ...clientToken.data
    }) : res.redirect("/");  
    }else{
      res.status(427);
      res.json({
        message : "something went wrong"
      })
    }
  }else{
    res.status(410);
    res.json({
      message : "link expired"
    })
  }
}

module.exports = {
  checkUserLogin,
  logout,
  invite
}