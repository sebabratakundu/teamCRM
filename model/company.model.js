const mongoose = require("mongoose");
const { Schema } = mongoose;
const companySchema = new Schema({
  company_name : {
    type : String,
    unique : true
  },
  email : {
    type : String,
    unique : true
  },
  company_logo : String,
  phone : {
    type : Number,
    unique : true
  },
  isLogo : {
    type : Boolean,
    default : false
  },
  emailVerified : {
    type : Boolean,
    default : false
  },
  phoneVerified : {
    type : Boolean,
    default : false
  },
  createdAt : {
    type : Date,
    default : Date.now()
  },
  updatedAt : {
    type : Date,
    default : Date.now()
  }
});

// unique validattion before storing middleware
companySchema.pre("save",async function(next){
  const query = {
    company_name : this.company_name
  };

  const length = await mongoose.model("Company").countDocuments(query);
  if(length>0){
    const companyError = {
      message : "Company name already exist",
      field : "company-name"
    }
    throw next(companyError);
  }else{
    next();
  }
});

companySchema.pre("save",async function(next){
  const query = {
    email : this.email
  };

  const length = await mongoose.model("Company").countDocuments(query);
  if(length>0){
    const emailError = {
      message : "Company Email already exist",
      field : "company-email"
    }
    throw next(emailError);
  }else{
    next();
  }
});

companySchema.pre("save",async function(next){
  const query = {
    phone : this.phone
  };

  const length = await mongoose.model("Company").countDocuments(query);
  if(length>0){
    const phoneError = {
      message : "Phone Number already exist",
      field : "company-phone"
    }
    throw next(phoneError);
  }else{
    next();
  }
});

module.exports = mongoose.model("Company",companySchema);