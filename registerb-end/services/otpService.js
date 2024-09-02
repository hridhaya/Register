const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: 'your-email@gmail.com', // Your email address
    pass: 'your-email-password'   // Your email password or an app password
  }
});

const sendOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

const verifyOtp = async (email, otp) => {
  // Logic for verifying OTP
  console.log(`Verifying OTP ${otp} for email ${email}`);
  return true; // Placeholder for successful verification
};

module.exports = { sendOtp, verifyOtp };
