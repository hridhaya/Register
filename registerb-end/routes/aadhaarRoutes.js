// routes/aadhaarRoutes.js
const express = require('express');
const { verifyAadhaarNumber } = require('../controllers/aadhaarController');
const router = express.Router();

// POST route to verify Aadhaar number
router.post('/verify', verifyAadhaarNumber);

module.exports = router;
