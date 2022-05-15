const tokenService = require("../services/token.service");

const roleRoutePermission = {
  admin : [
    "/client"
  ],
  client : [
    "/business"
  ],
  team : []
}


const rolePermission = (req,res,next) =>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const role = token.data.role;
    let route = req.originalUrl;
    if(route.indexOf("?") != -1){
      route = route.split("?")[0];
    }

    if(roleRoutePermission[role].indexOf(route) != -1){
      next();
    }else{
      res.status(401);
      res.redirect("/access-denide");
    }
  }
}

module.exports = rolePermission;