const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otp: { type: String } // Add OTP field
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
