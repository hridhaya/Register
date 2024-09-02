const express = require('express');
const { sendOtpController, verifyOtpController } = require('../controllers/authController');

const router = express.Router();

router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);

module.exports = router;
