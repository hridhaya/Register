// controllers/aadhaarController.js
const User = require('../models/userModel'); // Adjust the path as per your project structure

// Simulated Aadhaar verification (replace with actual API call if available)
const verifyAadhaar = (aadhaarNumber) => {
  // Simulate Aadhaar verification logic, e.g., check length or use a regex pattern
  const aadhaarPattern = /^\d{12}$/;
  return aadhaarPattern.test(aadhaarNumber);
};

const verifyAadhaarNumber = async (req, res) => {
  const { aadhaarNumber} = req.body;
  
  if (!aadhaarNumber) {
    return res.status(400).json({ error: 'No Aadhaar Number' });
  }

  try {
    // Update the user's Aadhaar number in the database
    const response = await fetch('https://api.apyhub.com/validate/aadhaar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'apy-token':process.env.APY_TOKEN 
         },
        body: JSON.stringify({ aadhaar : aadhaarNumber}),
   } );
    const dataResponse= await response.json();
console.log(dataResponse);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }
if (response.ok){
    return res.status(200).json({ message: 'Aadhaar verified successfully', dataResponse});
}
    
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { verifyAadhaarNumber };
