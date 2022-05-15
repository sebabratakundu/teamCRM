const mongoose = require("mongoose");
const { Schema } = mongoose;

const clientSchema = new Schema({
  companyId : [String],
  clientName : {
    type : String,
    lowercase : true,
    required : [true,"Client Name is required"]
  },
  clientEmail : {
    type : String,
    lowercase : true,
    unique : true,
    required : [true,"Client Email is required"]
  },
  clientCountry : {
    type : String,
    lowercase : true,
    required : [true,"Client Country is required"]
  },
  clientPhone : {
    type : Number,
    unique : true,
    required : [true,"Client Phone is required"]
  },
  isUser : {
    type : Boolean,
    default : false
  },
  createdAt : {
    type : Date,
    default : Date.now
  },
  updatedAt : {
    type : Date,
    default : Date.now
  }
})

// unique validattion before storing middleware
clientSchema.pre("save",async function(next){
  const query = {
    clientEmail : this.clientEmail,
    companyId : this.companyId
  };

  const length = await mongoose.model("Client").countDocuments(query);
  console.log(length);
  if(length>0){
    const clientEmailError = {
      type : "duplicate",
      message : "Client Email already exist",
      field : "clientEmail"
    }
    throw next(clientEmailError);
  }else{
    next();
  }
});

clientSchema.pre("save",async function(next){
  const query = {
    clientPhone : this.clientPhone
  };

  const length = await mongoose.model("Client").countDocuments(query);
  if(length>0){
    const clientPhoneError = {
      type : "duplicate",
      message : "Client Phone already exist",
      field : "clientPhone"
    }
    throw next(clientPhoneError);
  }else{
    next();
  }
});


module.exports = mongoose.model("Client",clientSchema);