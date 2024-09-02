const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// MongoDB connection
const connString = process.env.db_URI;

if (!connString) {
  console.error('MongoDB connection string is not defined. Please check your environment variables.');
  process.exit(1);
}

mongoose.connect(connString, {

})
  .then(() => console.log('Mongodb connection established'))
  .catch((error) => {
    console.log('Mongodb connection error:', error);
    process.exit(1);
  });

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Use the authentication routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
