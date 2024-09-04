const express = require('express');
const { verifyBankAcct, BankAcctVerified } = require('../controllers/bankAcctController');
const router = express.Router();

// POST route to verify gst number
router.post('/handle-acct-verify', verifyBankAcct);
router.get('/get-acct-verify', BankAcctVerified);

module.exports = router;
