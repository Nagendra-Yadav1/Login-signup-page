// making a project of  mongodb database and login and singup
const mongoose = require('mongoose');
const plm=require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/Project").then(()=>{
    console.log("Mongodb database connected successfully")
}).catch(()=>{
    console.log("Mongodb database show Error");
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  password: {
    type: String
  },
  dp: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});
userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);