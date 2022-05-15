const http = require("supertest");

const postRequest = async (request)=>{
  const response = await http(request.domain)
  .post(request.endpoint)
  .send({token : request.token});
  return response.body;
}

const getRequest = async (request)=>{
  const response = await http(request.domain)
  .get(request.endpoint)
  .set({
    "X-Auth-Token" : request.token
  })
  return response.body;
}

const putRequest = async (request)=>{
  const response = await http(request.domain)
  .put(request.endpoint+"/"+request.query)
  .send({
    token : request.token,
    data : request.data
  });

  return response.body;
}

module.exports = {
  postRequest,
  getRequest,
  putRequest
}