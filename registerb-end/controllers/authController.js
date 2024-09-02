const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create the transporter using environment variables for Gmail configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Update this to 'smtp.gmail.com' for Gmail
  port: 587,
  secure: false, // Use true for port 465, false for all other ports
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PWD,
  },
});

// Function to send OTP
const sendOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Your Name" <${process.env.EMAIL_ID}>`, // sender address
      to: email, // recipient address
      subject: 'Your OTP Code', // Subject line
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // plain text body
      html: `<b>Your OTP code is ${otp}. It is valid for 10 minutes.</b>`, // html body
    };

    // Send mail using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Controller to handle sending OTP
const sendOtpController = async (req, res) => {
  const { username, email } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user if not found
      user = new User({ username, email });
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    await sendOtp(email, otp);

    // Save the OTP to the user record
    user.otp = otp;
    await user.save();

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Controller to handle verifying OTP
const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified successfully
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

module.exports = { sendOtpController, verifyOtpController };
