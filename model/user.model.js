const mongoose = require("mongoose");
const bcryptService = require("../services/bcrypt.service");
const { Schema } = mongoose;
const userSchema = new Schema({
  uid : {
    type : String,
    unique : true
  },
  password : {
    type : String,
    required : [true,"Password is required"]
  },
  token : String,
  role : String,
  expiresIn : Number,
  isLogged : {
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
  },
  logoutAt : Date
});

userSchema.pre("save",async function(next){
  try{
    this.password = await bcryptService.encrypt(this.password.toString());
    next();
  }catch(error){
    throw next(createError(500));
  }
});

module.exports = mongoose.model("User",userSchema);