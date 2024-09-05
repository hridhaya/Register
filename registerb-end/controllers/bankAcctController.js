
const verifyAcct = (acctNumber, ifscCode) => {
  // Bank account number verification logic (9 to 18 digits)
  const acctPattern = /^[0-9]{9,18}$/;

  // IFSC code verification logic (4 letters, a digit (0), followed by 6 digits/letters)
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return acctPattern.test(acctNumber) && ifscPattern.test(ifscCode);
};
// verify acct(gets request id)
const verifyBankAcct = async (req, res) => {
  const { acctNumber, ifscCode } = req.body;

  if (!acctNumber || !ifscCode) {
    return res.status(400).json({ error: "No Account Number or IFSC Code!" });
  }
  if (!verifyAcct(acctNumber, ifscCode)) {
    return res
      .status(400)
      .json({ error: "Invalid Account Number or IFSC Code format" });
  }

  try {
    const response = await fetch(
      "https://indian-bank-account-verification.p.rapidapi.com/v3/tasks/async/verify_with_source/validate_bank_account",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.RAPID_APIKEY_BNK,
          "x-rapidapi-host": process.env.RAPID_APIHOST_BNK,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: '123',
          group_id: '1234',
          data: {
            bank_account_no: acctNumber,
            bank_ifsc_code: ifscCode
          }
        })
      }
    );

    const dataResponse = await response.json();
    const request_id = dataResponse.request_id;
    // console.log(dataResponse,"ghfjgfkyt");

    // console.log(request_id,"hhhhhh");

    if (request_id) {
      return res
        .status(200)
        .json({request_id});
    } else {
      return res.status(400).json({ error: "Failed to initiate verification" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// VERIFING THE ACCT
const BankAcctVerified = async (req, res) => {
  const { request_id } = req.query; // Use req.query for query parameters
  // console.log(request_id,"hggggggggg");
  try {
    const response = await fetch(`https://indian-bank-account-verification.p.rapidapi.com/v3/tasks?request_id=${request_id}`, {
      method: "GET",
      headers: {
        'x-rapidapi-key': process.env.RAPID_APIKEY_BNKACCT,
        'x-rapidapi-host': process.env.RAPID_APIHOST_BNKACCT
      }
    });

    const dataResponse = await response.json();
  const verify = dataResponse[0]?.result?.status; 
    // console.log(verify);
    if (verify === "id_found") {
      return res
        .status(200)
        .json({ message: "Bank account verified successfully" });
    } else {
      return res.status(400).json({ error: "Verification failed...." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { verifyBankAcct , BankAcctVerified};
