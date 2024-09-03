const express = require('express');
const { lookupAddress } = require('../controllers/lookupController');
const router = express.Router();

// POST route to verify gst number
router.post('/search', lookupAddress);

module.exports = router;