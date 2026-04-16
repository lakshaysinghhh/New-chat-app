import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  profilePic:{
    type:String,
    default:"",
  }
},{
  timestamps:true
})


const User=mongoose.model("User",userSchema)

export default User;

// A model is a wrapper around a schema that provides an interface to interact with the database (CRUD operations).

// A schema defines the structure of documents in a MongoDB collection, including fields, data types, and validation rules.
// ➡️ Mongoose ek library hai jo:

// Node.js app ko MongoDB ke saath easily connect aur manage karne me help karti hai