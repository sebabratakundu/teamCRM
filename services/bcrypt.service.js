const bcrypt = require("bcrypt");

const encrypt = async (data)=>{
  const encryptData = await bcrypt.hash(data,12);
  return encryptData;
}

const match = async (actualData,typedData)=>{
  const response = await bcrypt.compare(typedData,actualData);
  return response;
}

module.exports = {
  encrypt,
  match
}