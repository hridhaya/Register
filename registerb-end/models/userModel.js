const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otp: { type: String }, 
  phoneNumber:{type:String, required: true},
  aadhaarNumber: { type: String, required: true},
  dob:{type:String, required: true},
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
