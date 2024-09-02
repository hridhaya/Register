// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// require('dotenv').config();


// // MongoDB connection
// const connString = process.env.db_URI;

// if (!connString) {
//     console.error('MongoDB connection string is not defined. Please check your environment variables.');
//     process.exit(1);
// }

// mongoose.connect(connString)
// .then(() => {
//     console.log('Mongodb connection established');
// })
// .catch((error) => {
//     console.log('Mongodb connection error:', error);
//     process.exit(1);
// });

// // Schema
// const userRegSchema = new mongoose.Schema({
//     username: String,
//     email: String
// }); 

// // Model
// const RegUser = mongoose.model('RegUser', userRegSchema);

// const server = express();

// // Middleware
// server.use(cors());
// server.use(bodyParser.json());

// // API
// server.post('/demo', async (req, res) => {
//     try {
//         let regUser = new RegUser({
//             username: req.body.username,
//             email: req.body.email
//         });
//         const doc = await regUser.save();
//         console.log(doc);
//         res.json(doc);
//     } catch (error) {
//         console.error('Error saving user:', error);
//         res.status(500).json({ error: 'Failed to register user' });
//     }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// MongoDB connection
const connString = process.env.db_URI;

if (!connString) {
    console.error('MongoDB connection string is not defined. Please check your environment variables.');
    process.exit(1);
}

mongoose.connect(connString)
    .then(() => {
        console.log('Mongodb connection established');
    })
    .catch((error) => {
        console.log('Mongodb connection error:', error);
        process.exit(1);
    });

// Schema
const userRegSchema = new mongoose.Schema({
    username: String,
    email: String,
    otp: String,
    otpExpires: Date
}); 

// Model
const RegUser = mongoose.model('RegUser', userRegSchema);

const server = express();

// Middleware
server.use(cors());
server.use(bodyParser.json());

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'hridhayashimi013@gmail.com', 
            pass: 'mpqj rgcc dqmc nsmb'
        }
    });

    const mailOptions = {
        from: 'hridhayashimi013@gmail.com' ,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

// API to send OTP
server.post('/send-otp', async (req, res) => {
    try {
        const { email, username } = req.body;

        // Check if email is already registered
        const existingUser = await RegUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Already registered with this email' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Save user with OTP
        let regUser = new RegUser({
            username,
            email,
            otp,
            otpExpires
        });

        await regUser.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// API to verify OTP
server.post('/verify-otp', async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const user = await RegUser.findOne({ email });
    //   console.log(user);
    //   console.log(user.otp);
      if (user.otp !== otp) {
        
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      if (Date.now() > user.otpExpires) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      // OTP is valid, now clear OTP and expiration time
      user.otp = undefined; // Clear OTP after successful verification
      user.otpExpires = undefined;
      await user.save();
  
      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  });
  

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
