const twilio = require('twilio');
const User = require('../models/userModel');
// import { useRouter } from "next/navigation";

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config(); 

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendMobileOtpController = async (req, res) => {
  const { username, email, phoneNumber, aadhaarNumber } = req.body;

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP using Twilio
    await client.messages.create({
      body: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    // Find the user by phoneNumber
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({phoneNumber});
    } else {
      // If user exists, update user details and OTP
      user.otp = otp;
    }

    // Save the user record
    await user.save();

    res.status(200).json({ message: 'OTP sent to your mobile number' });
  } catch (error) {
    console.error('Error sending mobile OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyMobileOtpController = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Find the user by phoneNumber
    let user = await User.findOne({ phoneNumber });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // If OTP is verified successfully
    user.otp = null; // Clear the OTP after verification
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
    // router.push(`/phoneOtp`);
    
  } catch (error) {
    console.error('Error verifying mobile OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

module.exports = { sendMobileOtpController, verifyMobileOtpController };
