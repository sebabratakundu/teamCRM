const tokenService = require("../services/token.service");

const access = {
  admin : [{label : "clients",icon : "fa fa-user-secret",link : "/client" , color : "icon-btn-dark"},{label:"teams",icon : "fa fa-users",link:"/teams",color : "icon-btn-info"},{label:"logout",icon:"fa fa-sign-out-alt",link:"/logout", color : "icon-btn-danger"}],
  client : [
    {label:"logout",icon:"fa fa-sign-out-alt",link:"/logout", color : "icon-btn-danger"}
  ],
  team : ""
}

const roleAccess = (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    res.json({
      data : access[token.data.role]
    })
  }else{
    res.status(401);
    res.json({
      status : 401,
      message : "Unauthorized user"
    });
  }
}

module.exports = {
  roleAccess
}