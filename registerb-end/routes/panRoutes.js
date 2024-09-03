const express = require('express');
const { verifyPanNumber } = require('../controllers/panController');
const router = express.Router();

// POST route to verify pan number
router.post('/verify', verifyPanNumber);

module.exports = router;