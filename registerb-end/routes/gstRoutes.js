
const express = require('express');
const { verifyGstNumber } = require('../controllers/gstController');
const router = express.Router();

// POST route to verify gst number
router.post('/verify', verifyGstNumber);

module.exports = router;
