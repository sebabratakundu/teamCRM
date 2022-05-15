const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const create = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const formdata = {
      companyId : token.data._id,
      ...req.body
    }

    try{
      const response = await databaseService.createRecord(formdata,"clients");
      res.status(201);
      res.json({
        data : response,
        message : "record created"
      });
    }catch(error){
      if(error.type && error.type == "duplicate"){
        res.status(409);
        res.json({
          ...error
        })
      }else{
        res.status(400);
        res.json(Object.entries(error.errors).map((err)=>{
          return err[1];
        }));
      }
    }
  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

const getClientId = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    // find client by email
    const query = {
      clientEmail : token.data.username
    }
    try{
      const response = await databaseService.getRecordByQuery(query,"clients");
      console.log(response);
      if(response.length > 0){
        if(response[0].isUser){
          res.json({
            isClientExists : true,
            data : response,
            message : "client found"
          })
        }else{
          res.status(401);
          res.json({
            status : 401,
            isClientExists : false,
            message : "you are not register with us. please contact your company"
          })
        }
      }else{
        res.status(404);
        res.json({
          status : 404,
          isClientExists : false,
          message : "client not found"
        });
      }
    }catch(error){
      res.status(500);
      res.json({
        status : 500,
        isClientExists : false,
        message : "internal server error",
        error
      });
    }
  }else{
    res.status(401);
    res.json({
      status : 401,
      isClientExists : false,
      message : "unauthorized user"
    });
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

const getAllClients = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const companyId = token.data._id;
    const query = {
      companyId
    }
    try{
      const allClients = await databaseService.getRecordByQuery(query,"clients");
      if(allClients.length > 0){
        res.json({
          data : allClients
        })
      }else{
        res.status(404);
        res.json({
          message : "data not found"
        })
      }
    }catch(error){
      res.status(500);
      res.json({
        message : "internal server error"
      })
    }
  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

const countClients = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const query = {
      companyId : token.data._id
    }
    try{
      const response = await databaseService.countRecords(query,"clients");
      res.json({
        data : response
      })
    }catch(error){
      res.status(500);
      res.json({
        message : "internal server error"
      })
    }
  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

const paginate = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const from = Number(req.params.from);
    const to = Number(req.params.to);
    const query = {
      companyId : token.data._id,
    }
    const response = await databaseService.paginate(query,from,to,"clients");
    res.json({
      data : response
    })
  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

const update = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const id = req.params.id;
    const data = {
      ...req.body,
      updatedAt : Date.now()
    };
    try{
      const response = await databaseService.updateRecordById(id,data,"clients");
    res.json({
      message : "your data has been updated",
      data : response
    });
    }catch(error){
      res.status(500);
      res.json({
        message : "internal server error"
      })
    }
  }else{
    res.status(401);
    res.json({
      message : "unauthenticated user"
    })
  }
}

const updateAndCreateClientAsAUser = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  delete req.body.token;
  const data = {
    ...req.body,
    role : "client",
  }
  if(token.isVerified){
    const dataToUpdate = {
      isUser : true,
      updatedAt : Date.now()
    }
    if(req.body.password.trim() !=""){
      try{
        const updateRes = await databaseService.updateRecordById(req.params.id,dataToUpdate,"clients");
        if(updateRes.isUser){
          try{
            await databaseService.createRecord(data,"users");
            res.status(201);
            res.json({
              message : "signup success, please login."
            })
          }catch(error){
            res.status(409);
            res.json({
              message : "user already exists"
            })
          }
        }else{
          res.status(500);
          res.json({
            message : "something went wrong, please try again leter"
          })
        }
      }catch(error){
        res.status(500);
        res.json({
          message : "something went wrong, please try again leter"
        })
      }
    }else{
      res.status(400);
      res.json({
        message : "password is required"
      })
    }
  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

const deleteClient = async (req,res)=>{
  const token = tokenService.verifyToken(req);
  if(token.isVerified){
    const clientId = req.params.id;
    try{
      const response = await databaseService.deleteRecordById(clientId,"clients");
      if(response != null){
        res.json({
          message : "your record has been deleted"
        })
      }else{
        res.status(400);
        res.json({
          message : "no client found"
        })
      }
    }catch(error){
      res.status(500);
      res.json({
        message : "internal server error"
      })
    }
  }else{
    res.status(401);
    res.json({
      message : "unauthorized user"
    })
  }
}

module.exports = {
  create,
  getClientId,
  getAllClients,
  countClients,
  paginate,
  deleteClient,
  update,
  updateAndCreateClientAsAUser
}